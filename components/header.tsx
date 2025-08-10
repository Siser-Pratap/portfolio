"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Menu, X } from "lucide-react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { navItems } from "@/constants/constant"


const Header = () => {
  const headerRef = useRef<HTMLElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const backRef = useRef<HTMLDivElement>(null)
  const menuTl = useRef<gsap.core.Timeline | null>(null)
  gsap.registerPlugin(ScrollTrigger);
  const [scroll, setScrolled] = useState(false);
  
  useEffect(() => {
    const element = document.querySelector(".name");
    if (!element) return;

    const handleMouseEnter = () => {
      gsap.to('.element', {
        rotate: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    

    element.addEventListener("mouseenter", handleMouseEnter);
    

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      
    };
  }, []);

  useEffect(() => {
    // Handle scroll effect
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!headerRef.current) return

    const ctx = gsap.context(() => {
      gsap.set(".nav-item", { opacity: 0, y: -20 })
      gsap.set(".nav", {opacity:0, y:-20})

      const tl = gsap.timeline();

      tl.from(".element", {
        opacity:0,
        y: -45,
        duration:1,
        delay:0.2,
        ease:"power2.out"
    })
      tl.to(".element", {
        rotate:-25,
        duration:0.5,
        opacity:1,
        y:0
      })
      tl.to(".nav", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.5,
        ease: "power2.out",
      })
      tl.to(".nav-item", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.5,
        ease: "power2.out",
      })
      
    });

    return () => ctx.revert()
  }, [])

  const scrollToAbout = (href:string)=> {
  document.getElementById(`${href}`)?.scrollIntoView({
    behavior: "smooth"
    });
  }
 
  useEffect(() => {
    if (!backRef.current) return
  if (!menuTl.current) {
      menuTl.current = gsap.timeline({ paused: true })
        .from(backRef.current, {
          opacity: 0,
          duration: 0,
        })
        .to(backRef.current, {
          opacity: 1,
          scale: '1.05',
          duration: 0.2,
          ease: "back.out(1)",
        })
        .set('.back-nav-item', { opacity: 0 })
        .fromTo(
          ".back-nav-item",
          { opacity: 0, x: -400 },
          { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
        );
    }

    if (isMenuOpen) {
      menuTl.current.play();
    } else {
      gsap.to('.back-nav-item', {
        opacity: 0,
        x: -400,
        duration: 0.5,
        ease: "power2.in",
      })
    }

    // Cleanup on unmount
    return () => {
      menuTl.current && menuTl.current.kill();
      menuTl.current = null;
    };
  }, [isMenuOpen]);

  return (
    <header ref={headerRef} className={`fixed overflow-x-hidden w-auto top-0 left-0 right-0 transition-all duration-300 z-40 p-6 ${scroll ? " bg-black py-2" : "bg-transparent py-4"}`}>
      <div className="max-w-7xl mx-auto ">
        <div className=" color  rounded-2xl px-6 py-4 ">
          <div className="flex items-center justify-between gap-[32px]">
            {/* Logo */}
            <div className="flex flex-row gap-0 hover:scale-105 name">
              <h1 className="text-4xl nav underline font-bold text-white/80 hover:text-white interactive">
                Sis</h1><span className="text-[#4204c7] text-4xl font-bold transform rotate-45 element">e</span>
              <h1 className="text-4xl nav underline font-bold text-white/80 hover:text-white interactive">r</h1>  
              
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToAbout(item.href)}
                  className="nav-item text-white/80  hover:text-white hover:scale-105 hover:text-2xl transition-all duration-300 relative group interactive"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4204c7] transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white interactive nav-item">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          { isMenuOpen && 
          <div ref={backRef} className="back overflow-x-hidden w-full h-[80vh]  overflow-y-hidden rounded-sm relative bg-black border border-purple-500/25  mt-10 mr-10">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-[120px] opacity-20 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-400 rounded-full filter blur-[100px] opacity-20 animate-pulse"></div>
            <div className='flex items-center back-nav justify-center gap-[20px]  h-full w-full flex-col'>
                    {
                      navItems.map((item, index)=>(
                        <button 
                          key={index}
                          onClick={()=>{
                            setIsMenuOpen(false); scrollToAbout(item.href)}}
                          className="m-[0.3rem] back-nav-item opacity-0 text-white/80  hover:text-white hover:scale-105 hover:text-2xl transition-all duration-300 relative group interactive"
                        >
                          {item.name}
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4204c7] transition-all duration-300 group-hover:w-full" />
                          </button>
                       ))
                      
                    }
                </div>
            </div>
            
          
      }
        </div>
      </div>
    </header>
  )
}

export default Header
