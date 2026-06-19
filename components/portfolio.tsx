"use client"

import {useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { ExternalLink, Github } from "lucide-react"
import { portfolioItems, filters} from "@/constants/constant"

const Portfolio = () => {
  const projectRef = useRef<HTMLDivElement>(null)
  const [activeFilter, setActiveFilter] = useState("All")
  const filteredItems =
    activeFilter === "All" ? portfolioItems : portfolioItems.filter((item) => item.category === activeFilter)

  return (
    <section id="works" ref={projectRef} className="py-32 bg-transparent overflow-x-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-xs md:text-sm font-light tracking-[0.3em] uppercase text-white/40 mb-3 block">
            SELECTED CREATIONS
          </span>
          <h2 className="animate-slide-in-y text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
            PORTFOLIO
          </h2>

          <div className="flex flex-wrap justify-center gap-3 mt-10 mb-12">
            {filters.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-300 interactive ${
                    isActive
                      ? "bg-white text-black shadow-lg shadow-white/5"
                      : "bg-white/[0.03] border border-white/[0.06] text-white/60 hover:text-white hover:border-white/20"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {filteredItems.map((project, index) => (
            <Card
              key={index}
              className="animate-slide-in-x glass-card border-none p-6 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="glass-card-glow" />
              <div className="relative overflow-hidden rounded-xl mb-6 z-10">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-60 transition-opacity duration-300" />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-md text-[10px] uppercase tracking-widest text-white/80 font-mono">
                  {project.category}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white/90 mb-2 group-hover:text-white transition-colors duration-300 relative z-10">
                {project.title}
              </h3>
              <p className="text-white/40 mb-6 font-light leading-relaxed text-sm h-14 line-clamp-2 relative z-10">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6 relative z-10">
                {project.technologies.slice(0, 3).map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-2 py-0.5 bg-white/[0.04] border border-white/[0.06] rounded-md text-[10px] text-white/50 font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex space-x-3 relative z-10">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive flex items-center space-x-1.5 px-4 py-2 bg-white/[0.04] border border-white/[0.08] text-white/70 hover:text-black hover:bg-white text-xs font-mono rounded-full transition-all duration-300"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>DEMO</span>
                </a>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive flex items-center space-x-1.5 px-4 py-2 bg-white/[0.04] border border-white/[0.08] text-white/70 hover:text-black hover:bg-white text-xs font-mono rounded-full transition-all duration-300"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>CODE</span>
                </a>
              </div>
            </Card>
          ))}
        </div>

        

        
      </div>
    </section>
  )
}

export default Portfolio
