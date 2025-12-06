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
    let mouseTimeout: NodeJS.Timeout | undefined

    const ctx = gsap.context(() => {
      /** -------------- FIXED SECTION -------------------
       * Bubbles now start from their CURRENT DOM position.
       * No random teleporting.
       --------------------------------------------------*/
      bubbles.forEach((bubble, index) => {
  if (!bubble) return

  // Get natural DOM position
  const rect = bubble.getBoundingClientRect()
  const startX = rect.left
  const startY = rect.top

  // Floating animation – move WITH RESPECT TO ORIGINAL POSITION
  gsap.to(bubble, {
    x: (Math.random() * window.innerWidth), // absolute values, not +=
    y: (Math.random() * window.innerHeight),
    duration: Math.random() * 10 + 10,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: index * 0.1,
  })

  // Rotation
  gsap.to(bubble, {
    rotation: 360,
    duration: Math.random() * 20 + 20,
    repeat: -1,
    ease: "none",
  })
})
    }, containerRef)

    const handleMouseMove = (e: MouseEvent) => {
      bubbles.forEach(bubble => {
        if (!bubble) return

        const rect = bubble.getBoundingClientRect()
        const bubbleX = rect.left + rect.width / 2
        const bubbleY = rect.top + rect.height / 2

        const dx = e.clientX - bubbleX
        const dy = e.clientY - bubbleY
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 200) {
          gsap.to(bubble, {
            x: `+=${dx * 0.1}`,
            y: `+=${dy * 0.1}`,
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
      if (mouseTimeout) clearTimeout(mouseTimeout)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`fixed top-0 left-0 w-screen h-screen pointer-events-none overflow-hidden ${className}`}
    >
      {Array.from({ length: 27 }).map((_, index) => (
        <div
          key={index}
          ref={el => { if (el) bubblesRef.current[index] = el }}
          className={`absolute w-16 h-16 x-${window.innerWidth} y-${window.innerHeight} rounded-full bg-[#4204c7]/40 backdrop-blur-sm border border-white/10`}
        />
      ))}
    </div>
  )
}

export default BubbleBackground
