import { NextRequest, NextResponse } from "next/server"
import { timingSafeEqual } from "crypto"
import { pendingEmailIds, deliverEmail } from "@/lib/booking/store"
import { recoverBooking } from "@/lib/booking/service"
import { sendBookingEmails } from "@/lib/booking/email"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const secret = process.env.BOOKING_WORKER_SECRET
  const actual = Buffer.from(req.headers.get("authorization") ?? "")
  const expected = Buffer.from("Bearer " + secret)
  if (!secret || actual.length !== expected.length || !timingSafeEqual(actual, expected)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    let failed = 0
    const ids = await pendingEmailIds()
    for (const id of ids) {
      try {
        await deliverEmail(id, recoverBooking, async (booking, result) => { await sendBookingEmails({ ...booking, joinUrl: result.joinUrl }) })
      } catch (error) { failed++; console.error("Booking email retry failed:", error) }
    }
    return NextResponse.json({ processed: ids.length, failed }, { headers: { "Cache-Control": "no-store" } })
  } catch {
    return NextResponse.json({ error: "Queue unavailable" }, { status: 503 })
  }
}

