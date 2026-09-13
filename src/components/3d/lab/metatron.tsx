"use client";
/** Identity System — Metatron's cube: thirteen centres, every pair connected; the lattice a brand grows from. Brand & Studio. */
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { AssetCanvas, Segs, Dots, Strip, TAU, useReducedMotion } from "./shared";

function ring(radius: number, seg = 96): Float32Array {
  const a = new Float32Array((seg + 1) * 3);
  for (let i = 0; i <= seg; i++) { const t = (i / seg) * TAU; a[i * 3] = Math.cos(t) * radius; a[i * 3 + 1] = Math.sin(t) * radius; }
  return a;
}

function Scene({ reduced }: { reduced: boolean }) {
  const root = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const bg = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  const g = useMemo(() => {
    const r = 1.15;
    const centres: [number, number][] = [[0, 0]];
    for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU + Math.PI / 6; centres.push([Math.cos(a) * r, Math.sin(a) * r]); }
    for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU + Math.PI / 6; centres.push([Math.cos(a) * r * 2, Math.sin(a) * r * 2]); }
    const lines: number[] = [];
    for (let i = 0; i < centres.length; i++) for (let j = i + 1; j < centres.length; j++) lines.push(centres[i][0], centres[i][1], 0, centres[j][0], centres[j][1], 0);
    const nodes = new Float32Array(centres.flatMap(([x, y]) => [x, y, 0]));
    // outer hexagon + big triangles
    const hex: number[] = [];
    for (let i = 0; i < 6; i++) {
      const a0 = (i / 6) * TAU + Math.PI / 6, a1 = ((i + 1) / 6) * TAU + Math.PI / 6;
      hex.push(Math.cos(a0) * 3.6, Math.sin(a0) * 3.6, 0, Math.cos(a1) * 3.6, Math.sin(a1) * 3.6, 0);
      hex.push(Math.cos(a0) * 3.6, Math.sin(a0) * 3.6, 0, Math.cos(a0 + TAU / 3) * 3.6, Math.sin(a0 + TAU / 3) * 3.6, 0);
    }
    // background tiled lattice (faint)
    const tile: number[] = [];
    for (let tx = -2; tx <= 2; tx++) for (let ty = -2; ty <= 2; ty++) {
      if (tx === 0 && ty === 0) continue;
      const ox = tx * 6.2 + (ty % 2 ? 3.1 : 0), oy = ty * 5.4;
      for (let i = 0; i < 6; i++) {
        const a0 = (i / 6) * TAU + Math.PI / 6, a1 = ((i + 1) / 6) * TAU + Math.PI / 6;
        tile.push(ox + Math.cos(a0) * 3.0, oy + Math.sin(a0) * 3.0, -1, ox + Math.cos(a1) * 3.0, oy + Math.sin(a1) * 3.0, -1);
        tile.push(ox, oy, -1, ox + Math.cos(a0) * 3.0, oy + Math.sin(a0) * 3.0, -1);
      }
    }
    return { lines: new Float32Array(lines), nodes, hex: new Float32Array(hex), tile: new Float32Array(tile), circles: centres.map(([x, y]) => ({ x, y, pts: ring(r) })) };
  }, []);

  useFrame((s) => {
    const t = s.clock.elapsedTime * (reduced ? 0.15 : 1);
    if (root.current) {
      root.current.rotation.x += (-pointer.y * 0.3 - root.current.rotation.x) * 0.04;
      root.current.rotation.y += (pointer.x * 0.3 - root.current.rotation.y) * 0.04;
    }
    if (inner.current) inner.current.rotation.z = t * 0.03;
    if (bg.current) bg.current.rotation.z = -t * 0.008;
  });

  return (
    <group ref={root}>
      <group ref={bg}><Segs pts={g.tile} opacity={0.045} /></group>
      <Segs pts={g.hex} opacity={0.28} />
      <group ref={inner}>
        <Segs pts={g.lines} opacity={0.2} />
        {g.circles.map((c, i) => (
          <group key={i} position={[c.x, c.y, 0]}><Strip pts={c.pts} opacity={0.07} /></group>
        ))}
        <Dots pts={g.nodes} opacity={1} size={0.09} />
      </group>
    </group>
  );
}

export default function Metatron() {
  const reduced = useReducedMotion();
  return (
    <AssetCanvas camera={{ position: [0, 0, 9], fov: 42 }} bloom={0.9}>
      <Scene reduced={reduced} />
    </AssetCanvas>
  );
}
