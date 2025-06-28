"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Card, CardContent } from "@/components/ui/card"
import { Facebook, Twitter, Dribbble, Instagram, Linkedin } from "lucide-react"
import Image from "next/image"

const Team = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  const teamMembers = [
    {
      name: "SISER PRATAP",
      role: "SOFTWARE DEVELOPER",
      image: "/placeholder.svg?height=300&width=300",
      social: [Facebook, Twitter, Dribbble, Instagram, Linkedin],
    },
    
  ]

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".team-card",
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
    <section id="team" ref={sectionRef} className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="fade-up text-4xl md:text-3xl font-bold mb-8">
            <span className="text-purple-600/75 rounded-full p-5 pr-7 pl-7 shadow-lg shadow-purple-500/25">
              SOCIALS
            </span>
          </h2>
          <p className="fade-up text-xl text-white/70">
            The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic
            words etc.
          </p>
        </div>

        <div className="flex justify-center items-center">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className="team-card bg-black  border-transparent shadow-lg shadow-purple-500/25"
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
                  {member.social.map((Social, socialIndex) => (
                    <a
                      key={socialIndex}
                      href="#"
                      className="w-10 h-10 bg-gray-700/50 rounded-full flex items-center justify-center hover:bg-purple-600/75 transition-colors duration-300 interactive"
                    >
                      <Social className="w-4 h-4 text-white" />
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
