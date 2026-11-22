"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import gsap from "gsap"

// Dynamically import the 3D model canvas to avoid SSR issues with Three.js / WebGL
const HeroModel = dynamic(() => import("@/components/reconstructed/HeroModel"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-2 border-[#E8E2D8]/20 border-t-[#E8E2D8] animate-spin" />
    </div>
  ),
})

const Hero = () => {
  const containerRef = useRef<HTMLElement>(null)
  const leftColRef = useRef<HTMLDivElement>(null)
  const rightColRef = useRef<HTMLDivElement>(null)
  const bottomStripRef = useRef<HTMLDivElement>(null)
  const modelTagRef = useRef<HTMLDivElement>(null)

  // GSAP Choreographed Entrance Animation
  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      tl.fromTo(
        ".hero-stage-bg",
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4 }
      )
        .fromTo(
          leftColRef.current,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 1 },
          "-=0.9"
        )
        .fromTo(
          rightColRef.current,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 1 },
          "-=0.8"
        )
        .fromTo(
          modelTagRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.6"
        )
        .fromTo(
          bottomStripRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5"
        )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100vh] min-h-[820px] flex items-center justify-center bg-[#0A0A0A] text-white overflow-hidden pt-20"
    >
      {/* Outer Tech Precision Rings */}
      <div className="hero-stage-bg absolute top-[47%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[78vh] h-[78vh] max-w-[820px] max-h-[820px] rounded-full border border-white/[0.06] pointer-events-none z-0" />
      <div className="hero-stage-bg absolute top-[47%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[68vh] h-[68vh] max-w-[700px] max-h-[700px] rounded-full border border-dashed border-[#E8E2D8]/20 pointer-events-none z-0" />

      {/* Architectural Sandstone Beige Stage Backdrop */}
      <div
        className="hero-stage-bg absolute top-[47%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[52vh] h-[52vh] md:w-[60vh] md:h-[60vh] max-w-[620px] max-h-[620px] rounded-full z-0 shadow-[0_30px_90px_rgba(0,0,0,0.85)]"
        style={{
          background:
            "radial-gradient(circle at 45% 40%, #F5F1EB 0%, #E8E2D8 60%, #D8D0C3 100%)",
          boxShadow:
            "0 30px 90px rgba(0, 0, 0, 0.8), inset 0 2px 4px rgba(255, 255, 255, 0.6), inset 0 -12px 30px rgba(0, 0, 0, 0.15)",
        }}
      />

      {/* 3D WebGL Model Canvas Container */}
      <div className="absolute top-[47%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[750px] h-[65vh] max-h-[650px] z-10 flex items-center justify-center">
        <HeroModel />
      </div>

      {/* Model Telemetry Pill Tag */}
      <div
        ref={modelTagRef}
        className="absolute bottom-28 md:bottom-28 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-2.5 bg-[#0A0A0A]/90 border border-[#E8E2D8]/30 px-4 py-1.5 rounded-full shadow-2xl backdrop-blur-md"
      >
        <span className="w-2 h-2 rounded-full bg-[#E8E2D8] animate-pulse" />
        <span className="font-mono text-[11px] tracking-widest text-[#E8E2D8] font-bold uppercase">
          AI CORE // KINETIC MONOLITH
        </span>
      </div>

      {/* Main Content Layout */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-center h-full pb-32">
        {/* Left Typography */}
        <div
          ref={leftColRef}
          className="flex flex-col items-start w-full md:w-1/2 pointer-events-auto"
        >
          {/* Greeting Pill */}
          <div className="inline-flex items-center gap-2.5 text-xs font-semibold tracking-widest uppercase text-[#E8E2D8] bg-[#E8E2D8]/[0.08] border border-[#E8E2D8]/20 px-3.5 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            Hey! I am Siser Pratap
          </div>

          <h1 className="flex flex-col items-start m-0 p-0">
            <span className="block text-[clamp(54px,8vw,128px)] font-[900] leading-[0.88] tracking-[-0.04em] uppercase text-white drop-shadow-2xl">
              SOFTWARE<br />DEVELOPER
            </span>
          </h1>

          {/* Sub-specialty Pill */}
          <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#0A0A0A] bg-[#E8E2D8] px-4 py-2 rounded-full shadow-xl">
            ✦ FULL STACK &amp; AI SYSTEMS
          </div>
        </div>

        {/* Right Info & CTA */}
        <div
          ref={rightColRef}
          className="w-full md:w-1/3 flex flex-col items-start md:items-end text-left md:text-right mt-auto md:mt-0 md:pt-40 pointer-events-auto"
        >
          <p className="text-white/80 text-[16px] leading-[1.7] mb-8 max-w-[340px] font-normal drop-shadow-md">
            Software innovator crafting digital experiences with bold simplicity, structural clarity, and intelligent architecture.
          </p>

          <Link
            href="/book"
            className="flex bg-white text-[#0A0A0A] rounded-full p-2 pl-6 items-center w-full max-w-[320px] justify-between cursor-pointer hover:bg-[#E8E2D8] hover:scale-[1.02] transition-all shadow-2xl group"
          >
            <span className="font-bold text-sm tracking-wide">Schedule a Free Call</span>
            <span className="bg-[#0A0A0A] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-base transition-transform group-hover:rotate-45">
              ↗
            </span>
          </Link>
        </div>
      </div>

      {/* Services Strip */}
      <div
        ref={bottomStripRef}
        className="absolute bottom-10 left-0 w-full z-20 border-t border-white/10 pt-6"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex flex-wrap justify-between items-center text-white/85 text-xs md:text-sm font-semibold tracking-wide">
          <div className="flex items-center gap-2">
            <span className="text-[#E8E2D8] font-mono">{"// 01"}</span> Frontend
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#E8E2D8] font-mono">{"// 02"}</span> Backend
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#E8E2D8] font-mono">{"// 03"}</span> Full Stack Software
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#E8E2D8] font-mono">{"// 04"}</span> AI Agents
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#E8E2D8] font-mono">{"// 05"}</span> ML Models
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
