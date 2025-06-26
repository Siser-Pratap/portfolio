"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { GraduationCap, Award, Calendar } from "lucide-react"

const Education = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  const education = [
    {
      degree: "Master of Computer Science",
      school: "Stanford University",
      period: "2017 - 2019",
      gpa: "3.8/4.0",
      description:
        "Specialized in Human-Computer Interaction and Software Engineering. Thesis on 'Improving User Experience in Web Applications through Advanced Animation Techniques'.",
      achievements: ["Dean's List", "Research Assistant", "Published 2 papers"],
    },
    {
      degree: "Bachelor of Software Engineering",
      school: "University of California, Berkeley",
      period: "2013 - 2017",
      gpa: "3.6/4.0",
      description:
        "Comprehensive study of software development, algorithms, and system design. Active member of the Computer Science Society.",
      achievements: ["Magna Cum Laude", "Hackathon Winner", "Teaching Assistant"],
    },
  ]

  const certifications = [
    "AWS Certified Solutions Architect",
    "Google Cloud Professional Developer",
    "React Advanced Certification",
    "UI/UX Design Specialization",
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".education-item", {
        opacity: 0,
        x: 50,
        duration: 0.8,
        stagger: 0.2,
        delay: 0.3,
      })

      gsap.from(".cert-item", {
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.8,
      })

      // Animate timeline line
      gsap.from(".education-timeline-line", {
        height: 0,
        duration: 1.5,
        ease: "power2.out",
        delay: 0.5,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} className="h-full flex items-center justify-center p-8">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Education
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">Academic background and continuous learning journey</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Education Timeline */}
          <div className="relative">
            <div className="education-timeline-line absolute left-8 top-0 w-0.5 h-full bg-gradient-to-b from-blue-400 to-purple-400"></div>

            <div className="space-y-12">
              {education.map((edu, index) => (
                <div key={index} className="education-item relative pl-20">
                  <div className="absolute left-6 top-6 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-4 border-gray-900"></div>

                  <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <GraduationCap className="w-6 h-6 text-blue-400 mr-3" />
                      <div className="flex items-center text-blue-400 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {edu.period}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">{edu.degree}</h3>
                    <h4 className="text-lg text-white/80 mb-2">{edu.school}</h4>
                    <p className="text-blue-300 mb-4">GPA: {edu.gpa}</p>

                    <p className="text-white/60 mb-6 leading-relaxed">{edu.description}</p>

                    <div className="space-y-2">
                      <h5 className="text-white font-medium">Key Achievements:</h5>
                      <div className="flex flex-wrap gap-2">
                        {edu.achievements.map((achievement, achIndex) => (
                          <span
                            key={achIndex}
                            className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm"
                          >
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 h-full">
              <div className="flex items-center mb-6">
                <Award className="w-8 h-8 text-purple-400 mr-3" />
                <h3 className="text-2xl font-bold text-white">Certifications</h3>
              </div>

              <div className="space-y-4 mb-8">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="cert-item backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 interactive"
                  >
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-3"></div>
                      <span className="text-white/80">{cert}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                <h4 className="text-lg font-bold text-white mb-2">Continuous Learning</h4>
                <p className="text-white/60 text-sm">
                  Always staying updated with the latest technologies and industry best practices through online
                  courses, workshops, and tech conferences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Education
