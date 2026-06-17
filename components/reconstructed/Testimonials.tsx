"use client"

import { useState } from "react"
import { testimonials } from "@/constants/constant"
import Image from "next/image"

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const current = testimonials[activeIndex]

  return (
    <section className="w-full bg-[#FFFFFF] py-[120px]">
      <div className="max-w-[1400px] mx-auto px-10">

        <div className="flex justify-between items-center mb-16">
          <h2 className="text-[56px] font-[700] text-[#0D0505] tracking-tight leading-none">
            Words From Clients
          </h2>
          <span className="text-[#8A8A8A] text-sm font-medium italic">{'(/ Testimonial )'}</span>
        </div>

        <div className="max-w-[800px] mx-auto bg-white rounded-[24px] shadow-[0_10px_60px_-15px_rgba(0,0,0,0.05)] border border-[#EAEAEA] p-12">

          {/* Header of Card */}
          <div className="flex justify-between items-start mb-10">
            <div className="flex items-center gap-6">
              <span className="text-[#0D0505] font-semibold text-lg">
                [{String(activeIndex + 1).padStart(2, "0")}]
              </span>
              <div className="w-16 h-16 rounded-lg overflow-hidden relative">
                <Image src={current.image} alt={current.author} fill className="object-cover" />
              </div>
              <div>
                <h4 className="text-[20px] font-[700] text-[#0D0505] flex items-center gap-2">
                  <span className="w-4 h-px bg-[#0D0505]"></span> {current.author}
                </h4>
                <p className="text-[#8A8A8A] text-sm mb-1">{current.role}{current.company ? `, ${current.company}` : ""}</p>
                <div className="flex gap-1 text-[#FF4B1F]">★★★★★</div>
              </div>
            </div>

            <div className="text-[#EAEAEA] text-[100px] leading-none font-serif mt-[-20px]">"</div>
          </div>

          {/* Quote */}
          <p className="text-[#0D0505]/80 text-[24px] leading-[1.6] font-medium max-w-[600px]">
            {current.quote}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-end gap-6 mt-10 max-w-[800px] mx-auto">
          {testimonials.map((t, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`text-sm font-semibold transition-colors ${
                i === activeIndex ? "text-[#0D0505]" : "text-[#8A8A8A] hover:text-[#0D0505]"
              }`}
            >
              {t.author.split(" ")[0]} {t.author.split(" ")[1]?.[0]}.
            </button>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Testimonials
