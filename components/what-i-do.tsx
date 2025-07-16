"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

const WhatIDo = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      if(sectionRef){
      gsap.fromTo(
        ".section-title",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start:"top 25%",
          },
        },
      )

      gsap.fromTo(
        ".section-description",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 27%",
          },
        },
      )
    }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="py-24 bg-black/80 overflow-x-hidden">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="section-title text-3xl md:text-2xl font-bold mb-8 hover:scale-125">
          <span className="text-purple-600/75 hover:text-white/80 transition-colors duration-300 shadow-purple-500/25 rounded-full px-6 py-4 shadow-lg shadow-">
            My Life
          </span>
        </h2>
        <p className="section-description text-lg pt-2 text-white leading-relaxed">
          I build software applications that drive technological advancement and contribute to a better, more connected society.
        </p>
      </div>
      
    </section>
  )
}

export default WhatIDo
