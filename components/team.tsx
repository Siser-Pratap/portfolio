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
      name: "JOSEPH LUI",
      role: "PHP DEVELOPER",
      image: "/placeholder.svg?height=300&width=300",
      social: [Facebook, Twitter, Dribbble, Instagram, Linkedin],
    },
    {
      name: "JOSEPH LUI",
      role: "PHP DEVELOPER",
      image: "/placeholder.svg?height=300&width=300",
      social: [Facebook, Twitter, Dribbble, Instagram, Linkedin],
    },
    {
      name: "JOSEPH LUI",
      role: "PHP DEVELOPER",
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
          <h2 className="fade-up text-4xl md:text-6xl font-bold mb-8">
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              CREATIVE TEAM
            </span>
          </h2>
          <p className="fade-up text-xl text-white/70">
            The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic
            words etc.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className="team-card bg-gray-800/50 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 group interactive"
            >
              <CardContent className="p-8 text-center">
                <div className="relative mb-6 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={300}
                    height={300}
                    className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-orange-500/20"
                  />
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-orange-400 mb-6">{member.role}</p>

                <div className="flex justify-center space-x-3">
                  {member.social.map((Social, socialIndex) => (
                    <a
                      key={socialIndex}
                      href="#"
                      className="w-10 h-10 bg-gray-700/50 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors duration-300 interactive"
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
