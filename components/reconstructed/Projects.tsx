"use client"

import { portfolioItems } from "@/constants/constant"
import Image from "next/image"

const Projects = () => {
  const featured = portfolioItems[0]
  const rest = portfolioItems.slice(1, 5) // Get up to 4 items for the grid

  return (
    <section id="works" className="w-full bg-[#FFFFFF] py-[120px]">
      <div className="max-w-[1400px] mx-auto px-10">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div className="flex flex-col">
            <span className="text-[#8A8A8A] text-sm font-medium mb-6 italic">{'(/ Project )'}</span>
            <h2 className="text-[56px] font-[700] leading-[1.1] text-[#0D0505] tracking-tight">
              Best Project
            </h2>
          </div>
          <span className="text-[24px] font-[600] text-[#0D0505]">©2025</span>
        </div>

        {/* Featured Project */}
        {featured && (
          <div className="w-full h-[600px] relative rounded-[24px] overflow-hidden mb-[32px]">
            <Image 
              src={featured.image || "/placeholder.svg"} 
              alt={featured.title} 
              fill 
              className="object-cover"
            />
            <div className="absolute top-6 left-6">
              <span className="bg-white text-[#0D0505] px-4 py-2 rounded-full text-xs font-semibold">
                {featured.category}
              </span>
            </div>
          </div>
        )}

        {/* Grid Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px]">
          {rest.map((project, index) => (
            <div key={index} className="w-full aspect-[4/3] relative rounded-[24px] overflow-hidden">
              <Image 
                src={project.image || "/placeholder.svg"} 
                alt={project.title} 
                fill 
                className="object-cover"
              />
              <div className="absolute top-6 left-6">
                <span className="bg-white text-[#0D0505] px-4 py-2 rounded-full text-xs font-semibold">
                  {project.category}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Projects