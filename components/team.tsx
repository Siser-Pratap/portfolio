"use client"


import { Card, CardContent } from "@/components/ui/card"
import { teamMembers } from "@/constants/constant"

import Image from "next/image"

const Team = () => {
  

  
  
  return (
    <section id="socials"  className="py-24 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-slide-in-x">
          <h2 className="c text-2xl md:text-2xl font-bold mb-8">
            <span className="text-purple-600/75 rounded-full px-6 py-4 hover:text-white shadow-lg shadow-purple-500/25">
              SOCIALS
            </span>
          </h2>
        </div>

        <div className="flex justify-center items-center">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className="animate-slide-in-y bg-black  border-transparent shadow-lg shadow-purple-500/25"
            >
              <CardContent className="p-8 text-center">
                <div className="relative mb-6 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={300}
                    height={300}
                    className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-purple-600/75"
                  />
                </div>

                <h3 className="text-xl font-bold text-white mb-2 ">
                  {member.name}
                </h3>
                <p className="text-white/80 mb-6">{member.role}</p>

                <div className="flex justify-center space-x-3">
                  {member.social.map((social, socialIndex) => (
                    <a
                      key={socialIndex}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-700/50 rounded-full flex items-center justify-center hover:bg-purple-600/75 transition-colors duration-300 interactive"
                    >
                      <social.icon className="w-4 h-4 text-white" />
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
