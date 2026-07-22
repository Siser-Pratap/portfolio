"use client"

import { AnimatePresence, motion } from "framer-motion"
import { SETTINGS } from "@/constants/settings"
import { formatDateKeyLong, formatTime, formatZoneAbbrev } from "@/lib/booking/format"
import { EASE } from "@/lib/booking/motion"

type Props = {
  duration: number
  dateKey: string | null
  slotIso: string | null
  timezone: string
  guests: string[]
}

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <motion.div layout className="border-t border-[#EAEAEA] pt-4">
    <p className="text-[#8A8A8A] text-xs mb-1 font-medium">{label}</p>
    <div className="text-[#0D0505] font-semibold text-sm">{children}</div>
  </motion.div>
)

/** Values fade up as they're filled in, so the recap feels like it's building. */
const Filled = ({ children }: { children: React.ReactNode }) => (
  <motion.span
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, ease: EASE }}
    className="block"
  >
    {children}
  </motion.span>
)

const Pending = () => <span className="text-[#C9C9C9] font-normal">Not picked yet</span>

const BookingSummary = ({ duration, dateKey, slotIso, timezone, guests }: Props) => (
  <motion.div layout className="flex flex-col gap-4">
    <Row label="Length">
      <Filled key={duration}>{duration} minutes</Filled>
    </Row>

    <Row label="Date">
      {dateKey ? <Filled key={dateKey}>{formatDateKeyLong(dateKey)}</Filled> : <Pending />}
    </Row>

    <Row label="Time">
      {slotIso ? (
        <Filled key={slotIso}>
          {formatTime(slotIso, timezone)} {formatZoneAbbrev(slotIso, timezone)}
          <span className="block text-[#8A8A8A] font-normal text-xs mt-1">
            {formatTime(slotIso, SETTINGS.booking.hostTimezone)}{" "}
            {formatZoneAbbrev(slotIso, SETTINGS.booking.hostTimezone)} my time
          </span>
        </Filled>
      ) : (
        <Pending />
      )}
    </Row>

    <AnimatePresence>
      {guests.length > 0 && (
        <motion.div
          layout
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="overflow-hidden"
        >
          <Row label="Guests">
            {guests.length} invited
            <span className="block text-[#8A8A8A] font-normal text-xs mt-1 break-words">
              {guests.join(", ")}
            </span>
          </Row>
        </motion.div>
      )}
    </AnimatePresence>

    <motion.div layout className="border-t border-[#EAEAEA] pt-4 flex items-center gap-2">
      <span className="w-6 h-6 rounded-full bg-gradient-to-b from-[#FF4B1F] to-[#FF6A21] flex items-center justify-center text-white text-[11px] font-bold">
        M
      </span>
      <span className="text-[#0D0505] text-sm font-semibold">Google Meet</span>
      <span className="text-[#8A8A8A] text-xs">— link arrives by email</span>
    </motion.div>
  </motion.div>
)

export default BookingSummary
