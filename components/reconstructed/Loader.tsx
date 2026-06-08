"use client"

import { useEffect, useState } from "react"
import { gsap } from "gsap"

interface LoaderProps {
  onLoadComplete: () => void
}

const Loader = ({ onLoadComplete }: LoaderProps) => {
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    document.body.style.overflow = "hidden"

    const timeline = gsap.timeline()

    timeline
      .to(".loader-logo", { opacity: 1, duration: 0.5, ease: "power2.out" })
      .to(".loader-progress-fill", { width: "100%", duration: 1.5, ease: "power2.inOut" }, 0)
      .to(".loader-content", { opacity: 0, duration: 0.4, ease: "power2.inOut", delay: 1.6 })
      .to(".loader-overlay", { opacity: 0, pointerEvents: "none", duration: 0.4, ease: "power2.inOut" }, "-=0.2")
      .call(() => {
        setIsComplete(true)
        document.body.style.overflow = "auto"
        onLoadComplete()
      })

    return () => { timeline.kill() }
  }, [onLoadComplete])

  if (isComplete) return null

  return (
    <div className="loader-overlay fixed inset-0 z-[9999] bg-[#0D0505] flex items-center justify-center overflow-hidden">
      <div className="loader-content w-full h-full flex flex-col items-center justify-center relative opacity-100 px-10">
        
        <div className="text-center">
          <h1 className="loader-logo opacity-0 text-[80px] md:text-[120px] font-[800] italic text-white tracking-tighter mb-8 leading-none">
            Siser.
          </h1>

          <div className="w-[300px] md:w-[400px] h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
            <div className="loader-progress-fill h-full w-0 bg-gradient-to-r from-[#FF4B1F] to-[#FF6A21] rounded-full"></div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Loader