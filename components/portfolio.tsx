"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Card } from "@/components/ui/card"
import Image from "next/image"

const Portfolio = () => {
  const projectRef = useRef<HTMLDivElement>(null)
  const [activeFilter, setActiveFilter] = useState("All")

  const filters = ["All", "Illustration", "Vector Design", "Photography", "Web Design"]

  const portfolioItems = [
    { category: "Web Design", image: "/placeholder.svg?height=300&width=400" },
    { category: "Illustration", image: "/placeholder.svg?height=300&width=400" },
    { category: "Photography", image: "/placeholder.svg?height=300&width=400" },
    { category: "Vector Design", image: "/placeholder.svg?height=300&width=400" },
    { category: "Web Design", image: "/placeholder.svg?height=300&width=400" },
    { category: "Photography", image: "/placeholder.svg?height=300&width=400" },
    { category: "Illustration", image: "/placeholder.svg?height=300&width=400" },
    { category: "Vector Design", image: "/placeholder.svg?height=300&width=400" },
  ]

  useEffect(() => {
    if (!projectRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".portfolio-item",
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: projectRef.current,
            start: "top 20%",
          },
        },
      )
    }, projectRef)

    return () => ctx.revert()
  }, [])

  const filteredItems =
    activeFilter === "All" ? portfolioItems : portfolioItems.filter((item) => item.category === activeFilter)

  return (
    <section id="portfolio" ref={projectRef} className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="fade-up text-4xl md:text-3xl font-bold mb-8">
            <span className="text-purple-600/75 rounded-full p-5 shadow-lg shadow-purple-500/25">
              PROJECTS
            </span>
          </h2>

          {/* Filter Buttons */}
          <div className="fade-up flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2  transition-all duration-300 interactive ${
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <Card
              key={index}
              className="portfolio-item bg-gray-800/50 border-orange-500/20 overflow-hidden group hover:border-orange-500/40 transition-all duration-300 interactive"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.category}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <span className="text-white font-medium">{item.category}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        
      </div>
    </section>
  )
}

export default Portfolio
