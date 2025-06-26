"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface NavigationProps {
  currentSection: number
  onSectionChange: (section: number) => void
}

const Navigation = ({ currentSection, onSectionChange }: NavigationProps) => {
  const navRef = useRef<HTMLElement>(null)

  const navItems = [
    { name: "Home", index: 0 },
    { name: "About", index: 1 },
    { name: "Experience", index: 2 },
    { name: "Education", index: 3 },
    { name: "Projects", index: 4 },
    { name: "Contact", index: 5 },
  ]

  useEffect(() => {
    if (!navRef.current) return

    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(".nav-item", {
        opacity: 0,
        y: -20,
      })

      // Animate in
      gsap.to(".nav-item", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.5,
        ease: "power2.out",
      })
    }, navRef)

    return () => ctx.revert()
  }, [])

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-40 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-6 py-4 shadow-xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="nav-item">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Portfolio
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.index}
                  onClick={() => onSectionChange(item.index)}
                  className={`nav-item transition-all duration-300 relative group interactive ${
                    currentSection === item.index ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 ${
                      currentSection === item.index ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <div className="nav-item text-white/60 text-sm">{navItems[currentSection]?.name}</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
