"use client"

import Link from "next/link"

const Header = () => {
  return (
    <header className="absolute top-0 left-0 w-full z-50 py-8 px-10">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-white text-2xl font-bold italic tracking-tight">
          Siser.
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-white/80 text-sm font-medium">
          <Link href="#about" className="hover:text-white transition-colors">About</Link>
          <Link href="#services" className="hover:text-white transition-colors">Services</Link>
          <Link href="#works" className="hover:text-white transition-colors">Works</Link>
          <Link href="#blogs" className="hover:text-white transition-colors">Blogs</Link>
        </nav>

        {/* CTA */}
        <Link 
          href="#contact" 
          className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors"
        >
          Get in touch
          <span className="bg-gradient-to-b from-[#FF4B1F] to-[#FF6A21] w-6 h-6 rounded-full text-white flex items-center justify-center text-xs">
            ↗
          </span>
        </Link>
      </div>
    </header>
  )
}

export default Header