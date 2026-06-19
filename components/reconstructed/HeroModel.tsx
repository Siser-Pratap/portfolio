"use client"

import { useRef, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"

function Planet() {
  const { scene } = useGLTF("/models/scene.gltf")
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1
    }
  })

  return <primitive ref={groupRef} object={scene} scale={2.4} />
}

export default function HeroModel() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 42 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.25} />
      {/* Key light: cool white from top-right */}
      <directionalLight position={[3, 5, 4]} intensity={1.8} color="#ffffff" />
      {/* Rim light: orange-red from below to match brand accent */}
      <pointLight position={[0, -4, 2]} intensity={6} color="#FF4B1F" distance={12} />
      {/* Fill light: subtle warm backlight */}
      <pointLight position={[-4, 2, -3]} intensity={0.6} color="#FF6A21" distance={14} />

      <Suspense fallback={null}>
        <Planet />
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload("/models/scene.gltf")
