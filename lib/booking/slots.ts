import { SETTINGS } from "@/constants/settings"
import type { BusyWindow, Slot } from "./types"

/**
 * Timezone math is done with `Intl.DateTimeFormat` rather than a library:
 * date-fns v4 needs the separate `@date-fns/tz` package for zone support, and
 * the ICU data shipped with Node/browsers is already authoritative for DST.
 *
 * Everything crossing a boundary (API, storage, .ics) is a UTC instant.
 * Wall-clock times only ever exist paired with an explicit IANA zone.
 */

export type BookingConfig = typeof SETTINGS.booking

export type WallTime = {
  year: number
  month: number // 1-12
  day: number
  hour: number
  minute: number
}

const MINUTE_MS = 60_000
const DAY_MS = 86_400_000

const formatterCache = new Map<string, Intl.DateTimeFormat>()

function getFormatter(timeZone: string): Intl.DateTimeFormat {
  let formatter = formatterCache.get(timeZone)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23", // avoids the "24" hour that hour12:false can emit
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    formatterCache.set(timeZone, formatter)
  }
  return formatter
}

/** The wall-clock time shown in `timeZone` at a given instant. */
export function getWallParts(instant: Date, timeZone: string): WallTime & { second: number } {
  const parts = getFormatter(timeZone).formatToParts(instant)
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? "0")

  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
    hour: read("hour"),
    minute: read("minute"),
    second: read("second"),
  }
}

/**
 * Offset of `timeZone` from UTC at `instant`, in milliseconds.
 * Positive east of Greenwich (Asia/Kolkata → +19_800_000).
 */
export function getOffsetMs(instant: Date, timeZone: string): number {
  const w = getWallParts(instant, timeZone)
  const asIfUtc = Date.UTC(w.year, w.month - 1, w.day, w.hour, w.minute, w.second)
  // Intl truncates to whole seconds, so ignore the sub-second remainder.
  return asIfUtc - Math.floor(instant.getTime() / 1000) * 1000
}

/**
 * The UTC instant at which `timeZone` reads `wall`.
 *
 * DST edges: the first guess uses the offset at the wrong instant, so the
 * result is re-checked against the offset actually in force there. Ambiguous
 * times (the repeated hour when clocks fall back) resolve to the first pass.
 */
export function wallTimeToUtc(wall: WallTime, timeZone: string): Date {
  const naiveMs = Date.UTC(wall.year, wall.month - 1, wall.day, wall.hour, wall.minute)

  const firstOffset = getOffsetMs(new Date(naiveMs), timeZone)
  let utcMs = naiveMs - firstOffset

  const secondOffset = getOffsetMs(new Date(utcMs), timeZone)
  if (secondOffset !== firstOffset) utcMs = naiveMs - secondOffset

  return new Date(utcMs)
}

/**
 * False when `wall` does not exist in `timeZone` — the skipped hour when
 * clocks spring forward. Those slots must never be offered.
 */
export function wallTimeExists(wall: WallTime, timeZone: string): boolean {
  const instant = wallTimeToUtc(wall, timeZone)
  const actual = getWallParts(instant, timeZone)
  return (
    actual.year === wall.year &&
    actual.month === wall.month &&
    actual.day === wall.day &&
    actual.hour === wall.hour &&
    actual.minute === wall.minute
  )
}

/** "YYYY-MM-DD" for the calendar date `instant` falls on inside `timeZone`. */
export function formatDateKey(instant: Date, timeZone: string): string {
  const w = getWallParts(instant, timeZone)
  return `${w.year}-${pad(w.month)}-${pad(w.day)}`
}

export function parseDateKey(dateKey: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateKey.split("-").map(Number)
  return { year, month, day }
}

/** Day of week (0 = Sunday) for a calendar date, independent of any zone. */
export function dateKeyWeekday(dateKey: string): number {
  const { year, month, day } = parseDateKey(dateKey)
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay()
}

/** Whole days between two calendar dates, `b - a`. */
export function daysBetweenKeys(a: string, b: string): number {
  const pa = parseDateKey(a)
  const pb = parseDateKey(b)
  const ma = Date.UTC(pa.year, pa.month - 1, pa.day)
  const mb = Date.UTC(pb.year, pb.month - 1, pb.day)
  return Math.round((mb - ma) / DAY_MS)
}

/** Shift a "YYYY-MM-DD" key by `n` days. */
export function addDaysToKey(dateKey: string, n: number): string {
  const { year, month, day } = parseDateKey(dateKey)
  const shifted = new Date(Date.UTC(year, month - 1, day) + n * DAY_MS)
  return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}`
}

function pad(n: number): string {
  return String(n).padStart(2, "0")
}

/** "HH:MM" → minutes since midnight. */
export function parseClock(value: string): number {
  const [hour, minute] = value.split(":").map(Number)
  return hour * 60 + minute
}

function overlapsBusy(
  start: Date,
  end: Date,
  busy: BusyWindow[],
  bufferMinutes: number,
): boolean {
  const bufferMs = bufferMinutes * MINUTE_MS
  return busy.some((window) => {
    const busyStart = window.start.getTime() - bufferMs
    const busyEnd = window.end.getTime() + bufferMs
    return start.getTime() < busyEnd && end.getTime() > busyStart
  })
}

export type GenerateSlotsParams = {
  /** Calendar date in the host timezone. */
  dateKey: string
  durationMinutes: number
  /** Defaults to now; injectable so this stays pure and testable. */
  now?: Date
  /** Known-busy windows, as UTC instants. Empty in phase 1. */
  busy?: BusyWindow[]
  config?: BookingConfig
}

/**
 * Every slot offered for one calendar date.
 *
 * Slots outside the booking window (too soon, too far out, non-working day)
 * are omitted entirely. Slots that merely collide with an existing meeting are
 * returned with `available: false`, so the UI can show them struck through
 * rather than silently shrinking the grid.
 */
export function generateSlots({
  dateKey,
  durationMinutes,
  now = new Date(),
  busy = [],
  config = SETTINGS.booking,
}: GenerateSlotsParams): Slot[] {
  const { hostTimezone } = config

  if (config.blockedDates.includes(dateKey)) return []
  if (!config.workingDays.includes(dateKeyWeekday(dateKey))) return []

  const todayKey = formatDateKey(now, hostTimezone)
  const dayOffset = daysBetweenKeys(todayKey, dateKey)
  if (dayOffset < 0 || dayOffset > config.maxDaysAhead) return []

  const { year, month, day } = parseDateKey(dateKey)
  const openMinute = parseClock(config.workingHours.start)
  const closeMinute = parseClock(config.workingHours.end)
  const earliestStart = now.getTime() + config.minNoticeHours * 60 * MINUTE_MS

  const slots: Slot[] = []

  for (
    let minute = openMinute;
    minute + durationMinutes <= closeMinute;
    minute += config.slotIntervalMinutes
  ) {
    const wall: WallTime = {
      year,
      month,
      day,
      hour: Math.floor(minute / 60),
      minute: minute % 60,
    }

    // Skipped by a spring-forward transition — this time never happens.
    if (!wallTimeExists(wall, hostTimezone)) continue

    const start = wallTimeToUtc(wall, hostTimezone)
    if (start.getTime() < earliestStart) continue

    const end = new Date(start.getTime() + durationMinutes * MINUTE_MS)

    slots.push({
      start: start.toISOString(),
      available: !overlapsBusy(start, end, busy, config.bufferMinutes),
    })
  }

  return slots
}

/**
 * Server-side re-derivation of a slot the client claims to have picked.
 * The create route must call this — a posted `startsAt` is never trusted.
 */
export function isSlotBookable(params: {
  startsAt: Date
  durationMinutes: number
  now?: Date
  busy?: BusyWindow[]
  config?: BookingConfig
}): boolean {
  const config = params.config ?? SETTINGS.booking
  const iso = params.startsAt.toISOString()

  const slots = generateSlots({
    dateKey: formatDateKey(params.startsAt, config.hostTimezone),
    durationMinutes: params.durationMinutes,
    now: params.now,
    busy: params.busy,
    config,
  })

  return slots.some((slot) => slot.start === iso && slot.available)
}

/** Calendar dates currently open for booking, for painting the date picker. */
export function bookableDateKeys(now: Date = new Date(), config = SETTINGS.booking): string[] {
  const todayKey = formatDateKey(now, config.hostTimezone)
  const keys: string[] = []

  for (let offset = 0; offset <= config.maxDaysAhead; offset++) {
    const key = addDaysToKey(todayKey, offset)
    if (config.blockedDates.includes(key)) continue
    if (!config.workingDays.includes(dateKeyWeekday(key))) continue
    keys.push(key)
  }

  return keys
}
