import { SETTINGS } from "@/constants/settings"
import { escapeHtml, getTransporter } from "@/lib/mailer"
import { buildIcs, buildUid } from "./ics"
import type { ConfirmedBooking } from "./types"

const BRAND = {
  ink: "#0D0505",
  orange: "#FF4B1F",
  orangeSoft: "#FF6A21",
  muted: "#8A8A8A",
  line: "#EAEAEA",
}

export type BookingEmailInput = ConfirmedBooking & { joinUrl: string }

/** e.g. "Monday, 3 August 2026 · 10:00 AM IST" */
function formatWhen(instant: Date, timeZone: string): string {
  const date = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(instant)

  const time = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(instant)

  return `${date} · ${time}`
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${BRAND.line};color:${BRAND.muted};font-size:13px;width:110px;vertical-align:top;">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid ${BRAND.line};color:${BRAND.ink};font-size:14px;font-weight:600;">${value}</td>
    </tr>`
}

function guestConfirmationHtml(input: BookingEmailInput): string {
  const theirTime = formatWhen(input.startsAt, input.timezone)
  const myTime = formatWhen(input.startsAt, SETTINGS.booking.hostTimezone)
  const guestList = input.guests.length ? input.guests.map(escapeHtml).join(", ") : "—"

  return `
  <div style="background:#F7F7F7;padding:32px 0;font-family:Inter,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid ${BRAND.line};">
      <div style="background:${BRAND.ink};padding:28px 32px;">
        <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;font-style:italic;letter-spacing:-0.02em;">Siser.</p>
      </div>

      <div style="padding:32px;">
        <p style="margin:0 0 8px;color:${BRAND.muted};font-size:13px;font-style:italic;">(/ Booking confirmed )</p>
        <h1 style="margin:0 0 24px;color:${BRAND.ink};font-size:26px;line-height:1.25;font-weight:800;letter-spacing:-0.03em;">
          We're on for ${escapeHtml(theirTime)}
        </h1>

        <table style="width:100%;border-collapse:collapse;border-top:1px solid ${BRAND.line};">
          ${row("Subject", escapeHtml(input.subject))}
          ${row("Duration", `${input.duration} minutes`)}
          ${row("Your time", escapeHtml(theirTime))}
          ${row("My time", escapeHtml(myTime))}
          ${row("Guests", guestList)}
          ${row("Where", "Google Meet")}
        </table>

        <a href="${encodeURI(input.joinUrl)}"
           style="display:inline-block;margin-top:28px;background:${BRAND.orange};color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:999px;font-size:14px;font-weight:700;">
          Join the Meet →
        </a>

        <p style="margin:24px 0 0;color:${BRAND.muted};font-size:13px;line-height:1.7;">
          The calendar invite is attached — open it to add this to your calendar.
          Need to move it? Just reply to this email.
        </p>
      </div>
    </div>

    <p style="max-width:560px;margin:16px auto 0;color:${BRAND.muted};font-size:12px;text-align:center;">
      Booking ref ${escapeHtml(input.bookingId)}
    </p>
  </div>`
}

/** Plain-text fallback for the attendee. Must never leak the host digest. */
function guestConfirmationText(input: BookingEmailInput): string {
  return [
    `Booking confirmed — ${formatWhen(input.startsAt, input.timezone)}`,
    ``,
    `Subject:  ${input.subject}`,
    `Duration: ${input.duration} minutes`,
    `Where:    Google Meet — ${input.joinUrl}`,
    input.guests.length ? `Guests:   ${input.guests.join(", ")}` : null,
    ``,
    `The calendar invite is attached.`,
    `Need to move it? Just reply to this email.`,
    ``,
    `Booking ref ${input.bookingId}`,
  ]
    .filter((line) => line !== null)
    .join("\n")
}

function hostNotificationText(input: BookingEmailInput): string {
  return [
    `New booking — ${formatWhen(input.startsAt, SETTINGS.booking.hostTimezone)}`,
    ``,
    `Name:     ${input.name}`,
    `Email:    ${input.email}`,
    `Subject:  ${input.subject}`,
    `Duration: ${input.duration} min`,
    `Guests:   ${input.guests.length ? input.guests.join(", ") : "—"}`,
    `Their tz: ${input.timezone} (${formatWhen(input.startsAt, input.timezone)})`,
    `Join:     ${input.joinUrl}`,
    ``,
    `Notes:`,
    input.notes?.trim() || "—",
    ``,
    `Ref: ${input.bookingId}`,
  ].join("\n")
}

/**
 * Sends the attendee confirmation (with .ics) and the host notification.
 *
 * Both go out in parallel; a failure in either rejects, so the caller can tell
 * the visitor the booking did not land rather than silently dropping it.
 */
export async function sendBookingEmails(input: BookingEmailInput): Promise<void> {
  const transporter = getTransporter()

  const ics = buildIcs({
    uid: buildUid(input.bookingId),
    start: input.startsAt,
    durationMinutes: input.duration,
    subject: input.subject,
    description: input.notes,
    location: input.joinUrl,
    organizer: { name: "Siser Pratap", email: SETTINGS.email },
    attendees: [{ name: input.name, email: input.email }, ...input.guests.map((email) => ({ email }))],
  })

  await Promise.all([
    transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: input.email,
      cc: input.guests.length ? input.guests : undefined,
      replyTo: SETTINGS.email,
      subject: `Confirmed: ${input.subject}`,
      text: guestConfirmationText(input),
      html: guestConfirmationHtml(input),
      // `icalEvent` (not a plain attachment) is what makes Gmail and Outlook
      // render this as an invitation with RSVP buttons. Attaching the same
      // .ics as well would show the recipient two calendar files.
      icalEvent: { method: "REQUEST", filename: "meeting.ics", content: ics },
    }),

    transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: SETTINGS.email,
      replyTo: input.email,
      subject: `New booking — ${input.name}, ${formatWhen(input.startsAt, SETTINGS.booking.hostTimezone)}`,
      text: hostNotificationText(input),
      icalEvent: { method: "REQUEST", filename: "meeting.ics", content: ics },
    }),
  ])
}
