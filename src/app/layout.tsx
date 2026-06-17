import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://siserpratap.vercel.app"),
  title: "Siser Pratap | Full Stack Developer",
  description:
    "Portfolio of Siser Pratap — Full Stack Developer specialising in React, Next.js, Node.js, and cloud-native apps. Available for freelance & collaborations worldwide.",
  keywords: [
    "Siser Pratap",
    "Full Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js",
    "TypeScript",
    "Portfolio",
    "India",
    "Freelance Developer",
  ],
  authors: [{ name: "Siser Pratap", url: "https://github.com/Siser-Pratap" }],
  creator: "Siser Pratap",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Siser Pratap | Full Stack Developer",
    description:
      "Full Stack Developer building scalable web apps, APIs, and 3D web experiences.",
    siteName: "Siser Pratap Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Siser Pratap | Full Stack Developer",
    description: "Full Stack Developer — React, Next.js, Node.js, Three.js.",
    creator: "@PratapSiser",
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head><link rel="icon" href="/favicon.ico" /></head>
      <body className={`${inter.className} font-sans cursor-none`}>{children}</body>
    </html>
  )
}
