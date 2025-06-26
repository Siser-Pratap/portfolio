"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import Image from "next/image"

const Blog = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  const blogPosts = [
    {
      title: "THERE ARE MANY VARIATIONS OF PASSAGES LABLE",
      excerpt:
        "Aliquam egestas pellentesque est. Etiam a orci Nulla id enim feugiat ligula scelerisque. Morbi eu luctus nisl.",
      date: "11 May 2017",
      image: "/placeholder.svg?height=250&width=400",
    },
    {
      title: "THERE ARE MANY VARIATIONS OF PASSAGES LABLE",
      excerpt:
        "Aliquam egestas pellentesque est. Etiam a orci Nulla id enim feugiat ligula scelerisque. Morbi eu luctus nisl.",
      date: "11 May 2017",
      image: "/placeholder.svg?height=250&width=400",
    },
    {
      title: "THERE ARE MANY VARIATIONS OF PASSAGES LABLE",
      excerpt:
        "Aliquam egestas pellentesque est. Etiam a orci Nulla id enim feugiat ligula scelerisque. Morbi eu luctus nisl.",
      date: "11 May 2017",
      image: "/placeholder.svg?height=250&width=400",
    },
  ]

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".blog-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="blog" ref={sectionRef} className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="fade-up text-4xl md:text-6xl font-bold mb-8">
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              OUR BLOGS
            </span>
          </h2>
          <p className="fade-up text-xl text-white/70">
            The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic
            words etc.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Card
              key={index}
              className="blog-card bg-gray-800/50 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 group interactive overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center text-orange-400 text-sm mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  {post.date}
                </div>
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-orange-400 transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                <button className="text-orange-400 hover:text-orange-300 font-medium interactive">Read more</button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Blog
