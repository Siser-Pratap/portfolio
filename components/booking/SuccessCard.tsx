"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { SETTINGS } from "@/constants/settings"
import { cell, container, EASE } from "@/lib/booking/motion"
import { formatDateKeyLong, formatTime, formatZoneAbbrev, googleCalendarUrl } from "@/lib/booking/format"
import { formatDateKey } from "@/lib/booking/slots"
import type { BookingResult } from "@/lib/booking/types"

type Props = {
  result: BookingResult
  duration: number
  timezone: string
  email: string
  guests: string[]
  onBookAnother: () => void
}

const SuccessCard = ({ result, duration, timezone, email, guests, onBookAnother }: Props) => {
  const dateKey = formatDateKey(new Date(result.startsAt), timezone)
  const addToCalendar = googleCalendarUrl({
    subject: "Call with Siser Pratap",
    startIso: result.startsAt,
    durationMinutes: duration,
    details: `Google Meet: ${result.joinUrl}`,
    location: result.joinUrl,
    timeZone: timezone,
  })

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative text-center py-4"
    >
      {/* Slow orange bloom behind the confirmation. */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 0.5, 0.28], scale: 1 }}
        transition={{ duration: 1.6, ease: EASE, times: [0, 0.5, 1] }}
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 w-56 h-56 rounded-full bg-[#FF4B1F]/30 blur-[70px]"
      />

      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="relative w-16 h-16 rounded-full bg-gradient-to-b from-[#FF4B1F] to-[#FF6A21] mx-auto flex items-center justify-center mb-6"
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <motion.path
            d="M4 12.5l5.5 5.5L20 7"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
          />
        </svg>
      </motion.div>

      <motion.h3
        variants={cell}
        className="relative text-[#0D0505] text-[28px] font-[800] tracking-tight leading-tight mb-3"
      >
        You&apos;re booked in.
      </motion.h3>
      <motion.p
        variants={cell}
        className="relative text-[#8A8A8A] text-sm leading-relaxed mb-8 max-w-[380px] mx-auto"
      >
        {formatDateKeyLong(dateKey)} at {formatTime(result.startsAt, timezone)}{" "}
        {formatZoneAbbrev(result.startsAt, timezone)} — {duration} minutes on Google Meet.
      </motion.p>

      <motion.div variants={cell} className="relative border-t border-b border-[#EAEAEA] py-5 mb-8 text-left">
        <p className="text-[#8A8A8A] text-xs mb-1 font-medium">Confirmation sent to</p>
        <p className="text-[#0D0505] font-semibold text-sm break-words">{email}</p>
        {guests.length > 0 && (
          <p className="text-[#8A8A8A] text-xs mt-2 break-words">CC&apos;d: {guests.join(", ")}</p>
        )}
        <p className="text-[#8A8A8A] text-xs mt-3 leading-relaxed">
          The calendar invite is attached to that email. Need to move it? Just reply — or write to{" "}
          <a href={`mailto:${SETTINGS.email}`} className="text-[#0D0505] font-semibold hover:text-[#FF4B1F]">
            {SETTINGS.email}
          </a>
          .
        </p>
      </motion.div>

      <motion.div variants={cell} className="relative flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
        <a
          href={result.joinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#0D0505] text-white font-bold px-7 py-3.5 rounded-full text-sm hover:bg-[#FF4B1F] transition-colors"
        >
          Open the Meet link
        </a>
        <a
          href={addToCalendar}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-[#EAEAEA] text-[#0D0505] font-bold px-7 py-3.5 rounded-full text-sm hover:border-[#0D0505] transition-colors"
        >
          Add to Google Calendar
        </a>
      </motion.div>

      <Link
        href="/"
        className="relative inline-block text-[#8A8A8A] text-xs mt-6 hover:text-[#FF4B1F] transition-colors underline underline-offset-4"
      >
        Back to portfolio
      </Link>

      <motion.button
        variants={cell}
        type="button"
        onClick={onBookAnother}
        className="relative block mx-auto text-[#8A8A8A] text-xs mt-6 hover:text-[#FF4B1F] transition-colors underline underline-offset-4"
      >
        Book another call
      </motion.button>

      <motion.p variants={cell} className="relative text-[#C9C9C9] text-[11px] mt-6">
        Ref {result.bookingId}
      </motion.p>
    </motion.div>
  )
}

export default SuccessCard
