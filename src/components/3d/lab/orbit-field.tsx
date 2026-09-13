"use client";
/** Reach — rings of attention widening from one voice; the audience stands in the field. Social Media. */
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { AssetCanvas, Strip, Dots, Segs, LIGHT, rng, TAU, useReducedMotion } from "./shared";

function Scene({ reduced }: { reduced: boolean }) {
  const layers = useRef<(THREE.Group | null)[]>([]);
  const root = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  const g = useMemo(() => {
    const r = rng(5);
    const rings: { pts: Float32Array; layer: number; op: number }[] = [];
    for (let i = 0; i < 64; i++) {
      const rad = 0.9 + Math.pow(i / 64, 1.15) * 7.2;
      const seg = 220, a = new Float32Array((seg + 1) * 3);
      const k = 3 + Math.floor(r() * 6), ph = r() * TAU, amp = 0.03 + r() * 0.12;
      for (let j = 0; j <= seg; j++) {
        const t = (j / seg) * TAU;
        const rr = rad + amp * (Math.sin(t * k + ph) + 0.5 * Math.sin(t * (k * 2 + 1) - ph));
        a[j * 3] = Math.cos(t) * rr; a[j * 3 + 1] = 0; a[j * 3 + 2] = Math.sin(t) * rr;
      }
      rings.push({ pts: a, layer: i % 3, op: 0.18 - (i / 64) * 0.1 });
    }
    // audience: small standing figures = short vertical segments + head dot
    const stand: number[] = [], heads: number[] = [];
    for (let i = 0; i < 90; i++) {
      const rad = 1.6 + r() * 6.4, t = r() * TAU, h = 0.14 + r() * 0.16;
      const x = Math.cos(t) * rad, z = Math.sin(t) * rad;
      stand.push(x, 0, z, x, h, z); heads.push(x, h + 0.03, z);
    }
    const core = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.42, 1));
    return { rings, stand: new Float32Array(stand), heads: new Float32Array(heads), core };
  }, []);

  useFrame((s) => {
    const t = s.clock.elapsedTime * (reduced ? 0.15 : 1);
    layers.current.forEach((l, i) => { if (l) l.rotation.y = t * (i === 1 ? -0.03 : 0.02 + i * 0.01); });
    if (root.current) root.current.rotation.y += (pointer.x * 0.2 - root.current.rotation.y) * 0.03;
  });

  return (
    <group ref={root} position={[0, -0.6, 0]}>
      {[0, 1, 2].map((L) => (
        <group key={L} ref={(el) => { layers.current[L] = el; }}>
          {g.rings.filter((rg) => rg.layer === L).map((rg, i) => <Strip key={i} pts={rg.pts} opacity={rg.op} />)}
        </group>
      ))}
      <Segs pts={g.stand} opacity={0.6} />
      <Dots pts={g.heads} opacity={0.9} size={0.05} />
      <group position={[0, 0.9, 0]}>
        <lineSegments geometry={g.core}><lineBasicMaterial color={LIGHT} transparent opacity={0.7} toneMapped={false} /></lineSegments>
        <mesh><sphereGeometry args={[0.06, 8, 8]} /><meshBasicMaterial color={LIGHT} toneMapped={false} /></mesh>
        {/* beam */}
        <Segs pts={new Float32Array([0, 0.5, 0, 0, 6, 0])} opacity={0.25} />
      </group>
      <fog attach="fog" args={["#060608", 6, 20]} />
    </group>
  );
}

export default function OrbitField() {
  const reduced = useReducedMotion();
  return (
    <AssetCanvas camera={{ position: [0, 4.2, 9.5], fov: 46 }} bloom={0.6}>
      <Scene reduced={reduced} />
    </AssetCanvas>
  );
}
