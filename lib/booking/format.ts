/**
 * Display helpers shared by the booking UI. Client-safe — no server imports.
 *
 * Every time is shown in the host timezone (IST). The scheduler is
 * single-timezone by design: visitors book against Siser's calendar, so the
 * hours they see are the hours the meeting actually happens, IST, full stop.
 */

/** "10:00 AM" — always in the given (host) timezone. */
export function formatTime(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso))
}

/**
 * Short zone label. en-IN renders Asia/Kolkata as the familiar "IST" (en-US
 * would give "GMT+5:30"); other zones still fall back to a GMT offset.
 */
export function formatZoneAbbrev(iso: string, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone,
    hour: "numeric",
    timeZoneName: "short",
  }).formatToParts(new Date(iso))
  return parts.find((p) => p.type === "timeZoneName")?.value ?? timeZone
}

/**
 * "Add to Google Calendar" link (the render/TEMPLATE endpoint) — lets anyone
 * one-click the meeting onto their own Google Calendar without any OAuth on our
 * side. Complements the .ics attachment, which covers non-Google clients.
 */
export function googleCalendarUrl(opts: {
  subject: string
  startIso: string
  durationMinutes: number
  details?: string
  location?: string
  timeZone: string
}): string {
  const start = new Date(opts.startIso)
  const end = new Date(start.getTime() + opts.durationMinutes * 60_000)
  const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.subject,
    dates: `${stamp(start)}/${stamp(end)}`,
    ctz: opts.timeZone,
  })
  if (opts.details) params.set("details", opts.details)
  if (opts.location) params.set("location", opts.location)

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/**
 * "Monday, 3 August 2026" for a "YYYY-MM-DD" key.
 * Rendered in UTC so the calendar date is never shifted by the viewer's zone.
 */
export function formatDateKeyLong(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number)
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, day)))
}

/** "3 Aug" */
export function formatDateKeyShort(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number)
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
  }).format(new Date(Date.UTC(year, month - 1, day)))
}

/** "August 2026" */
export function formatMonthLabel(year: number, month: number): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, 1)))
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
