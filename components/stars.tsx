import React, { useRef, useState } from "react";
import { Points, PointMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function randomInSphere(array: Float32Array, { radius }: { radius: number }) {
  for (let i = 0; i < array.length; i += 3) {
    let u = Math.random();
    let v = Math.random();
    let theta = 2 * Math.PI * u;
    let phi = Math.acos(2 * v - 1);
    let r = radius * Math.cbrt(Math.random());
    array[i] = r * Math.sin(phi) * Math.cos(theta);
    array[i + 1] = r * Math.sin(phi) * Math.sin(theta);
    array[i + 2] = r * Math.cos(phi);
  }
  return array;
}

export const Stars: React.FC = (props) => {
  const ref = useRef<THREE.Points>(null);
  const [sphere] = useState<Float32Array>(() => randomInSphere(new Float32Array(5000), { radius: 1.2 }));

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#f272c8"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};