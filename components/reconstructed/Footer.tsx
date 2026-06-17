"use client"

import { motion } from "framer-motion"
import { SETTINGS } from "@/constants/settings"

const linkClass = "text-[#0D0505] dark:text-white text-sm hover:text-[#FF4B1F] transition-colors"

const Footer = () => {
  return (
    <footer className="w-full bg-[#F7F7F7] dark:bg-[#110A0A] pt-[120px] pb-10 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-10">

        <motion.div
          className="grid grid-cols-1 md:grid-cols-12 gap-[40px] mb-[120px]"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Left Statement */}
          <div className="md:col-span-5 flex flex-col">
            <span className="text-[#8A8A8A] text-xs font-semibold mb-4 tracking-wide uppercase">What's your brand waiting for?</span>
            <h2 className="text-[32px] md:text-[40px] font-[500] leading-[1.2] text-[#0D0505] dark:text-white">
              Create a Striking Visual<br />
              Identity That Leaves a<br />
              Lasting Impression.
            </h2>
          </div>

          {/* Right Links Grid */}
          <div className="md:col-span-7 grid grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-[#8A8A8A] text-xs font-semibold mb-2">Contact</span>
              <span className="text-[#0D0505] dark:text-white text-sm">{SETTINGS.phone}</span>
              <a href={`mailto:${SETTINGS.email}`} className={linkClass}>{SETTINGS.email}</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[#8A8A8A] text-xs font-semibold mb-2">Menu</span>
              <a href="#about" className={linkClass}>About</a>
              <a href="#services" className={linkClass}>Service</a>
              <a href="#article" className={linkClass}>Article</a>
              <a href="#works" className={`${linkClass} flex items-center gap-1`}>
                Work <span className="bg-[#0D0505] dark:bg-white text-white dark:text-black text-[10px] px-1 rounded-sm leading-none font-bold">↗</span>
              </a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[#8A8A8A] text-xs font-semibold mb-2">Follow</span>
              <a href="#" className={linkClass}>Instagram</a>
              <a href="#" className={linkClass}>Youtube</a>
              <a href="#" className={linkClass}>Dribbble</a>
              <a href="#" className={linkClass}>Behance</a>
            </div>
          </div>
        </motion.div>

        {/* Massive Logo */}
        <motion.div
          className="w-full flex justify-center items-center mt-auto border-t border-[#0D0505]/10 dark:border-white/10 pt-10"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <h1 className="text-[clamp(80px,18vw,300px)] font-[800] italic tracking-[-0.05em] text-[#0D0505] dark:text-white leading-none m-0 p-0 text-center">
            Siser.
          </h1>
        </motion.div>

      </div>
    </footer>
  )
}

export default Footer
