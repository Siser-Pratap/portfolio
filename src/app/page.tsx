"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollSmoother } from "gsap/ScrollSmoother"
import CustomCursor from "@/components/custom-cursor"
import BubbleBackground from "@/components/bubble-background"
import Header from "@/components/header"
import Hero from "@/components/hero"
import WhatIDo from "@/components/what-i-do"
import RecentWork from "@/components/recent-work"
import Portfolio from "@/components/portfolio"
import Team from "@/components/team"
import Skills from "@/components/skills"
import Check from "@/components/check"


import Contact from "@/components/contact"
import Footer from "@/components/footer"
import SectionIndicator from "@/components/section-indicator"
import SectionWithStars from "@/components/sectionWrapper"
import Experience from "@/components/experience"
import Exp from "@/components/experience"


// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
}

export default function Home() {
  const smoothWrapperRef = useRef<HTMLDivElement>(null)
  const smoothContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let smoother: any

    const ctx = gsap.context(() => {
      // Initialize ScrollSmoother
      smoother = ScrollSmoother.create({
        wrapper: smoothWrapperRef.current,
        content: smoothContentRef.current,
        smooth: 1,
        effects: true,
        smoothTouch: 0.1,
      })

      // Global scroll animations
      gsap.utils.toArray(".fade-up").forEach((element: any) => {
        gsap.fromTo(
          element,
          {
            opacity: 0,
            y: 100,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          },
        )
      })

      gsap.utils.toArray(".fade-in").forEach((element: any) => {
        gsap.fromTo(
          element,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          },
        )
      })
    })

    return () => {
      ctx.revert()
      if (smoother) smoother.kill()
    }
  }, [])

  return (
    <div
      className="bg-black text-white overflow-x-hidden"
      
    >
      <CustomCursor />
      <SectionIndicator />
      <Header />
      <div ref={smoothWrapperRef} id="smooth-wrapper">
      <div ref={smoothContentRef} id="smooth-content">
        {/* <Hero /> */}
        {/* <SectionWithStars> */}
          {/* <WhatIDo />
          <RecentWork />
          <Experience />
          <Portfolio />
          <Team /> */}
          <Skills />
          <Contact />
          <Footer />
        {/* </SectionWithStars> */}
      </div>
      </div>
    </div>
  )
}
