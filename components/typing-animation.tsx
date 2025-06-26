"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

interface TypingAnimationProps {
  words: string[]
  className?: string
  speed?: number
  deleteSpeed?: number
  pauseDuration?: number
}

const TypingAnimation = ({
  words,
  className = "",
  speed = 100,
  deleteSpeed = 50,
  pauseDuration = 2000,
}: TypingAnimationProps) => {
  const textRef = useRef<HTMLSpanElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentText, setCurrentText] = useState("")

  useEffect(() => {
    if (!textRef.current) return

    const ctx = gsap.context(() => {
      // Cursor blinking animation
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      })
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const currentWord = words[currentWordIndex]
    let timeout: NodeJS.Timeout

    if (!isDeleting && currentText === currentWord) {
      // Pause before deleting
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration)
    } else if (isDeleting && currentText === "") {
      // Move to next word
      setIsDeleting(false)
      setCurrentWordIndex((prev) => (prev + 1) % words.length)
    } else {
      // Type or delete character
      const nextText = isDeleting
        ? currentWord.substring(0, currentText.length - 1)
        : currentWord.substring(0, currentText.length + 1)

      timeout = setTimeout(
        () => {
          setCurrentText(nextText)

          // Add subtle animation when typing
          if (!isDeleting && textRef.current) {
            gsap.fromTo(textRef.current, { scale: 1.05 }, { scale: 1, duration: 0.1, ease: "power2.out" })
          }
        },
        isDeleting ? deleteSpeed : speed,
      )
    }

    return () => clearTimeout(timeout)
  }, [currentText, currentWordIndex, isDeleting, words, speed, deleteSpeed, pauseDuration])

  return (
    <span className={`typing-container ${className}`}>
      <span ref={textRef} className="typing-text">
        {currentText}
      </span>
      <span ref={cursorRef} className="typing-cursor ml-1 text-purple-400 font-thin">
        |
      </span>
    </span>
  )
}

export default TypingAnimation
