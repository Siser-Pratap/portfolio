"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import * as THREE from "three"
import gsap from "gsap"

function MonolithScene() {
  const outerRingRef = useRef<THREE.Mesh>(null)
  const middleRingRef = useRef<THREE.Mesh>(null)
  const innerRingRef = useRef<THREE.Mesh>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  // Floating kinetic rotation on independent axes
  useFrame((_, delta) => {
    // 1. Central Faceted White Monolith Core
    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.18
      coreRef.current.rotation.y += delta * 0.25
      coreRef.current.rotation.z += delta * 0.12
    }
    // 2. Inner Circle (Matte Black - opposite of white core)
    if (innerRingRef.current) {
      innerRingRef.current.rotation.y -= delta * 0.4
      innerRingRef.current.rotation.z += delta * 0.22
    }
    // 3. Middle Circle (Sandstone Beige)
    if (middleRingRef.current) {
      middleRingRef.current.rotation.x += delta * 0.26
      middleRingRef.current.rotation.z -= delta * 0.3
    }
    // 4. Outer Last Circle (Pure White)
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x += delta * 0.3
      outerRingRef.current.rotation.y += delta * 0.16
    }
  })

  // GSAP entrance and mouse tracking
  useEffect(() => {
    if (!groupRef.current) return

    // Entrance scale
    gsap.fromTo(
      groupRef.current.scale,
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 1, z: 1, duration: 1.5, ease: "power3.out", delay: 0.2 }
    )

    // Mouse parallax tracking with spring dampening
    const handleMouseMove = (e: MouseEvent) => {
      if (!groupRef.current) return
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2

      gsap.to(groupRef.current.rotation, {
        y: nx * 0.42,
        x: -ny * 0.32,
        duration: 1.2,
        ease: "power2.out",
        overwrite: "auto",
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.35}>
        
        {/* CENTER NUCLEUS: The Faceted Geometric Monolith Core in Pure White */}
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1.08, 0]} />
          <meshStandardMaterial
            color="#FFFFFF"
            roughness={0.2}
            metalness={0.15}
            flatShading={true}
          />
        </mesh>

        {/* Center Spark Element */}
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>

        {/* CIRCLE 1 (Inner): Deep Matte Black (Direct opposite of white core) */}
        <mesh ref={innerRingRef} rotation={[-0.5, 0.4, 0.6]}>
          <torusGeometry args={[1.65, 0.075, 32, 100]} />
          <meshStandardMaterial
            color="#0D0D10"
            roughness={0.3}
            metalness={0.85}
          />
        </mesh>

        {/* CIRCLE 2 (Middle): Architectural Sandstone Beige */}
        <mesh ref={middleRingRef} rotation={[0.6, -0.5, 0.3]}>
          <torusGeometry args={[2.05, 0.08, 32, 100]} />
          <meshStandardMaterial
            color="#E8E2D8"
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>

        {/* CIRCLE 3 (Last Circle): Crisp Pure White */}
        <mesh ref={outerRingRef} rotation={[0.4, 0.5, -0.2]}>
          <torusGeometry args={[2.45, 0.085, 32, 100]} />
          <meshStandardMaterial
            color="#FFFFFF"
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>

        {/* High-Contrast Orbital Accent Satellites */}
        <mesh position={[1.4, 0.7, -0.3]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.1} metalness={0.9} />
        </mesh>
        <mesh position={[-1.8, -1.2, 0.8]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#0A0A0A" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0.5, -1.9, -0.7]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial color="#E8E2D8" roughness={0.4} />
        </mesh>

      </Float>
    </group>
  )
}

export default function HeroModel() {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.95} />
        {/* Top-right studio key light */}
        <directionalLight position={[5, 7, 6]} intensity={1.8} color="#FFFFFF" />
        {/* Bottom-left fill light */}
        <directionalLight position={[-5, -4, -4]} intensity={1.2} color="#E8E2D8" />
        {/* Soft center rim light */}
        <pointLight position={[0, -3, 3]} intensity={0.7} color="#FFFFFF" />

        <MonolithScene />
      </Canvas>
    </div>
  )
}
