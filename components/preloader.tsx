"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface PreloaderProps {
  children: React.ReactNode
}

const Preloader = ({ children }: PreloaderProps) => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Ensure all resources are loaded
    const handleLoad = () => {
      setIsLoaded(true)
    }

    if (document.readyState === "complete") {
      handleLoad()
    } else {
      window.addEventListener("load", handleLoad)
      return () => window.removeEventListener("load", handleLoad)
    }
  }, [])

  useEffect(() => {
    // Prevent scrolling during loading
    if (!isLoaded) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isLoaded])

  return <>{children}</>
}

export default Preloader
