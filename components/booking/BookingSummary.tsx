"use client"

import { SETTINGS } from "@/constants/settings"
import { formatDateKeyLong, formatTime, formatZoneAbbrev } from "@/lib/booking/format"

type Props = {
  duration: number
  dateKey: string | null
  slotIso: string | null
  timezone: string
  guests: string[]
}

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="border-t border-[#EAEAEA] pt-4">
    <p className="text-[#8A8A8A] text-xs mb-1 font-medium">{label}</p>
    <div className="text-[#0D0505] font-semibold text-sm">{children}</div>
  </div>
)

const Pending = () => <span className="text-[#C9C9C9] font-normal">Not picked yet</span>

const BookingSummary = ({ duration, dateKey, slotIso, timezone, guests }: Props) => (
  <div className="flex flex-col gap-4">
    <Row label="Length">{duration} minutes</Row>

    <Row label="Date">{dateKey ? formatDateKeyLong(dateKey) : <Pending />}</Row>

    <Row label="Time">
      {slotIso ? (
        <>
          {formatTime(slotIso, timezone)} {formatZoneAbbrev(slotIso, timezone)}
          <span className="block text-[#8A8A8A] font-normal text-xs mt-1">
            {formatTime(slotIso, SETTINGS.booking.hostTimezone)}{" "}
            {formatZoneAbbrev(slotIso, SETTINGS.booking.hostTimezone)} my time
          </span>
        </>
      ) : (
        <Pending />
      )}
    </Row>

    {guests.length > 0 && (
      <Row label="Guests">
        {guests.length} invited
        <span className="block text-[#8A8A8A] font-normal text-xs mt-1 break-words">{guests.join(", ")}</span>
      </Row>
    )}

    <div className="border-t border-[#EAEAEA] pt-4 flex items-center gap-2">
      <span className="w-6 h-6 rounded-full bg-gradient-to-b from-[#FF4B1F] to-[#FF6A21] flex items-center justify-center text-white text-[11px] font-bold">
        M
      </span>
      <span className="text-[#0D0505] text-sm font-semibold">Google Meet</span>
      <span className="text-[#8A8A8A] text-xs">— link arrives by email</span>
    </div>
  </div>
)

export default BookingSummary
