"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Mail, Phone } from "lucide-react"

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-item",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <section id="contact" ref={sectionRef} className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="fade-up text-4xl md:text-6xl font-bold mb-8">
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              GET IN TOUCH
            </span>
          </h2>
          <p className="fade-up text-xl text-white/70">
            The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic
            words etc.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="contact-item bg-gray-800/50 border-orange-500/20">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">OUR LOCATION</h3>
                  <p className="text-white/70">218, Dreamland, jakatnaka surat.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="contact-item bg-gray-800/50 border-orange-500/20">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">SEND E-MAIL</h3>
                  <p className="text-white/70">info@yourdomailname.com</p>
                </div>
              </CardContent>
            </Card>

            <Card className="contact-item bg-gray-800/50 border-orange-500/20">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">CONTACT US</h3>
                  <p className="text-white/70">+91 (0) 99 87 65 43 21</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="contact-item bg-gray-800/50 border-orange-500/20">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-gray-700/50 border-orange-500/20 text-white placeholder-white/50 focus:border-orange-400"
                  required
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-gray-700/50 border-orange-500/20 text-white placeholder-white/50 focus:border-orange-400"
                  required
                />
                <Input
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="bg-gray-700/50 border-orange-500/20 text-white placeholder-white/50 focus:border-orange-400"
                />
                <Input
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="bg-gray-700/50 border-orange-500/20 text-white placeholder-white/50 focus:border-orange-400"
                  required
                />
                <Textarea
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="bg-gray-700/50 border-orange-500/20 text-white placeholder-white/50 focus:border-orange-400 resize-none"
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white interactive"
                >
                  SEND MESSAGE
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default Contact
