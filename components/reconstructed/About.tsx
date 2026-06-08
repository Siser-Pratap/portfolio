"use client"

import Image from "next/image"

const About = () => {
  return (
    <section id="about" className="w-full bg-[#F7F7F7] py-[120px]">
      <div className="max-w-[1400px] mx-auto px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">
          
          {/* Left: Large Image */}
          <div className="w-full h-auto aspect-[4/5] relative rounded-[24px] overflow-hidden bg-[#0D0505]">
            {/* Red gradient background inside image container */}
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
              Building brands that express quietly, grow naturally, and outlive fleeting trends.
            </h2>
            
            <p className="text-[#0D0505]/70 text-[16px] leading-[1.8] mb-10 max-w-[90%]">
              Crafting brand systems, art direction, and product stories with bold simplicity. The process is quiet and collaborative—strategy → craft → system—ensuring every deliverable has purpose, scales across touchpoints, and stays free of unnecessary complexity.
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <span className="px-6 py-2 rounded-full bg-gradient-to-r from-[#FF4B1F] to-[#FF6A21] text-white text-xs font-semibold tracking-wide">
                Strategy → Craft → System
              </span>
              <span className="px-6 py-2 rounded-full bg-[#0D0505] text-white text-xs font-semibold tracking-wide">
                Working worldwide
              </span>
              <span className="px-6 py-2 rounded-full bg-[#0D0505] text-white text-xs font-semibold tracking-wide">
                Q4 '25
              </span>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between border-t border-[#EAEAEA] pt-12">
              <div className="flex flex-col items-start">
                <span className="text-[48px] font-[800] text-[#0D0505] leading-none mb-2">75+</span>
                <span className="text-xs text-[#8A8A8A] font-medium">Project Done</span>
              </div>
              <div className="w-[1px] h-12 bg-[#EAEAEA]"></div>
              <div className="flex flex-col items-center">
                <span className="text-[48px] font-[800] text-[#0D0505] leading-none mb-2">99%</span>
                <span className="text-xs text-[#8A8A8A] font-medium">Happy Customer</span>
              </div>
              <div className="w-[1px] h-12 bg-[#EAEAEA]"></div>
              <div className="flex flex-col items-end">
                <span className="text-[48px] font-[800] text-[#0D0505] leading-none mb-2">30+</span>
                <span className="text-xs text-[#8A8A8A] font-medium">Global clients</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default About