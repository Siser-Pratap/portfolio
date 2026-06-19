"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

interface LoaderProps {
  onLoadComplete: () => void
}

const CHARS = ["S", "i", "s", "e", "r", "."]

const Loader = ({ onLoadComplete }: LoaderProps) => {
  const [isComplete, setIsComplete] = useState(false)
  const counterRef  = useRef<HTMLSpanElement>(null)
  const charRefs    = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    document.body.style.overflow = "hidden"

    const tl = gsap.timeline()

    // Initial state
    gsap.set(charRefs.current.filter(Boolean), { yPercent: 115, opacity: 0 })
    gsap.set(".loader-meta", { opacity: 0, y: 10 })

    tl
      // 1 — Characters slide up one-by-one from below their clip container
      .to(charRefs.current.filter(Boolean), {
        yPercent: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.065,
        ease: "power3.out",
        delay: 0.15,
      })

      // 2 — "Full Stack Developer · Loading" meta line fades in
      .to(".loader-meta", {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
      }, "-=0.35")

      // 3 — Counter counts 000 → 100
      .to(
        { val: 0 },
        {
          val: 100,
          duration: 1.3,
          ease: "power2.inOut",
          onUpdate() {
            if (counterRef.current) {
              const v = Math.round((this.targets()[0] as { val: number }).val)
              counterRef.current.textContent = String(v).padStart(3, "0")
            }
          },
        },
        "-=0.25"
      )

      // 4 — Very brief hold at 100
      .to({}, { duration: 0.12 })

      // 5 — Content fades out as panels prepare to split
      .to(".loader-content", {
        opacity: 0,
        scale: 0.97,
        duration: 0.3,
        ease: "power2.in",
      })

      // 6 — Panels split apart (the money shot)
      .to(".loader-panel-top", {
        yPercent: -100,
        duration: 0.72,
        ease: "power3.inOut",
      }, "-=0.12")
      .to(".loader-panel-bottom", {
        yPercent: 100,
        duration: 0.72,
        ease: "power3.inOut",
      }, "<")

      // 7 — Done
      .call(() => {
        setIsComplete(true)
        document.body.style.overflow = "auto"
        onLoadComplete()
      })

    return () => { tl.kill() }
  }, [onLoadComplete])

  if (isComplete) return null

  return (
    <div className="fixed inset-0 z-[9999]">

      {/* Top panel — slides up on exit */}
      <div className="loader-panel-top absolute top-0 left-0 right-0 h-[51%] bg-[#0D0505]" />

      {/* Bottom panel — slides down on exit */}
      <div className="loader-panel-bottom absolute bottom-0 left-0 right-0 h-[51%] bg-[#0D0505]" />

      {/* Thin orange centre-line accent — natural split point */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-px h-px bg-[#FF4B1F]/20 z-10" />

      {/* Content — sits above both panels */}
      <div className="loader-content absolute inset-0 z-20 flex flex-col items-center justify-center select-none px-6">

        {/* Name — each character in its own overflow-hidden clip */}
        <div className="flex items-end leading-none mb-5">
          {CHARS.map((char, i) => (
            <span key={i} className="overflow-hidden inline-block leading-[0.85]">
              <span
                ref={(el) => { charRefs.current[i] = el }}
                className="inline-block text-[clamp(72px,13vw,172px)] font-[800] italic text-white tracking-[-0.02em]"
              >
                {char}
              </span>
            </span>
          ))}
        </div>

        {/* Meta row */}
        <div className="loader-meta flex items-center gap-4">
          <span className="text-white/30 text-[11px] font-mono tracking-[0.2em] uppercase">
            Full Stack Developer
          </span>
          <span className="w-px h-3 bg-white/20" />
          <span className="text-white/30 text-[11px] font-mono tracking-[0.2em] uppercase">
            Loading
          </span>
          <span
            ref={counterRef}
            className="text-[#FF4B1F] text-[11px] font-mono tracking-[0.15em] font-bold tabular-nums"
          >
            000
          </span>
        </div>

      </div>
    </div>
  )
}

export default Loader
