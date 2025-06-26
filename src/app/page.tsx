"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import Hero from "@/components/hero"
import About from "@/components/about"
import Experience from "@/components/experience"
import Education from "@/components/education"
import Projects from "@/components/projects"
import Contact from "@/components/contact"
import BackgroundElements from "@/components/background-elements"
import ScrollController from "@/components/scroll-controller"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const sections = [
    { id: "hero", component: Hero },
    { id: "about", component: About },
    { id: "experience", component: Experience },
    { id: "education", component: Education },
    { id: "projects", component: Projects },
    { id: "contact", component: Contact },
  ]

  useEffect(() => {
    // Disable default scrolling
    document.body.style.overflow = "hidden"

    // Initial setup
    gsap.set(`.section-0`, { opacity: 1, scale: 1 })
    gsap.set(`.section-1, .section-2, .section-3, .section-4, .section-5`, { opacity: 0, scale: 0.8 })

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  const handleSectionChange = (newSection: number) => {
    if (isTransitioning || newSection < 0 || newSection >= sections.length) return

    setIsTransitioning(true)

    // Animate out current section
    gsap.to(`.section-${currentSection}`, {
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        setCurrentSection(newSection)

        // Animate in new section
        gsap.fromTo(
          `.section-${newSection}`,
          {
            opacity: 0,
            scale: 1.2,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => {
              setIsTransitioning(false)
            },
          },
        )
      },
    })
  }

  return (
    <div ref={mainRef} className="bg-gray-900 h-screen overflow-hidden relative">
      <CustomCursor />
      <BackgroundElements />
      <Navigation currentSection={currentSection} onSectionChange={handleSectionChange} />
      <ScrollController
        currentSection={currentSection}
        totalSections={sections.length}
        onSectionChange={handleSectionChange}
        isTransitioning={isTransitioning}
      />

      <main className="relative z-10 h-full">
        {sections.map((section, index) => {
          const SectionComponent = section.component
          return (
            <div
              key={section.id}
              className={`section-${index} absolute inset-0 w-full h-full ${
                index === currentSection ? "opacity-100" : "opacity-0"
              }`}
              style={{ zIndex: index === currentSection ? 20 : 10 }}
            >
              <SectionComponent />
            </div>
          )
        })}
      </main>

      {/* Section Indicator */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-30 space-y-3">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSectionChange(index)}
            className={`w-3 h-3 rounded-full border-2 transition-all duration-300 interactive ${
              index === currentSection
                ? "bg-gradient-to-r from-purple-400 to-pink-400 border-purple-400"
                : "border-white/30 hover:border-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
