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
    <section id="contact" ref={sectionRef} className="py-24 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="works text-3xl md:text-2xl font-bold mb-8">
            <span className="text-purple-600/75 rounded-full px-6 py-4 hover:text-white shadow-lg shadow-purple-500/25">
              Get In Touch
            </span>
          </h2>
        </div>

        <div className="flex items-center justify-center md:flex-row flex-col md:gap-[4rem] gap-8">
          {/* Contact Info */}
            <div className="h-[50vh] md:w-[50vw] w-[60vw] ">
                <Canvas camera={{ position: [0, 0, 5] }}>
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[5, 5, 5]} intensity={1} />
                    <MyModel />
                    <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={4} />
                </Canvas>
              </div>
          
              
            
              <div className="xl:flex-row flex-col-reverse pb-0  flex gap-10 ">
                <div className="flex-[0.75] bg-black-100 rounded-2xl">
                  <Card className="contact-item bg-black border-transparent">
                    <CardContent >
                      <form onSubmit={handleSubmit} className="space-y-8">
                        <Input
                          name="name"
                          placeholder="Name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="bg-black w-[30vw] hover:shadow-lg rounded-lg hover:shadow-purple-500/25 text-white placeholder-white/50 border-transparent"
                          required
                        />
                        <Input
                          name="email"
                          type="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="bg-black w-full hover:shadow-lg rounded-lg hover:shadow-purple-500/25 text-white placeholder-white/50 border-transparent  "
                          required
                        />
                        <Input
                          name="phone"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="bg-black w-full hover:shadow-lg rounded-lg hover:shadow-purple-500/25 text-white placeholder-white/50 border-transparent  "
                        />
                        <Textarea
                          name="message"
                          placeholder="Message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={8}
                          className="bg-black w-full hover:shadow-lg rounded-lg hover:shadow-purple-500/25 text-white placeholder-white/50 border-transparent  py-4"
                          required
                        />
                        <Button
                          type="submit"
                          className="w-full rounded-full border-purple-600/75 shadow-lg shadow-purple-500/25 text-white interactive "
                        >
                          {loading ? "Sending..." : "SEND MESSAGE"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

        <div className="flex items-center justify-center md:flex-row flex-col gap-8 mt-8" >
            <Card className="contact-item bg-black border-transparent ">
              <CardContent className="p-6 flex items-center space-x-4 shadow-lg shadow-purple-500/25">
                <div className="w-12 h-12 bg-purple-500/25 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-600/75" />
                </div>
                <div >
                  <h3 className="text-white font-bold mb-1">MY LOCATION</h3>
                  <p className="text-white/70">New Delhi, India</p>
                </div>
              </CardContent>
            </Card>

            <Card onClick={handleEmail} className="contact-item email bg-black border-transparent cursor-pointer ">
              <CardContent className="p-6 flex items-center space-x-4 shadow-lg shadow-purple-500/25">
                <div className="w-12 h-12 bg-purple-500/25 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-purple-600/75" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1 mail">E-MAIL</h3>
                  <p className="text-white/70">siserinsevoc@gmail.com</p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
        
        

        
      
    </section>
  )
}

export default Contact
