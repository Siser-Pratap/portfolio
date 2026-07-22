"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { SETTINGS } from "@/constants/settings"
import { isValidEmail } from "@/lib/booking/format"

type Props = {
  value: string[]
  onChange: (guests: string[]) => void
}

const GuestInput = ({ value, onChange }: Props) => {
  const [draft, setDraft] = useState("")
  const [error, setError] = useState<string | null>(null)

  const commit = (raw: string) => {
    const email = raw.trim().toLowerCase().replace(/,$/, "")
    if (!email) return

    if (!isValidEmail(email)) {
      setError(`"${email}" isn't a valid email`)
      return
    }
    if (value.includes(email)) {
      setError("That guest is already on the list")
      setDraft("")
      return
    }
    if (value.length >= SETTINGS.booking.maxGuests) {
      setError(`At most ${SETTINGS.booking.maxGuests} guests`)
      return
    }

    onChange([...value, email])
    setDraft("")
    setError(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      // Enter would otherwise submit the form with a half-typed guest.
      e.preventDefault()
      commit(draft)
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div className="flex flex-col gap-2 mt-4">
      <label htmlFor="guest-input" className="text-[12px] font-semibold text-[#0D0505]">
        Guests <span className="text-[#8A8A8A] font-normal">(optional)</span>
      </label>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-1">
          {/* popLayout so the remaining chips slide up as one is removed. */}
          <AnimatePresence mode="popLayout" initial={false}>
            {value.map((email) => (
              <motion.span
                key={email}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
                className="inline-flex items-center gap-2 bg-[#0D0505] text-white text-xs font-medium pl-3 pr-2 py-1.5 rounded-full"
              >
                {email}
                <button
                  type="button"
                  onClick={() => onChange(value.filter((g) => g !== email))}
                  aria-label={`Remove ${email}`}
                  className="w-4 h-4 rounded-full bg-white/20 hover:bg-[#FF4B1F] transition-colors flex items-center justify-center text-[10px] leading-none"
                >
                  ×
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      )}

      <input
        id="guest-input"
        type="email"
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value)
          setError(null)
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => commit(draft)}
        placeholder={value.length ? "Add another…" : "colleague@company.com"}
        className="w-full border-b border-[#EAEAEA] pb-2 text-sm text-[#0D0505] placeholder-[#8A8A8A] outline-none focus:border-[#FF4B1F] transition-colors bg-transparent"
      />

      <p className={`text-xs ${error ? "text-red-500" : "text-[#8A8A8A]"}`}>
        {error ?? "Press Enter after each address — they'll be CC'd on the invite."}
      </p>
    </div>
  )
}

export default GuestInput
