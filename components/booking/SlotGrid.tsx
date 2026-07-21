"use client"

import { useEffect, useMemo, useState } from "react"
import { formatDateKeyLong, formatTime, formatZoneAbbrev } from "@/lib/booking/format"
import { formatDateKey } from "@/lib/booking/slots"
import type { AvailabilityResponse, Slot } from "@/lib/booking/types"

type Props = {
  dateKey: string
  duration: number
  timezone: string
  value: string | null
  onChange: (startIso: string) => void
}

const SlotGrid = ({ dateKey, duration, timezone, value, onChange }: Props) => {
  const [slots, setSlots] = useState<Slot[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setSlots(null)
    setError(null)

    fetch(`/api/booking/availability?date=${dateKey}&duration=${duration}`)
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Could not load times")
        return res.json() as Promise<AvailabilityResponse>
      })
      .then((data) => {
        // A slower earlier request must not overwrite a newer day's slots.
        if (!cancelled) setSlots(data.slots)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load times")
      })

    return () => {
      cancelled = true
    }
  }, [dateKey, duration])

  const zone = slots?.length ? formatZoneAbbrev(slots[0].start, timezone) : timezone

  /**
   * The heading is the host's calendar date, but times render in the visitor's
   * zone — and far enough west those are a different local day. Saying so
   * beats a heading that contradicts every time under it.
   */
  const localDates = useMemo(() => {
    if (!slots?.length) return []
    const seen = new Set(slots.map((slot) => formatDateKey(new Date(slot.start), timezone)))
    return Array.from(seen).sort()
  }, [slots, timezone])

  const shiftsLocalDate = localDates.length > 0 && !(localDates.length === 1 && localDates[0] === dateKey)

  return (
    <div>
      <h3 className="text-[#0D0505] text-lg font-bold tracking-tight mb-1">{formatDateKeyLong(dateKey)}</h3>
      <p className="text-[#8A8A8A] text-sm mb-2">
        {duration}-minute slots, shown in your time ({zone}).
      </p>
      {shiftsLocalDate && (
        <p className="text-[#0D0505] text-xs mb-6 bg-[#FF4B1F]/[0.06] border border-[#FF4B1F]/20 rounded-xl px-3 py-2">
          Heads up — that&apos;s my date. Where you are, these land on{" "}
          <strong className="font-semibold">{localDates.map(formatDateKeyLong).join(" and ")}</strong>.
        </p>
      )}
      {!shiftsLocalDate && <div className="mb-6" />}

      {slots === null && !error && (
        <div className="grid grid-cols-3 gap-2" aria-busy="true" aria-label="Loading available times">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-11 rounded-xl bg-[#F0F0F0] animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="border border-[#EAEAEA] rounded-2xl p-6 text-center">
          <p className="text-[#0D0505] text-sm font-semibold mb-1">{error}</p>
          <p className="text-[#8A8A8A] text-xs">Try another date, or refresh the page.</p>
        </div>
      )}

      {slots?.length === 0 && (
        <div className="border border-[#EAEAEA] rounded-2xl p-8 text-center">
          <p className="text-[#0D0505] text-sm font-semibold mb-1">Nothing free that day.</p>
          <p className="text-[#8A8A8A] text-xs">Go back and pick another date.</p>
        </div>
      )}

      {slots && slots.length > 0 && (
        <div className="grid grid-cols-3 gap-2 max-h-[340px] overflow-y-auto pr-1">
          {slots.map((slot) => {
            const selected = slot.start === value
            return (
              <button
                key={slot.start}
                type="button"
                disabled={!slot.available}
                onClick={() => onChange(slot.start)}
                aria-pressed={selected}
                title={slot.available ? undefined : "Already booked"}
                className={[
                  "h-11 rounded-xl border text-sm font-semibold transition-colors",
                  selected
                    ? "border-[#FF4B1F] bg-[#FF4B1F] text-white"
                    : slot.available
                      ? "border-[#EAEAEA] text-[#0D0505] hover:border-[#FF4B1F] hover:text-[#FF4B1F]"
                      : "border-[#F0F0F0] text-[#D5D5D5] line-through cursor-not-allowed",
                ].join(" ")}
              >
                {formatTime(slot.start, timezone)}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SlotGrid
