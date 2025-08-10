import React from 'react'
import CustomCursor from "@/components/custom-cursor";
import SectionIndicator from "@/components/section-indicator";
import Header from "@/components/header";
import Hero from "@/components/hero";

const TopSection = () => {
  return (
    <>
        <CustomCursor />
        <SectionIndicator />
        <Header />
        <Hero />
    </>
  )
}

export default TopSection
