"use client"

const Footer = () => {
  return (
    <footer className="w-full bg-[#110A0A] pt-[120px] pb-10 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[40px] mb-[120px]">
          
          {/* Left Statement */}
          <div className="md:col-span-5 flex flex-col">
            <span className="text-[#8A8A8A] text-xs font-semibold mb-4 tracking-wide uppercase">What's your brand waiting for?</span>
            <h2 className="text-[32px] md:text-[40px] font-[500] leading-[1.2] text-white">
              Create a Striking Visual<br />
              Identity That Leaves a<br />
              Lasting Impression.
            </h2>
          </div>

          {/* Right Links Grid */}
          <div className="md:col-span-7 grid grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-[#8A8A8A] text-xs font-semibold mb-2">Contact</span>
              {/* TODO: Replace with real phone number */}
              <span className="text-white text-sm">+91 XXXXX XXXXX</span>
              <a href="mailto:siserinsevoc@gmail.com" className="text-white text-sm hover:text-[#FF4B1F] transition-colors">siserinsevoc@gmail.com</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[#8A8A8A] text-xs font-semibold mb-2">Menu</span>
              <a href="#about" className="text-white text-sm hover:text-[#FF4B1F] transition-colors">About</a>
              <a href="#services" className="text-white text-sm hover:text-[#FF4B1F] transition-colors">Service</a>
              <a href="#article" className="text-white text-sm hover:text-[#FF4B1F] transition-colors">Article</a>
              <a href="#works" className="text-white text-sm hover:text-[#FF4B1F] transition-colors flex items-center gap-1">Work <span className="bg-white text-black text-[10px] px-1 rounded-sm leading-none font-bold">↗</span></a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[#8A8A8A] text-xs font-semibold mb-2">Follow</span>
              <a href="#" className="text-white text-sm hover:text-[#FF4B1F] transition-colors">Instagram</a>
              <a href="#" className="text-white text-sm hover:text-[#FF4B1F] transition-colors">Youtube</a>
              <a href="#" className="text-white text-sm hover:text-[#FF4B1F] transition-colors">Dribbble</a>
              <a href="#" className="text-white text-sm hover:text-[#FF4B1F] transition-colors">Behance</a>
            </div>
          </div>

        </div>

        {/* Massive Logo */}
        <div className="w-full flex justify-center items-center mt-auto border-t border-[#FFFFFF]/10 pt-10">
          <h1 className="text-[clamp(80px,18vw,300px)] font-[800] italic tracking-[-0.05em] text-white leading-none m-0 p-0 text-center">
            Siser.
          </h1>
        </div>

      </div>
    </footer>
  )
}

export default Footer