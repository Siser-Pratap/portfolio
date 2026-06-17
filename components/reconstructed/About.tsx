"use client"

import Image from "next/image"

const About = () => {
  return (
    <section id="about" className="w-full bg-[#F7F7F7] py-[120px]">
      <div className="max-w-[1400px] mx-auto px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">

          {/* Left: Large Image */}
          <div className="w-full h-auto aspect-[4/5] relative rounded-[24px] overflow-hidden bg-[#0D0505]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF4B1F]/40 to-transparent z-0"></div>
            <Image
              src="/photo.jpg"
              alt="About Siser"
              fill
              className="object-cover z-10 mix-blend-luminosity opacity-90"
            />
          </div>

          {/* Right: Content */}
          <div className="flex flex-col pt-10">
            <span className="text-[#8A8A8A] text-sm font-medium mb-6 italic">{'(/ About )'}</span>

            <h2 className="text-[56px] font-[700] leading-[1.1] text-[#0D0505] mb-8 tracking-tight">
              Building software that scales, performs, and actually ships.
            </h2>

            <p className="text-[#0D0505]/70 text-[16px] leading-[1.8] mb-10 max-w-[90%]">
              Full Stack Developer with a focus on React, Next.js, Node.js, and cloud-native architectures. I work across the entire stack — from database schema to deployed product — with a strong eye for UI and a bias toward simplicity. I've shipped production apps for clients across India, Canada, and beyond.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <span className="px-6 py-2 rounded-full bg-gradient-to-r from-[#FF4B1F] to-[#FF6A21] text-white text-xs font-semibold tracking-wide">
                Design → Build → Deploy
              </span>
              <span className="px-6 py-2 rounded-full bg-[#0D0505] text-white text-xs font-semibold tracking-wide">
                Working worldwide
              </span>
              <span className="px-6 py-2 rounded-full bg-[#0D0505] text-white text-xs font-semibold tracking-wide">
                Available Now
              </span>
            </div>

            {/* TODO: Add your resume PDF to /public/resume.pdf then this button goes live */}
            <a
              href="/resume.pdf"
              download
              className="flex items-center gap-3 w-fit mb-16 group"
            >
              <div className="bg-[#0D0505] text-white px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-3 hover:bg-[#FF4B1F] transition-colors">
                Download Resume
                <span className="bg-white/10 group-hover:bg-white/20 w-7 h-7 rounded-full flex items-center justify-center text-sm transition-colors">
                  ↓
                </span>
              </div>
            </a>

            {/* Stats Row */}
            <div className="flex items-center justify-between border-t border-[#EAEAEA] pt-12 mt-0">
              <div className="flex flex-col items-start">
                <span className="text-[48px] font-[800] text-[#0D0505] leading-none mb-2">75+</span>
                <span className="text-xs text-[#8A8A8A] font-medium">Projects Shipped</span>
              </div>
              <div className="w-[1px] h-12 bg-[#EAEAEA]"></div>
              <div className="flex flex-col items-center">
                <span className="text-[48px] font-[800] text-[#0D0505] leading-none mb-2">3+</span>
                <span className="text-xs text-[#8A8A8A] font-medium">Years Experience</span>
              </div>
              <div className="w-[1px] h-12 bg-[#EAEAEA]"></div>
              <div className="flex flex-col items-end">
                <span className="text-[48px] font-[800] text-[#0D0505] leading-none mb-2">30+</span>
                <span className="text-xs text-[#8A8A8A] font-medium">Global Clients</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default About
