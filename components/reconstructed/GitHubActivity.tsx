"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Github, Star, GitFork, Clock } from "lucide-react"
import { portfolioItems } from "@/constants/constant"

interface RepoData {
  name: string
  description: string | null
  stars: number
  forks: number
  language: string | null
  updated_at: string
  topics: string[]
  html_url: string
}

interface ProfileData {
  public_repos: number
  followers: number
  following: number
}

interface GitHubData {
  profile: ProfileData
  repos: RepoData[]
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript:  "#3178c6",
  JavaScript:  "#f1e05a",
  Python:      "#3572A5",
  Java:        "#b07219",
  CSS:         "#563d7c",
  HTML:        "#e34c26",
  "C++":       "#f34b7d",
  Go:          "#00ADD8",
  Rust:        "#dea584",
}

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return "just now"
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d ago`
  const mo = Math.floor(d / 30)
  return mo === 1 ? "1mo ago" : `${mo}mo ago`
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-[20px] border border-[#EAEAEA] dark:border-white/10 p-8 flex flex-col gap-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#EAEAEA] dark:bg-white/10" />
          <div className="w-32 h-4 rounded-full bg-[#EAEAEA] dark:bg-white/10" />
        </div>
        <div className="w-16 h-5 rounded-full bg-[#EAEAEA] dark:bg-white/10" />
      </div>
      <div className="w-full h-3 rounded-full bg-[#EAEAEA] dark:bg-white/10" />
      <div className="w-3/4 h-3 rounded-full bg-[#EAEAEA] dark:bg-white/10" />
      <div className="flex gap-2 mt-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-16 h-5 rounded-full bg-[#EAEAEA] dark:bg-white/10" />
        ))}
      </div>
      <div className="flex gap-4 pt-2 border-t border-[#EAEAEA] dark:border-white/10">
        <div className="w-10 h-3 rounded-full bg-[#EAEAEA] dark:bg-white/10" />
        <div className="w-10 h-3 rounded-full bg-[#EAEAEA] dark:bg-white/10" />
        <div className="w-20 h-3 rounded-full bg-[#EAEAEA] dark:bg-white/10 ml-auto" />
      </div>
    </div>
  )
}

const GitHubActivity = () => {
  const [data, setData] = useState<GitHubData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const slugs = portfolioItems
      .map((p) => p.githubUrl.split("/").pop())
      .filter(Boolean)
      .join(",")

    fetch(`/api/github-repos?repos=${slugs}`)
      .then((r) => r.json())
      .then((d) => setData(d as GitHubData))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Merge live data back onto portfolioItems (preserves order + hardcoded fields)
  const enriched = portfolioItems.map((item) => {
    const slug = item.githubUrl.split("/").pop()
    const live = data?.repos.find((r) => r.name === slug)
    return { ...item, live }
  })

  return (
    <section className="w-full bg-[#F7F7F7] dark:bg-[#0A0404] py-[120px]">
      <div className="max-w-[1400px] mx-auto px-10">

        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <span className="text-[#8A8A8A] text-sm font-medium mb-6 italic block">{"(/ Open Source )"}</span>
            <h2 className="text-[56px] font-[700] leading-[1.1] text-[#0D0505] dark:text-white tracking-tight">
              Building in Public
            </h2>
          </div>
          <a
            href="https://github.com/Siser-Pratap"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#0D0505] dark:bg-white text-white dark:text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#FF4B1F] dark:hover:bg-[#FF4B1F] dark:hover:text-white transition-colors w-fit shrink-0"
          >
            <Github size={16} />
            View GitHub Profile ↗
          </a>
        </motion.div>

        {/* Live profile stats bar */}
        <motion.div
          className="flex flex-wrap gap-6 mb-10 px-6 py-4 rounded-[16px] bg-white dark:bg-white/[0.03] border border-[#EAEAEA] dark:border-white/10 w-fit"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        >
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="w-24 h-4 rounded-full bg-[#EAEAEA] dark:bg-white/10 animate-pulse" />
            ))
          ) : (
            <>
              <span className="text-sm font-semibold text-[#0D0505] dark:text-white">
                <span className="text-[#FF4B1F]">{data?.profile.public_repos ?? "—"}</span>
                <span className="text-[#8A8A8A] font-medium ml-1.5">Public Repos</span>
              </span>
              <span className="w-px h-4 bg-[#EAEAEA] dark:bg-white/10 self-center" />
              <span className="text-sm font-semibold text-[#0D0505] dark:text-white">
                <span className="text-[#FF4B1F]">{data?.profile.followers ?? "—"}</span>
                <span className="text-[#8A8A8A] font-medium ml-1.5">Followers</span>
              </span>
              <span className="w-px h-4 bg-[#EAEAEA] dark:bg-white/10 self-center" />
              <span className="text-sm font-semibold text-[#0D0505] dark:text-white">
                <span className="text-[#FF4B1F]">{data?.profile.following ?? "—"}</span>
                <span className="text-[#8A8A8A] font-medium ml-1.5">Following</span>
              </span>
            </>
          )}
        </motion.div>

        {/* Contribution graph */}
        <motion.div
          className="w-full rounded-[24px] overflow-hidden border border-[#EAEAEA] dark:border-white/10 bg-white dark:bg-white/[0.03] p-8 mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://ghchart.rshah.org/FF4B1F/Siser-Pratap"
            alt="Siser Pratap GitHub contribution chart"
            className="w-full h-auto"
            loading="lazy"
          />
        </motion.div>

        {/* Repo cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading
            ? [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
            : enriched.map((project, index) => (
                <motion.a
                  key={project.githubUrl}
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
                  className="bg-white dark:bg-white/[0.03] rounded-[20px] border border-[#EAEAEA] dark:border-white/10 p-8 flex flex-col gap-4 hover:border-[#FF4B1F]/40 hover:shadow-[0_4px_24px_-8px_rgba(255,75,31,0.15)] transition-all group"
                >
                  {/* Title row */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0D0505] dark:bg-white/10 flex items-center justify-center">
                        <Github size={14} className="text-white dark:text-white/80" />
                      </div>
                      <span className="text-[#0D0505] dark:text-white font-[700] text-[16px] group-hover:text-[#FF4B1F] transition-colors">
                        {project.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-[#8A8A8A] border border-[#EAEAEA] dark:border-white/10 px-2 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>

                  {/* Description — prefer live GitHub description, fall back to hardcoded */}
                  <p className="text-[#8A8A8A] dark:text-white/50 text-sm leading-relaxed">
                    {project.live?.description ?? project.description}
                  </p>

                  {/* Tech pills */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.technologies.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-semibold text-[#0D0505]/60 dark:text-white/50 bg-[#F7F7F7] dark:bg-white/5 px-3 py-1 rounded-full border border-[#EAEAEA] dark:border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Live stats footer */}
                  <div className="flex items-center gap-4 pt-4 border-t border-[#EAEAEA] dark:border-white/10 text-[12px] text-[#8A8A8A] dark:text-white/40">
                    <span className="flex items-center gap-1">
                      <Star size={12} />
                      {project.live?.stars ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork size={12} />
                      {project.live?.forks ?? 0}
                    </span>
                    {project.live?.language && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: LANGUAGE_COLORS[project.live.language] ?? "#8A8A8A" }}
                        />
                        {project.live.language}
                      </span>
                    )}
                    {project.live?.updated_at && (
                      <span className="flex items-center gap-1 ml-auto">
                        <Clock size={11} />
                        {timeAgo(project.live.updated_at)}
                      </span>
                    )}
                  </div>
                </motion.a>
              ))}
        </div>

      </div>
    </section>
  )
}

export default GitHubActivity
