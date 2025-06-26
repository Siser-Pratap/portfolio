"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ExternalLink, Github } from "lucide-react"

const Projects = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const ribbonRef = useRef<HTMLDivElement>(null)

  const featuredProjects = [
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with React, Node.js, and Stripe integration",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      title: "Task Management App",
      description: "Collaborative task management with real-time updates and team features",
      technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
      liveUrl: "#",
      githubUrl: "#",
    },
  ]

  const otherProjects = [
    "Weather Dashboard",
    "Social Analytics",
    "Portfolio Website",
    "Chat Application",
    "Blog Platform",
    "Music Player",
    "Recipe Finder",
    "Expense Tracker",
    "Todo Application",
    "Image Gallery",
    "News Aggregator",
    "Fitness Tracker",
  ]

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(".featured-project", {
        opacity: 0,
        y: 50,
      })

      // Animate featured projects
      gsap.to(".featured-project", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        delay: 0.3,
        ease: "power2.out",
      })

      // Animate ribbon
      const ribbon = ribbonRef.current
      if (ribbon) {
        const diceCards = ribbon.querySelectorAll(".dice-card")

        if (diceCards.length > 0) {
          // Set initial positions and rotations
          gsap.set(diceCards, {
            x: (i) => i * 200 - 400,
            rotationX: 45,
            rotationY: 45,
            rotationZ: 15,
            transformStyle: "preserve-3d",
          })

          // Continuous movement
          gsap.to(diceCards, {
            x: "+=1600",
            duration: 20,
            repeat: -1,
            ease: "none",
            modifiers: {
              x: (x) => {
                const parsed = Number.parseFloat(x)
                return parsed > 1200 ? parsed - 1600 + "px" : x
              },
            },
          })

          // Floating animation
          gsap.to(diceCards, {
            y: "random(-10, 10)",
            duration: "random(2, 4)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: {
              amount: 2,
              from: "random",
            },
          })
        }
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} className="h-full flex flex-col justify-center items-center p-8 relative overflow-hidden">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">Featured work and creative solutions</p>
        </div>

        {/* Featured Projects */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {featuredProjects.map((project, index) => (
            <div
              key={index}
              className="featured-project backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="h-48 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-xl mb-6 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <div className="text-6xl font-bold text-white/20">{index + 1}</div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-pink-400 transition-colors duration-300">
                {project.title}
              </h3>
              <p className="text-white/70 mb-6 leading-relaxed">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-3 py-1 bg-gradient-to-r from-pink-500/20 to-red-500/20 border border-pink-500/30 rounded-full text-pink-300 text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex space-x-4">
                <a
                  href={project.liveUrl}
                  className="interactive flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </a>
                <a
                  href={project.githubUrl}
                  className="interactive flex items-center space-x-2 px-4 py-2 backdrop-blur-md bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  <Github className="w-4 h-4" />
                  <span>Code</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Other Projects Section */}
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white/80 mb-4">Other Projects</h3>
          <p className="text-white/60">Hover over the dice to explore more projects</p>
        </div>
      </div>

      {/* Dice Ribbon */}
      <div className="absolute bottom-20 left-0 right-0 h-32 overflow-hidden">
        <div ref={ribbonRef} className="relative h-full">
          {otherProjects.map((project, index) => (
            <div
              key={index}
              className="dice-card absolute w-24 h-24 cursor-pointer interactive group"
              style={{
                perspective: "1000px",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className="w-full h-full relative transition-all duration-500 group-hover:scale-125 group-hover:-translate-y-8"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Dice faces */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/80 to-pink-500/80 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center transform translate-z-12">
                  <span className="text-white text-xs font-bold text-center px-2 leading-tight">{project}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/80 to-red-500/80 backdrop-blur-md border border-white/20 rounded-lg transform rotateY-90 translate-z-12">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/80 to-purple-500/80 backdrop-blur-md border border-white/20 rounded-lg transform rotateY-180 translate-z-12">
                  <div className="w-full h-full flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/80 to-blue-500/80 backdrop-blur-md border border-white/20 rounded-lg transform rotateY-270 translate-z-12">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-1">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/80 to-orange-500/80 backdrop-blur-md border border-white/20 rounded-lg transform rotateX-90 translate-z-12">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-1">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div></div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/80 to-pink-500/80 backdrop-blur-md border border-white/20 rounded-lg transform rotateX-270 translate-z-12">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-1">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover tooltip */}
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm whitespace-nowrap">
                  {project}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instruction */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/40 text-sm">
        Scroll to explore • Use arrow keys for navigation
      </div>
    </div>
  )
}

export default Projects
