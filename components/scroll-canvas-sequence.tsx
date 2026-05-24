"use client"

import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion"
import TypingAnimation from "./typing-animation"
import { Button } from "./ui/button"

const ScrollCanvasSequence = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Track scroll progress of the container from 0 to 1
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Panel 1 (Hero): Opacity and Y transitions
  const p1Opacity = useTransform(scrollYProgress, [0, 0.18, 0.25], [1, 1, 0])
  const p1Y = useTransform(scrollYProgress, [0, 0.25], [0, -60])

  // Panel 2: Opacity and Y transitions
  const p2Opacity = useTransform(scrollYProgress, [0.25, 0.30, 0.50, 0.55], [0, 1, 1, 0])
  const p2Y = useTransform(scrollYProgress, [0.28, 0.55], [60, -60])

  // Panel 3: Opacity and Y transitions
  const p3Opacity = useTransform(scrollYProgress, [0.55, 0.60, 0.85, 0.90], [0, 1, 1, 0])
  const p3Y = useTransform(scrollYProgress, [0.58, 0.90], [60, -60])

  // Render a specific frame onto the canvas
  const renderFrame = (index: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    const frames = (window as any).preloadedFrames
    if (!canvas || !ctx || !frames || !frames[index]) return

    const img = frames[index]

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate crop dimensions to mimic object-fit: cover
    const imgWidth = img.width
    const imgHeight = img.height
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height

    const imgRatio = imgWidth / imgHeight
    const canvasRatio = canvasWidth / canvasHeight

    let drawWidth = canvasWidth
    let drawHeight = canvasHeight
    let offsetX = 0
    let offsetY = 0

    if (imgRatio > canvasRatio) {
      drawWidth = canvasHeight * imgRatio
      offsetX = (canvasWidth - drawWidth) / 2
    } else {
      drawHeight = canvasWidth / imgRatio
      offsetY = (canvasHeight - drawHeight) / 2
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
  }

  // Draw the frame when the scroll position updates
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const totalFrames = 120
    const frameIndex = Math.min(totalFrames - 1, Math.floor(latest * totalFrames))
    renderFrame(frameIndex)
  })

  // Set up resize listener and initial rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1
      const width = window.innerWidth
      const height = window.innerHeight

      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.scale(dpr, dpr)
      }

      // Redraw frame after resizing
      const latestProgress = scrollYProgress.get()
      const totalFrames = 120
      const frameIndex = Math.min(totalFrames - 1, Math.floor(latestProgress * totalFrames))
      renderFrame(frameIndex)
    }

    window.addEventListener("resize", handleResize)
    
    // Tiny delay to ensure DOM and preloaded images are ready
    const initTimeout = setTimeout(() => {
      handleResize()
    }, 100)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(initTimeout)
    }
  }, [scrollYProgress])

  const scrollToNextSection = () => {
    const element = document.getElementById("about")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div ref={containerRef} id="home" className="relative w-[100vw] h-[500vh] bg-[#121212] overflow-x-hidden">
      {/* Sticky Canvas Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden z-10">
        <canvas ref={canvasRef} className="block w-full h-full object-cover" />

        {/* Ambient Gradient Accent Glows */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-[#121212]/80 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vh] bg-violet-500/10 rounded-full filter blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[45vh] bg-cyan-500/10 rounded-full filter blur-[120px] pointer-events-none" />

        {/* Text Panel Overlays */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="max-w-4xl mx-auto px-6 w-full text-center relative z-20 pointer-events-auto">
            
            {/* Panel 1: Hero */}
            <motion.div
              style={{ opacity: p1Opacity, y: p1Y }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
            >
              <span className="text-xs md:text-sm font-light tracking-[0.3em] uppercase text-white/40 mb-3">
                SISER PRATAP
              </span>
              <h1 className="text-4xl md:text-7xl font-bold font-sans tracking-tight mb-4 leading-none bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                CREATIVE DEVELOPER
              </h1>
              <div className="text-xl md:text-3xl font-light text-white/80 mb-10">
                I'm a{" "}
                <TypingAnimation
                  words={["Developer", "Designer", "Freelancer", "Entrepreneur"]}
                  className="font-normal text-white"
                />
              </div>
              <Button
                onClick={scrollToNextSection}
                className="border relative border-white/20 hover:border-white/60 rounded-full bg-white/[0.04] backdrop-blur-sm text-white px-8 py-6 text-lg interactive shadow-lg shadow-purple-500/10 transform transition-all duration-300 hover:bg-white hover:text-black hover:scale-105"
              >
                Latest Works
              </Button>
            </motion.div>

            {/* Panel 2: Performance & Motion */}
            <motion.div
              style={{ opacity: p2Opacity, y: p2Y }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
            >
              <span className="text-xs md:text-sm font-light tracking-[0.3em] uppercase text-white/40 mb-3">
                HIGH PERFORMANCE EXPERIENCE
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-white/95 to-white/70 bg-clip-text text-transparent">
                CINEMATIC MOTION & 60FPS GRAPHICS
              </h2>
              <p className="max-w-2xl text-white/50 text-base md:text-lg font-light leading-relaxed">
                Locking performance using hardware-accelerated canvas sequences and direct DOM manipulation.
                Every scroll, hover, and coordinate shift feels organic, fluid, and locked to the monitor's refresh rate.
              </p>
            </motion.div>

            {/* Panel 3: Quality & Tech Stack */}
            <motion.div
              style={{ opacity: p3Opacity, y: p3Y }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
            >
              <span className="text-xs md:text-sm font-light tracking-[0.3em] uppercase text-white/40 mb-3">
                UNCOMPROMISING AESTHETICS
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-white/95 to-white/70 bg-clip-text text-transparent">
                MODERN TECH STACK, RAW POWER
              </h2>
              <p className="max-w-2xl text-white/50 text-base md:text-lg font-light leading-relaxed">
                Blending Next.js, Framer Motion, and Three.js with deep charcoal canvas design.
                Custom LERP cursors, glassmorphic panels, and beautiful shaders form a cohesive futuristic experience.
              </p>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ScrollCanvasSequence
