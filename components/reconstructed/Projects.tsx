"use client"

import { portfolioItems } from "@/constants/constant"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

type ProjectCardProps = {
  project: (typeof portfolioItems)[number]
  className?: string
}

const ProjectCard = ({ project, className = "" }: ProjectCardProps) => (
  <div className={`group relative rounded-[24px] overflow-hidden cursor-pointer ${className}`}>
    {/* Image */}
    <Image
      src={project.image || "/placeholder.svg"}
      alt={project.title}
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-105"
    />

    {/* Always-visible category badge */}
    <div className="absolute top-6 left-6 z-10">
      <span className="bg-white text-[#0D0505] px-4 py-2 rounded-full text-xs font-semibold">
        {project.category}
      </span>
    </div>

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
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((tech, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-[11px] font-semibold border border-white/20"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
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

const Projects = () => {
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
          <span className="text-[24px] font-[600] text-[#0D0505]">©2025</span>
        </motion.div>

        {/* Featured */}
        {featured && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            custom={0.1}
            variants={fadeUp}
            className="mb-[32px]"
          >
            <ProjectCard project={featured} className="w-full h-[600px]" />
          </motion.div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px]">
          {rest.map((project, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              custom={0.1 * index}
              variants={fadeUp}
            >
              <ProjectCard project={project} className="w-full aspect-[4/3]" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Projects
