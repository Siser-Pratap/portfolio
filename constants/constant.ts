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
      description: "Responsive, accessible UIs built with React and Next.js — fast, pixel-perfect, and production-ready.",
    },
    {
      icon: creator,
      title: "Backend",
      description: "Scalable server-side systems, REST APIs, and cloud-native architectures using Node.js, NestJS, and SpringBoot.",
    },
    {
      icon: web,
      title: "Full Stack Software",
      description: "End-to-end product development — from database schema design to deployed, monitored production app.",
    },
    {
      icon: mobile,
      title: "AI Agents & ML Models",
      description: "Intelligent AI agents designed to automate workflows, enhance decision-making, and deliver human-like interactions.",
    },
  ]

export const experiences = [
    {
      title: "Software Development Engineer",
      company: "M37Labs",
      location: "Gurugram, India — OnSite",
      period: "Jan 2026 – Present",
      bullets: [
        "Developed scalable full-stack applications using the MERN stack, FastAPI, and Django; partnered with the largest Jewellery and Clothes retail stores to translate requirements into high-performance, user-centric solutions.",
        "Designed enterprise-grade Generative AI SaaS platforms leveraging LLMs, Prompt Engineering, and Computer Vision for clients across Malaysia and the US, ensuring cross-functional alignment and scalable architecture.",
        "Built production-ready AI inference pipelines with model fine-tuning, human-in-the-loop feedback, and optimised backend integrations to improve accuracy, latency, and deployment reliability.",
      ],
      technologies: ["MERN Stack", "FastAPI", "Django", "LLMs", "Computer Vision", "AWS", "TypeScript"],
    },
    {
      title: "SDE Intern",
      company: "M37Labs",
      location: "Gurugram, India — OnSite",
      period: "Sept 2025 – Dec 2025",
      bullets: [
        "Architected end-to-end LLM-powered and vision-based AI systems with structured prompt pipelines and evaluation frameworks for performance optimisation.",
        "Integrated AI microservices with scalable FastAPI services for seamless deployment across cloud-native environments.",
        "Collaborated on AWS-based deployments, CI/CD automation, and technical documentation to deliver robust, production-grade AI systems.",
      ],
      technologies: ["FastAPI", "LLMs", "AWS", "CI/CD", "Computer Vision", "Python"],
    },
    {
      title: "SDE Intern",
      company: "Synapsis Medical Technologies",
      location: "Edmonton, Canada — Remote",
      period: "Feb 2025 – Apr 2025",
      bullets: [
        "Built 5+ backend APIs in Nest.js supporting authentication, appointment tracking, and core application modules.",
        "Developed an end-to-end testing framework using React.js, improving bug detection speed and reducing integration defects by 65%.",
        "Integrated 3D medical simulation visuals using Three.js, React Three Fiber (R3F), and GSAP, enhancing high-fidelity user interaction.",
      ],
      technologies: ["Nest.js", "React.js", "Three.js", "React Three Fiber", "GSAP", "TypeScript"],
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
  // Languages
  { name: "JavaScript",      level: 90 },
  { name: "TypeScript",      level: 85 },
  { name: "Python",          level: 85 },
  { name: "Java",            level: 72 },
  { name: "C++",             level: 68 },
  { name: "SQL",             level: 80 },
  { name: "HTML + CSS",      level: 90 },
  // Frameworks & Libraries
  { name: "React.js",        level: 92 },
  { name: "Next.js",         level: 88 },
  { name: "Node.js",         level: 85 },
  { name: "Express.js",      level: 82 },
  { name: "Nest.js",         level: 80 },
  { name: "Three.js",        level: 78 },
  { name: "TensorFlow",      level: 70 },
  { name: "PyTorch",         level: 70 },
  { name: "Scikit-learn",    level: 72 },
  // Cloud & DevOps
  { name: "AWS",             level: 80 },
  { name: "Docker",          level: 75 },
  { name: "Kubernetes",      level: 65 },
  { name: "Git + GitHub",    level: 90 },
  // Databases
  { name: "MongoDB",         level: 82 },
  { name: "MySQL",           level: 78 },
  // Core Concepts
  { name: "REST APIs",       level: 88 },
  { name: "Microservices",   level: 75 },
  { name: "Generative AI",   level: 82 },
  { name: "Computer Vision", level: 78 },
  { name: "NLP",             level: 75 },
  { name: "System Design",   level: 75 },
]
export const testimonials = [
  {
    quote: "Design direction that brings clarity and depth. It's not just about visuals—it's about crafting experiences that linger long after the first impression",
    author: "Sophiea Dee",
    role: "Product Lead, Next-p",
    image: "/photo.jpg",
  },
  {
    quote: "Working with Siser transformed our digital presence. Highly professional, creative, and always exceeds expectations.",
    author: "Michael Chen",
    role: "Founder",
    company: "StartUp Co.",
    image: "/photo.jpg",
  },
  {
    quote: "A true digital innovator. Siser's work is not just functional but also beautifully designed. Highly recommend!",
    author: "Emma Williams",
    role: "CEO",
    company: "Design Studio",
    image: "/photo.jpg",
  },
]
