"use client"

import Image from "next/image"

const FeatureBanner = () => {
  return (
    <section className="w-full bg-gradient-to-b from-[#8B1A1A] to-[#4A0E0E] py-[120px] relative overflow-hidden flex flex-col items-center justify-center min-h-[800px]">
      
      {/* Portrait in background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[80%] z-0 flex items-end justify-center mix-blend-luminosity opacity-80 pointer-events-none">
        <Image
          src="/photo.jpg"
          alt="Designing with Purpose"
          width={600}
          height={800}
          sizes="(max-width: 768px) 100vw, 600px"
          className="object-cover h-full w-auto object-bottom"
        />
        {/* Dark overlay at bottom */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#4A0E0E] to-transparent"></div>
      </div>

      <div className="relative z-10 text-center flex flex-col items-center mt-[30vh]">
        <h2 className="text-[clamp(40px,6vw,90px)] font-[800] leading-[1] text-white tracking-[-0.03em] uppercase mb-6 max-w-[1200px]">
          DESIGNING WITH PURPOSE
        </h2>
        
        <p className="text-white/90 text-[18px] font-medium leading-[1.6] max-w-[600px] mb-10 text-center">
          From research to high-fidelity prototypes, I craft experiences that delight users and drive results. My work blends creativity, usability, and strategy.
        </p>

        <a
          href="https://calendly.com/siserpratap"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-[#0D0505] px-6 py-3 rounded-full text-sm font-bold flex items-center gap-4 hover:scale-105 transition-transform shadow-2xl"
        >
          Schedule a Free Call
          <span className="bg-gradient-to-b from-[#FF4B1F] to-[#FF6A21] w-8 h-8 rounded-full text-white flex items-center justify-center text-sm">
            ↗
          </span>
        </a>
      </div>

    </section>
  )
}

export default FeatureBanner