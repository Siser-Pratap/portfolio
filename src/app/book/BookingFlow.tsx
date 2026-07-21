"use client"

import { useEffect, useState } from "react"
import { SETTINGS } from "@/constants/settings"
import BookingSummary from "@/components/booking/BookingSummary"
import DatePicker from "@/components/booking/DatePicker"
import DetailsForm, { emptyDetails, type Details } from "@/components/booking/DetailsForm"
import DurationPicker from "@/components/booking/DurationPicker"
import SlotGrid from "@/components/booking/SlotGrid"
import StepIndicator, { STEP_ORDER, type StepId } from "@/components/booking/StepIndicator"
import SuccessCard from "@/components/booking/SuccessCard"
import { visitorTimezone } from "@/lib/booking/format"
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

  // Resolved on the client only — the server has no idea where the visitor is,
  // and reading it during render would desync hydration.
  const [timezone, setTimezone] = useState(SETTINGS.booking.hostTimezone)
  useEffect(() => setTimezone(visitorTimezone()), [])

  const completed: StepId[] = [
    "duration",
    ...(dateKey ? (["date"] as StepId[]) : []),
    ...(slotIso ? (["time"] as StepId[]) : []),
  ]

  const goTo = (next: StepId) => {
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">
      {/* Left: editorial column + live recap */}
      <div className="flex flex-col pt-4">
        <span className="text-[#8A8A8A] text-sm font-medium mb-6 italic">{"(/ Book a Call )"}</span>
        <h1 className="text-[clamp(34px,5vw,56px)] font-[700] leading-[1.1] text-[#0D0505] tracking-tight mb-8 max-w-[420px]">
          {result ? "That's in the diary." : "Let's find a time that works."}
        </h1>
        <p className="text-[#8A8A8A] text-[15px] leading-[1.8] mb-12 max-w-[380px]">
          {result
            ? "Everything you need is in your inbox — including the calendar invite. See you then."
            : "Pick a slot and I'll send a Google Meet invite straight to your inbox. No account, no back-and-forth."}
        </p>

        {!result && (
          <div className="lg:sticky lg:top-10">
            <BookingSummary
              duration={duration}
              dateKey={dateKey}
              slotIso={slotIso}
              timezone={timezone}
              guests={details.guests}
            />
          </div>
        )}
      </div>

      {/* Right: the active step */}
      <div className="bg-white rounded-[24px] p-8 sm:p-10 shadow-[0_10px_50px_-15px_rgba(0,0,0,0.05)] border border-[#EAEAEA]">
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

            {step === "duration" && <DurationPicker value={duration} onChange={handleDuration} />}

            {step === "date" && <DatePicker value={dateKey} duration={duration} onChange={handleDate} />}

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

            {stepIndex > 0 && (
              <button
                type="button"
                onClick={() => goTo(STEP_ORDER[stepIndex - 1])}
                className="text-[#8A8A8A] text-xs mt-8 hover:text-[#FF4B1F] transition-colors"
              >
                ← Back
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default BookingFlow
