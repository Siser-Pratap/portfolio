import { SETTINGS } from "@/constants/settings"
import { SITE } from "@/constants/site"

/**
 * Minimal RFC 5545 writer — hand-rolled to avoid a dependency for what is
 * ~60 lines of string building. Emits a single VEVENT with METHOD:REQUEST so
 * mail clients render it as an invitation with accept/decline.
 */

export type IcsEvent = {
  uid: string
  start: Date
  durationMinutes: number
  subject: string
  description?: string
  /** Meet URL — used as LOCATION and echoed in the description. */
  location?: string
  organizer: { name: string; email: string }
  attendees: Array<{ name?: string; email: string }>
  /** Bump when re-issuing an updated invite for the same UID. */
  sequence?: number
}

/** RFC 5545 §3.3.5 — UTC form, e.g. 20260803T043000Z */
function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
}

/** RFC 5545 §3.3.11 — backslash, semicolon, comma and newlines are special. */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n")
}

/**
 * RFC 5545 §3.1 — lines must not exceed 75 octets. Folds on octet count
 * (not characters) so multi-byte UTF-8 survives, with a leading space on
 * each continuation.
 */
function foldLine(line: string): string {
  const bytes = Buffer.from(line, "utf8")
  if (bytes.length <= 75) return line

  const chunks: string[] = []
  let start = 0
  let limit = 75

  while (start < bytes.length) {
    let end = Math.min(start + limit, bytes.length)
    // Never split inside a multi-byte sequence: 0b10xxxxxx is a continuation.
    while (end > start && end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--
    chunks.push(bytes.subarray(start, end).toString("utf8"))
    start = end
    limit = 74 // continuation lines carry a leading space
  }

  return chunks.join("\r\n ")
}

export function buildIcs(event: IcsEvent): string {
  const end = new Date(event.start.getTime() + event.durationMinutes * 60_000)

  const descriptionParts = [event.description?.trim(), event.location ? `Join: ${event.location}` : undefined]
  const description = descriptionParts.filter(Boolean).join("\n\n")

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Siser Pratap//Portfolio Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(event.start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SEQUENCE:${event.sequence ?? 0}`,
    `SUMMARY:${escapeText(event.subject)}`,
    `ORGANIZER;CN=${escapeText(event.organizer.name)}:mailto:${event.organizer.email}`,
  ]

  if (description) lines.push(`DESCRIPTION:${escapeText(description)}`)
  if (event.location) lines.push(`LOCATION:${escapeText(event.location)}`)

  for (const attendee of event.attendees) {
    const cn = attendee.name ? `;CN=${escapeText(attendee.name)}` : ""
    lines.push(
      `ATTENDEE${cn};ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${attendee.email}`,
    )
  }

  lines.push("STATUS:CONFIRMED", "TRANSP:OPAQUE", "END:VEVENT", "END:VCALENDAR")

  return lines.map(foldLine).join("\r\n") + "\r\n"
}

/** Stable, collision-free UID for a booking. */
export function buildUid(bookingId: string): string {
  const domain = SETTINGS.email.split("@")[1] ?? SITE.url.replace(/^https?:\/\//, "")
  return `${bookingId}@${domain}`
}
