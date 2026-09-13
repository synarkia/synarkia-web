"use client";
/** The Iris — a dark core with radial streaks and pulsing rings; events flash through the spokes. AI & Automation. */
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { AssetCanvas, Segs, Dots, Strip, rng, TAU, useReducedMotion } from "./shared";

function wobbleRing(radius: number, amp: number, k: number, ph: number, seg = 360): Float32Array {
  const a = new Float32Array((seg + 1) * 3);
  for (let i = 0; i <= seg; i++) {
    const t = (i / seg) * TAU;
    const r = radius + amp * (Math.sin(t * k + ph) * 0.6 + Math.sin(t * k * 2.7 + ph * 1.3) * 0.4);
    a[i * 3] = Math.cos(t) * r;
    a[i * 3 + 1] = Math.sin(t) * r;
  }
  return a;
}

function Scene({ reduced }: { reduced: boolean }) {
  const root = useRef<THREE.Group>(null);
  const spokes = useRef<THREE.LineSegments>(null);
  const layers = useRef<(THREE.Group | null)[]>([]);
  const { pointer } = useThree();

  const g = useMemo(() => {
    const r = rng(7);
    const faint: number[] = [], mid: number[] = [], bright: number[] = [];
    for (let i = 0; i < 1400; i++) {
      const t = r() * TAU;
      const r0 = 1.05 + r() * 0.5;
      const len = Math.pow(r(), 2.2) * 3.4 + 0.15;
      const c = Math.cos(t), s = Math.sin(t);
      const tgt = i % 9 === 0 ? bright : i % 3 === 0 ? mid : faint;
      tgt.push(c * r0, s * r0, 0, c * (r0 + len), s * (r0 + len), 0);
    }
    // flashing spokes
    const sp: number[] = [];
    for (let i = 0; i < 14; i++) {
      const t = r() * TAU;
      const c = Math.cos(t), s = Math.sin(t);
      sp.push(c * 1.0, s * 1.0, 0, c * 4.6, s * 4.6, 0);
    }
    // dotted rings
    const rings: Float32Array[] = [];
    [1.5, 2.1, 2.8, 3.6, 4.3].forEach((rad, j) => {
      const n = 90 + j * 40;
      const a = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        const t = (i / n) * TAU;
        a[i * 3] = Math.cos(t) * rad;
        a[i * 3 + 1] = Math.sin(t) * rad;
      }
      rings.push(a);
    });
    const wobbles = [wobbleRing(2.4, 0.08, 9, 0.3), wobbleRing(3.3, 0.14, 5, 1.7), wobbleRing(4.0, 0.1, 13, 2.9)];
    const core: number[] = [];
    for (let i = 0; i < 400; i++) {
      const t = r() * TAU, rad = 0.95 + r() * 0.12;
      core.push(Math.cos(t) * rad, Math.sin(t) * rad, 0);
    }
    return {
      faint: new Float32Array(faint), mid: new Float32Array(mid), bright: new Float32Array(bright),
      spokes: new Float32Array(sp), rings, wobbles, core: new Float32Array(core),
    };
  }, []);

  useFrame((s) => {
    const t = s.clock.elapsedTime * (reduced ? 0.2 : 1);
    if (root.current) {
      root.current.rotation.z = t * 0.015;
      root.current.rotation.x += (-pointer.y * 0.25 - root.current.rotation.x) * 0.04;
      root.current.rotation.y += (pointer.x * 0.25 - root.current.rotation.y) * 0.04;
    }
    layers.current.forEach((l, i) => { if (l) l.rotation.z = t * (i % 2 ? -1 : 1) * (0.02 + i * 0.012); });
    if (spokes.current) {
      const m = spokes.current.material as THREE.LineBasicMaterial;
      m.opacity = 0.05 + Math.max(0, Math.sin(t * 1.7) ** 7) * 0.6;
    }
  });

  return (
    <group ref={root}>
      <Segs pts={g.faint} opacity={0.08} />
      <Segs pts={g.mid} opacity={0.2} />
      <Segs pts={g.bright} opacity={0.45} />
      <lineSegments ref={spokes} geometry={useMemo(() => { const bg = new THREE.BufferGeometry(); bg.setAttribute("position", new THREE.BufferAttribute(g.spokes, 3)); return bg; }, [g.spokes])}>
        <lineBasicMaterial color="#F4F1E9" transparent opacity={0.1} toneMapped={false} depthWrite={false} />
      </lineSegments>
      {g.rings.map((rp, i) => (
        <group key={i} ref={(el) => { layers.current[i] = el; }}>
          <Dots pts={rp} opacity={0.35 - i * 0.04} size={0.028} />
        </group>
      ))}
      {g.wobbles.map((w, i) => (
        <group key={"w" + i} ref={(el) => { layers.current[5 + i] = el; }}>
          <Strip pts={w} opacity={0.14} />
        </group>
      ))}
      <Dots pts={g.core} opacity={0.9} size={0.035} />
      {/* void */}
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[0.92, 64]} />
        <meshBasicMaterial color="#060608" />
      </mesh>
    </group>
  );
}

export default function Iris() {
  const reduced = useReducedMotion();
  return (
    <AssetCanvas camera={{ position: [0, 0, 8.5], fov: 45 }} bloom={0.55}>
      <Scene reduced={reduced} />
    </AssetCanvas>
  );
}
