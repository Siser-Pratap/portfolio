"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

interface LoaderProps {
  onLoadComplete: () => void
}

const Loader = ({ onLoadComplete }: LoaderProps) => {
  const loaderRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const bubblesRef = useRef<HTMLDivElement[]>([])
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Loading")

  const loadingSteps = [
    "Initializing...",
    "Loading Assets...",
    "Preparing Components...",
    "Setting up Animations...",
    "Almost Ready...",
    "Welcome!",
  ]

  useEffect(() => {
    if (!loaderRef.current) return

    const ctx = gsap.context(() => {
      // Initial setup
      gsap.set(".loader-bubble", {
        scale: 0,
        opacity: 0,
      })

      // Animate bubbles in
      gsap.to(".loader-bubble", {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)",
      })

      // Floating animation for bubbles
      gsap.to(".loader-bubble", {
        y: "random(-20, 20)",
        x: "random(-10, 10)",
        rotation: "random(0, 360)",
        duration: "random(2, 4)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
          amount: 1,
          from: "random",
        },
      })

      // Progress bar animation
      gsap.set(progressRef.current, { width: "0%" })

      // Text fade animation
      gsap.set(textRef.current, { opacity: 0, y: 20 })
      gsap.to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.5,
        ease: "power2.out",
      })
    }, loaderRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    let progressInterval: NodeJS.Timeout
    let textInterval: NodeJS.Timeout

    // Simulate loading progress
    progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15 + 5
        return newProgress >= 100 ? 100 : newProgress
      })
    }, 200)

    // Update loading text
    textInterval = setInterval(() => {
      setLoadingText((prev) => {
        const currentIndex = loadingSteps.indexOf(prev)
        const nextIndex = (currentIndex + 1) % loadingSteps.length
        return loadingSteps[nextIndex]
      })
    }, 800)

    return () => {
      clearInterval(progressInterval)
      clearInterval(textInterval)
    }
  }, [loadingSteps])

  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${progress}%`,
        duration: 0.5,
        ease: "power2.out",
      })
    }

    if (progress >= 100) {
      setTimeout(() => {
        // Exit animation
        const ctx = gsap.context(() => {
          const tl = gsap.timeline({
            onComplete: onLoadComplete,
          })

          tl.to(".loader-bubble", {
            scale: 0,
            opacity: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "back.in(1.7)",
          })
            .to(
              [textRef.current, progressRef.current?.parentElement],
              {
                opacity: 0,
                y: -20,
                duration: 0.4,
                ease: "power2.in",
              },
              "-=0.2",
            )
            .to(loaderRef.current, {
              opacity: 0,
              duration: 0.6,
              ease: "power2.inOut",
            })
        }, loaderRef)

        return () => ctx.revert()
      }, 1000)
    }
  }, [progress, onLoadComplete])

  const bubbleColors = [
    "from-cyan-400/60 to-blue-500/40",
    "from-purple-500/60 to-pink-500/40",
    "from-emerald-400/60 to-teal-500/40",
    "from-rose-400/60 to-orange-500/40",
    "from-violet-400/60 to-purple-600/40",
  ]

  return (
    <div ref={loaderRef} className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
      {/* Background Bubbles */}
      <div className="absolute inset-0">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) bubblesRef.current[index] = el
            }}
            className={`loader-bubble absolute w-16 h-16 rounded-full bg-gradient-to-br ${
              bubbleColors[index % bubbleColors.length]
            } backdrop-blur-sm border border-white/10`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Main Loader Content */}
      <div className="relative z-10 text-center">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Portfolio
          </h1>
        </div>

        {/* Loading Text */}
        <div ref={textRef} className="mb-8">
          <p className="text-xl text-white/80 font-light">{loadingText}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-80 max-w-sm mx-auto">
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              ref={progressRef}
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: "0%" }}
            />
          </div>
          <div className="mt-3 text-center">
            <span className="text-sm text-white/60">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2 mt-8">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-pulse"
              style={{
                animationDelay: `${index * 0.2}s`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-transparent to-black/80 pointer-events-none" />
    </div>
  )
}

export default Loader
