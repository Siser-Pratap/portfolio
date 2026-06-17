"use client"

import { motion } from "framer-motion"
import { Github } from "lucide-react"
import { portfolioItems } from "@/constants/constant"

const GitHubActivity = () => {
  return (
    <section className="w-full bg-[#F7F7F7] py-[120px]">
      <div className="max-w-[1400px] mx-auto px-10">

        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <span className="text-[#8A8A8A] text-sm font-medium mb-6 italic block">{"(/ Open Source )"}</span>
            <h2 className="text-[56px] font-[700] leading-[1.1] text-[#0D0505] tracking-tight">
              Building in Public
            </h2>
          </div>
          <a
            href="https://github.com/Siser-Pratap"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#0D0505] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#FF4B1F] transition-colors w-fit shrink-0"
          >
            <Github size={16} />
            View GitHub Profile ↗
          </a>
        </motion.div>

        {/* Contribution graph */}
        <motion.div
          className="w-full rounded-[24px] overflow-hidden border border-[#EAEAEA] bg-white p-8 mb-10"
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
          {portfolioItems.map((project, index) => (
            <motion.a
              key={project.slug ?? index}
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
              className="bg-white rounded-[20px] border border-[#EAEAEA] p-8 flex flex-col gap-4 hover:border-[#FF4B1F]/40 hover:shadow-[0_4px_24px_-8px_rgba(255,75,31,0.15)] transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0D0505] flex items-center justify-center">
                    <Github size={14} className="text-white" />
                  </div>
                  <span className="text-[#0D0505] font-[700] text-[16px] group-hover:text-[#FF4B1F] transition-colors">
                    {project.title}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-[#8A8A8A] border border-[#EAEAEA] px-2 py-1 rounded-full">
                  {project.category}
                </span>
              </div>

              <p className="text-[#8A8A8A] text-sm leading-relaxed">{project.description}</p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {project.technologies.slice(0, 4).map((tech, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-semibold text-[#0D0505]/60 bg-[#F7F7F7] px-3 py-1 rounded-full border border-[#EAEAEA]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  )
}

export default GitHubActivity
