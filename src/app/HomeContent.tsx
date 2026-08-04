"use client";

import dynamic from "next/dynamic";

// Above the fold — statically imported so they are server-rendered into the
// initial HTML and available to crawlers without a round trip.
import Header from "@/components/reconstructed/Header";
import Hero from "@/components/reconstructed/Hero";
import ClientLogos from "@/components/reconstructed/ClientLogos";
import About from "@/components/reconstructed/About";
import Services from "@/components/reconstructed/Services";
import Experience from "@/components/reconstructed/Experience";
import Projects from "@/components/reconstructed/Projects";
import Blogs from "@/components/reconstructed/Blogs";
import Contact from "@/components/reconstructed/Contact";
import Footer from "@/components/reconstructed/Footer";
import Loader from "@/components/reconstructed/Loader";

// Below the fold and library-heavy. Split out of the initial bundle so d3,
// the syntax highlighter and the chat client stop blocking first paint.
// `ssr: true` (the default) is deliberate — the markup still lands in the
// server-rendered HTML, so nothing is hidden from crawlers; only the
// JavaScript is deferred.
const SkillGraph = dynamic(() => import("@/components/reconstructed/SkillGraph"));
const GitHubActivity = dynamic(() => import("@/components/reconstructed/GitHubActivity"));
const CodeShowcase = dynamic(() => import("@/components/reconstructed/CodeShowcase"));
const FeatureBanner = dynamic(() => import("@/components/reconstructed/FeatureBanner"));

// Interactive widgets with no SEO value — never rendered on the server.
const ChatAssistant = dynamic(() => import("@/components/reconstructed/ChatAssistant"), {
  ssr: false,
});
const TerminalMode = dynamic(() => import("@/components/reconstructed/TerminalMode"), {
  ssr: false,
});

export default function HomeContent() {
  return (
    <main className="bg-[#0D0505] text-[#FFFFFF] min-h-screen overflow-x-hidden font-sans relative">
      {/* The loader is a fixed, full-screen overlay at z-9999 — it already hides
          the page on its own, so the content below renders normally. It is not
          wrapped in a visibility gate: doing so put the entire page at zero
          height in the server-rendered HTML, which delayed LCP and meant a JS
          failure would serve a crawler a blank page. */}
      <Loader />
      <ChatAssistant />
      <TerminalMode />

      <Header />
      <Hero />
      <ClientLogos />
      <About />
      <Services />
      <Experience />
      <SkillGraph />
      <Projects />
      <GitHubActivity />
      <CodeShowcase />
      <FeatureBanner />
      <Blogs />
      <Contact />
      <Footer />
    </main>
  );
}
