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
    const handleScroll = () => setScrolled(window.scrollY > 80)
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
        className={`fixed top-0 left-0 w-full z-50 px-10 transition-all duration-500 ${
          scrolled
            ? "py-4 bg-[#0D0505]/85 backdrop-blur-xl border-b border-white/10"
            : "py-8 bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={`text-2xl font-bold italic tracking-tight transition-colors ${
              scrolled ? "text-white" : "text-[#0D0505] dark:text-white"
            }`}
          >
            Siser.
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.slice(0, 4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  activeSection === link.id
                    ? scrolled ? "text-white" : "text-[#0D0505] dark:text-white"
                    : scrolled ? "text-white/60 hover:text-white" : "text-[#0D0505]/50 dark:text-white/60 hover:text-[#0D0505] dark:hover:text-white"
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <span className="block h-[2px] w-full bg-gradient-to-r from-[#FF4B1F] to-[#FF6A21] rounded-full mt-0.5" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA + Mobile Hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="#contact"
              className={`hidden md:flex px-6 py-2 rounded-full text-sm font-medium items-center gap-2 transition-colors ${
                scrolled
                  ? "bg-white text-black hover:bg-gray-100"
                  : "bg-[#0D0505] dark:bg-white text-white dark:text-black hover:opacity-80"
              }`}
            >
              Get in touch
              <span className="bg-gradient-to-b from-[#FF4B1F] to-[#FF6A21] w-6 h-6 rounded-full text-white flex items-center justify-center text-xs">
                ↗
              </span>
            </Link>

            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors text-sm ${
                  scrolled
                    ? "border-white/20 text-white/70 hover:text-white hover:border-white/40"
                    : "border-[#0D0505]/20 dark:border-white/20 text-[#0D0505]/70 dark:text-white/70 hover:text-[#0D0505] dark:hover:text-white hover:border-[#0D0505]/40 dark:hover:border-white/40"
                }`}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.166 17.834a.75.75 0 0 0-1.06 1.06l1.59 1.591a.75.75 0 1 0 1.061-1.06l-1.59-1.591ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.166 6.166a.75.75 0 0 0 1.06 1.06l1.59-1.59a.75.75 0 1 0-1.06-1.061L6.166 6.166Z"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd"/></svg>
                )}
              </button>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden flex flex-col justify-center items-center gap-[5px] w-10 h-10"
              aria-label="Toggle menu"
            >
              <span className={`block h-[2px] rounded-full transition-all duration-300 ${scrolled ? "bg-white" : "bg-[#0D0505] dark:bg-white"} ${menuOpen ? "w-6 rotate-45 translate-y-[7px]" : "w-6"}`} />
              <span className={`block h-[2px] rounded-full transition-all duration-300 ${scrolled ? "bg-white" : "bg-[#0D0505] dark:bg-white"} ${menuOpen ? "opacity-0 w-4" : "w-4"}`} />
              <span className={`block h-[2px] rounded-full transition-all duration-300 ${scrolled ? "bg-white" : "bg-[#0D0505] dark:bg-white"} ${menuOpen ? "w-6 -rotate-45 -translate-y-[7px]" : "w-6"}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#0D0505] flex flex-col items-start justify-center px-10"
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
                    className={`text-[clamp(32px,8vw,56px)] font-[700] tracking-tight leading-none transition-colors ${
                      activeSection === link.id ? "text-[#FF4B1F]" : "text-white hover:text-[#FF4B1F]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="mt-16"
            >
              <Link
                href="#contact"
                onClick={closeMenu}
                className="flex bg-white text-black px-6 py-3 rounded-full text-sm font-semibold items-center gap-3 hover:bg-gray-100 transition-colors"
              >
                Get in touch
                <span className="bg-gradient-to-b from-[#FF4B1F] to-[#FF6A21] w-7 h-7 rounded-full text-white flex items-center justify-center text-xs">↗</span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header
