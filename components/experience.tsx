"use client"

import { Calendar, MapPin } from "lucide-react"
import { experiences } from "@/constants/constant"

const Experience = () => {
  
  return (
    <div id="experience"  className="h-full flex items-center justify-center p-8 overflow-x-hidden">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center animate-slide-in-y mb-20">
          <span className="text-xs md:text-sm font-light tracking-[0.3em] uppercase text-white/40 mb-3 block">
            MY JOURNEY
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
            EXPERIENCE
          </h2>
        </div>

        <div className="relative">
          <div className="timeline-line absolute left-8 top-0 w-[1px] h-full bg-gradient-to-b from-white/10 via-white/5 to-transparent"></div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div key={index} className="timeline-item animate-slide-in-x relative pl-20">
                {/* Timeline Dot */}
                <div className="absolute left-7 top-7 w-3.5 h-3.5 bg-[#121212] rounded-full border-2 border-white/20 shadow-md"></div>

                <div className="glass-card border-none p-8 relative overflow-hidden transition-all duration-300">
                  <div className="glass-card-glow" />
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 relative z-10">
                    <h3 className="text-xl md:text-2xl font-bold text-white/90 mb-2 md:mb-0">{exp.title}</h3>
                    <div className="flex items-center text-white/40 text-xs tracking-wider uppercase font-mono">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 opacity-60" />
                      {exp.period}
                    </div>
                  </div>

                  <div className="flex items-center flex-col md:gap-2 md:flex-row text-white/50 mb-4 relative z-10 text-sm">
                    <span className="font-semibold text-white/70">{exp.company}</span>
                    <span className="hidden md:inline text-white/20">•</span>
                    <div className="flex items-center text-xs text-white/40">
                      <MapPin className="w-3.5 h-3.5 mr-1 opacity-60" />
                      {exp.location}
                    </div>
                  </div>

                  <p className="text-white/40 mb-6 font-light leading-relaxed relative z-10 text-sm">{exp.description}</p>

                  <div className="flex flex-wrap gap-2 relative z-10">
                    {exp.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-white/[0.04] border border-white/[0.06] rounded-full text-white/60 text-xs font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Experience
