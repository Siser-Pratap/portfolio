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
            start: "top 80%",
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
            start: "top 80%",
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="py-24 bg-gray-900/30">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="section-title text-4xl md:text-6xl font-bold mb-8">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            WHAT I DO.
          </span>
        </h2>
        <p className="section-description text-xl text-white/70 leading-relaxed">
          The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic
          words etc.
        </p>
      </div>
    </section>
  )
}

export default WhatIDo
