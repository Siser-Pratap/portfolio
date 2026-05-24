"use client"


import { Card, CardContent } from "@/components/ui/card"
import { teamMembers } from "@/constants/constant"

import Image from "next/image"

const Team = () => {
  

  
  
  return (
    <section id="socials" className="py-32 bg-transparent overflow-x-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 animate-slide-in-x">
          <span className="text-xs md:text-sm font-light tracking-[0.3em] uppercase text-white/40 mb-3 block">
            GET IN TOUCH
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
            SOCIALS
          </h2>
        </div>

        <div className="flex justify-center items-center">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className="animate-slide-in-y glass-card border-none max-w-sm w-full transition-all duration-300 group interactive relative overflow-hidden"
            >
              <div className="glass-card-glow" />
              <CardContent className="p-8 text-center relative z-10">
                <div className="relative mb-6 transition-transform duration-500 group-hover:scale-105">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={300}
                    height={300}
                    className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-white/10 group-hover:border-white/20 transition-all duration-300"
                  />
                </div>

                <h3 className="text-xl font-bold text-white/90 mb-2">
                  {member.name}
                </h3>
                <span className="text-xs font-light tracking-[0.2em] uppercase text-white/40 mb-6 block font-mono">
                  {member.role}
                </span>

                <div className="flex justify-center space-x-3 mt-6">
                  {member.social.map((social, socialIndex) => (
                    <a
                      key={socialIndex}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/[0.04] border border-white/[0.08] hover:bg-white text-white hover:text-black rounded-full flex items-center justify-center transition-colors duration-300 interactive"
                    >
                      <social.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Team
