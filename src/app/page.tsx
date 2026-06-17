"use client";

import { useState } from "react";
import Header from "@/components/reconstructed/Header";
import Hero from "@/components/reconstructed/Hero";
import ClientLogos from "@/components/reconstructed/ClientLogos";
import About from "@/components/reconstructed/About";
import Services from "@/components/reconstructed/Services";
import Experience from "@/components/reconstructed/Experience";
import Skills from "@/components/reconstructed/Skills";
import Projects from "@/components/reconstructed/Projects";
import GitHubActivity from "@/components/reconstructed/GitHubActivity";
import FeatureBanner from "@/components/reconstructed/FeatureBanner";
import Testimonials from "@/components/reconstructed/Testimonials";
import Blogs from "@/components/reconstructed/Blogs";
import Contact from "@/components/reconstructed/Contact";
import Footer from "@/components/reconstructed/Footer";
import Loader from "@/components/reconstructed/Loader";
import ChatAssistant from "@/components/reconstructed/ChatAssistant";
import TerminalMode from "@/components/reconstructed/TerminalMode";
import CodeShowcase from "@/components/reconstructed/CodeShowcase";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main className="bg-[#0D0505] text-[#FFFFFF] min-h-screen overflow-x-hidden font-sans relative">
      <Loader onLoadComplete={() => setIsLoading(false)} />
      <ChatAssistant />
      <TerminalMode />

      <div className={`transition-opacity duration-1000 ${isLoading ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
        <Header />
        <Hero />
        <ClientLogos />
        <About />
        <Services />
        <Experience />
        <Skills />
        <Projects />
        <GitHubActivity />
        <CodeShowcase />
        <FeatureBanner />
        <Testimonials />
        <Blogs />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
