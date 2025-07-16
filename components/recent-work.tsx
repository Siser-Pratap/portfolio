"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Card, CardContent } from "@/components/ui/card"
import { Palette, Smile, Eye, Settings, Globe, Lightbulb } from "lucide-react"
import Image from "next/image"
import { backend, creator, web, mobile } from "@/public"
import { ScrollSmoother } from "gsap/ScrollSmoother"



const RecentWork = () => {
  const servicesRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLSpanElement>(null)

  const services = [
    {
      icon: backend,
      title: "Frontend",
    },
    {
      icon: creator,
      title: "Backend",
    },
    {
      icon: web,
      title: "Full Stack Software",
    },
    {
      icon: mobile,
      title: "UI Design and 3D",
    },
    
  ]

  useEffect(()=>{
    const ctx = gsap.context(()=>{

      const tl = gsap.timeline();

      tl.fromTo(
        sectionRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start:"top 50%",
            
          },
        },
      )
      .from('.service-card', {
        opacity:0,
        x:-50,
      })
      .to('.service-card', {
        opacity:1,
        duration:0.5,
        x:0,
        stagger:0.5,
        ease:"back.out(1.2)",
        scrollTrigger:{
          trigger:servicesRef.current,
          start:"top 55%",
        }
      })
      .from('.hello', {
        opacity:0,
        x:-50,
      })
      .to('.hello', {
        opacity:1,
        duration:0.5,
        x:0,
        stagger:0.5,
        ease:"back.out(1.2)",
        scrollTrigger:{
          trigger:servicesRef.current,
          start:"top 80%",
        }
      })
    }, servicesRef);

    return ()=> ctx.revert();

  })

  const scrollToAbout = (href:string)=> {
  document.getElementById(`${href}`)?.scrollIntoView({
    behavior: "smooth"
    });
  }  

  return (
    <section id="services" ref={servicesRef} className="py-24 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-2xl font-bold mb-8">
            <span ref={sectionRef} className="text-purple-600/75 section-title hover:text-white/80 rounded-full px-6 py-4 shadow-lg shadow-purple-500/25">
              SERVICES.
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="animate-slide-in-y bg-black/50 border-transparent transition-all duration-300 group interactive "
            >
              <CardContent className="p-8 text-center hover:text-white hover:scale-125">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Image width="8" height="8" alt='technologies' src={service.icon}  className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white/80 mb-4 hover:text-purple-600/75 transition-all duration-300">
                  {service.title}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt- 6 rounded-full">
          <div className=" hello bg-cover bg-black/50 border-transparent rounded-full p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">WANT TO CONNECT ?</h3>
            <p className="text-white/70 mb-6">
              'Cause connection builds Future
            </p>
            <button
              onClick={() => {
                scrollToAbout('contact')
              }}
              className="hover:text-black hover:bg-white/80 hover:shadow-transparent  text-white px-8 py-3 rounded-full font-medium interactive shadow-lg shadow-purple-500/25"
            >
              LET'S WORK TOGETHER!
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RecentWork
