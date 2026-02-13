"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
// @ts-ignore
import * as random from "maath/random/dist/maath-random.esm";

interface ParticleFieldProps {
  count?: number;
  color?: string;
  size?: number;
  radius?: number;
}

export function ParticleField({
  count = 2000,
  color = "#B8A9E8",
  size = 0.02,
  radius = 5,
}: ParticleFieldProps) {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    return random.inSphere(new Float32Array(count * 3), { radius });
  }, [count, radius]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={color}
          size={size}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}
