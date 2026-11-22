"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useTheme } from "next-themes"

const navLinks = [
  { label: "About", href: "#about", id: "about" },
  { label: "Services", href: "#services", id: "services" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Works", href: "#works", id: "works" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Blogs", href: "#blogs", id: "blogs" },
  { label: "Contact", href: "#contact", id: "contact" },
]

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    navLinks.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.25, rootMargin: "-80px 0px -50% 0px" }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 px-6 md:px-12 transition-all duration-500 ${
          scrolled
            ? "py-3 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg md:text-xl font-extrabold tracking-tight text-white flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <span className="w-2 h-2 rounded-full bg-[#E8E2D8] shadow-[0_0_8px_#E8E2D8]" />
            <span className="uppercase tracking-wider">Siser Pratap</span>
          </Link>

          {/* Desktop Nav - Floating Architectural Glass Pill */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-wider uppercase bg-white/[0.04] border border-white/10 px-6 py-2.5 rounded-full backdrop-blur-xl shadow-lg">
            {navLinks.slice(0, 5).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors relative py-1 ${
                  activeSection === link.id
                    ? "text-white font-bold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-0.5 left-0 w-full h-[2px] bg-[#E8E2D8] rounded-full"
                  />
                )}
              </Link>
            ))}
            <Link
              href="/book"
              className="text-white/60 hover:text-white transition-colors"
            >
              Book a Call
            </Link>
          </nav>

          {/* Desktop CTA + Theme Toggle + Mobile Hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="#contact"
              className="hidden md:flex px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase items-center gap-2.5 transition-all bg-white text-black hover:bg-[#E8E2D8] hover:scale-[1.02] shadow-xl"
            >
              Get in touch
              <span className="bg-black text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs">
                ↗
              </span>
            </Link>

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-9 h-9 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 flex items-center justify-center transition-colors text-sm"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.166 17.834a.75.75 0 0 0-1.06 1.06l1.59 1.591a.75.75 0 1 0 1.061-1.06l-1.59-1.591ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.166 6.166a.75.75 0 0 0 1.06 1.06l1.59-1.59a.75.75 0 1 0-1.06-1.061L6.166 6.166Z"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd"/></svg>
                )}
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden flex flex-col justify-center items-center gap-[5px] w-10 h-10"
              aria-label="Toggle menu"
            >
              <span className={`block h-[2px] rounded-full transition-all duration-300 bg-white ${menuOpen ? "w-6 rotate-45 translate-y-[7px]" : "w-6"}`} />
              <span className={`block h-[2px] rounded-full transition-all duration-300 bg-white ${menuOpen ? "opacity-0 w-4" : "w-4"}`} />
              <span className={`block h-[2px] rounded-full transition-all duration-300 bg-white ${menuOpen ? "w-6 -rotate-45 -translate-y-[7px]" : "w-6"}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#0A0A0A] flex flex-col items-start justify-center px-10"
          >
            <nav className="flex flex-col gap-6 w-full">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className={`text-[clamp(32px,8vw,56px)] font-[800] tracking-tight leading-none uppercase transition-colors ${
                      activeSection === link.id ? "text-[#E8E2D8]" : "text-white hover:text-[#E8E2D8]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * navLinks.length, duration: 0.3 }}
                className="pt-4"
              >
                <Link
                  href="/book"
                  onClick={closeMenu}
                  className="inline-flex bg-white text-black font-bold uppercase text-sm tracking-wider px-6 py-3 rounded-full"
                >
                  Book a Call ↗
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header
