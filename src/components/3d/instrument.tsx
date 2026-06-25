"use client";

/**
 * Instrument — a slow, luminous mission-control HUD built from sacred geometry.
 * Concentric dials with tick bezels, a flower-of-life core, a crosshair reticle,
 * sweeping orbital arcs, travelling light-satellites, over a faint starfield.
 * Tilted into a console perspective. Strictly monochrome; light is the only color.
 *
 * Optimized: all geometry precomputed once (lines + points), capped DPR,
 * low bloom, gentle parallax, respects reduced-motion.
 *
 * variant: "core" (home, centred) · "studio" (offset right) · "labs" (offset left)
 */

import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const LIGHT = new THREE.Color("#F4F1E9");
const TAU = Math.PI * 2;

/* ── geometry generators ───────────────────────────────── */
function ringArray(radius: number, seg = 192): Float32Array {
  const a = new Float32Array((seg + 1) * 3);
  for (let i = 0; i <= seg; i++) {
    const t = (i / seg) * TAU;
    a[i * 3] = Math.cos(t) * radius;
    a[i * 3 + 1] = Math.sin(t) * radius;
  }
  return a;
}

function arcArray(radius: number, a0: number, a1: number, seg = 96): Float32Array {
  const a = new Float32Array((seg + 1) * 3);
  for (let i = 0; i <= seg; i++) {
    const t = a0 + (i / seg) * (a1 - a0);
    a[i * 3] = Math.cos(t) * radius;
    a[i * 3 + 1] = Math.sin(t) * radius;
  }
  return a;
}

function tickArray(radius: number, count: number, len: number, every = 1): Float32Array {
  const pts: number[] = [];
  for (let i = 0; i < count; i++) {
    if (i % every !== 0) continue;
    const t = (i / count) * TAU;
    const c = Math.cos(t);
    const s = Math.sin(t);
    pts.push(c * radius, s * radius, 0, c * (radius + len), s * (radius + len), 0);
  }
  return new Float32Array(pts);
}

function crossArray(r: number, gap: number): Float32Array {
  return new Float32Array([
    gap, 0, 0, r, 0, 0,
    -gap, 0, 0, -r, 0, 0,
    0, gap, 0, 0, r, 0,
    0, -gap, 0, 0, -r, 0,
  ]);
}

/* flower of life: centre circle + 6 around (overlapping) */
function flowerArrays(radius: number): Float32Array[] {
  const out: Float32Array[] = [ringArray(radius, 96)];
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * TAU;
    const cx = Math.cos(ang) * radius;
    const cy = Math.sin(ang) * radius;
    const seg = 96;
    const a = new Float32Array((seg + 1) * 3);
    for (let j = 0; j <= seg; j++) {
      const t = (j / seg) * TAU;
      a[j * 3] = cx + Math.cos(t) * radius;
      a[j * 3 + 1] = cy + Math.sin(t) * radius;
    }
    out.push(a);
  }
  return out;
}

/* ── primitives ────────────────────────────────────────── */
function L({ pts, opacity, loop = false }: { pts: Float32Array; opacity: number; loop?: boolean }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pts, 3));
    return g;
  }, [pts]);
  return loop ? (
    <lineLoop geometry={geo}>
      <lineBasicMaterial color={LIGHT} transparent opacity={opacity} toneMapped={false} />
    </lineLoop>
  ) : (
    <line geometry={geo}>
      <lineBasicMaterial color={LIGHT} transparent opacity={opacity} toneMapped={false} />
    </line>
  );
}

function Seg({ pts, opacity }: { pts: Float32Array; opacity: number }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pts, 3));
    return g;
  }, [pts]);
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={LIGHT} transparent opacity={opacity} toneMapped={false} />
    </lineSegments>
  );
}

function Layer({ speed, children }: { speed: number; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.z = s.clock.elapsedTime * speed;
  });
  return <group ref={ref}>{children}</group>;
}

/* a bright light that travels a ring (these bloom = the stars) */
function Satellite({ radius, speed, phase = 0, size = 0.045 }: { radius: number; speed: number; phase?: number; size?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    const t = s.clock.elapsedTime * speed + phase;
    if (ref.current) {
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.y = Math.sin(t) * radius;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshBasicMaterial color={LIGHT} toneMapped={false} />
    </mesh>
  );
}

function Starfield({ count = 1100 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const pos = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 8 + Math.random() * 16;
      const th = Math.random() * TAU;
      const ph = Math.acos(2 * Math.random() - 1);
      a[i * 3] = r * Math.sin(ph) * Math.cos(th);
      a[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      a[i * 3 + 2] = r * Math.cos(ph) - 6;
    }
    return a;
  }, [count]);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [pos]);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.01;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color={LIGHT} size={0.03} sizeAttenuation transparent opacity={0.55} depthWrite={false} toneMapped={false} />
    </points>
  );
}

/* breathing opacity on the sacred core */
function FlowerCore({ radius }: { radius: number }) {
  const ref = useRef<THREE.Group>(null);
  const circles = useMemo(() => flowerArrays(radius), [radius]);
  useFrame((s) => {
    if (ref.current) {
      const o = 0.06 + (Math.sin(s.clock.elapsedTime * 0.5) * 0.5 + 0.5) * 0.06;
      ref.current.children.forEach((c) => {
        const m = (c as THREE.LineLoop).material as THREE.LineBasicMaterial;
        if (m) m.opacity = o;
      });
      ref.current.rotation.z = s.clock.elapsedTime * 0.02;
    }
  });
  return (
    <group ref={ref}>
      {circles.map((c, i) => (
        <L key={i} pts={c} opacity={0.1} loop />
      ))}
    </group>
  );
}

interface Cfg {
  offset: [number, number];
  scale: number;
  tilt: [number, number];
}

const VARIANTS: Record<string, Cfg> = {
  core: { offset: [0, 0], scale: 1, tilt: [-0.32, 0.16] },
  studio: { offset: [3.4, 0.6], scale: 1.25, tilt: [-0.28, 0.34] },
  labs: { offset: [-3.4, -0.4], scale: 1.2, tilt: [-0.34, -0.3] },
};

function Scene({ variant, reduced }: { variant: string; reduced: boolean }) {
  const cfg = VARIANTS[variant] ?? VARIANTS.core;
  const tilt = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const s = reduced ? 0.2 : 1;

  // precompute static geometry
  const g = useMemo(
    () => ({
      bezelTicks: tickArray(4.4, 120, 0.16, 1),
      bezelTicksMajor: tickArray(4.4, 24, 0.34, 1),
      ring1: ringArray(4.4),
      ring2: ringArray(3.5),
      midTicks: tickArray(3.5, 60, -0.18, 1),
      ring3: ringArray(2.4),
      ring4: ringArray(1.45),
      arcA: arcArray(2.95, 0.2, 1.5),
      arcB: arcArray(2.95, Math.PI + 0.3, Math.PI + 1.9),
      arcC: arcArray(3.95, Math.PI * 0.7, Math.PI * 1.25),
      cross: crossArray(2.0, 0.35),
      diag: (() => {
        // subtle hexagram spokes
        const pts: number[] = [];
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * TAU;
          pts.push(0, 0, 0, Math.cos(a) * 4.4, Math.sin(a) * 4.4, 0);
        }
        return new Float32Array(pts);
      })(),
    }),
    []
  );

  useFrame((state) => {
    if (!tilt.current) return;
    const px = pointer.x * 0.12;
    const py = pointer.y * 0.12;
    tilt.current.rotation.x += (cfg.tilt[0] - py - tilt.current.rotation.x) * 0.04;
    tilt.current.rotation.y += (cfg.tilt[1] + px - tilt.current.rotation.y) * 0.04;
    tilt.current.position.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.12;
  });

  return (
    <>
      <Starfield />
      <group position={[cfg.offset[0], cfg.offset[1], 0]}>
        <group ref={tilt} scale={cfg.scale}>
          {/* outer bezel — slow counter-rotation */}
          <Layer speed={-0.022 * s}>
            <L pts={g.ring1} opacity={0.22} loop />
            <Seg pts={g.bezelTicks} opacity={0.16} />
            <Seg pts={g.bezelTicksMajor} opacity={0.3} />
          </Layer>

          {/* mid dial */}
          <Layer speed={0.03 * s}>
            <L pts={g.ring2} opacity={0.18} loop />
            <Seg pts={g.midTicks} opacity={0.14} />
            <Seg pts={g.diag} opacity={0.05} />
          </Layer>

          {/* orbital arcs */}
          <Layer speed={0.05 * s}>
            <L pts={g.arcA} opacity={0.3} />
            <L pts={g.arcB} opacity={0.22} />
            <Satellite radius={2.95} speed={0} phase={0.2} />
            <Satellite radius={2.95} speed={0} phase={Math.PI + 0.3} size={0.04} />
          </Layer>
          <Layer speed={-0.04 * s}>
            <L pts={g.arcC} opacity={0.2} />
            <Satellite radius={3.95} speed={0} phase={Math.PI * 0.7} size={0.05} />
          </Layer>

          {/* inner ring + reticle */}
          <Layer speed={0.018 * s}>
            <L pts={g.ring3} opacity={0.16} loop />
            <L pts={g.ring4} opacity={0.12} loop />
          </Layer>
          <Seg pts={g.cross} opacity={0.18} />

          {/* sacred core */}
          <FlowerCore radius={0.62} />

          {/* travelling stars on different radii */}
          <Satellite radius={4.4} speed={0.12 * s} phase={1.1} size={0.05} />
          <Satellite radius={2.4} speed={-0.16 * s} phase={2.4} size={0.04} />
        </group>
      </group>
    </>
  );
}

export default function Instrument({ variant = "core" }: { variant?: "core" | "studio" | "labs" }) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [0, 0, 9], fov: 46 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <Scene variant={variant} reduced={reduced} />
        <EffectComposer>
          <Bloom intensity={0.7} luminanceThreshold={0.4} luminanceSmoothing={0.9} mipmapBlur radius={0.65} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
