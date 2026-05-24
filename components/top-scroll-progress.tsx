"use client"

import { useEffect, useRef } from "react"

const TopScrollProgress = () => {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    let ticking = false

    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollY = window.scrollY
      const progress = scrollHeight > 0 ? scrollY / scrollHeight : 0

      // Update scaleX transformation directly on DOM
      bar.style.transform = `scaleX(${progress})`
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress)
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    updateProgress()

    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 w-full h-[4px] z-50 origin-left pointer-events-none"
      style={{
        background: "linear-gradient(90deg, #0c2041 0%, #123466 40%, #1c529b 100%)",
        boxShadow: "0 0 8px rgba(28, 82, 155, 0.6)",
        transform: "scaleX(0)",
      }}
    />
  )
}

export default TopScrollProgress
