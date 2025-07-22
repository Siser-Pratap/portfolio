"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import BubbleBackground from "./bubble-background"
import {ScrollSmoother} from "gsap/ScrollSmoother"

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const typingRef = useRef<HTMLSpanElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const latestWorksBtnRef = useRef<HTMLButtonElement>(null);
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

  const scrollToAbout = ()=> {
  document.getElementById("works")?.scrollIntoView({
    behavior: "smooth"
    });
  }

  return (
    <>
    <BubbleBackground className="z-11" />
      <section id="home" ref={heroRef} className="min-h-screen w-[100vw] flex items-center inset-0 z-10 relative justify-center  pt-20 overflow-x-hidden">

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-400 rounded-full filter blur-[100px] opacity-20 animate-pulse"></div>

        <div className="max-w-4xl mx-auto text-center px-6">
          <div className=" bg-transparent rounded-3xl p-12 shadow-2xl">
            

            <div className="hero-subtitle mb-8 bg-inherit ">
              <h2 className="text-2xl md:text-4xl border relative border-transparent font-bold text-[#4204c7]  bg-transparent">
                I'm <span className="text-white/80">a</span>{" "}
                <span className=" inline-block">
                  <span
                    ref={typingRef}
                    className="text-white/80 hover:scale-105 hover:text-5xl md:text-4xl text-xl"
                  >
                    Developer
                  </span>
                  <span
                    ref={cursorRef}
                    className=" relative hidden -right-1 top-0 text-purple-400 font-thin"
                    style={{ animation: "blink 1s infinite" }}
                  >
                    |
                  </span>
                </span>
              </h2>
            </div>
            <div className="hero-cta">
              <Button
                ref={latestWorksBtnRef}
                style={{
                  visibility: "visible",
                  animationDelay: "0.2s",
                  animationName: "fadeInUp"
                }}
                onClick={()=>scrollToAbout()}
                className="border relative fadeInUp inset-0 z-10 cursor-pointer border-white border-spacing-7  group interactive text-white px-8 py-6 text-lg interactive shadow-lg shadow-purple-500/25 transform transition-all duration-300 hover:bg-white/80 hover:text-black  "
              >
                Latest Works
                
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
       
      </section>
    </>
  )
}

export default Hero
