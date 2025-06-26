"use client"

import { useEffect, useRef } from "react"

interface ScrollControllerProps {
  currentSection: number
  totalSections: number
  onSectionChange: (section: number) => void
  isTransitioning: boolean
}

const ScrollController = ({
  currentSection,
  totalSections,
  onSectionChange,
  isTransitioning,
}: ScrollControllerProps) => {
  const scrollProgress = useRef(0)
  const lastScrollTime = useRef(0)

  useEffect(() => {
    let animationFrame: number

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      if (isTransitioning) return

      const now = Date.now()
      if (now - lastScrollTime.current < 50) return // Throttle scroll events

      lastScrollTime.current = now

      const delta = e.deltaY > 0 ? 1 : -1
      scrollProgress.current += delta * 2

      // Clamp scroll progress between 0 and 100
      scrollProgress.current = Math.max(0, Math.min(100, scrollProgress.current))

      // Check if we've reached 50% threshold
      if (scrollProgress.current >= 50) {
        if (currentSection < totalSections - 1) {
          onSectionChange(currentSection + 1)
          scrollProgress.current = 0 // Reset scroll progress
        } else {
          scrollProgress.current = 50 // Stay at max for last section
        }
      } else if (scrollProgress.current <= -10) {
        if (currentSection > 0) {
          onSectionChange(currentSection - 1)
          scrollProgress.current = 0 // Reset scroll progress
        } else {
          scrollProgress.current = 0 // Stay at min for first section
        }
      }

      // Update scroll indicator
      updateScrollIndicator()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return

      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
          e.preventDefault()
          if (currentSection < totalSections - 1) {
            onSectionChange(currentSection + 1)
          }
          break
        case "ArrowUp":
        case "PageUp":
          e.preventDefault()
          if (currentSection > 0) {
            onSectionChange(currentSection - 1)
          }
          break
        case "Home":
          e.preventDefault()
          onSectionChange(0)
          break
        case "End":
          e.preventDefault()
          onSectionChange(totalSections - 1)
          break
      }
    }

    const updateScrollIndicator = () => {
      const indicator = document.getElementById("scroll-progress")
      if (indicator) {
        indicator.style.height = `${scrollProgress.current}%`
      }
    }

    // Add event listeners
    window.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("keydown", handleKeyDown)

    // Touch events for mobile
    let touchStartY = 0
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (isTransitioning) return

      const touchEndY = e.changedTouches[0].clientY
      const diff = touchStartY - touchEndY

      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentSection < totalSections - 1) {
          onSectionChange(currentSection + 1)
        } else if (diff < 0 && currentSection > 0) {
          onSectionChange(currentSection - 1)
        }
      }
    }

    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchmove", handleTouchMove, { passive: false })
    window.addEventListener("touchend", handleTouchEnd)

    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [currentSection, totalSections, onSectionChange, isTransitioning])

  return (
    <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-30">
      <div className="w-1 h-32 bg-white/20 rounded-full overflow-hidden">
        <div
          id="scroll-progress"
          className="w-full bg-gradient-to-t from-purple-400 to-pink-400 transition-all duration-300 rounded-full"
          style={{ height: "0%" }}
        />
      </div>
      <div className="text-white/60 text-xs mt-2 text-center">{Math.round(scrollProgress.current)}%</div>
    </div>
  )
}

export default ScrollController
