"use client"

import { services } from "@/constants/constant"
import Image from "next/image"
import { motion } from "framer-motion"

const Services = () => {
  return (
    <section id="services" className="w-full bg-[#FFFFFF] py-[120px]">
      <div className="max-w-[1400px] mx-auto px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">

          {/* Left Content */}
          <motion.div
            className="flex flex-col max-w-[500px]"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[#8A8A8A] text-sm font-medium mb-6 italic">{"(/ Service )"}</span>

            <h2 className="text-[56px] font-[700] leading-[1.1] text-[#0D0505] mb-6 tracking-tight">
              Engineering innovation, one line at a time.
            </h2>

            <p className="text-[#8A8A8A] text-[16px] leading-[1.8] mb-12">
              Helping businesses craft products, systems, and experiences that connect simply and effectively.
            </p>

            <a
              href="https://calendly.com/siserpratap"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0D0505] text-white px-6 py-3 rounded-full text-sm font-medium flex items-center justify-between w-[220px] hover:bg-[#FF4B1F] transition-colors"
            >
              Schedule a Free Call
              <span className="bg-white text-black w-6 h-6 rounded-full flex items-center justify-center text-xs">↗</span>
            </a>
          </motion.div>

          {/* Right Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
            {services.map((service, index) => {
              const isActive = index === 0

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                    delay: index * 0.08,
                  }}
                  className={`p-8 rounded-[24px] flex flex-col justify-between aspect-[4/3] border ${
                    isActive
                      ? "bg-gradient-to-b from-[#FF4B1F] to-[#FF6A21] border-transparent"
                      : "bg-[#F7F7F7] border-[#EAEAEA]"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-12 bg-[#0D0505] overflow-hidden">
                    <Image
                      src={service.icon}
                      alt={service.title}
                      width={22}
                      height={22}
                      className="object-contain invert"
                    />
                  </div>

                  <div>
                    <h3 className={`text-[20px] font-[700] mb-2 leading-tight ${isActive ? "text-white" : "text-[#0D0505]"}`}>
                      {service.title}
                    </h3>
                    <p className={`text-[12px] leading-relaxed ${isActive ? "text-white/80" : "text-[#8A8A8A]"}`}>
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}

export default Services
