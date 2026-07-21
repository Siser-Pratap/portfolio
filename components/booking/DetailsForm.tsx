"use client"

import GuestInput from "./GuestInput"

export type Details = {
  name: string
  email: string
  subject: string
  notes: string
  guests: string[]
  /** Anti-spam. Hidden from humans; bots fill it and get a fake success. */
  honeypot: string
}

export const emptyDetails: Details = {
  name: "",
  email: "",
  subject: "",
  notes: "",
  guests: [],
  honeypot: "",
}

type Props = {
  value: Details
  onChange: (details: Details) => void
  onSubmit: () => void
  submitting: boolean
  error: string | null
}

const inputClass =
  "w-full border-b border-[#EAEAEA] pb-2 text-sm text-[#0D0505] placeholder-[#8A8A8A] outline-none focus:border-[#FF4B1F] transition-colors bg-transparent"

const DetailsForm = ({ value, onChange, onSubmit, submitting, error }: Props) => {
  const set = <K extends keyof Details>(key: K, next: Details[K]) => onChange({ ...value, [key]: next })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className="flex flex-col"
    >
      <h3 className="text-[#0D0505] text-lg font-bold tracking-tight mb-1">Last bit</h3>
      <p className="text-[#8A8A8A] text-sm mb-6">So I know who I&apos;m meeting and what we&apos;re covering.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="booking-name" className="text-[12px] font-semibold text-[#0D0505]">
            Your name *
          </label>
          <input
            id="booking-name"
            name="name"
            autoComplete="name"
            value={value.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Aditi Rao"
            required
            minLength={2}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="booking-email" className="text-[12px] font-semibold text-[#0D0505]">
            Your email *
          </label>
          <input
            id="booking-email"
            name="email"
            type="email"
            autoComplete="email"
            value={value.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@company.com"
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-6">
        <label htmlFor="booking-subject" className="text-[12px] font-semibold text-[#0D0505]">
          What&apos;s it about? *
        </label>
        <input
          id="booking-subject"
          name="subject"
          value={value.subject}
          onChange={(e) => set("subject", e.target.value)}
          placeholder="Intro call — rebuilding our marketing site"
          required
          minLength={3}
          maxLength={140}
          className={inputClass}
        />
      </div>

      <GuestInput value={value.guests} onChange={(guests) => set("guests", guests)} />

      <div className="flex flex-col gap-2 mt-6">
        <label htmlFor="booking-notes" className="text-[12px] font-semibold text-[#0D0505]">
          Anything else? <span className="text-[#8A8A8A] font-normal">(optional)</span>
        </label>
        <textarea
          id="booking-notes"
          name="notes"
          value={value.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Context, links, or what you'd like to get out of the call…"
          rows={3}
          maxLength={1000}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Off-screen rather than display:none — some bots skip hidden fields. */}
      <div aria-hidden="true" className="absolute left-[-9999px] w-px h-px overflow-hidden">
        <label htmlFor="booking-company-url">Company URL</label>
        <input
          id="booking-company-url"
          name="honeypot"
          tabIndex={-1}
          autoComplete="off"
          value={value.honeypot}
          onChange={(e) => set("honeypot", e.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-500 font-medium mt-6">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#0D0505] text-white font-bold py-4 rounded-full mt-8 hover:bg-[#FF4B1F] transition-colors text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "CONFIRMING…" : "CONFIRM BOOKING"}
      </button>
    </form>
  )
}

export default DetailsForm
