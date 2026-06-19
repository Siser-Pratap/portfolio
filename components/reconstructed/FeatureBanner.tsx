"use client"

import { motion } from "framer-motion"
import { SETTINGS } from "@/constants/settings"

const TICKER_ITEMS = [
  "Full Stack", "React", "Next.js", "FastAPI", "TypeScript",
  "Node.js", "AI Systems", "AWS", "Docker", "Generative AI",
]

const stats = [
  { value: "5+", label: "Projects Shipped" },
  { value: "1+",  label: "Years Building" },
  { value: "3+", label: "Global Clients" },
]

const FeatureBanner = () => {
  return (
    <section className="w-full bg-[#0D0505] relative overflow-hidden flex flex-col items-center justify-center min-h-[700px] py-[120px]">

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.055] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-[-120px] left-[-100px] w-[500px] h-[500px] rounded-full bg-[#FF4B1F] opacity-[0.12] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[380px] h-[380px] rounded-full bg-[#FF4B1F] opacity-[0.07] blur-[100px] pointer-events-none" />

      {/* Background angled text ticker */}
      <div className="absolute inset-0 -rotate-[10deg] scale-125 flex flex-col justify-center gap-8 opacity-[0.035] pointer-events-none select-none overflow-hidden">
        {[0, 1, 2, 3, 4].map((row) => (
          <div
            key={row}
            className={`flex gap-12 whitespace-nowrap ${row % 2 === 0 ? "animate-marquee" : "[animation-direction:reverse] animate-marquee"}`}
          >
            {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="text-white text-[56px] font-[900] uppercase tracking-tight">
                {item} <span className="text-[#FF4B1F]">·</span>
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">

        {/* Rotating badge */}
        <motion.div
          className="relative w-[110px] h-[110px] flex items-center justify-center mb-12"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg
            viewBox="0 0 110 110"
            className="absolute inset-0 w-full h-full animate-spin-slow"
            aria-hidden="true"
          >
            <defs>
              <path
                id="badge-circle"
                d="M 55,55 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
              />
            </defs>
            <text fill="rgba(255,255,255,0.55)" fontSize="10.5" letterSpacing="3.2">
              <textPath href="#badge-circle">
                AVAILABLE FOR WORK · OPEN TO COLLABORATE ·
              </textPath>
            </text>
          </svg>
          <a
            href={SETTINGS.calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full bg-[#FF4B1F] flex items-center justify-center text-white text-lg hover:scale-110 transition-transform"
          >
            ↗
          </a>
        </motion.div>

        {/* Headline — alternating fill / stroke */}
        <div className="flex flex-col items-center leading-[0.88] mb-10 tracking-[-0.04em]">
          {["BUILDING", "SOFTWARE", "THAT SHIPS."].map((word, i) => (
            <motion.span
              key={word}
              className="text-[clamp(52px,9vw,130px)] font-[900] uppercase"
              style={
                i === 1
                  ? { WebkitTextStroke: "2px white", color: "transparent" }
                  : { color: "white" }
              }
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Divider */}
        <motion.div
          className="w-12 h-[2px] bg-[#FF4B1F] mb-10"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
        />

        {/* Stats row */}
        <motion.div
          className="flex items-center gap-10 mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.4 }}
        >
          {stats.map((s, i) => (
            <div key={s.label} className="flex items-center gap-10">
              <div className="flex flex-col items-center">
                <span className="text-[32px] font-[800] text-white leading-none">{s.value}</span>
                <span className="text-white/40 text-[11px] font-medium tracking-wider uppercase mt-1">{s.label}</span>
              </div>
              {i < stats.length - 1 && <div className="w-px h-8 bg-white/10" />}
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.a
          href={SETTINGS.calendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-[#0D0505] px-7 py-3.5 rounded-full text-sm font-bold flex items-center gap-4 hover:bg-[#FF4B1F] hover:text-white transition-colors shadow-2xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.48 }}
        >
          Schedule a Free Call
          <span className="bg-[#FF4B1F] group-hover:bg-white w-7 h-7 rounded-full text-white flex items-center justify-center text-sm">
            ↗
          </span>
        </motion.a>

      </div>
    </section>
  )
}

export default FeatureBanner
