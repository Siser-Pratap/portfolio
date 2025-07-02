"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Card } from "./ui/card"

const Skills = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  const skills = [
    { name: "UX Design", level: 80 },
    { name: "HTML5 + CSS3", level: 65 },
    { name: "JQUERY + JAVASCRIPT", level: 50 },
    { name: "BOOTSTRAP", level: 90 },
    { name: "LARAVEL", level: 30 },
    { name: "PHOTOSHOP", level: 60 },
  ]

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".skill-item",
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        },
      )

      // Animate skill bars
      gsap.fromTo(
        ".skill-bar",
        { width: 0 },
        {
          width: (index, target) => target.getAttribute("data-width") + "%",
          duration: 1.5,
          delay: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

 

  return (
    <section ref={sectionRef} id="skills" className="py-24 ">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
          <h2 className="text-2xl md:text-2xl font-bold mb-8">
            <span ref={sectionRef} className="text-purple-600/75 section-title hover:text-white/80 rounded-full px-6 py-4 shadow-lg shadow-purple-500/25">
              SKILLS.
            </span>
          </h2>
        </div>
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">
          {skills.map((skill, index) => (
            <div key={index} className="skill-item px-4 hover:scale-105 shadow-2xl md:shadow-lg shadow-purple-500/25 bg-black md:hover:bg-gradient-to-t from-purple-500 to-transparent">
             <Card >
                 <div className="flex h-[30vh] w-[20vw] shadow-none border-transparent md:shadow-md  md:shadow-purple-500/25 md:border md:border-purple-600/75 justify-between items-center mb-3 text-center p-8 bg-black">
                    <span className="text-lg font-medium text-white text-center">{skill.name}</span>
                </div>
              </Card>
              
            </div>
          ))}
        </div>
      </div>
    </div>
     


    </section>
  )
}

export default Skills
