import { NextRequest, NextResponse } from "next/server"
import { BookingError, createBooking } from "@/lib/booking/service"
import { checkRateLimit, clientKey } from "@/lib/booking/rate-limit"
import { bookingRequestSchema } from "@/lib/booking/types"
import { isMailConfigured } from "@/lib/mailer"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  let payload: unknown
  try { payload = await req.json() } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 })
  }
  const parsed = bookingRequestSchema.safeParse(payload)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid booking details." }, { status: 400 })
  if (parsed.data.honeypot) return NextResponse.json({ ok: true, bookingId: "ignored", joinUrl: "", startsAt: parsed.data.startsAt })
  const key = req.headers.get("Idempotency-Key")
  if (!key || !/^[0-9a-f-]{36}$/i.test(key)) return NextResponse.json({ error: "A valid Idempotency-Key is required." }, { status: 400 })
  const limit = checkRateLimit(clientKey(req.headers))
  if (!limit.allowed) return NextResponse.json({ error: "Too many booking attempts." }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } })
  if (!isMailConfigured()) return NextResponse.json({ error: "Booking is temporarily unavailable. Please email me directly." }, { status: 503 })
  try {
    const result = await createBooking(parsed.data, key)
    return NextResponse.json(result, { status: 201, headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    const status = error instanceof BookingError ? error.status : 503
    console.error("Booking request failed:", error)
    return NextResponse.json({ error: error instanceof BookingError ? error.message : "Booking could not be verified. Retry using the same request key." }, { status, headers: { "Retry-After": "60", "Cache-Control": "no-store" } })
  }
}

