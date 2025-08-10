"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { sections } from "@/constants/constant"

const SectionIndicator = () => {
  const indicatorRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState(0)

  useEffect(() => {
    if (!indicatorRef.current) return

    const ctx = gsap.context(() => {
      // Initial animation
      gsap.set(".indicator-bubble", { opacity: 0, scale: 0 })

      gsap.to(".indicator-bubble", {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        delay: 1.5,
        ease: "back.out(1.7)",
      })

      // Set up scroll triggers for each section
      sections.forEach((section, index) => {
        const element = document.getElementById(section.id)
        if (element) {
          ScrollTrigger.create({
            trigger: element,
            start: "top 50%",
            end: "bottom 50%",
            onEnter: () => setActiveSection(index),
            onEnterBack: () => setActiveSection(index),
          })
        }
      })
    }, indicatorRef)

    return () => ctx.revert()
  }, [])

  const scrollToSection = (sectionId: string, index: number) => {
    const element = document.getElementById(sectionId)
    if (element) {
      setActiveSection(index)
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div ref={indicatorRef} className="fixed left-8 top-1/2 transform -translate-y-1/2 z-30 hidden lg:block">
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`indicator-bubble cursor-pointer transition-all duration-300 interactive ${
              activeSection === index ? "scale-125" : "hover:scale-110"
            }`}
            onClick={() => scrollToSection(section.id, index)}
          >
            <div
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                activeSection === index
                  ? "bg-purple-600 shadow-lg shadow-purple-500/50"
                  : "bg-white/20 hover:bg-white/30 border border-white/30"
              }`}
            />
            {activeSection === index && (
              <div className="absolute inset-0 w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-ping opacity-75" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SectionIndicator
