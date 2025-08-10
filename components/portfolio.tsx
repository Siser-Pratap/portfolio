"use client"

import {useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { ExternalLink, Github } from "lucide-react"
import { portfolioItems, filters} from "@/constants/constant"

const Portfolio = () => {
  const projectRef = useRef<HTMLDivElement>(null)
  const [activeFilter, setActiveFilter] = useState("All")
  const filteredItems =
    activeFilter === "All" ? portfolioItems : portfolioItems.filter((item) => item.category === activeFilter)

  return (
    <section id="works" ref={projectRef} className="py-24 bg-black overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="animate-slide-in-y text-3xl md:text-2xl font-bold mb-8">
            <span className="text-purple-600/75 rounded-full px-6 py-4 hover:text-white shadow-lg shadow-purple-500/25">
              WORKS
            </span>
          </h2>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 fade-in animate-slide-in-x transition-all duration-300 interactive ${
                  activeFilter === filter
                    ? "text-purple-600/75 rounded-full p-4 shadow-lg shadow-purple-500/25"
                    : " text-white/80 bg-black"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {filteredItems.map((project, index) => (
            <Card
              key={index}
              className=" animate-slide-in-x border border-purple-500/25 rounded-lg p-8 transition-all duration-300 group" >

                <div className="relative overflow-hidden ">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.category}
                      width={400}
                      height={300}
                      className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <span className="text-white font-medium">{project.category}</span>
                      </div>
                </div>
                <h3 className="md:text-2xl text-xl font-bold text-white/80 mb-3 group-hover:text-white transition-colors duration-300">
                        {project.title}
                </h3>
                <p className="text-white/70 mb-6 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-3 py-1 bg-black shadow-md shadow-purple-600/75  rounded-full text-white/80 text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                </div> 
                 <div className="flex space-x-4">
                        <a
                          href={project.liveUrl}
                          className="interactive flex items-center space-x-2 px-4 py-2 bg-black text-white  rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Live Demo</span>
                        </a>
                        <a
                          href={project.githubUrl}
                          className="interactive flex items-center space-x-2 px-4 py-2 s bg-black  text-white rounded-full hover:shadow-lg hover:shadow-purple-500/25  transition-all duration-300"
                        >
                          <Github className="w-4 h-4" />
                          <span>Code</span>
                        </a>
                </div>
              </Card>
          ))}
        </div>

        

        
      </div>
    </section>
  )
}

export default Portfolio
