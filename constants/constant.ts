import { backend, creator, web, mobile } from "@/public"
import {  Twitter, Dribbble, Instagram, Linkedin, Github } from "lucide-react"

export const sections = [
    { id: "home" },
    { id: "about" },
    { id: "services" },
    { id: "experience" },
    { id: "works" },
    { id: "socials" },
    { id: "skills" },
    { id: "contact" },
  ]

export const navItems = [
    { name: "Home", href: "home" },
    { name: "About", href: "about" },
    { name: "Services", href: "services" },
    { name: "Experience", href: "experience" },
    { name: "Works", href: "works" },
    { name: "Socials", href: "socials" },
    { name: "Skills", href: "skills" },
    { name: "Contact", href: "contact" },
  ]

export const services = [
    {
      icon: backend,
      title: "Frontend",
    },
    {
      icon: creator,
      title: "Backend",
    },
    {
      icon: web,
      title: "Full Stack Software",
    },
    {
      icon: mobile,
      title: "UI Design and 3D",
    },
  ]

export const experiences = [
    {
      title: "FreeLancer",
      company: "Self Employed",
      location: "New Delhi, India",
      period: "2023 - Present",
      description:
        "Leading development of scalable web applications using React, Node.js, and cloud technologies. Mentoring junior developers and architecting solutions for complex business requirements.",
      technologies: ["React", "Node.js", "TypeScript", "AWS", "PostgreSQL", "Next.js", "SpringBoot"],
    },
    {
      title: "Software Development Intern",
      company: "Synapsis Medical Technologies",
      location: "Edmonton, Canada",
      period: "February 2025 - April 2025",
      description:
        "Developed responsive web applications and collaborated with design teams to create pixel-perfect user interfaces. Improved application performance by 40%.",
      technologies: ["React", "Vue.js", "SASS", "JavaScript", "Figma"],
    },
    {
      title: "Web Development Intern",
      company: "DC Infotech",
      location: "Mumbai, India",
      period: "Sept 2024 - November 2024",
      description:
        "Built and maintained web applications, participated in code reviews, and contributed to the development of the company's main product platform.",
      technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    },
  ]

export  const portfolioItems = [
    { 
      category: "Frontend", 
      image: "/meetPro.jpg",
      title: "MeetPro",
      description: "Advanced video conferencing app powered by Steam with modern design",
      technologies: ["Next.js", "TypeScript", "Stream", "Tailwind CSS"],
      liveUrl: "https://meetpro-siser-pratap.vercel.app/",
      githubUrl: "https://github.com/Siser-Pratap/meetPro",
    },
    { 
      category: "FullStack", 
      image: "/intelai.jpg", 
      title: "IntelAI",
      description: "A cutting-edge conversational AI platform that combines the power of modern AI models with a beautiful, responsive user interface.",
      technologies: ["Next.js", "TypeScript", "React", "MongoDB", "NodeJS", "ExpressJS"],
      liveUrl: "https://intelai-siser-pratap.vercel.app/",
      githubUrl: "https://github.com/Siser-Pratap/intelai",
    },
    { 
      category: "Backend", 
      image: "/authence.jpg", 
      title: "Authence",
      description: "NPM Package for authentication and authorization in Node.js applications powered by AI.",
      technologies: ["Next.js","Gen-AI","TypeScript", "React", "MongoDB", "NodeJS", "ExpressJS"],
      liveUrl: "https://www.npmjs.com/package/authence",
      githubUrl: "https://github.com/Siser-Pratap/Authence",
    },
    { 
      category: "Frontend", 
      image: "/visionweave.jpg", 
      title: "VisionWeave",
      description: "AI Powered Image Generation Platform with Stunning animation and UI",
      technologies: ["Next.js","Gen-AI API","TypeScript", "React", "MongoDB", "NodeJS", "ExpressJS"],
      liveUrl: "https://visionweave-siser-pratap.vercel.app/",
      githubUrl: "https://github.com/Siser-Pratap/VisionWeave",
    },
    
  ]

export const filters = ["All", "Frontend", "Backend", "FullStack", "Algorithmic"]

export const teamMembers = [
    {
      name: "SISER PRATAP",
      role: "SOFTWARE DEVELOPER",
      image: "/photo.jpg",
      social: [
        { icon: Twitter, link: "https://twitter.com/PratapSiser" },
        { icon: Dribbble, link: "https://calendly.com/siserpratap" },
        { icon: Instagram, link: "https://instagram.com/siser_ins17" },
        { icon: Linkedin, link: "https://linkedin.com/in/siser" },
        {icon: Github, link:"https://github.com/Siser-Pratap"},
      ],
    },
  ]

  export const skills = [
  { name: "HTML5 + CSS3", level: 95 },
  { name: "JQUERY + JAVASCRIPT", level: 75 },
  { name: "BOOTSTRAP", level: 85 },
  { name: "React.js", level: 90 },
  { name: "Next.js", level: 88 },
  { name: "Nest.js", level: 88 },
  { name: "Three.js", level: 88 },
  { name: "Springboot", level: 88 },
  { name: "SQL", level: 88 },
  { name: "Gen-AI", level: 88 },
  { name: "Node.js", level: 85 },
  { name: "Express.js", level: 80 },
  { name: "MongoDB", level: 85 },
  { name: "PostgreSQL", level: 80 },
  { name: "TypeScript", level: 75 },
  { name: "Tailwind CSS", level: 90 },
  { name: "REST API", level: 90 },
]