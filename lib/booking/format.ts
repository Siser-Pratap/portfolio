/** Display helpers shared by the booking UI. Client-safe — no server imports. */

/** The visitor's IANA timezone, e.g. "America/New_York". */
export function visitorTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/** "10:00 AM" */
export function formatTime(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso))
}

/** "EDT" / "GMT+5:30" — no single locale renders both prettily, so favour the unambiguous one. */
export function formatZoneAbbrev(iso: string, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    timeZoneName: "short",
  }).formatToParts(new Date(iso))
  return parts.find((p) => p.type === "timeZoneName")?.value ?? timeZone
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
