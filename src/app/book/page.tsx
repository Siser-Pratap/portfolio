import Link from "next/link"
import type { Metadata } from "next"
import BookingFlow from "./BookingFlow"
import JsonLd from "@/components/seo/JsonLd"
import { SITE, absoluteUrl } from "@/constants/site"
import { graph, breadcrumbSchema } from "@/lib/seo/schema"

export const metadata: Metadata = {
  // The root layout's title template appends "— Siser Pratap".
  title: "Book a Call",
  description:
    "Schedule a Google Meet with Siser Pratap. Pick a length, choose a time in your own timezone, and get the invite by email.",
  alternates: {
    canonical: "/book",
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/book"),
    title: `Book a Call — ${SITE.name}`,
    description: "Pick a time that works for you. Google Meet invite lands in your inbox.",
    siteName: SITE.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `Book a Call — ${SITE.name}`,
    description: "Pick a time that works for you. Google Meet invite lands in your inbox.",
  },
}

export default function BookPage() {
  return (
    <main className="bg-[#F7F7F7] min-h-screen">
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: SITE.name, path: "/" },
            { name: "Book a Call", path: "/book" },
          ])
        )}
      />
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

      <div className="relative">
        {/* Ambient bloom — echoes the Hero. Decorative, so it drifts slowly
            and disappears entirely under prefers-reduced-motion. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="booking-blob animate-blob-drift absolute -top-20 -left-24 w-[420px] h-[420px] rounded-full bg-[#FF4B1F] opacity-[0.07]" />
          <div
            className="booking-blob animate-blob-drift absolute top-[40%] -right-32 w-[380px] h-[380px] rounded-full bg-[#FF6A21] opacity-[0.06]"
            style={{ animationDelay: "-7s" }}
          />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6 sm:px-10 py-[60px] lg:py-[100px]">
          <BookingFlow />
        </div>
      </div>

      {/* Same marquee treatment as the homepage banner. */}
      <div className="border-t border-[#EAEAEA] py-5 overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="text-[#C9C9C9] text-xs font-semibold tracking-[0.2em] uppercase mx-6">
              Available for work · Open to collaborate · Usually replies within a day ·
            </span>
          ))}
        </div>
      </div>
    </main>
  )
}
