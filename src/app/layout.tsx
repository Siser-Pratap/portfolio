import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Preloader from "@/components/preloader"

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Siser Pratap",
  description: "",
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
      <body className={`${inter.className} font-sans cursor-none`}><Preloader>{children}</Preloader></body>
    </html>
  )
}
