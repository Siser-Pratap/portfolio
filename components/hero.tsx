"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const typingRef = useRef<HTMLSpanElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  const words = ["Developer", "Designer", "Freelancer", "Entrepreneur"]

  useEffect(() => {
    if (!heroRef.current) return

    const ctx = gsap.context(() => {
      gsap.set([".hero-title", ".hero-subtitle", ".hero-description", ".hero-cta"], {
        opacity: 0,
        y: 50,
      })

      const tl = gsap.timeline({ delay: 1 })

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
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          "-=0.2",
        )

      // Cursor blinking animation
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!typingRef.current) return

    const typeWord = (word: string, callback?: () => void) => {
      const letters = word.split("")
      let currentText = ""

      // Clear current text first
      gsap.set(typingRef.current, { text: "" })

      // Type each letter
      letters.forEach((letter, index) => {
        gsap.to(
          {},
          {
            duration: 0.1,
            delay: index * 0.1,
            onComplete: () => {
              currentText += letter
              if (typingRef.current) {
                typingRef.current.textContent = currentText
              }
              if (index === letters.length - 1 && callback) {
                setTimeout(callback, 2000) // Wait 2 seconds before next word
              }
            },
          },
        )
      })
    }

    const eraseWord = (callback?: () => void) => {
      const currentText = typingRef.current?.textContent || ""
      const letters = currentText.split("")

      letters.reverse().forEach((_, index) => {
        gsap.to(
          {},
          {
            duration: 0.05,
            delay: index * 0.05,
            onComplete: () => {
              const newText = currentText.slice(0, currentText.length - index - 1)
              if (typingRef.current) {
                typingRef.current.textContent = newText
              }
              if (index === letters.length - 1 && callback) {
                setTimeout(callback, 500) // Wait 0.5 seconds before typing next word
              }
            },
          },
        )
      })
    }

    const startTypingCycle = () => {
      const cycleWords = () => {
        const currentWord = words[currentWordIndex]

        typeWord(currentWord, () => {
          eraseWord(() => {
            setCurrentWordIndex((prev) => (prev + 1) % words.length)
          })
        })
      }

      // Start after hero animation completes
      setTimeout(cycleWords, 2500)
    }

    startTypingCycle()
  }, [currentWordIndex, words])

  return (
    <section id="home" ref={heroRef} className="min-h-screen flex items-center justify-center relative pt-20">
      <div className="max-w-4xl mx-auto text-center px-6">
        <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-3xl p-12 shadow-2xl">
          <h1 className="hero-title text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Using Our Reputation
            </span>
            <br />
            <span className="text-white">To Help You!</span>
          </h1>

          <div className="hero-subtitle mb-8">
            <h2 className="text-2xl md:text-3xl text-white/90 font-light">
              I'm a{" "}
              <span className="relative inline-block">
                <span
                  ref={typingRef}
                  className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent font-bold"
                >
                  Developer
                </span>
                <span
                  ref={cursorRef}
                  className="absolute -right-1 top-0 text-purple-400 font-thin"
                  style={{ animation: "blink 1s infinite" }}
                >
                  |
                </span>
              </span>
            </h2>
          </div>

          <p className="hero-description text-lg text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
            There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in
            some form, by injected humour, or randomised words which don't look even slightly believable. If you are
            going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the
            middle of text.
          </p>

          <div className="hero-cta">
            <Button className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white px-8 py-6 text-lg rounded-full interactive shadow-lg shadow-purple-500/25 transform hover:scale-105 transition-all duration-300">
              VIEW PORTFOLIO
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-500 rounded-full animate-pulse opacity-40"></div>
      <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-pink-400 rounded-full animate-bounce opacity-50"></div>
    </section>
  )
}

export default Hero
