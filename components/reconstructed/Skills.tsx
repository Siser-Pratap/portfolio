"use client"

import { skills } from "@/constants/constant"
import { motion } from "framer-motion"

const Skills = () => {
  return (
    <section id="skills" className="w-full bg-[#0D0505] py-[120px]">
      <div className="max-w-[1400px] mx-auto px-10">

        <motion.div
          className="flex flex-col md:flex-row md:justify-between md:items-end mb-20 gap-6"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col">
            <span className="text-white/30 text-sm font-medium mb-6 italic">{"(/ Skills )"}</span>
            <h2 className="text-[56px] font-[700] leading-[1.1] text-white tracking-tight">
              Tools of the Trade
            </h2>
          </div>
          <p className="text-white/40 text-sm max-w-[260px] md:text-right leading-relaxed">
            Technologies I work with day-to-day — from UI to API to infrastructure.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[80px] gap-y-10">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              className="flex flex-col gap-3"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
                delay: (index % 2) * 0.05 + Math.floor(index / 2) * 0.04,
              }}
            >
              <div className="flex justify-between items-baseline">
                <span className="text-white text-sm font-semibold tracking-wide">
                  {skill.name}
                </span>
                <span className="text-white/30 text-xs font-medium tabular-nums">
                  {skill.level}%
                </span>
              </div>
              <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#FF4B1F] to-[#FF6A21] rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.9,
                    ease: [0.22, 1, 0.36, 1],
                    delay: (index % 2) * 0.05 + Math.floor(index / 2) * 0.04 + 0.1,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Skills
