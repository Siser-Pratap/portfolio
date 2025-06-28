"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

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
    <section ref={sectionRef} className="py-24 ">
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <div key={index} className="skill-item">
              <div className="flex justify-between items-center mb-3 rounded-full text-center p-8 bg-purple-600/25">
                <span className="text-lg font-medium text-white text-center">{skill.name}</span>

              </div>
              
            </div>
          ))}
        </div>
      </div>
     


    </section>
  )
}

export default Skills
