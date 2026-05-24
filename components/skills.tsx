"use client"


import { Card } from "./ui/card"
import { skills } from "@/constants/constant"

const Skills = () => {
  

  
  

 

  return (
    <section id="skills" className="py-32 bg-transparent overflow-x-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 animate-slide-in-y">
          <span className="text-xs md:text-sm font-light tracking-[0.3em] uppercase text-white/40 mb-3 block">
            KNOWLEDGE BASE
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
            SKILLS
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {skills.map((skill, index) => (
            <Card
              key={index}
              className="animate-slide-in-x glass-card border-none p-6 text-center hover:scale-105 transition-all duration-300 group interactive relative overflow-hidden flex flex-col justify-center items-center h-28"
            >
              <div className="glass-card-glow" />
              <span className="text-sm md:text-base font-medium text-white/80 group-hover:text-white relative z-10 font-mono tracking-wide uppercase">
                {skill.name}
              </span>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
