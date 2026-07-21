"use client"

import Link from "next/link"
import { SETTINGS } from "@/constants/settings"
import { formatDateKeyLong, formatTime, formatZoneAbbrev } from "@/lib/booking/format"
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

  return (
    <div className="text-center py-4">
      <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#FF4B1F] to-[#FF6A21] mx-auto flex items-center justify-center mb-6">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 12.5l5.5 5.5L20 7"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h3 className="text-[#0D0505] text-[28px] font-[800] tracking-tight leading-tight mb-3">
        You&apos;re booked in.
      </h3>
      <p className="text-[#8A8A8A] text-sm leading-relaxed mb-8 max-w-[380px] mx-auto">
        {formatDateKeyLong(dateKey)} at {formatTime(result.startsAt, timezone)}{" "}
        {formatZoneAbbrev(result.startsAt, timezone)} — {duration} minutes on Google Meet.
      </p>

      <div className="border-t border-b border-[#EAEAEA] py-5 mb-8 text-left">
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
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={result.joinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#0D0505] text-white font-bold px-7 py-3.5 rounded-full text-sm hover:bg-[#FF4B1F] transition-colors"
        >
          Open the Meet link
        </a>
        <Link
          href="/"
          className="border border-[#EAEAEA] text-[#0D0505] font-bold px-7 py-3.5 rounded-full text-sm hover:border-[#0D0505] transition-colors"
        >
          Back to portfolio
        </Link>
      </div>

      <button
        type="button"
        onClick={onBookAnother}
        className="text-[#8A8A8A] text-xs mt-6 hover:text-[#FF4B1F] transition-colors underline underline-offset-4"
      >
        Book another call
      </button>

      <p className="text-[#C9C9C9] text-[11px] mt-6">Ref {result.bookingId}</p>
    </div>
  )
}

export default SuccessCard
