"use client"

import Script from "next/script"
import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    turnstile?: {
      render(element: HTMLElement, options: { sitekey: string; action: string; callback: (token: string) => void; "expired-callback": () => void; "error-callback": () => void }): string
      remove(id: string): void
    }
  }
}

export default function Turnstile({ onVerify, resetKey }: { onVerify: (token: string) => void; resetKey: number }) {
  const container = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  useEffect(() => {
    if (!ready || !sitekey || !container.current || !window.turnstile) return
    const api = window.turnstile
    const id = api.render(container.current, { sitekey, action: "contact", callback: onVerify, "expired-callback": () => onVerify(""), "error-callback": () => onVerify("") })
    return () => { api.remove(id) }
  }, [ready, sitekey, onVerify, resetKey])
  return <>
    <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={() => setReady(true)} />
    <div ref={container} />
    {!sitekey && <p className="text-sm text-[#8A8A8A]">Please use the email address alongside this form to get in touch.</p>}
  </>
}
