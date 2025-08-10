import { backend, creator, web, mobile } from "@/public"

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