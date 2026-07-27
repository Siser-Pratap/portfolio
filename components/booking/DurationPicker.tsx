"use client"

import { motion } from "framer-motion"
import { SETTINGS } from "@/constants/settings"
import { cell, grid, LAYOUT } from "@/lib/booking/motion"

type Props = {
  value: number
  onChange: (duration: number) => void
}

const BLURB: Record<number, string> = {
  15: "A quick intro or a single question.",
  30: "The usual — scope, timeline, and fit.",
  45: "A deeper dive into requirements.",
  60: "Full walkthrough, architecture, and planning.",
}

const DurationPicker = ({ value, onChange }: Props) => (
  <div>
    <h3 className="text-[#0D0505] text-lg font-bold tracking-tight mb-1">How long do you need?</h3>
    <p className="text-[#8A8A8A] text-sm mb-6">Pick a length and I&apos;ll show what&apos;s free that day.</p>

    <motion.div variants={grid(0.06)} initial="hidden" animate="show" className="flex flex-col gap-3">
      {SETTINGS.booking.durations.map((duration) => {
        const selected = duration === value
        return (
          <motion.button
            key={duration}
            variants={cell}
            type="button"
            onClick={() => onChange(duration)}
            aria-pressed={selected}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={[
              "relative flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition-colors",
              selected ? "border-[#FF4B1F]" : "border-[#EAEAEA] hover:border-[#0D0505]",
            ].join(" ")}
          >
            {selected && (
              <motion.span
                layoutId={LAYOUT.durationPill}
                className="absolute inset-0 rounded-2xl bg-[#FF4B1F]/[0.05]"
                transition={{ type: "spring", stiffness: 380, damping: 34 }}
              />
            )}

            <span className="relative">
              <span className="block text-[#0D0505] font-bold text-[15px]">{duration} minutes</span>
              <span className="block text-[#8A8A8A] text-xs mt-0.5">{BLURB[duration] ?? ""}</span>
            </span>

            <span
              className={[
                "relative w-5 h-5 rounded-full border flex items-center justify-center text-[10px] text-white shrink-0 transition-colors",
                selected ? "bg-[#FF4B1F] border-[#FF4B1F]" : "border-[#EAEAEA]",
              ].join(" ")}
            >
              {selected ? "✓" : ""}
            </span>
          </motion.button>
        )
      })}
    </motion.div>
  </div>
)

export default DurationPicker
