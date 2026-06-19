"use client"

import { useEffect, useState, useRef } from "react"

interface LoaderProps {
  onLoadComplete: () => void
}

const Loader = ({ onLoadComplete }: LoaderProps) => {
  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  useEffect(() => {
    // Prevent scrolling during load
    document.body.style.overflow = "hidden"
    
    // Create offscreen canvas for rendering
    const canvas = document.createElement("canvas")
    canvas.width = 960
    canvas.height = 540
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      setProgress(100)
      setIsLoaded(true)
      return
    }

    const totalFrames = 120
    const frames: HTMLImageElement[] = []

    const drawFrame = (c: CanvasRenderingContext2D, w: number, h: number, frame: number) => {
      c.fillStyle = "#121212"
      c.fillRect(0, 0, w, h)

      const centerX = w / 2
      const centerY = h / 2
      const scrollRatio = frame / (totalFrames - 1)

      // Base radius and math
      const radius = Math.min(w, h) * 0.3
      const angleOffset = scrollRatio * Math.PI * 4 // two full spins

      // Deep background glow
      const glowGrad = c.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.8)
      const h1 = (270 + scrollRatio * 60) % 360
      const h2 = (190 + scrollRatio * 60) % 360
      glowGrad.addColorStop(0, `hsla(${h1}, 70%, 50%, 0.18)`)
      glowGrad.addColorStop(0.5, `hsla(${h2}, 70%, 50%, 0.05)`)
      glowGrad.addColorStop(1, "rgba(18, 18, 18, 0)")
      c.fillStyle = glowGrad
      c.fillRect(0, 0, w, h)

      // Drawing a 3D-looking wireframe spherical spiral
      c.lineWidth = 1.5
      const rings = 12
      const pointsPerRing = 100

      for (let r = 0; r < rings; r++) {
        const ringProgress = r / rings
        const phi = ringProgress * Math.PI
        
        c.beginPath()
        for (let p = 0; p <= pointsPerRing; p++) {
          const thetaProgress = p / pointsPerRing
          const theta = thetaProgress * Math.PI * 2 + angleOffset

          // 3D coordinates on sphere
          const x3d = radius * Math.sin(phi) * Math.cos(theta)
          const y3d = radius * Math.sin(phi) * Math.sin(theta)
          const z3d = radius * Math.cos(phi) + Math.sin(theta * 6 + scrollRatio * Math.PI * 6) * 15

          // Rotate in 3D space (Y-axis and X-axis)
          const cosY = Math.cos(scrollRatio * Math.PI * 2)
          const sinY = Math.sin(scrollRatio * Math.PI * 2)
          const cosX = Math.cos(0.5)
          const sinX = Math.sin(0.5)

          let x1 = x3d * cosY - z3d * sinY
          let z1 = x3d * sinY + z3d * cosY

          let y2 = y3d * cosX - z1 * sinX
          let z2 = y3d * sinX + z1 * cosX

          // Perspective projection
          const dist = 1000
          const scale = dist / (dist + z2)
          const screenX = centerX + x1 * scale
          const screenY = centerY + y2 * scale

          if (p === 0) {
            c.moveTo(screenX, screenY)
          } else {
            c.lineTo(screenX, screenY)
          }
        }

        const grad = c.createLinearGradient(0, 0, w, h)
        grad.addColorStop(0, `hsla(${h1}, 80%, 65%, ${0.1 + ringProgress * 0.4})`)
        grad.addColorStop(1, `hsla(${h2}, 80%, 65%, ${0.1 + (1 - ringProgress) * 0.4})`)
        c.strokeStyle = grad
        c.stroke()
      }

      // Outer HUD ticks
      c.fillStyle = `rgba(255, 255, 255, ${0.1 + Math.sin(scrollRatio * Math.PI) * 0.15})`
      for (let i = 0; i < 60; i++) {
        const angle = (i / 60) * Math.PI * 2 + angleOffset * 0.15
        const ringRad = radius * 1.25 + Math.sin(scrollRatio * Math.PI * 4 + i) * 6
        const x = centerX + Math.cos(angle) * ringRad
        const y = centerY + Math.sin(angle) * ringRad
        c.beginPath()
        c.arc(x, y, 1.2, 0, Math.PI * 2)
        c.fill()
      }
    }

    let currentFrame = 0

    const generateNextFrame = () => {
      if (currentFrame < totalFrames) {
        drawFrame(ctx, canvas.width, canvas.height, currentFrame)
        const url = canvas.toDataURL("image/jpeg", 0.7)
        const img = new Image()
        img.src = url
        frames.push(img)

        currentFrame++
        setProgress(Math.round((currentFrame / totalFrames) * 100))
        requestAnimationFrame(generateNextFrame)
      } else {
        // Generation completed, store in global variable
        ;(window as any).preloadedFrames = frames
        setIsLoaded(true)
        setTimeout(() => {
          setIsAnimatingOut(true)
        }, 300)
      }
    }

    generateNextFrame()

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  useEffect(() => {
    if (isAnimatingOut) {
      const timer = setTimeout(() => {
        onLoadComplete()
        document.body.style.overflow = "auto"
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [isAnimatingOut, onLoadComplete])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a] transition-all duration-[1200ms] pointer-events-none`}
      style={{
        transform: isAnimatingOut ? "translateY(-100%)" : "translateY(0%)",
        opacity: isAnimatingOut ? 0 : 1,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div className="max-w-xl w-full px-12 text-center select-none pointer-events-none">
        <h1 className="text-xs md:text-sm font-light tracking-[0.4em] uppercase text-white/90 mb-6 animate-pulse">
          INITIALIZING CINEMATIC CANVAS
        </h1>

        <div className="w-full h-[1px] bg-white/10 relative overflow-hidden mb-4">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-violet-500 via-cyan-400 to-teal-500 transition-all duration-300 origin-left"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-white/40 font-mono text-[3.5rem] md:text-[5.5rem] font-extralight tracking-tighter tabular-nums leading-none">
          <span>{progress.toString().padStart(3, "0")}</span>
          <span className="text-[1.5rem] md:text-[2rem] font-light text-white/20">%</span>
        </div>

        <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/20 mt-4">
          {progress < 100 ? "RENDERING GEOMETRIC FLOW FIELDS" : "CANVAS READY - DECODING SEQUENCE"}
        </p>
      </div>
    </div>
  )
}

export default Loader
