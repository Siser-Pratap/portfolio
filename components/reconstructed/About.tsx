"use client"

import { motion, useInView } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { SETTINGS } from "@/constants/settings"
import { portfolioItems } from "@/constants/constant"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
})

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1400
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return "just now"
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return d === 1 ? "1d ago" : `${d}d ago`
}

const stack = ["React", "Next.js", "Node.js", "TypeScript", "Three.js", "PostgreSQL", "AWS", "Python", "Django", "FastAPI"]

const About = () => {
  const [currentBuild, setCurrentBuild] = useState<{ name: string; time: string } | null>(null)

  useEffect(() => {
    const repos = portfolioItems.map((p) => ({
      name: p.title,
      slug: p.githubUrl.split("/").pop() ?? "",
    }))

    Promise.allSettled(
      repos.map(({ slug, name }) =>
        fetch(`/api/github-commit?repo=${encodeURIComponent(slug)}`)
          .then((r) => r.json())
          .then((d) => ({ name, date: d.date as string | null }))
      )
    ).then((results) => {
      const valid = results
        .filter(
          (r): r is PromiseFulfilledResult<{ name: string; date: string }> =>
            r.status === "fulfilled" && !!r.value.date
        )
        .map((r) => r.value)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      if (valid[0]) {
        setCurrentBuild({ name: valid[0].name, time: timeAgo(valid[0].date) })
      }
    })
  }, [])

  return (
    <section id="about" className="w-full bg-[#F7F7F7] dark:bg-[#0D0505] py-[120px]">
      <div className="max-w-[1400px] mx-auto px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">

          {/* Left: Developer Identity Card */}
          <motion.div
            className="w-full aspect-[4/5] relative rounded-[24px] overflow-hidden bg-[#0D0505] flex flex-col justify-between p-10"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Dot grid background */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />

            {/* Orange glow orbs */}
            <div className="absolute top-[-100px] right-[-100px] w-[360px] h-[360px] rounded-full bg-[#FF4B1F] opacity-20 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-80px] left-[-60px] w-[260px] h-[260px] rounded-full bg-[#FF6A21] opacity-10 blur-[80px] pointer-events-none" />

            {/* Top bar */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-white/30 text-[11px] font-mono tracking-[0.25em] uppercase">
                Software Developer
              </span>
            </div>

            {/* Center: Name + ghost initials */}
            <div className="relative z-10 flex-1 flex items-center justify-center">
              <span
                className="absolute text-[clamp(120px,18vw,200px)] font-[900] leading-none select-none tracking-[-0.05em] pointer-events-none"
                style={{ color: "rgba(255,255,255,0.03)" }}
              >
                SP
              </span>
              <div className="flex flex-col items-center gap-3">
                <span className="text-[clamp(52px,6vw,80px)] font-[800] text-white leading-none tracking-tight">
                  Siser<span className="text-[#FF4B1F]">.</span>
                </span>
                <span className="text-white/30 text-sm font-medium tracking-[0.4em] uppercase">
                  Pratap
                </span>
                <div className="mt-4 h-px w-12 bg-[#FF4B1F]/40" />
              </div>
            </div>

            {/* Bottom: Stack pills + location */}
            <div className="relative z-10 flex flex-col gap-5">
              <div className="flex flex-wrap gap-2">
                {stack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[11px] font-mono text-white/50 border border-white/10 px-3 py-1 rounded-full hover:border-[#FF4B1F]/40 hover:text-white/70 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-white/25 text-[11px] font-mono">
                <span>📍 {SETTINGS.location}</span>
                <span>Since 2021</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <div className="flex flex-col pt-10">
            <motion.span {...fadeUp(0)} className="text-[#8A8A8A] text-sm font-medium mb-6 italic">
              {"(/ About )"}
            </motion.span>

            <motion.h2 {...fadeUp(0.08)} className="text-[56px] font-[700] leading-[1.1] text-[#0D0505] dark:text-white mb-8 tracking-tight">
              Building software that scales, performs and actually ships
            </motion.h2>

            <motion.p {...fadeUp(0.14)} className="text-[#0D0505]/70 dark:text-white/60 text-[16px] leading-[1.8] mb-10 max-w-[90%]">
              Software Developer with a focus on React, Next.js, Node.js, Python, FastAPI and cloud-native architectures.
              I work across the entire stack from database schema to deployed product with a strong
              eye for UI and a bias toward simplicity. I&apos;ve shipped production apps for clients and organizationsacross
              India, Canada, and beyond.
            </motion.p>

            <motion.div {...fadeUp(0.18)} className="flex flex-wrap gap-4 mb-10">
              <span className="px-6 py-2 rounded-full bg-gradient-to-r from-[#FF4B1F] to-[#FF6A21] text-white text-xs font-semibold tracking-wide">
                Design → Build → Deploy
              </span>
              <span className="px-6 py-2 rounded-full bg-[#0D0505] dark:bg-white text-white dark:text-black text-xs font-semibold tracking-wide">
                Working worldwide
              </span>

              {currentBuild ? (
                <motion.span
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="px-6 py-2 rounded-full bg-[#0D0505] dark:bg-white/10 dark:border dark:border-white/10 text-white text-xs font-semibold tracking-wide flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
                  {currentBuild.name} · {currentBuild.time}
                </motion.span>
              ) : (
                <span className="px-6 py-2 rounded-full bg-[#0D0505] dark:bg-white/10 dark:border dark:border-white/10 text-white text-xs font-semibold tracking-wide flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400/40 shrink-0" />
                  Available Now
                </span>
              )}
            </motion.div>

            <motion.div {...fadeUp(0.22)} className="flex items-center gap-3 mb-16 flex-wrap">
              <a
                href={SETTINGS.resumeViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3"
              >
                <div className="bg-[#0D0505] dark:bg-white text-white dark:text-black px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-3 hover:bg-[#FF4B1F] dark:hover:bg-[#FF4B1F] dark:hover:text-white transition-colors">
                  View Resume
                  <span className="bg-white/10 dark:bg-black/10 group-hover:bg-white/20 w-7 h-7 rounded-full flex items-center justify-center text-sm transition-colors">
                    ↗
                  </span>
                </div>
              </a>
              <a
                href={SETTINGS.resumeDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3"
              >
                <div className="border border-[#0D0505] dark:border-white/30 text-[#0D0505] dark:text-white px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-3 hover:bg-[#0D0505] dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors">
                  Download
                  <span className="w-7 h-7 rounded-full border border-current flex items-center justify-center text-sm transition-colors">
                    ↓
                  </span>
                </div>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              {...fadeUp(0.26)}
              className="flex items-center justify-between border-t border-[#EAEAEA] dark:border-white/10 pt-12"
            >
              <div className="flex flex-col items-start">
                <span className="text-[48px] font-[800] text-[#0D0505] dark:text-white leading-none mb-2">
                  <CountUp target={5} suffix="+" />
                </span>
                <span className="text-xs text-[#8A8A8A] font-medium">Projects Shipped</span>
              </div>
              <div className="w-[1px] h-12 bg-[#EAEAEA] dark:bg-white/10" />
              <div className="flex flex-col items-center">
                <span className="text-[48px] font-[800] text-[#0D0505] dark:text-white leading-none mb-2">
                  <CountUp target={1} suffix="+" />
                </span>
                <span className="text-xs text-[#8A8A8A] font-medium">Years Experience</span>
              </div>
              <div className="w-[1px] h-12 bg-[#EAEAEA] dark:bg-white/10" />
              <div className="flex flex-col items-end">
                <span className="text-[48px] font-[800] text-[#0D0505] dark:text-white leading-none mb-2">
                  <CountUp target={3} suffix="+" />
                </span>
                <span className="text-xs text-[#8A8A8A] font-medium">Global Clients</span>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default About
