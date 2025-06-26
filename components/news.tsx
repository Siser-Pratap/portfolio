"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import Image from "next/image"
import { Calendar } from "lucide-react"

const News = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  const articles = [
    {
      title: "The Future of Web Animation",
      excerpt: "Exploring new possibilities in web animation and interactive design.",
      date: "March 15, 2024",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "Design Systems That Scale",
      excerpt: "Building maintainable design systems for growing teams.",
      date: "February 28, 2024",
      image: "/placeholder.svg?height=300&width=400",
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".news-card", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 bg-stone-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-light text-stone-800 mb-16 text-center">News</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {articles.map((article, index) => (
              <article key={index} className="news-card group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-6">
                  <Image
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center text-sm text-stone-500 mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  {article.date}
                </div>
                <h3 className="text-xl font-medium text-stone-800 mb-3 group-hover:text-amber-600 transition-colors duration-300">
                  {article.title}
                </h3>
                <p className="text-stone-600 leading-relaxed">{article.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default News
