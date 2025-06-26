"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Quote } from "lucide-react"

const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  const testimonials = [
    {
      quote:
        "Sam's creative vision and technical expertise brought our project to life in ways we never imagined possible.",
      author: "Sarah Johnson",
      position: "Creative Director, Studio XYZ",
    },
    {
      quote:
        "Working with Sam was an absolute pleasure. His attention to detail and innovative approach exceeded our expectations.",
      author: "Michael Chen",
      position: "CEO, TechStart Inc.",
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".testimonial-card", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-light text-stone-800 mb-16 text-center">Testimonials</h2>

          <div className="space-y-12">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card text-center">
                <Quote className="w-12 h-12 text-amber-600 mx-auto mb-6" />
                <blockquote className="text-2xl font-light text-stone-700 leading-relaxed mb-8 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <p className="text-lg font-medium text-stone-800">{testimonial.author}</p>
                  <p className="text-stone-600">{testimonial.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
