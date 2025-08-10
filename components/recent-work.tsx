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
    <section id="services"  className="py-24 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center animate-slide-in-y mb-16">
          <h2 className="text-2xl md:text-2xl font-bold mb-8">
            <span  className="text-purple-600/75 section-title hover:text-white/80 rounded-full px-6 py-4 shadow-lg shadow-purple-500/25">
              SERVICES.
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="animate-slide-in-x bg-black/50 border-transparent transition-all duration-300 group interactive "
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

        <div className="text-center mt-6 animate-slide-in-y rounded-full">
          <div className=" hello bg-cover  bg-black/50 border-transparent rounded-full p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold animate-slide-in-x text-white mb-4">WANT TO CONNECT ?</h3>
            <p className="text-white/70 mb-6 animate-slide-in-x">
              'Cause connection builds Future
            </p>
            <button
              onClick={() => {
                scrollToAbout('contact')
              }}
              className="hover:text-black animate-slide-in-x hover:bg-white/80 hover:shadow-transparent  text-white px-8 py-3 rounded-full font-medium interactive shadow-lg shadow-purple-500/25"
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
