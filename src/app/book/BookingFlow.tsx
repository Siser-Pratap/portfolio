"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "framer-motion"
import { SETTINGS } from "@/constants/settings"
import BookingSummary from "@/components/booking/BookingSummary"
import DatePicker from "@/components/booking/DatePicker"
import DetailsForm, { emptyDetails, type Details } from "@/components/booking/DetailsForm"
import DurationPicker from "@/components/booking/DurationPicker"
import SlotGrid from "@/components/booking/SlotGrid"
import StepIndicator, { STEP_ORDER, type StepId } from "@/components/booking/StepIndicator"
import SuccessCard from "@/components/booking/SuccessCard"
import { container, EASE, riseIn, stepSlide } from "@/lib/booking/motion"
import type { BookingResult } from "@/lib/booking/types"

const BookingFlow = () => {
  const [step, setStep] = useState<StepId>("duration")
  const [duration, setDuration] = useState(SETTINGS.booking.defaultDuration)
  const [dateKey, setDateKey] = useState<string | null>(null)
  const [slotIso, setSlotIso] = useState<string | null>(null)
  const [details, setDetails] = useState<Details>(emptyDetails)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<BookingResult | null>(null)

  // The scheduler is single-timezone: everything is shown and booked in IST
  // (the host timezone), so there is no visitor-timezone resolution to do.
  const timezone = SETTINGS.booking.hostTimezone

  const completed: StepId[] = [
    "duration",
    ...(dateKey ? (["date"] as StepId[]) : []),
    ...(slotIso ? (["time"] as StepId[]) : []),
  ]

  // Which way the panels should travel: +1 forward, -1 back.
  const direction = useRef(1)

  // Zeroes the travel distance so reduced motion is a fade, not a jump.
  // Gated behind `mounted` because useReducedMotion is null during SSR — reading
  // it in the SSR'd `initial` would desync hydration. Exits are all post-mount.
  const reducedPref = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const reduced = mounted && reducedPref

  const slideVariants = stepSlide(reduced ? 0 : 40)
  const riseVariants = riseIn(reduced ? 0 : 24)

  const goTo = (next: StepId) => {
    direction.current = STEP_ORDER.indexOf(next) >= STEP_ORDER.indexOf(step) ? 1 : -1
    setError(null)
    setStep(next)
  }

  const handleDuration = (next: number) => {
    // A slot picked for a different length may now overrun the working day, and
    // the chosen date may not even have room for the longer call — clear both.
    if (next !== duration) {
      setSlotIso(null)
      setDateKey(null)
    }
    setDuration(next)
    goTo("date")
  }

  const handleDate = (next: string) => {
    if (next !== dateKey) setSlotIso(null)
    setDateKey(next)
    goTo("time")
  }

  const handleSlot = (next: string) => {
    setSlotIso(next)
    goTo("details")
  }

  const submit = async () => {
    if (!slotIso) {
      setError("Pick a time first.")
      setStep("time")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: details.name,
          email: details.email,
          subject: details.subject,
          notes: details.notes || undefined,
          guests: details.guests,
          duration,
          startsAt: slotIso,
          timezone,
          honeypot: details.honeypot,
        }),
      })

      const body = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(body.error ?? "Something went wrong. Please try again.")
        // The slot went stale between picking and confirming — send them back
        // to a freshly fetched grid rather than letting them retry a dead time.
        if (res.status === 409) {
          setSlotIso(null)
          setStep("time")
        }
        return
      }

      setResult(body as BookingResult)
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setResult(null)
    setDetails(emptyDetails)
    setSlotIso(null)
    setDateKey(null)
    setStep("duration")
  }

  const stepIndex = STEP_ORDER.indexOf(step)

  return (
    // reducedMotion="user" makes every transform/layout animation below
    // collapse to a plain opacity change when the OS asks for less motion.
    <MotionConfig reducedMotion="user">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">
        {/* Left: editorial column + live recap */}
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col pt-4">
          <motion.span variants={riseVariants} className="text-[#8A8A8A] text-sm font-medium mb-6 italic">
            {"(/ Book a Call )"}
          </motion.span>
          <motion.h1
            variants={riseVariants}
            className="text-[clamp(34px,5vw,56px)] font-[700] leading-[1.1] text-[#0D0505] tracking-tight mb-8 max-w-[420px]"
          >
            {result ? "That's in the diary." : "Let's find a time that works."}
          </motion.h1>
          <motion.p variants={riseVariants} className="text-[#8A8A8A] text-[15px] leading-[1.8] mb-12 max-w-[380px]">
            {result
              ? "Everything you need is in your inbox — including the calendar invite. See you then."
              : "Pick a slot and I'll send a Google Meet invite straight to your inbox. No account, no back-and-forth."}
          </motion.p>

          {!result && (
            <motion.div variants={riseVariants} className="lg:sticky lg:top-10">
              <BookingSummary
                duration={duration}
                dateKey={dateKey}
                slotIso={slotIso}
                timezone={timezone}
                guests={details.guests}
              />
            </motion.div>
          )}
        </motion.div>

        {/* Right: the active step */}
        <motion.div
          layout
          initial={{ opacity: 0, y: reduced ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
          className="bg-white rounded-[24px] p-8 sm:p-10 shadow-[0_10px_50px_-15px_rgba(0,0,0,0.05)] border border-[#EAEAEA] overflow-hidden"
        >
          {result ? (
            <SuccessCard
              result={result}
              duration={duration}
              timezone={timezone}
              email={details.email}
              guests={details.guests}
              onBookAnother={reset}
            />
          ) : (
            <>
              <StepIndicator current={step} completed={completed} onJump={goTo} />

              {/* One panel at a time, sliding the way the visitor is going. */}
              <AnimatePresence mode="wait" custom={direction.current} initial={false}>
                <motion.div
                  key={step}
                  custom={direction.current}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {step === "duration" && <DurationPicker value={duration} onChange={handleDuration} />}

                  {step === "date" && (
                    <DatePicker value={dateKey} duration={duration} onChange={handleDate} />
                  )}

                  {step === "time" && dateKey && (
                    <SlotGrid
                      dateKey={dateKey}
                      duration={duration}
                      timezone={timezone}
                      value={slotIso}
                      onChange={handleSlot}
                    />
                  )}

                  {step === "details" && (
                    <DetailsForm
                      value={details}
                      onChange={setDetails}
                      onSubmit={submit}
                      submitting={submitting}
                      error={error}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {stepIndex > 0 && (
                <motion.button
                  layout
                  type="button"
                  onClick={() => goTo(STEP_ORDER[stepIndex - 1])}
                  whileHover={{ x: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className="text-[#8A8A8A] text-xs mt-8 hover:text-[#FF4B1F] transition-colors"
                >
                  ← Back
                </motion.button>
              )}
            </>
          )}
        </motion.div>
      </div>
    </MotionConfig>
  )
}

export default BookingFlow
