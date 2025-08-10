"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import WhatIDo from "@/components/what-i-do";
import RecentWork from "@/components/recent-work";
import Portfolio from "@/components/portfolio";
import Team from "@/components/team";
import Skills from "@/components/skills";
import Loader from "@/components/loader";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import SectionWithStars from "@/components/sectionWrapper";
import Experience from "@/components/experience";
import TopSection from "@/components/topSection";

// Register GSAP plugins once in the browser
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* -------- GSAP page‑load + global scroll effects -------- */
  useEffect(() => {
    if (isLoading || !mainRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(".page-content", { opacity: 0 });
      gsap.to(".page-content", { opacity: 1, duration: 1, ease: "power2.out" });

      gsap.utils.toArray(".fade-up").forEach(el => {
        gsap.fromTo(
          el as Element,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el as Element,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      gsap.utils.toArray(".fade-in").forEach(el => {
        gsap.fromTo(
          el as Element,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el as Element,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, mainRef);

    return () => ctx.revert();
  }, [isLoading]);

  /* -------- IntersectionObserver slide‑in‑x effect -------- */
  useEffect(() => {
    if (isLoading) return;

    const items = document.querySelectorAll(".animate-slide-in-x");
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.5 },
    );

    items.forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;

    const items = document.querySelectorAll(".animate-slide-in-y");
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.5 },
    );

    items.forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, [isLoading]);

  /* ------------------------- RENDER ----------------------- */
  if (isLoading) {
    return <Loader onLoadComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="bg-black text-white overflow-hidden">
      <div ref={mainRef} className="page-content overflow-hidden">
        <TopSection />
        <SectionWithStars className="z-12 bg-black">
          <WhatIDo />
          <RecentWork />
          <Experience />
          <Portfolio />
          <Team />
          <Skills />
          <Contact />
          <Footer />
        </SectionWithStars>
      </div>
    </div>
  );
}
