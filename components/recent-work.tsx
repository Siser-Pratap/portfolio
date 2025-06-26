"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Card, CardContent } from "@/components/ui/card"
import { Palette, Smile, Eye, Settings, Globe, Lightbulb } from "lucide-react"

const RecentWork = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  const services = [
    {
      icon: Palette,
      title: "PERFECT DESIGN",
      description: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.",
    },
    {
      icon: Smile,
      title: "EASY & FUN",
      description: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.",
    },
    {
      icon: Eye,
      title: "RETINA READY",
      description: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.",
    },
    {
      icon: Settings,
      title: "EASY TO CUSTOMIZE",
      description: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.",
    },
    {
      icon: Globe,
      title: "TRANSLATION READY",
      description: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.",
    },
    {
      icon: Lightbulb,
      title: "INVENTIVE ELEMENTS",
      description: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.",
    },
  ]

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".service-card",
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
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

  return (
    <section id="services" ref={sectionRef} className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="fade-up text-4xl md:text-6xl font-bold mb-8">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              RECENT WORK.
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="service-card bg-black/50 border-white/10 hover:border-purple-500/40 transition-all duration-300 group interactive"
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {service.title}
                </h3>
                <p className="text-white/70 leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="fade-up backdrop-blur-md bg-black/50 border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">WANT TO WORK WITH US ?</h3>
            <p className="text-white/70 mb-6">
              The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic
              words e
            </p>
            <button className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-medium interactive shadow-lg shadow-purple-500/25">
              LET'S WORK TOGETHER!
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RecentWork
