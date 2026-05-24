import React from 'react'
import CustomCursor from "@/components/custom-cursor";
import SectionIndicator from "@/components/section-indicator";
import Header from "@/components/header";
import ScrollCanvasSequence from "@/components/scroll-canvas-sequence";
import TopScrollProgress from "@/components/top-scroll-progress";

const TopSection = () => {
  return (
    <>
        <TopScrollProgress />
        <CustomCursor />
        <SectionIndicator />
        <Header />
        <ScrollCanvasSequence />
    </>
  )
}

export default TopSection
