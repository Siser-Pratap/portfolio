import Link from "next/link"
import type { Metadata } from "next"
import BookingFlow from "./BookingFlow"

export const metadata: Metadata = {
  title: "Book a Call — Siser Pratap",
  description:
    "Schedule a Google Meet with Siser Pratap. Pick a length, choose a time in your own timezone, and get the invite by email.",
  openGraph: {
    title: "Book a Call — Siser Pratap",
    description: "Pick a time that works for you. Google Meet invite lands in your inbox.",
  },
}

export default function BookPage() {
  return (
    // `cursor-auto` overrides the global `cursor-none` on <body> — a form is
    // unusable without a pointer.
    <main className="bg-[#F7F7F7] min-h-screen cursor-auto">
      <header className="w-full bg-[#0D0505] py-6 px-6 sm:px-10">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <Link href="/" className="text-white text-xl font-bold italic tracking-tight">
            Siser.
          </Link>
          <Link href="/" className="text-white/60 text-sm hover:text-white transition-colors">
            ← Back to portfolio
          </Link>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-[60px] lg:py-[100px]">
        <BookingFlow />
      </div>
    </main>
  )
}
