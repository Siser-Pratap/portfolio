"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Code, Palette, Zap, Heart } from "lucide-react"

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  const skills = [
    { icon: Code, title: "Development", description: "Full-stack development with modern technologies" },
    { icon: Palette, title: "Design", description: "Creating beautiful and intuitive user interfaces" },
    { icon: Zap, title: "Performance", description: "Optimizing applications for speed and efficiency" },
    { icon: Heart, title: "Passion", description: "Dedicated to delivering exceptional user experiences" },
  ]

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([".about-content", ".skill-card"], {
        opacity: 0,
        y: 30,
      })

      // Animate when component mounts
      const tl = gsap.timeline({ delay: 0.3 })

      tl.to(".about-content", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
      }).to(
        ".skill-card",
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.2)",
        },
        "-=0.4",
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} className="h-full flex items-center justify-center p-8">
      {/* Rest of component remains the same */}
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="about-content text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">About Me</span>
          </h2>
          <p className="about-content text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            I'm a passionate developer with 5+ years of experience creating digital solutions that combine technical
            excellence with creative design.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="about-content backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">My Journey</h3>
            <p className="text-white/70 leading-relaxed mb-4">
              Started as a curious student exploring the intersection of technology and creativity. Over the years, I've
              evolved into a full-stack developer who believes in the power of clean code and beautiful design.
            </p>
            <p className="text-white/70 leading-relaxed">
              I specialize in React, Node.js, and modern web technologies, always staying updated with the latest trends
              and best practices in the industry.
            </p>
          </div>

          <div className="about-content backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">What I Do</h3>
            <ul className="space-y-3 text-white/70">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-3"></span>
                Frontend Development (React, Next.js, TypeScript)
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-3"></span>
                Backend Development (Node.js, Python, PostgreSQL)
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-3"></span>
                UI/UX Design (Figma, Adobe Creative Suite)
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-3"></span>
                Mobile Development (React Native)
              </li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="skill-card backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 interactive"
            >
              <skill.icon className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
              <h4 className="text-xl font-bold text-white mb-2">{skill.title}</h4>
              <p className="text-white/60 text-sm">{skill.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default About
