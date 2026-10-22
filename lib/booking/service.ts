import { createHash, randomUUID } from "crypto"
import { getProvider } from "./providers"
import { isSlotBookable } from "./slots"
import { claimBooking, completeBooking, releaseBooking } from "./store"
import type { BookingRequest, BookingResult, ConfirmedBooking } from "./types"

export class BookingError extends Error {
  status: number
  constructor(status: number, message: string) { super(message); this.status = status }
}

export async function createBooking(request: BookingRequest, key: string): Promise<BookingResult> {
  const id = createHash("sha256").update(key).digest("hex")
  const fingerprint = createHash("sha256").update(JSON.stringify(request)).digest("hex")
  const nonce = randomUUID()
  const booking: ConfirmedBooking = { ...request, startsAt: new Date(request.startsAt), bookingId: id }
  const state = await claimBooking(id, fingerprint, booking, nonce)
  if (state === "mismatch") throw new BookingError(409, "This request key was already used for different booking details.")
  if (state === "busy") throw new BookingError(409, "This booking is still being processed. Retry with the same request key.")
  if (state !== "claimed") return JSON.parse(state) as BookingResult

  try {
    const provider = getProvider()
    // Recover uncertain insert outcomes before freeBusy sees our own event.
    let meeting = await provider.find?.(id)
    if (!meeting) {
      let busy = [] as Awaited<ReturnType<NonNullable<typeof provider.busy>>>
      if (provider.busy) {
        try {
          busy = await provider.busy(new Date(booking.startsAt.getTime() - 86_400_000), new Date(booking.startsAt.getTime() + 86_400_000))
        } catch {
          throw new BookingError(503, "Calendar availability is temporarily unavailable.")
        }
      }
      if (!isSlotBookable({ startsAt: booking.startsAt, durationMinutes: booking.duration, busy })) {
        throw new BookingError(409, "That slot is no longer available. Pick another time.")
      }
      meeting = await provider.create(booking)
    }

    const result: BookingResult = { ok: true, bookingId: id, joinUrl: meeting.joinUrl, startsAt: booking.startsAt.toISOString(), emailStatus: "pending" }
    // The intent and retry job were persisted before the event was inserted.
    // A worker can recover the event by deterministic ID if this write fails.
    try { await completeBooking(id, result) } catch (error) {
      if (provider.name === "manual") throw error
      console.error("Booking result persistence needs recovery:", error)
    }
    return result
  } finally {
    await releaseBooking(id, nonce).catch((error) => console.error("Booking lease release failed:", error))
  }
}

export async function recoverBooking(booking: ConfirmedBooking): Promise<BookingResult | null> {
  const provider = getProvider()
  const meeting = provider.name === "manual" ? null : await provider.find?.(booking.bookingId)
  return meeting ? { ok: true, bookingId: booking.bookingId, joinUrl: meeting.joinUrl, startsAt: booking.startsAt.toISOString(), emailStatus: "pending" } : null
}
