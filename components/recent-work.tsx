"use client"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { services } from "@/constants/constant"

const RecentWork = () => {
 

const scrollToAbout = (href:string)=> {
  document.getElementById(`${href}`)?.scrollIntoView({
    behavior: "smooth"
    });
  }  

  return (
    <section id="services" className="py-32 overflow-x-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center animate-slide-in-y mb-20">
          <span className="text-xs md:text-sm font-light tracking-[0.3em] uppercase text-white/40 mb-3 block">
            CAPABILITIES
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
            SERVICES
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {services.map((service, index) => (
            <Card
              key={index}
              className="animate-slide-in-x glass-card border-none transition-all duration-300 group interactive relative overflow-hidden"
            >
              <div className="glass-card-glow" />
              <CardContent className="p-8 text-center relative z-10">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Image width="32" height="32" alt={service.title} src={service.icon} className="w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-lg font-bold text-white/80 mb-2 group-hover:text-white transition-all duration-300">
                  {service.title}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-6 animate-slide-in-y">
          <div className="glass-card p-12 max-w-2xl mx-auto text-center border-none relative overflow-hidden">
            <div className="glass-card-glow" />
            <span className="text-xs font-light tracking-[0.3em] uppercase text-white/40 mb-3 block relative z-10">
              GET IN TOUCH
            </span>
            <h3 className="text-2xl md:text-3xl font-bold animate-slide-in-x bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent mb-4 relative z-10">
              WANT TO CONNECT?
            </h3>
            <p className="text-white/50 mb-8 animate-slide-in-x font-light relative z-10">
              'Cause connection builds the future.
            </p>
            <button
              onClick={() => {
                scrollToAbout('contact')
              }}
              className="border border-white/20 hover:border-white/60 rounded-full bg-white/[0.04] text-white px-8 py-3 font-medium interactive shadow-lg shadow-purple-500/10 transform transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 relative z-10"
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
