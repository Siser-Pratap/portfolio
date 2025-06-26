"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Card } from "@/components/ui/card"
import Image from "next/image"

const Portfolio = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
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
    if (!sectionRef.current) return

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
            trigger: sectionRef.current,
            start: "top 80%",
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const filteredItems =
    activeFilter === "All" ? portfolioItems : portfolioItems.filter((item) => item.category === activeFilter)

  return (
    <section id="portfolio" ref={sectionRef} className="py-24 bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="fade-up text-4xl md:text-6xl font-bold mb-8">
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              PORTFOLIO
            </span>
          </h2>

          {/* Filter Buttons */}
          <div className="fade-up flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full transition-all duration-300 interactive ${
                  activeFilter === filter
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                    : "bg-gray-800/50 text-white/70 hover:text-orange-400 border border-orange-500/20"
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
                <div className="absolute inset-0 bg-gradient-to-t from-orange-500/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <span className="text-white font-medium">{item.category}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="fade-up bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-full font-medium interactive">
            VIEW MORE PORTFOLIO
          </button>
        </div>
      </div>
    </section>
  )
}

export default Portfolio
