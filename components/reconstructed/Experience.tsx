"use client"

import { experiences } from "@/constants/constant"

const Experience = () => {
  return (
    <section id="experience" className="w-full bg-[#F7F7F7] py-[120px]">
      <div className="max-w-[1400px] mx-auto px-10">

        <div className="flex flex-col mb-20">
          <span className="text-[#8A8A8A] text-sm font-medium mb-6 italic">{"(/ Experience )"}</span>
          <h2 className="text-[56px] font-[700] leading-[1.1] text-[#0D0505] tracking-tight">
            Where I&apos;ve Worked
          </h2>
        </div>

        <div className="relative flex flex-col gap-0">
          {/* Vertical line — desktop only */}
          <div className="absolute left-[11px] top-3 bottom-8 w-[1px] bg-[#EAEAEA] hidden lg:block" />

          {experiences.map((exp, index) => (
            <div
              key={index}
              className="relative flex flex-col lg:flex-row gap-8 pb-16 last:pb-0"
            >
              {/* Timeline dot */}
              <div className="hidden lg:flex absolute left-0 top-[10px] w-[23px] h-[23px] rounded-full bg-white border-2 border-[#FF4B1F] items-center justify-center">
                <div className="w-[8px] h-[8px] rounded-full bg-[#FF4B1F]" />
              </div>

              {/* Left: Period + Role + Company */}
              <div className="lg:pl-12 lg:w-[280px] shrink-0 flex flex-col">
                <span className="text-[#FF4B1F] text-[11px] font-semibold tracking-widest uppercase mb-3">
                  {exp.period}
                </span>
                <h3 className="text-[20px] font-[700] text-[#0D0505] leading-tight mb-1">
                  {exp.title}
                </h3>
                <p className="text-[#0D0505] text-sm font-semibold">{exp.company}</p>
                <p className="text-[#8A8A8A] text-xs mt-1">{exp.location}</p>
              </div>

              {/* Right: Description + Tech stack */}
              <div className="flex-1 bg-white rounded-[20px] p-8 border border-[#EAEAEA]">
                <p className="text-[#0D0505]/70 text-[15px] leading-[1.85] mb-7">
                  {exp.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-[#F7F7F7] text-[#0D0505] text-[11px] font-semibold border border-[#EAEAEA] tracking-wide"
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
    </section>
  )
}

export default Experience
