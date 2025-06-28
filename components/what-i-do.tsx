"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

const WhatIDo = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
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
            start:"top 20%"
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
            start: "top 25%",
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="py-24 bg-black/80">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="section-title text-4xl md:text-3xl font-bold mb-8 hover:scale-125">
          <span className="text-purple-600/75 transition-colors duration-300 shadow-purple-500/25 rounded-full p-4 shadow-lg shadow-">
            WHAT I DO.
          </span>
        </h2>
        <p className="section-description text-xl text-white leading-relaxed">
          Anything about me
        </p>
      </div>
    </section>
  )
}

export default WhatIDo
