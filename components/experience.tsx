"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Calendar, MapPin } from "lucide-react"

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  const experiences = [
    {
      title: "FreeLancer",
      company: "Self Employed",
      location: "New Delhi, India",
      period: "2023 - Present",
      description:
        "Leading development of scalable web applications using React, Node.js, and cloud technologies. Mentoring junior developers and architecting solutions for complex business requirements.",
      technologies: ["React", "Node.js", "TypeScript", "AWS", "PostgreSQL", "Next.js", "SpringBoot"],
    },
    {
      title: "Software Development Intern",
      company: "Synapsis Medical Technologies",
      location: "Edmonton, Canada",
      period: "February 2025 - April 2025",
      description:
        "Developed responsive web applications and collaborated with design teams to create pixel-perfect user interfaces. Improved application performance by 40%.",
      technologies: ["React", "Vue.js", "SASS", "JavaScript", "Figma"],
    },
    {
      title: "Web Development Intern",
      company: "DC Infotech",
      location: "Mumbai, India",
      period: "Sept 2024 - November 2024",
      description:
        "Built and maintained web applications, participated in code reviews, and contributed to the development of the company's main product platform.",
      technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
     
      const tl = gsap.timeline();

      tl.fromTo('.works', {
        opacity:0, 
        y:-50
      }, {
        opacity:1,
        y:0,
        scrollTrigger:{
          trigger:'.works', 
          start:'top 50%',
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  



  return (
    <div id="experience" ref={sectionRef} className="h-full flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="works text-3xl md:text-2xl font-bold mb-8">
            <span className="text-purple-600/75 rounded-full px-6 py-4 hover:text-white shadow-lg shadow-purple-500/25">
              Experience
            </span>
          </h2>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="timeline-line absolute left-8 top-0 w-0.5 h-full bg-gradient-to-b from-purple-600  to-purple-500/25"></div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div key={index} className="timeline-item animate-slide-in-x relative pl-20">
                {/* Timeline Dot */}
                <div className="absolute left-6 top-6 w-4 h-4 bg-black rounded-full border-2 shadow-lg shadow-purple-600/75 border-purple-600"></div>

                <div className="backdrop-blur-sm bg-black border border-purple-500/25 shadow-sm shadow-purple-600/75 rounded-2xl p-8 hover:bg-gradient-to-t from-purple-500/25 to-transparent transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white mb-2 md:mb-0">{exp.title}</h3>
                    <div className="flex items-center text-purple-600 text-sm">
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
                        className="px-3 py-1 bg-black border-transparent shadow-lg shadow-purple-500/25 rounded-full text-white  text-sm"
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
