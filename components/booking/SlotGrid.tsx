"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cell, grid, LAYOUT } from "@/lib/booking/motion"
import { formatDateKeyLong, formatTime, formatZoneAbbrev } from "@/lib/booking/format"
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

  const zone = slots?.length ? formatZoneAbbrev(slots[0].start, timezone) : "IST"

  return (
    <div>
      <h3 className="text-[#0D0505] text-lg font-bold tracking-tight mb-1">{formatDateKeyLong(dateKey)}</h3>
      <p className="text-[#8A8A8A] text-sm mb-6">
        {duration}-minute slots, all times in {zone}.
      </p>

      <AnimatePresence mode="wait">
        {slots === null && !error && (
          <motion.div
            key="skeleton"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-3 gap-2"
            aria-busy="true"
            aria-label="Loading available times"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-11 rounded-xl slot-shimmer animate-slot-shimmer"
                style={{ animationDelay: `${i * 0.06}s` }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

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
        <motion.div
          // Re-keyed per day+length so a new grid replays rather than morphs.
          key={`${dateKey}-${duration}`}
          variants={grid(0.02)}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-2 max-h-[340px] overflow-y-auto pr-1"
        >
          {slots.map((slot) => {
            const selected = slot.start === value
            return (
              <motion.button
                key={slot.start}
                variants={cell}
                type="button"
                disabled={!slot.available}
                onClick={() => onChange(slot.start)}
                aria-pressed={selected}
                title={slot.available ? undefined : "Already booked"}
                whileHover={slot.available ? { y: -2 } : undefined}
                whileTap={slot.available ? { scale: 0.96 } : undefined}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={[
                  "relative h-11 rounded-xl border text-sm font-semibold transition-colors",
                  selected
                    ? "border-[#FF4B1F] text-white"
                    : slot.available
                      ? "border-[#EAEAEA] text-[#0D0505] hover:border-[#FF4B1F] hover:text-[#FF4B1F]"
                      : "border-[#F0F0F0] text-[#D5D5D5] line-through cursor-not-allowed",
                ].join(" ")}
              >
                {selected && (
                  <motion.span
                    layoutId={LAYOUT.slotSelect}
                    className="absolute inset-0 rounded-xl bg-[#FF4B1F]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{formatTime(slot.start, timezone)}</span>
              </motion.button>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}

export default SlotGrid
