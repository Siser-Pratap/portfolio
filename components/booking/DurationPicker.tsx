"use client"

import { SETTINGS } from "@/constants/settings"

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

    <div className="flex flex-col gap-3">
      {SETTINGS.booking.durations.map((duration) => {
        const selected = duration === value
        return (
          <button
            key={duration}
            type="button"
            onClick={() => onChange(duration)}
            aria-pressed={selected}
            className={[
              "flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition-colors",
              selected
                ? "border-[#FF4B1F] bg-[#FF4B1F]/[0.04]"
                : "border-[#EAEAEA] hover:border-[#0D0505]",
            ].join(" ")}
          >
            <span>
              <span className="block text-[#0D0505] font-bold text-[15px]">{duration} minutes</span>
              <span className="block text-[#8A8A8A] text-xs mt-0.5">{BLURB[duration] ?? ""}</span>
            </span>
            <span
              className={[
                "w-5 h-5 rounded-full border flex items-center justify-center text-[10px] text-white shrink-0",
                selected ? "bg-[#FF4B1F] border-[#FF4B1F]" : "border-[#EAEAEA]",
              ].join(" ")}
            >
              {selected ? "✓" : ""}
            </span>
          </button>
        )
      })}
    </div>
  </div>
)

export default DurationPicker
