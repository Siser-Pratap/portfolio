"use client"

import { useEffect, useRef } from "react"

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // Position variables
    const mouse = { x: 0, y: 0 } // current mouse position
    const ringPos = { x: 0, y: 0 } // lerped ring position

    // Handle mouse movement
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY

      // Move inner dot instantly
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`
    }

    // Animation loop (LERP)
    const render = () => {
      const LERP = 0.10
      ringPos.x += (mouse.x - ringPos.x) * LERP
      ringPos.y += (mouse.y - ringPos.y) * LERP

      // Move lagging outer ring
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`

      requestAnimationFrame(render)
    }

    window.addEventListener("mousemove", onMouseMove)
    const animationFrameId = requestAnimationFrame(render)

    // Expand hover effects
    const handleMouseEnter = () => {
      ring.classList.add("cursor-expand")
    }

    const handleMouseLeave = () => {
      ring.classList.remove("cursor-expand")
    }

    // Manage listeners for interactive elements
    const attachListeners = (elements: NodeListOf<Element>) => {
      elements.forEach(el => {
        el.removeEventListener("mouseenter", handleMouseEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
        el.addEventListener("mouseenter", handleMouseEnter)
        el.addEventListener("mouseleave", handleMouseLeave)
      })
    }

    const updateHoverElements = () => {
      const elements = document.querySelectorAll("a, button, .interactive, [data-cursor-hover]")
      attachListeners(elements)
    }

    updateHoverElements()

    // Observe DOM changes to dynamically attach to new elements
    const observer = new MutationObserver(() => {
      updateHoverElements()
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      cancelAnimationFrame(animationFrameId)
      observer.disconnect()

      const elements = document.querySelectorAll("a, button, .interactive, [data-cursor-hover]")
      elements.forEach(el => {
        el.removeEventListener("mouseenter", handleMouseEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
      })
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  )
}

export default CustomCursor
