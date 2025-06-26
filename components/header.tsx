"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Menu, X } from "lucide-react"

const Header = () => {
  const headerRef = useRef<HTMLElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Team", href: "#team" },
    { name: "Blog", href: "#blog" },
    { name: "Contact", href: "#contact" },
  ]

  useEffect(() => {
    if (!headerRef.current) return

    const ctx = gsap.context(() => {
      gsap.set(".nav-item", { opacity: 0, y: -20 })

      gsap.to(".nav-item", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.5,
        ease: "power2.out",
      })
    }, headerRef)

    return () => ctx.revert()
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-40 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-md bg-black/60 border border-white/10 rounded-2xl px-6 py-4 shadow-xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="nav-item">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Portfolio
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(item.href)}
                  className="nav-item text-white/80 hover:text-transparent hover:bg-gradient-to-r hover:from-cyan-400 hover:to-purple-500 hover:bg-clip-text transition-all duration-300 relative group interactive"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white interactive nav-item">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pt-4 border-t border-white/10">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left py-2 text-white/80 hover:text-transparent hover:bg-gradient-to-r hover:from-cyan-400 hover:to-purple-500 hover:bg-clip-text transition-all duration-300 interactive"
                >
                  {item.name}
                </button>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
