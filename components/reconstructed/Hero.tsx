"use client"

import Image from "next/image"

const Hero = () => {
  return (
    <section className="relative w-full h-[100vh] min-h-[800px] flex items-center justify-center bg-[#0D0505] overflow-hidden pt-20">
      {/* Red/Orange Circle Backdrop */}
      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55vh] h-[55vh] md:w-[65vh] md:h-[65vh] rounded-full bg-gradient-to-b from-[#FF4B1F] to-[#FF6A21] z-0 blur-[2px]"></div>

      {/* Portrait */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[75%] z-10 flex items-end justify-center pointer-events-none">
        {/* Using the user's photo.jpg */}
        <Image 
          src="/photo.jpg" 
          alt="Siser Pratap" 
          width={800} 
          height={1000} 
          className="object-cover h-full w-auto object-bottom rounded-t-[400px]" 
          priority
        />
        {/* Bottom fade to blend with background if it's not a cutout */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0D0505] to-transparent"></div>
      </div>

      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-10 flex flex-col md:flex-row justify-between items-center h-full pb-32">
        {/* Left Typography */}
        <div className="flex flex-col items-start w-full md:w-1/2 pointer-events-auto">
          <span className="text-[#FFFFFF] text-lg font-medium mb-4">Hey! I Am</span>
          <h1 className="text-[clamp(64px,9vw,140px)] font-[800] leading-[0.85] tracking-[-0.05em] uppercase text-white m-0 p-0 drop-shadow-2xl">
            CREATIVE<br />DEVELOPER
          </h1>
        </div>
        
        {/* Right Info */}
        <div className="w-full md:w-1/3 flex flex-col items-start md:items-end text-left md:text-left mt-auto md:mt-0 md:pt-40 pointer-events-auto">
          <p className="text-white/90 text-[16px] leading-[1.8] mb-6 text-left max-w-[320px] font-medium drop-shadow-lg">
            Portfolio of Siser Pratap — Software innovator crafting digital experiences with bold simplicity.
          </p>
          <div className="flex bg-white rounded-full p-2 pl-6 items-center w-full max-w-[320px] justify-between cursor-pointer hover:scale-[1.02] transition-transform shadow-2xl">
            <span className="text-black font-semibold text-sm">Schedule a Free Call</span>
            <button className="bg-gradient-to-b from-[#FF4B1F] to-[#FF6A21] w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
              ↗
            </button>
          </div>
        </div>
      </div>

      {/* Services Strip */}
      <div className="absolute bottom-12 left-0 w-full z-20 border-t border-white/10 pt-8">
        <div className="max-w-[1400px] mx-auto px-10 flex flex-wrap justify-between items-center text-white/90 text-sm font-semibold tracking-wide">
          <div className="flex items-center gap-2"><span className="text-[#FF4B1F] italic">// 01</span> Frontend</div>
          <div className="flex items-center gap-2"><span className="text-[#FF4B1F] italic">// 02</span> Backend</div>
          <div className="flex items-center gap-2"><span className="text-[#FF4B1F] italic">// 03</span> Full Stack Software</div>
          <div className="flex items-center gap-2"><span className="text-[#FF4B1F] italic">// 04</span> UI Design</div>
          <div className="flex items-center gap-2"><span className="text-[#FF4B1F] italic">// 05</span> 3D Elements</div>
        </div>
      </div>
    </section>
  )
}

export default Hero