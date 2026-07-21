import { NextRequest, NextResponse } from "next/server"
import { SETTINGS } from "@/constants/settings"
import { generateSlots } from "@/lib/booking/slots"
import { getProvider } from "@/lib/booking/providers"
import { availabilityQuerySchema, type AvailabilityResponse } from "@/lib/booking/types"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const parsed = availabilityQuerySchema.safeParse({
    date: req.nextUrl.searchParams.get("date"),
    duration: req.nextUrl.searchParams.get("duration") ?? SETTINGS.booking.defaultDuration,
  })

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    )
  }

  const { date, duration } = parsed.data
  const provider = getProvider()

  // Widen the freebusy window by a day either side so meetings that straddle
  // midnight in the host timezone are still seen.
  let busy: Awaited<ReturnType<NonNullable<typeof provider.busy>>> = []
  if (provider.busy) {
    const [year, month, day] = date.split("-").map(Number)
    const from = new Date(Date.UTC(year, month - 1, day - 1))
    const to = new Date(Date.UTC(year, month - 1, day + 2))
    try {
      busy = await provider.busy(from, to)
    } catch (err) {
      // A calendar outage must not take the booking page down; fall back to
      // working hours and let the host reconcile a rare double-booking.
      console.error("Freebusy lookup failed:", err)
    }
  }

  const body: AvailabilityResponse = {
    date,
    duration,
    hostTimezone: SETTINGS.booking.hostTimezone,
    slots: generateSlots({ dateKey: date, durationMinutes: duration, busy }),
  }

  return NextResponse.json(body, {
    headers: { "Cache-Control": "no-store" },
  })
}
