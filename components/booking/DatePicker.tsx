"use client"

import { useMemo, useState } from "react"
import { SETTINGS } from "@/constants/settings"
import { formatMonthLabel } from "@/lib/booking/format"
import { addDaysToKey, daysBetweenKeys, dateKeyWeekday, formatDateKey, generateSlots } from "@/lib/booking/slots"

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"]

type Props = {
  value: string | null
  /** Needed up front: a day with no room for a 60-minute call is closed for it. */
  duration: number
  onChange: (dateKey: string) => void
}

function pad(n: number) {
  return String(n).padStart(2, "0")
}

const DatePicker = ({ value, duration, onChange }: Props) => {
  const { booking } = SETTINGS

  // "Today" means today where the host is — the visitor's own midnight is
  // irrelevant to which days are open.
  const todayKey = useMemo(() => formatDateKey(new Date(), booking.hostTimezone), [booking.hostTimezone])
  const lastKey = useMemo(() => addDaysToKey(todayKey, booking.maxDaysAhead), [todayKey, booking.maxDaysAhead])

  const initial = value ?? todayKey
  const [cursor, setCursor] = useState(() => {
    const [year, month] = initial.split("-").map(Number)
    return { year, month }
  })

  const cells = useMemo(() => {
    const first = new Date(Date.UTC(cursor.year, cursor.month - 1, 1))
    const daysInMonth = new Date(Date.UTC(cursor.year, cursor.month, 0)).getUTCDate()
    const leading = first.getUTCDay()

    const out: Array<string | null> = Array(leading).fill(null)
    for (let day = 1; day <= daysInMonth; day++) {
      out.push(`${cursor.year}-${pad(cursor.month)}-${pad(day)}`)
    }
    return out
  }, [cursor])

  /**
   * Days actually bookable in the visible month. Cheap enough to derive on the
   * client because phase 1 availability is pure working-hours arithmetic — the
   * same `generateSlots` the server runs. Once the Google provider supplies
   * busy windows this needs a per-month availability call instead, or a day
   * can look open here and turn out full on the next step.
   */
  const openDays = useMemo(() => {
    const open = new Set<string>()
    for (const dateKey of cells) {
      if (!dateKey) continue
      if (booking.blockedDates.includes(dateKey)) continue
      if (!booking.workingDays.includes(dateKeyWeekday(dateKey))) continue
      if (daysBetweenKeys(todayKey, dateKey) < 0) continue
      if (daysBetweenKeys(dateKey, lastKey) < 0) continue
      if (generateSlots({ dateKey, durationMinutes: duration }).some((slot) => slot.available)) {
        open.add(dateKey)
      }
    }
    return open
  }, [cells, duration, todayKey, lastKey, booking.blockedDates, booking.workingDays])

  const shiftMonth = (delta: number) => {
    setCursor((prev) => {
      const next = new Date(Date.UTC(prev.year, prev.month - 1 + delta, 1))
      return { year: next.getUTCFullYear(), month: next.getUTCMonth() + 1 }
    })
  }

  // Don't let the visitor wander outside the bookable window.
  const monthStart = `${cursor.year}-${pad(cursor.month)}-01`
  const canGoBack = daysBetweenKeys(todayKey, monthStart) > 0
  const canGoForward = daysBetweenKeys(monthStart, lastKey) > 31

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[#0D0505] text-lg font-bold tracking-tight">
          {formatMonthLabel(cursor.year, cursor.month)}
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            disabled={!canGoBack}
            aria-label="Previous month"
            className="w-9 h-9 rounded-full border border-[#EAEAEA] text-[#0D0505] flex items-center justify-center hover:border-[#FF4B1F] hover:text-[#FF4B1F] transition-colors disabled:opacity-30 disabled:hover:border-[#EAEAEA] disabled:hover:text-[#0D0505]"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            disabled={!canGoForward}
            aria-label="Next month"
            className="w-9 h-9 rounded-full border border-[#EAEAEA] text-[#0D0505] flex items-center justify-center hover:border-[#FF4B1F] hover:text-[#FF4B1F] transition-colors disabled:opacity-30 disabled:hover:border-[#EAEAEA] disabled:hover:text-[#0D0505]"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAY_LABELS.map((label, i) => (
          <div key={i} className="text-center text-[11px] font-semibold text-[#8A8A8A] py-2">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((dateKey, index) => {
          if (!dateKey) return <div key={`pad-${index}`} />

          const open = openDays.has(dateKey)
          const selected = dateKey === value
          const isToday = dateKey === todayKey
          const dayNumber = Number(dateKey.split("-")[2])

          return (
            <button
              key={dateKey}
              type="button"
              disabled={!open}
              onClick={() => onChange(dateKey)}
              aria-pressed={selected}
              className={[
                "aspect-square rounded-full text-sm font-semibold flex items-center justify-center transition-colors",
                selected
                  ? "bg-gradient-to-b from-[#FF4B1F] to-[#FF6A21] text-white"
                  : open
                    ? "text-[#0D0505] hover:bg-[#0D0505] hover:text-white"
                    : "text-[#D5D5D5] cursor-not-allowed",
                isToday && !selected ? "ring-1 ring-inset ring-[#EAEAEA]" : "",
              ].join(" ")}
            >
              {dayNumber}
            </button>
          )
        })}
      </div>

      <p className="text-[#8A8A8A] text-xs mt-6 leading-relaxed">
        Greyed-out days are weekends or already full for a {duration}-minute call. Times on the next step are
        shown in your local timezone.
      </p>
    </div>
  )
}

export default DatePicker
