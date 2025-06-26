"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

const Header = () => {
  const headerRef = useRef<HTMLElement>(null)
  const [activeSection, setActiveSection] = useState("HOME")

  const navItems = ["HOME", "ABOUT", "EDUCATION", "PROJECTS", "SKILLS", "TESTIMONIALS", "NEWS", "CONTACT"]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".nav-item", {
        opacity: 0,
        y: -20,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.2,
        ease: "power2.out",
      })
    }, headerRef)

    return () => ctx.revert()
  }, [])

  const handleNavClick = (item: string) => {
    setActiveSection(item)
    // Smooth scroll to section would be implemented here
  }

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 bg-stone-100/90 backdrop-blur-sm border-b border-stone-200/50"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="nav-item">
            <h1 className="text-2xl font-bold text-stone-800 tracking-wider">SB.</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className={`nav-item text-sm font-medium tracking-wider transition-all duration-300 hover:text-amber-600 relative group ${
                  activeSection === item ? "text-amber-600" : "text-stone-600"
                }`}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* Phone Number */}
          <div className="nav-item hidden lg:block">
            <a
              href="tel:+2325452325"
              className="text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors duration-300"
            >
              +2 325 452 32 35
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
