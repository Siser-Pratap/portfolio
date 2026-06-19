"use client"

const WhatIDo = () => {
  return (
    <section id="about" className="py-32 bg-[#121212]/30 overflow-x-hidden relative">
      <div className="max-w-4xl mx-auto text-center px-6">
        <span className="text-xs md:text-sm font-light tracking-[0.3em] uppercase text-white/40 mb-3 block">
          ABOUT ME
        </span>
        <h2 className="section-title animate-slide-in-y text-3xl md:text-5xl font-bold mb-8 tracking-tight bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
          MY VISION
        </h2>
        <p className="section-description animate-slide-in-x text-lg pt-2 text-white/50 leading-relaxed font-light">
          I build software applications that drive technological advancement and contribute to a better, more connected society.
        </p>
      </div>
    </section>
  )
}

export default WhatIDo
