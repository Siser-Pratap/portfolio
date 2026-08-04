import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import CustomCursor from "@/components/custom-cursor"
import JsonLd from "@/components/seo/JsonLd"
import { SITE } from "@/constants/site"
import { graph, personSchema, websiteSchema } from "@/lib/seo/schema"

// Only the weights the live components actually use. 100/200/300 appear solely
// in the unused legacy components under /components (not /components/reconstructed),
// so shipping them cost three font files per page load for nothing.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    // Child routes set a bare title; the name is appended so every tab and
    // search result carries the entity.
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "Siser Pratap",
    "Siser",
    "siserpratap",
    "Full Stack Developer",
    "React Developer",
    "Next.js Developer",
    "AI Developer",
    "Node.js",
    "TypeScript",
    "Python",
    "FastAPI",
    "Portfolio",
    "Gurugram",
    "India",
    "Freelance Developer",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,

  // Self-referencing canonical. Combined with the host redirects in
  // next.config.mjs, this leaves exactly one indexable URL per page.
  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Without this Google may show a small thumbnail or none at all.
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    title: SITE.title,
    description: SITE.description,
    siteName: SITE.name,
  },

  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    creator: SITE.twitterHandle,
    site: SITE.twitterHandle,
  },

  category: "technology",
}

// Tints the mobile browser chrome to match the page surface instead of the
// default grey, so the site reads as one continuous surface on phones.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F7F7" },
    { media: "(prefers-color-scheme: dark)", color: "#0D0505" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="overflow-x-hidden" suppressHydrationWarning>
      <body className={`${inter.className} font-sans cursor-none`}>
        {/* Site-wide entity graph. Carried on every route so each page
            reinforces the same Person rather than standing alone. */}
        <JsonLd data={graph(personSchema(), websiteSchema())} />
        <CustomCursor />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
