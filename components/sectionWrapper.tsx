import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";

// Import your Stars component from contact.tsx or move it to its own file
import { Stars } from "./stars"; // Adjust path as needed

type SectionWithStarsProps = React.PropsWithChildren<{
  className?: string;
  style?: React.CSSProperties;
}>;

const SectionWithStars: React.FC<SectionWithStarsProps> = ({ children, className = "", style }) => (
  <section className={`relative ${className}`} style={style}>
    <div className="w-full h-full absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <Stars />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
    {children}
  </section>
);

export default SectionWithStars;