"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

const BackgroundElements = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Floating particles animation
      const particles = containerRef.current?.querySelectorAll(".floating-particle")
      if (particles && particles.length > 0) {
        gsap.to(particles, {
          y: "random(-100, 100)",
          x: "random(-50, 50)",
          rotation: "random(0, 360)",
          duration: "random(3, 6)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: {
            amount: 2,
            from: "random",
          },
        })
      }

      // Gradient orbs animation
      const orbs = containerRef.current?.querySelectorAll(".gradient-orb")
      if (orbs && orbs.length > 0) {
        gsap.to(orbs, {
          scale: "random(0.8, 1.2)",
          rotation: 360,
          duration: "random(8, 12)",
          repeat: -1,
          ease: "none",
          stagger: {
            amount: 3,
            from: "random",
          },
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient Orbs */}
      <div className="gradient-orb absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
      <div className="gradient-orb absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl" />
      <div className="gradient-orb absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl" />

      {/* Floating Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="floating-particle absolute w-2 h-2 bg-white/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
    </div>
  )
}

export default BackgroundElements
