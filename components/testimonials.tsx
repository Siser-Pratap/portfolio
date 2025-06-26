"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  const testimonials = [
    {
      quote:
        "Sorem ipsum dolor sit amet, sea in odio erat, volumus oporteat his at, mei ocurreret vulputate ex. Clita prodesset Rem ipsum dolor sit amet, sea in odio erat, volumus oporteat his at, mei ocurreret vulputate ex. Clita prodesset oportere patrioque ne nec Duo cu partem omnesque..",
      author: "LUI JOSEPH",
      role: "WordPress",
    },
    {
      quote:
        "Lorem ipsum dolor sit amet, sea in odio era Clita prodesset Rem ipsum dolor sit amet, s vulputate ex. Clita prodesset oporter",
      author: "JOSEPH L",
      role: "Developer",
    },
  ]

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonial-card",
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.2)",
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
    <section ref={sectionRef} className="py-24 bg-gray-800/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="fade-up text-4xl md:text-6xl font-bold mb-8">
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              WHAT PEOPLE SAY.
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="testimonial-card bg-gray-800/50 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 interactive"
            >
              <CardContent className="p-8">
                <Quote className="w-12 h-12 text-orange-400 mb-6" />
                <blockquote className="text-white/80 leading-relaxed mb-6 italic">"{testimonial.quote}"</blockquote>
                <div>
                  <p className="text-white font-bold">{testimonial.author}</p>
                  <p className="text-orange-400">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
