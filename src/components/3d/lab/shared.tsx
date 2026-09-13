"use client";

/**
 * Shared primitives for the Asset Lab.
 * Strictly monochrome: Light (#F4F1E9) on Ink. Light is the only colour.
 */

import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

export const LIGHT = new THREE.Color("#F4F1E9");
export const TAU = Math.PI * 2;

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return reduced;
}

/* tiny deterministic PRNG so every asset renders the same on every load */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function useGeo(pts: Float32Array) {
  return useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pts, 3));
    return g;
  }, [pts]);
}

export function Strip({ pts, opacity, loop = false }: { pts: Float32Array; opacity: number; loop?: boolean }) {
  const geo = useGeo(pts);
  const obj = useMemo(() => {
    const m = new THREE.LineBasicMaterial({ color: LIGHT, transparent: true, opacity, toneMapped: false, depthWrite: false });
    return loop ? new THREE.LineLoop(geo, m) : new THREE.Line(geo, m);
  }, [geo, opacity, loop]);
  return <primitive object={obj} />;
}

export function Segs({ pts, opacity }: { pts: Float32Array; opacity: number }) {
  const geo = useGeo(pts);
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={LIGHT} transparent opacity={opacity} toneMapped={false} depthWrite={false} />
    </lineSegments>
  );
}

export function Dots({ pts, opacity, size = 0.03 }: { pts: Float32Array; opacity: number; size?: number }) {
  const geo = useGeo(pts);
  return (
    <points geometry={geo}>
      <pointsMaterial color={LIGHT} size={size} sizeAttenuation transparent opacity={opacity} depthWrite={false} toneMapped={false} />
    </points>
  );
}

export function Spark({ size = 0.05 }: { size?: number }) {
  return (
    <mesh>
      <sphereGeometry args={[size, 10, 10]} />
      <meshBasicMaterial color={LIGHT} toneMapped={false} />
    </mesh>
  );
}

/* points with per-vertex alpha + size (for particle systems) */
export const softPointShader = {
  vertexShader: `
    attribute float aAlpha;
    attribute float aSize;
    varying float vAlpha;
    uniform float uScale;
    void main() {
      vAlpha = aAlpha;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = aSize * uScale / -mv.z;
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragmentShader: `
    varying float vAlpha;
    uniform vec3 uColor;
    void main() {
      vec2 c = gl_PointCoord - 0.5;
      float d = length(c);
      if (d > 0.5) discard;
      float a = smoothstep(0.5, 0.05, d) * vAlpha;
      gl_FragColor = vec4(uColor, a);
    }
  `,
};

/**
 * AssetCanvas: lazy WebGL frame. Only mounts once scrolled near, pauses the
 * frameloop when off-screen so nine scenes on one page stay cheap.
 */
export function AssetCanvas({
  children,
  camera = { position: [0, 0, 8] as [number, number, number], fov: 45 },
  bloom = 0.6,
  className = "",
}: {
  children: React.ReactNode;
  camera?: { position: [number, number, number]; fov?: number; near?: number; far?: number };
  bloom?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setMounted(true);
        setVisible(e.isIntersecting);
      },
      { rootMargin: "240px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`absolute inset-0 ${className}`}>
      {mounted && (
        <Canvas
          className="w-full h-full"
          camera={camera}
          dpr={[1, 1.5]}
          frameloop={visible ? "always" : "never"}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
            {children}
            {bloom > 0 && (
              <EffectComposer>
                <Bloom intensity={bloom} luminanceThreshold={0.35} luminanceSmoothing={0.9} mipmapBlur radius={0.7} />
              </EffectComposer>
            )}
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
