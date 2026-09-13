"use client";
/** The Engine Room — a perspective grid corridor with data packets travelling the rails. Internal Tools. */
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { AssetCanvas, Segs, Dots, Spark, rng, useReducedMotion } from "./shared";

const W = 3.2, H = 2.0, DEPTH = 44, STEP = 1.0;

function Room({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const packets = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  const g = useMemo(() => {
    const rails: number[] = [];
    const rings: number[] = [];
    const nodes: number[] = [];
    // longitudinal rails on 4 faces
    for (let x = -W; x <= W + 1e-6; x += STEP) {
      rails.push(x, -H, 0, x, -H, -DEPTH, x, H, 0, x, H, -DEPTH);
    }
    for (let y = -H; y <= H + 1e-6; y += STEP) {
      rails.push(-W, y, 0, -W, y, -DEPTH, W, y, 0, W, y, -DEPTH);
    }
    // cross rings every STEP*2 (period for the seamless loop)
    for (let z = 0; z >= -DEPTH; z -= STEP * 2) {
      rings.push(-W, -H, z, W, -H, z, W, -H, z, W, H, z, W, H, z, -W, H, z, -W, H, z, -W, -H, z);
      for (let x = -W; x <= W + 1e-6; x += STEP) { nodes.push(x, -H, z, x, H, z); }
      for (let y = -H; y <= H + 1e-6; y += STEP) { nodes.push(-W, y, z, W, y, z); }
    }
    // packets: pick random rails
    const r = rng(11);
    const lanes: { x: number; y: number; v: number; ph: number }[] = [];
    for (let i = 0; i < 26; i++) {
      const side = Math.floor(r() * 4);
      const k = Math.floor(r() * 7);
      const x = side < 2 ? -W + k * STEP : side === 2 ? -W : W;
      const y = side < 2 ? (side === 0 ? -H : H) : -H + Math.floor(r() * 5) * STEP;
      lanes.push({ x, y, v: 3 + r() * 6, ph: r() * DEPTH });
    }
    return { rails: new Float32Array(rails), rings: new Float32Array(rings), nodes: new Float32Array(nodes), lanes };
  }, []);

  useFrame((s) => {
    const t = s.clock.elapsedTime * (reduced ? 0.15 : 1);
    if (group.current) {
      group.current.position.z = (t * 1.2) % (STEP * 2);
      group.current.rotation.y += (pointer.x * 0.05 - group.current.rotation.y) * 0.04;
      group.current.rotation.x += (pointer.y * 0.04 - group.current.rotation.x) * 0.04;
    }
    if (packets.current) {
      packets.current.children.forEach((c, i) => {
        const ln = g.lanes[i];
        c.position.z = -((t * ln.v + ln.ph) % DEPTH);
      });
    }
  });

  return (
    <group ref={group}>
      <Segs pts={g.rails} opacity={0.16} />
      <Segs pts={g.rings} opacity={0.08} />
      <Dots pts={g.nodes} opacity={0.5} size={0.035} />
      <group ref={packets}>
        {g.lanes.map((ln, i) => (
          <group key={i} position={[ln.x, ln.y, 0]}>
            <Spark size={0.045} />
          </group>
        ))}
      </group>
      <fog attach="fog" args={["#060608", 4, 34]} />
    </group>
  );
}

export default function GridRoom() {
  const reduced = useReducedMotion();
  return (
    <AssetCanvas camera={{ position: [0, 0, 1.5], fov: 70 }} bloom={0.8}>
      <Room reduced={reduced} />
    </AssetCanvas>
  );
}
