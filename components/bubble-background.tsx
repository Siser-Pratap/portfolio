"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface BubbleBackgroundProps {
  className?: string;
}

const BubbleBackground = ({ className = "z-0" }: BubbleBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const bubblesRef = useRef<HTMLDivElement[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!containerRef.current) return

    const bubbles = bubblesRef.current
    let isMouseMoving = false
    let mouseTimeout: NodeJS.Timeout

    const ctx = gsap.context(() => {
      // Initial bubble animation
      bubbles.forEach((bubble, index) => {
        if (!bubble) return

        // Random initial position
        gsap.set(bubble, {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          scale: Math.random() * 0.5 + 0.5,
        })

        // Floating animation
        gsap.to(bubble, {
          x: `+=${Math.random() * 200 - 100}`,
          y: `+=${Math.random() * 200 - 100}`,
          duration: Math.random() * 10 + 10,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.1,
        })

        // Rotation animation
        gsap.to(bubble, {
          rotation: 360,
          duration: Math.random() * 20 + 20,
          repeat: -1,
          ease: "none",
        })
      })
    }, containerRef)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      isMouseMoving = true

      clearTimeout(mouseTimeout)
      mouseTimeout = setTimeout(() => {
        isMouseMoving = false
      }, 100)

      // Move bubbles towards cursor
      bubbles.forEach((bubble) => {
        if (!bubble) return

        const rect = bubble.getBoundingClientRect()
        const bubbleX = rect.left + rect.width / 2
        const bubbleY = rect.top + rect.height / 2

        const deltaX = e.clientX - bubbleX
        const deltaY = e.clientY - bubbleY
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

        if (distance < 200) {
          gsap.to(bubble, {
            x: `+=${deltaX * 0.1}`,
            y: `+=${deltaY * 0.1}`,
            duration: 0.5,
            ease: "power2.out",
          })
        }
      })
    }

    document.addEventListener("mousemove", handleMouseMove)

    return () => {
      ctx.revert()
      document.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(mouseTimeout)
    }
  }, [])

  const bubbleColors = [
    "from-cyan-400/20 to-blue-500/10",
    "from-purple-500/20 to-pink-500/10",
    "from-emerald-400/20 to-teal-500/10",
    "from-rose-400/20 to-orange-500/10",
    "from-violet-400/20 to-purple-600/10",
  ]

  return (
    <div
      ref={containerRef}
      className={`fixed top-0 left-0 w-screen h-screen pointer-events-none overflow-hidden ${className}`}
      style={{ maxWidth: '100vw', maxHeight: '100vh' }}
    >
      {Array.from({ length: 27 }).map((_, index) => (
        <div
          key={index}
          ref={el => {
            if (el) bubblesRef.current[index] = el;
          }}
          className={`absolute w-16 h-16 rounded-full bg-gradient-to-br ${
            bubbleColors[index % bubbleColors.length]
          } backdrop-blur-sm border border-white/10`}
          style={{
            maxWidth: '100vw',
            maxHeight: '100vh',
          }}
        />
      ))}
    </div>
  )
}

export default BubbleBackground
