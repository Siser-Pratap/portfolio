"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Projects from "./projects"
import { ExternalLink, Github } from "lucide-react"

const Portfolio = () => {
  const projectRef = useRef<HTMLDivElement>(null)
  const [activeFilter, setActiveFilter] = useState("All")

  const filters = ["All", "Frontend", "Backend", "FullStack", "Algorithmic"]

  const portfolioItems = [
    { category: "Frontend", image: "/placeholder.svg?height=300&width=400" , title: "Task Management App",
      description: "Collaborative task management with real-time updates and team features",
      technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
      liveUrl: "#",
      githubUrl: "#",},
    { category: "Backend", image: "/placeholder.svg?height=300&width=400", title: "Task Management App",
      description: "Collaborative task management with real-time updates and team features",
      technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
      liveUrl: "#",
      githubUrl: "#", },
    { category: "FullStack", image: "/placeholder.svg?height=300&width=400", title: "Task Management App",
      description: "Collaborative task management with real-time updates and team features",
      technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
      liveUrl: "#",
      githubUrl: "#", },
    { category: "Algorithmic", image: "/placeholder.svg?height=300&width=400", title: "Task Management App",
      description: "Collaborative task management with real-time updates and team features",
      technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
      liveUrl: "#",
      githubUrl: "#", },
    { category: "Backend", image: "/placeholder.svg?height=300&width=400", title: "Task Management App",
      description: "Collaborative task management with real-time updates and team features",
      technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
      liveUrl: "#",
      githubUrl: "#", },
  ]

 

  useEffect(() => {
    if (!projectRef.current) return
    if(projectRef.current){
    const ctx = gsap.context(() => {

      const tl = gsap.timeline();

      tl.from('.works', {
        opacity:0,
        y:-500,
        ease:"back.out(1.2)",
        duration:0.5,
        scrollTrigger:{
          trigger:projectRef.current,
          start:"top 50%",
        }
      })
      
      tl.from('.filter-button', {
        opacity:0,
        y:-500,
        ease:"back.out(1.2)",
        duration:0.5,
        stagger:0.5,
        scrollTrigger:{
          trigger:projectRef.current,
          start:"top 45%",
        }
      })
      tl.from('.portfolio-item', {
        opacity:0,
        x:-500
      })
       tl.to('.portfolio-item', {
          opacity:1,
          x:0,
          duration:2,
          ease:"power2.in",
          stagger:0.5,
          scrollTrigger:{
            trigger:projectRef.current, 
            start:"top 40%",
          }
        })

    }, projectRef)
    

    return () => ctx.revert()
  }
  }, [])

  const filteredItems =
    activeFilter === "All" ? portfolioItems : portfolioItems.filter((item) => item.category === activeFilter)

  return (
    <section id="works" ref={projectRef} className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="works text-3xl md:text-2xl font-bold mb-8">
            <span className="text-purple-600/75 rounded-full px-6 py-4 hover:text-white shadow-lg shadow-purple-500/25">
              WORKS
            </span>
          </h2>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 filter-button transition-all duration-300 interactive ${
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
              className="portfolio-item animate-slide-in-x border border-purple-500/25 rounded-lg p-8 transition-all duration-300 group" >

                <div className="relative overflow-hidden">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.category}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
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
