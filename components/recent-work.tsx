"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Card, CardContent } from "@/components/ui/card"
import { Palette, Smile, Eye, Settings, Globe, Lightbulb } from "lucide-react"

const RecentWork = () => {
  const servicesRef = useRef<HTMLDivElement>(null)

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

  useEffect(()=>{
    const ctx = gsap.context(()=>{

      gsap.from('.service-card', {
        opacity:0,
        x:-50,
      })

      gsap.to('.service-card', {
        opacity:1,
        duration:0.5,
        x:0,
        stagger:0.5,
        ease:"back.out(1.2)",
        scrollTrigger:{
          trigger:servicesRef.current,
          start:"top 10%"
        }
      })
    }, servicesRef);

    return ()=> ctx.revert();

  })

  return (
    <section id="services" ref={servicesRef} className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="fade-up text-4xl md:text-3xl font-bold mb-8">
            <span className="text-purple-600/75 rounded-full p-5 shadow-lg shadow-purple-500/25">
              SERVICES.
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="service-card bg-black/50 border-white/10 hover:border-purple-500/40 transition-all duration-300 group interactive "
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
            <h3 className="text-2xl font-bold text-white mb-4">WANT TO CONNECT ?</h3>
            <p className="text-white/70 mb-6">
              The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic
              words e
            </p>
            <button className="hover:text-black hover:bg-white/80 hover:shadow-transparent  text-white px-8 py-3 rounded-full font-medium interactive shadow-lg shadow-purple-500/25">
              LET'S WORK TOGETHER!
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RecentWork
