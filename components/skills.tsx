"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

const Skills = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  const skills = [
    { name: "JavaScript/TypeScript", level: 95 },
    { name: "React/Next.js", level: 90 },
    { name: "UI/UX Design", level: 85 },
    { name: "GSAP Animation", level: 88 },
    { name: "Three.js/WebGL", level: 80 },
    { name: "Node.js", level: 82 },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".skill-item", {
        opacity: 0,
        x: -30,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      })

      // Animate skill bars
      gsap.from(".skill-bar", {
        width: 0,
        duration: 1,
        delay: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 bg-stone-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-light text-stone-800 mb-16 text-center">Skills</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-medium text-stone-800">{skill.name}</span>
                  <span className="text-sm text-stone-600">{skill.level}%</span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-2">
                  <div className="skill-bar bg-amber-600 h-2 rounded-full" style={{ width: `${skill.level}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills
