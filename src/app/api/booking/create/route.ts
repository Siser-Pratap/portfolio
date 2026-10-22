import { randomUUID } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { SETTINGS } from "@/constants/settings"
import { sendBookingEmails } from "@/lib/booking/email"
import { getProvider } from "@/lib/booking/providers"
import { checkRateLimit, clientKey } from "@/lib/booking/rate-limit"
import { formatDateKey, isSlotBookable } from "@/lib/booking/slots"
import { bookingRequestSchema, bookingResultSchema, type ConfirmedBooking } from "@/lib/booking/types"
import { isMailConfigured } from "@/lib/mailer"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 })
  }

  const parsed = bookingRequestSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid booking details." },
      { status: 400 },
    )
  }

  const booking = parsed.data

  // Never show a confirmation for a submission that will not create or email a meeting.
  if (booking.honeypot) {
    return NextResponse.json(
      { error: "Could not verify this submission. Refresh the page and enter your details again." },
      { status: 400 },
    )
  }

  const limit = checkRateLimit(clientKey(req.headers))
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many booking attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    )
  }

  const startsAt = new Date(booking.startsAt)
  if (Number.isNaN(startsAt.getTime())) {
    return NextResponse.json({ error: "Invalid start time." }, { status: 400 })
  }

  const provider = getProvider()

  // The client's slot is a claim, not a fact — re-derive the grid server-side.
  let busy: Awaited<ReturnType<NonNullable<typeof provider.busy>>> = []
  if (provider.busy) {
    const from = new Date(startsAt.getTime() - 86_400_000)
    const to = new Date(startsAt.getTime() + 86_400_000)
    try {
      busy = await provider.busy(from, to)
    } catch (err) {
      console.error("Freebusy lookup failed during create:", err)
      return NextResponse.json(
        { error: "Calendar availability is temporarily unavailable. Please try again later." },
        { status: 503, headers: { "Retry-After": "60", "Cache-Control": "no-store" } },
      )
    }
  }

  if (!isSlotBookable({ startsAt, durationMinutes: booking.duration, busy })) {
    return NextResponse.json(
      { error: "That slot is no longer available. Pick another time." },
      { status: 409 },
    )
  }

  if (!isMailConfigured()) {
    console.error("SMTP is not configured — refusing to accept a booking that cannot be confirmed.")
    return NextResponse.json(
      { error: "Booking is temporarily unavailable. Please email me directly." },
      { status: 503 },
    )
  }

  const bookingId = `bk_${randomUUID().replace(/-/g, "").slice(0, 12)}`

  const confirmed: ConfirmedBooking = {
    bookingId,
    startsAt,
    name: booking.name,
    email: booking.email,
    subject: booking.subject,
    notes: booking.notes,
    guests: booking.guests,
    duration: booking.duration,
    timezone: booking.timezone,
  }

  try {
    const { joinUrl } = await provider.create(confirmed)

    const result = bookingResultSchema.parse({
      ok: true,
      bookingId,
      joinUrl,
      startsAt: startsAt.toISOString(),
    })

    await sendBookingEmails({ ...confirmed, joinUrl: result.joinUrl })

    console.log(
      `Booking ${bookingId}: ${booking.email} · ${formatDateKey(startsAt, SETTINGS.booking.hostTimezone)} · ${booking.duration}min`,
    )

    return NextResponse.json(result)
  } catch (err) {
    console.error("Booking creation failed:", err)
    return NextResponse.json(
      { error: "Could not confirm the booking. Please try again or email me directly." },
      { status: 500 },
    )
  }
}
