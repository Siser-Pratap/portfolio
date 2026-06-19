"use client"

import { portfolioItems } from "@/constants/constant"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { useState, useEffect, useCallback } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

type UptimeStatus = "checking" | "online" | "slow" | "offline"

type ProjectHealth = {
  uptime: UptimeStatus
  latency: number
  lastCommit: string | null
  commitMsg: string | null
  commitSha: string | null
  lastDeploy: string | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return "just now"
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d ago`
  return `${Math.floor(d / 30)}mo ago`
}

function repoSlug(githubUrl: string): string {
  return githubUrl.split("/").pop() ?? ""
}

// ─── Status dot ───────────────────────────────────────────────────────────────

const DOT_COLOR: Record<UptimeStatus, string> = {
  checking: "bg-white/40 animate-pulse",
  online:   "bg-green-400",
  slow:     "bg-amber-400",
  offline:  "bg-red-400",
}

function UptimeDot({ status, latency }: { status: UptimeStatus; latency: number }) {
  const label =
    status === "checking" ? "Checking" :
    status === "online"   ? (latency > 0 ? `${latency}ms` : "Online") :
    status === "slow"     ? `${(latency / 1000).toFixed(1)}s` :
    "Offline"

  return (
    <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full px-2.5 py-1">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOT_COLOR[status]}`} />
      <span className="text-white/80 text-[10px] font-mono leading-none">{label}</span>
    </div>
  )
}

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

// ─── ProjectCard ──────────────────────────────────────────────────────────────

type ProjectCardProps = {
  project: (typeof portfolioItems)[number]
  health?: ProjectHealth
  className?: string
}

const ProjectCard = ({ project, health, className = "" }: ProjectCardProps) => (
  <div className={`group relative rounded-[24px] overflow-hidden cursor-pointer ${className}`}>
    <Image
      src={project.image || "/placeholder.svg"}
      alt={project.title}
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-105"
    />

    {/* Category badge — top-left */}
    <div className="absolute top-6 left-6 z-10">
      <span className="bg-white text-[#0D0505] px-4 py-2 rounded-full text-xs font-semibold">
        {project.category}
      </span>
    </div>

    {/* Uptime dot — top-right, always visible */}
    {health && (
      <div className="absolute top-6 right-6 z-10">
        <UptimeDot status={health.uptime} latency={health.latency} />
      </div>
    )}

    {/* Hover overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0505]/95 via-[#0D0505]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex flex-col justify-end p-8">
      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="text-white text-[22px] font-[700] mb-2 leading-tight">
          {project.title}
        </h3>
        <p className="text-white/70 text-sm leading-relaxed mb-4 max-w-[520px]">
          {project.description}
        </p>

        {/* Tech badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-[11px] font-semibold border border-white/20"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Last commit + deploy lines */}
        {(health?.lastCommit || health?.lastDeploy) && (
          <div className="flex flex-col gap-0.5 mb-5">
            {health?.lastCommit && (
              <p className="text-white/40 text-[11px] font-mono">
                ↻&nbsp;{health.commitSha}
                &nbsp;·&nbsp;{timeAgo(health.lastCommit)}
                {health.commitMsg && (
                  <>&nbsp;·&nbsp;{health.commitMsg.length > 50 ? health.commitMsg.slice(0, 50) + "…" : health.commitMsg}</>
                )}
              </p>
            )}
            {health?.lastDeploy && (
              <p className="text-white/40 text-[11px] font-mono">
                ↳&nbsp;deployed&nbsp;{timeAgo(health.lastDeploy)}
              </p>
            )}
          </div>
        )}

        {/* Action links */}
        <div className="flex items-center gap-3">
          <Link
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 bg-gradient-to-r from-[#FF4B1F] to-[#FF6A21] text-white px-5 py-2 rounded-full text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Live ↗
          </Link>
          <Link
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 bg-white/10 text-white px-5 py-2 rounded-full text-xs font-semibold border border-white/20 hover:bg-white/20 transition-colors"
          >
            GitHub ↗
          </Link>
        </div>
      </div>
    </div>
  </div>
)

// ─── Section ──────────────────────────────────────────────────────────────────

const Projects = () => {
  const [health, setHealth] = useState<Record<number, ProjectHealth>>({})

  const fetchProject = useCallback(async (index: number, project: (typeof portfolioItems)[number]) => {
    // Mark as checking immediately
    setHealth((prev) => ({
      ...prev,
      [index]: { uptime: "checking", latency: 0, lastCommit: null, commitMsg: null, commitSha: null, lastDeploy: null },
    }))

    const repo = repoSlug(project.githubUrl)
    const [healthResult, commitResult, deployResult] = await Promise.allSettled([
      fetch(`/api/health?url=${encodeURIComponent(project.liveUrl)}`).then((r) => r.json()),
      fetch(`/api/github-commit?repo=${repo}`).then((r) => r.json()),
      fetch(`/api/vercel-deploy?project=${encodeURIComponent(repo)}`).then((r) => r.json()),
    ])

    const h = healthResult.status === "fulfilled" ? healthResult.value : null
    const c = commitResult.status === "fulfilled" ? commitResult.value : null
    const d = deployResult.status === "fulfilled" ? deployResult.value : null

    let uptime: UptimeStatus = "offline"
    let latency = 0

    if (h?.ok) {
      latency = h.latency as number
      uptime = latency < 800 ? "online" : "slow"
    }

    setHealth((prev) => ({
      ...prev,
      [index]: {
        uptime,
        latency,
        lastCommit: c?.date ?? null,
        commitMsg:  c?.message ?? null,
        commitSha:  c?.sha ?? null,
        lastDeploy: d?.deployedAt ?? null,
      },
    }))
  }, [])

  useEffect(() => {
    portfolioItems.forEach((p, i) => fetchProject(i, p))
  }, [fetchProject])

  // Most recently committed project → "currently active" indicator
  const recentEntry = Object.entries(health)
    .filter(([, h]) => h.lastCommit !== null)
    .sort(([, a], [, b]) => new Date(b.lastCommit!).getTime() - new Date(a.lastCommit!).getTime())[0]

  const recentProject = recentEntry ? portfolioItems[Number(recentEntry[0])] : null
  const recentHealth  = recentEntry ? recentEntry[1] : null

  const featured = portfolioItems[0]
  const rest = portfolioItems.slice(1, 4)

  return (
    <section id="works" className="w-full bg-[#FFFFFF] py-[120px]">
      <div className="max-w-[1400px] mx-auto px-10">

        {/* Header */}
        <motion.div
          className="flex justify-between items-end mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
        >
          <div className="flex flex-col">
            <span className="text-[#8A8A8A] text-sm font-medium mb-6 italic">{"(/ Project )"}</span>
            <h2 className="text-[56px] font-[700] leading-[1.1] text-[#0D0505] tracking-tight">
              Best Projects
            </h2>
          </div>

          {/* Currently active indicator */}
          <div className="flex flex-col items-end gap-2">
            <span className="text-[24px] font-[600] text-[#0D0505]">©2025</span>
            {recentProject && recentHealth?.lastCommit && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-1.5 text-[11px] font-mono text-[#8A8A8A]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span>
                  {recentProject.title}&nbsp;·&nbsp;{timeAgo(recentHealth.lastCommit)}
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Featured card */}
        {featured && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            custom={0.1}
            variants={fadeUp}
            className="mb-[32px]"
          >
            <ProjectCard project={featured} health={health[0]} className="w-full h-[600px]" />
          </motion.div>
        )}

        {/* 3-card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px]">
          {rest.map((project, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              custom={0.1 * i}
              variants={fadeUp}
            >
              <ProjectCard project={project} health={health[i + 1]} className="w-full aspect-[4/3]" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Projects
