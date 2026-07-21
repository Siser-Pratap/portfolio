import { z } from "zod"
import { SETTINGS } from "@/constants/settings"

const { booking } = SETTINGS

/** "YYYY-MM-DD", interpreted in the host timezone. */
export const dateKeySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected a YYYY-MM-DD date")

export const durationSchema = z
  .number()
  .int()
  .refine((n) => booking.durations.includes(n), {
    message: `Duration must be one of ${booking.durations.join(", ")} minutes`,
  })

/** Query params for GET /api/booking/availability */
export const availabilityQuerySchema = z.object({
  date: dateKeySchema,
  duration: z.coerce.number().pipe(durationSchema),
})

/** Body for POST /api/booking/create */
export const bookingRequestSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  subject: z.string().trim().min(3, "Add a subject").max(140),
  notes: z.string().trim().max(1000).optional(),
  guests: z
    .array(z.string().trim().toLowerCase().email())
    .max(booking.maxGuests, `At most ${booking.maxGuests} guests`)
    .default([]),
  duration: durationSchema,
  /** Meeting start as an ISO 8601 UTC instant. */
  startsAt: z.string().datetime(),
  /** Visitor's IANA timezone, used only for display in emails. */
  timezone: z.string().min(1),
  /** Anti-spam: real users never fill this. */
  honeypot: z.string().max(0).optional(),
})

export type BookingRequest = z.infer<typeof bookingRequestSchema>
export type AvailabilityQuery = z.infer<typeof availabilityQuerySchema>

/** A generated slot. `start` is an ISO 8601 UTC instant. */
export type Slot = {
  start: string
  available: boolean
}

export type AvailabilityResponse = {
  date: string
  duration: number
  hostTimezone: string
  slots: Slot[]
}

/** A window in which the host cannot take meetings. */
export type BusyWindow = {
  start: Date
  end: Date
}

/** Result of a successful booking. */
export type BookingResult = {
  ok: true
  bookingId: string
  joinUrl: string
  startsAt: string
}
