"use client"

import { useState } from "react"
import { SETTINGS } from "@/constants/settings"

type FormState = {
  name: string
  email: string
  phone: string
  company: string
  message: string
}

const initialForm: FormState = { name: "", email: "", phone: "", company: "", message: "" }

const Contact = () => {
  const [form, setForm] = useState<FormState>(initialForm)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setStatus("success")
        setForm(initialForm)
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  const inputClass =
    "w-full border-b border-[#EAEAEA] pb-2 text-sm text-[#0D0505] placeholder-[#8A8A8A] outline-none focus:border-[#FF4B1F] transition-colors bg-transparent"

  return (
    <section id="contact" className="w-full bg-[#F7F7F7] py-[120px]">
      <div className="max-w-[1400px] mx-auto px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">

          {/* Left: Info */}
          <div className="flex flex-col pt-4">
            <span className="text-[#8A8A8A] text-sm font-medium mb-6 italic">{'(/ Contact )'}</span>
            <h2 className="text-[56px] font-[700] leading-[1.1] text-[#0D0505] tracking-tight mb-16 max-w-[400px]">
              Let&apos;s Build Something Together
            </h2>

            <div className="flex flex-col gap-8">
              <div className="border-t border-[#EAEAEA] pt-6">
                <p className="text-[#8A8A8A] text-sm mb-2 font-medium">Phone</p>
                <p className="text-[#0D0505] font-semibold">{SETTINGS.phone}</p>
              </div>
              <div className="border-t border-[#EAEAEA] pt-6">
                <p className="text-[#8A8A8A] text-sm mb-2 font-medium">Email</p>
                <a
                  href={`mailto:${SETTINGS.email}`}
                  className="text-[#0D0505] font-semibold hover:text-[#FF4B1F] transition-colors"
                >
                  {SETTINGS.email}
                </a>
              </div>
              <div className="border-t border-[#EAEAEA] pt-6 border-b border-b-[#EAEAEA] pb-6">
                <p className="text-[#8A8A8A] text-sm mb-2 font-medium">Location</p>
                <p className="text-[#0D0505] font-semibold">{SETTINGS.location}</p>
              </div>
            </div>
          </div>

          {/* Right: Form Card */}
          <div className="bg-white rounded-[24px] p-10 shadow-[0_10px_50px_-15px_rgba(0,0,0,0.05)] border border-[#EAEAEA]">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-semibold text-[#0D0505]">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-semibold text-[#0D0505]">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <label className="text-[12px] font-semibold text-[#0D0505]">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <label className="text-[12px] font-semibold text-[#0D0505]">Company</label>
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Company"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <label className="text-[12px] font-semibold text-[#0D0505]">How can I help you *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  rows={3}
                  required
                  className={`${inputClass} resize-none`}
                ></textarea>
              </div>

              {status === "success" && (
                <p className="text-sm text-green-600 font-medium">Message sent! I&apos;ll get back to you shortly.</p>
              )}
              {status === "error" && (
                <p className="text-sm text-red-500 font-medium">Something went wrong. Please try again or email directly.</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-[#0D0505] text-white font-bold py-4 rounded-full mt-8 hover:bg-[#FF4B1F] transition-colors text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "SENDING..." : "SEND MESSAGE"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Contact
