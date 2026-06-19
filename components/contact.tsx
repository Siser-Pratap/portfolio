"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Mail, Phone } from "lucide-react"
import emailjs from '@emailjs/browser';
import { Canvas } from "@react-three/fiber"
import { MyModel } from "./MyModel"
import { OrbitControls } from "@react-three/drei"
import {  Suspense } from "react";
import {  useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import type { ComponentProps } from "react";
import * as THREE from "three";


const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [loading, setloading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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

  

  useEffect(() => {
    const element = document.querySelector(".email");
    if (!element) return;

    const handleMouseEnter = () => {
      
      const mailElement = document.querySelector('.mail');
      if (mailElement) {
        mailElement.textContent = "Click to Email";
      }
    };

    const handleMouseLeave = () => {
      const mailElement = document.querySelector('.mail');
      if (mailElement) {
        mailElement.textContent = "Email";
      }
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      
      
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Helper for random points in sphere
  function randomInSphere(array: Float32Array, { radius }: { radius: number }) {
    for (let i = 0; i < array.length; i += 3) {
      let u = Math.random();
      let v = Math.random();
      let theta = 2 * Math.PI * u;
      let phi = Math.acos(2 * v - 1);
      let r = radius * Math.cbrt(Math.random());
      array[i] = r * Math.sin(phi) * Math.cos(theta);
      array[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      array[i + 2] = r * Math.cos(phi);
    }
    return array;
  }

  

  const Stars: React.FC<ComponentProps<typeof Points>> = (props) => {
    const ref = useRef<THREE.Points>(null);
    const [sphere] = useState<Float32Array>(() => randomInSphere(new Float32Array(5000), { radius: 1.2 }));

    useFrame((state, delta) => {
      if (ref.current) {
        ref.current.rotation.x -= delta / 10;
        ref.current.rotation.y -= delta / 15;
      }
    });

    return (
      <group rotation={[0, 0, Math.PI / 4]}>
        <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
          <PointMaterial
            transparent
            color='#f272c8'
            size={0.002}
            sizeAttenuation={true}
            depthWrite={false}
          />
        </Points>
      </group>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setloading(true);
    emailjs.send('service_x9a1382', 'template_m25ij2i', {from_name:formData.name, to_name: "Siser", from_email:formData.email, to_email:"jay.siserpratap@gmail.com", message:`message:${formData.message} , Email: ${formData.email} and Phone: ${formData.phone}`} ,'f_VZUB9-gBXWtZ5v1' ).then(
      () => {
        setloading(false);
        alert("Thank You. I will get back to you as soon as possible");
      setFormData({
        name:"", email:"", message:"" ,phone:"",
      });
    }, (error) => {
      setloading(false)
      console.log(error);
      }
    );
    
  }

  const handleEmail = () => {
    window.location.href = "mailto:siserinsevoc@gmail.com"
  }

  return (
    <section id="contact" ref={sectionRef} className="py-32 bg-transparent overflow-x-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 animate-slide-in-y">
          <span className="text-xs md:text-sm font-light tracking-[0.3em] uppercase text-white/40 mb-3 block">
            SAY HELLO
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
            CONTACT
          </h2>
        </div>

        <div className="flex items-center justify-center lg:flex-row flex-col lg:gap-16 gap-8">
          {/* 3D Model Display */}
          <div className="h-[40vh] lg:w-[40vw] w-[80vw] z-10">
            <Canvas camera={{ position: [0, 0, 5] }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <MyModel />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={4} />
            </Canvas>
          </div>
          
          <div className="w-full max-w-lg z-10">
            <Card className="contact-item glass-card border-none relative overflow-hidden p-2">
              <div className="glass-card-glow" />
              <CardContent className="p-6 relative z-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-white/[0.02] border border-white/[0.08] hover:border-white/20 focus:border-white/40 w-full hover:shadow-lg rounded-lg text-white placeholder-white/30 transition-all duration-300"
                    required
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-white/[0.02] border border-white/[0.08] hover:border-white/20 focus:border-white/40 w-full hover:shadow-lg rounded-lg text-white placeholder-white/30 transition-all duration-300"
                    required
                  />
                  <Input
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-white/[0.02] border border-white/[0.08] hover:border-white/20 focus:border-white/40 w-full hover:shadow-lg rounded-lg text-white placeholder-white/30 transition-all duration-300"
                  />
                  <Textarea
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="bg-white/[0.02] border border-white/[0.08] hover:border-white/20 focus:border-white/40 w-full hover:shadow-lg rounded-lg text-white placeholder-white/30 transition-all duration-300 py-4 resize-none"
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full rounded-full border border-white/20 hover:border-white/60 bg-white/[0.04] text-white hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 interactive"
                  >
                    {loading ? "Sending..." : "SEND MESSAGE"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex items-center justify-center md:flex-row flex-col gap-6 mt-12">
          <Card className="contact-item glass-card border-none relative overflow-hidden min-w-[280px]">
            <div className="glass-card-glow" />
            <CardContent className="p-6 flex items-center space-x-4 relative z-10">
              <div className="w-12 h-12 bg-white/[0.04] border border-white/[0.08] rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white/85" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">MY LOCATION</span>
                <p className="text-white/80 font-medium">New Delhi, India</p>
              </div>
            </CardContent>
          </Card>

          <Card onClick={handleEmail} className="contact-item email glass-card border-none cursor-pointer relative overflow-hidden min-w-[280px]">
            <div className="glass-card-glow" />
            <CardContent className="p-6 flex items-center space-x-4 relative z-10">
              <div className="w-12 h-12 bg-white/[0.04] border border-white/[0.08] rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-white/85" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase block mail">E-MAIL</span>
                <p className="text-white/80 font-medium">siserinsevoc@gmail.com</p>
              </div>
            </CardContent>
          </Card>
        </div>

        </div>
        
        

        
      
    </section>
  )
}

export default Contact
