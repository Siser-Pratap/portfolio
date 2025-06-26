"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Calendar, MapPin } from "lucide-react"

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  const experiences = [
    {
      title: "Senior Full Stack Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      period: "2022 - Present",
      description:
        "Leading development of scalable web applications using React, Node.js, and cloud technologies. Mentoring junior developers and architecting solutions for complex business requirements.",
      technologies: ["React", "Node.js", "TypeScript", "AWS", "PostgreSQL"],
    },
    {
      title: "Frontend Developer",
      company: "Digital Agency",
      location: "New York, NY",
      period: "2020 - 2022",
      description:
        "Developed responsive web applications and collaborated with design teams to create pixel-perfect user interfaces. Improved application performance by 40%.",
      technologies: ["React", "Vue.js", "SASS", "JavaScript", "Figma"],
    },
    {
      title: "Junior Developer",
      company: "StartupXYZ",
      location: "Austin, TX",
      period: "2019 - 2020",
      description:
        "Built and maintained web applications, participated in code reviews, and contributed to the development of the company's main product platform.",
      technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".timeline-item", {
        opacity: 0,
        x: -50,
        duration: 0.8,
        stagger: 0.2,
        delay: 0.3,
      })

      // Animate timeline line
      gsap.from(".timeline-line", {
        height: 0,
        duration: 1.5,
        ease: "power2.out",
        delay: 0.5,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} className="h-full flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            My professional journey and the experiences that shaped my career
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="timeline-line absolute left-8 top-0 w-0.5 h-full bg-gradient-to-b from-green-400 to-emerald-400"></div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div key={index} className="timeline-item relative pl-20">
                {/* Timeline Dot */}
                <div className="absolute left-6 top-6 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-4 border-gray-900"></div>

                <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white mb-2 md:mb-0">{exp.title}</h3>
                    <div className="flex items-center text-green-400 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {exp.period}
                    </div>
                  </div>

                  <div className="flex items-center text-white/70 mb-4">
                    <span className="text-lg font-medium mr-4">{exp.company}</span>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {exp.location}
                    </div>
                  </div>

                  <p className="text-white/60 mb-6 leading-relaxed">{exp.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full text-green-300 text-sm"
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
