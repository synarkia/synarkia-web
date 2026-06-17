"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

function LightField() {
  const far = useRef<THREE.Points>(null!);
  const near = useRef<THREE.Points>(null!);

  // Two depths of light, a kingdom of distant and near stars.
  const farPos = useMemo(() => sphere(1400, 9), []);
  const nearPos = useMemo(() => sphere(500, 5.2), []);

  useFrame((state, delta) => {
    const { x, y } = state.pointer;
    if (far.current) {
      far.current.rotation.y += delta * 0.012;
      far.current.rotation.x = THREE.MathUtils.lerp(far.current.rotation.x, y * 0.08, 0.04);
      far.current.rotation.z = THREE.MathUtils.lerp(far.current.rotation.z, x * 0.08, 0.04);
    }
    if (near.current) {
      near.current.rotation.y -= delta * 0.022;
      near.current.rotation.x = THREE.MathUtils.lerp(near.current.rotation.x, -y * 0.14, 0.04);
      near.current.rotation.y = THREE.MathUtils.lerp(near.current.rotation.y, -x * 0.14, 0.02);
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 5]}>
      <Points ref={far} positions={farPos} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#F4F1E9" size={0.013} sizeAttenuation depthWrite={false} opacity={0.55} />
      </Points>
      <Points ref={near} positions={nearPos} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#FFFFFF" size={0.03} sizeAttenuation depthWrite={false} opacity={0.95} />
      </Points>
    </group>
  );
}

function sphere(count: number, radius: number) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // distribute on a shell with some interior scatter
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2;
    const phi = Math.acos(2 * v - 1);
    const r = radius * (0.55 + Math.random() * 0.45);
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = r * Math.cos(phi);
  }
  return arr;
}

export function LightsCanvas() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <LightField />
      <EffectComposer>
        <Bloom intensity={1.1} luminanceThreshold={0.1} luminanceSmoothing={0.9} mipmapBlur radius={0.7} />
      </EffectComposer>
    </Canvas>
  );
}
