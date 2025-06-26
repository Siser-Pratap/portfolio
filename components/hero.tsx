"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!heroRef.current) return

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([".hero-title", ".hero-subtitle", ".hero-description", ".hero-cta"], {
        opacity: 0,
        y: 50,
      })

      // Create timeline
      const tl = gsap.timeline({ delay: 0.5 })

      tl.to(".hero-title", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      })
        .to(
          ".hero-subtitle",
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.5",
        )
        .to(
          ".hero-description",
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3",
        )
        .to(
          ".hero-cta",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          "-=0.2",
        )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={heroRef} className="h-full flex items-center justify-center relative">
      {/* Rest of the component remains the same */}
      <div className="max-w-4xl mx-auto text-center px-6">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-12 shadow-2xl">
          <h1 className="hero-title text-6xl md:text-8xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              John Doe
            </span>
          </h1>

          <h2 className="hero-subtitle text-2xl md:text-3xl text-white/80 mb-6 font-light">
            Full Stack Developer & UI/UX Designer
          </h2>

          <p className="hero-description text-lg text-white/60 mb-8 max-w-2xl mx-auto leading-relaxed">
            Crafting digital experiences that blend creativity with functionality. Passionate about creating beautiful,
            user-centric applications that make a difference.
          </p>

          <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center">
            <button className="interactive px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
              View My Work
            </button>
            <button className="interactive px-8 py-4 backdrop-blur-md bg-white/10 border border-white/20 text-white rounded-full font-medium hover:bg-white/20 transition-all duration-300">
              Download CV
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/40 text-sm">
        Scroll down to explore
      </div>
    </div>
  )
}

export default Hero
