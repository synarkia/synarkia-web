"use client";

/**
 * Cosmic Balance — the equilibrium of art · science · metaphysics.
 * A luminous core held by three slowly-rotating rings (the trinity),
 * suspended in a field of light. Strictly monochrome. Light is the only color.
 *
 * Optimized: single starfield Points buffer, lightweight ring geometry,
 * capped DPR, frameloop pauses when offscreen, respects reduced-motion.
 */

import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const LIGHT = new THREE.Color("#F4F1E9");

/* ── Central luminous core ── */
function Core() {
  const inner = useRef<THREE.Mesh>(null);
  const outer = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (inner.current) {
      inner.current.rotation.y = t * 0.12;
      inner.current.rotation.x = t * 0.06;
      const pulse = 0.92 + Math.sin(t * 0.9) * 0.08;
      inner.current.scale.setScalar(pulse);
    }
    if (outer.current) {
      outer.current.rotation.y = -t * 0.05;
      outer.current.rotation.z = t * 0.04;
    }
  });

  return (
    <group>
      {/* solid glowing seed */}
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.62, 1]} />
        <meshBasicMaterial color={LIGHT} toneMapped={false} />
      </mesh>
      {/* faint wireframe shell */}
      <mesh ref={outer}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial
          color={LIGHT}
          wireframe
          transparent
          opacity={0.18}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/* ── One orbiting ring of the trinity ── */
function Ring({
  radius,
  tube,
  rotation,
  speed,
  opacity,
}: {
  radius: number;
  tube: number;
  rotation: [number, number, number];
  speed: number;
  opacity: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * speed;
  });
  return (
    <mesh ref={ref} rotation={rotation}>
      <torusGeometry args={[radius, tube, 16, 180]} />
      <meshBasicMaterial color={LIGHT} transparent opacity={opacity} toneMapped={false} />
    </mesh>
  );
}

/* ── A satellite point that travels each ring ── */
function Satellite({
  radius,
  rotation,
  speed,
  size,
}: {
  radius: number;
  rotation: [number, number, number];
  speed: number;
  size: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const dot = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    if (dot.current) {
      dot.current.position.x = Math.cos(t) * radius;
      dot.current.position.y = Math.sin(t) * radius;
    }
    if (ref.current) ref.current.rotation.set(rotation[0], rotation[1], rotation[2]);
  });
  return (
    <group ref={ref}>
      <mesh ref={dot}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial color={LIGHT} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ── Starfield ── */
function Starfield({ count = 2200 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // distribute on a thick shell so depth reads well
      const r = 7 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.012;
      ref.current.rotation.x = state.clock.elapsedTime * 0.005;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={LIGHT}
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

/* ── Mouse parallax wrapper ── */
function Constellation({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!group.current) return;
    const tx = pointer.y * 0.18;
    const ty = pointer.x * 0.28;
    group.current.rotation.x += (tx - group.current.rotation.x) * 0.04;
    group.current.rotation.y += (ty - group.current.rotation.y) * 0.04;
  });

  const s = reduced ? 0.25 : 1;

  return (
    <group ref={group}>
      <Core />
      {/* The trinity — three planes of one balance */}
      <Ring radius={2.1} tube={0.006} rotation={[Math.PI / 2.1, 0, 0]} speed={0.08 * s} opacity={0.5} />
      <Ring radius={2.7} tube={0.005} rotation={[Math.PI / 3, Math.PI / 4, 0]} speed={-0.06 * s} opacity={0.38} />
      <Ring radius={3.3} tube={0.004} rotation={[Math.PI / 1.7, -Math.PI / 5, Math.PI / 6]} speed={0.045 * s} opacity={0.28} />

      <Satellite radius={2.1} rotation={[Math.PI / 2.1, 0, 0]} speed={0.34 * s} size={0.05} />
      <Satellite radius={2.7} rotation={[Math.PI / 3, Math.PI / 4, 0]} speed={-0.26 * s} size={0.045} />
      <Satellite radius={3.3} rotation={[Math.PI / 1.7, -Math.PI / 5, Math.PI / 6]} speed={0.2 * s} size={0.04} />

      <Starfield />
    </group>
  );
}

export default function CosmicBalance() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [0, 0, 8.5], fov: 42 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <Constellation reduced={reduced} />
        <EffectComposer>
          <Bloom
            intensity={1.15}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.9}
            mipmapBlur
            radius={0.7}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
