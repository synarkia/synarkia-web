"use client";
/** The Method — four instrument gates in sequence; each pulse passes Map, Design, Build, Ship. */
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { AssetCanvas, Strip, Segs, Spark, LIGHT, TAU, useReducedMotion } from "./shared";

const GATES = [0, -3.6, -7.2, -10.8];
const RADIUS = 1.35;

function ring(radius: number, seg = 128): Float32Array {
  const a = new Float32Array((seg + 1) * 3);
  for (let i = 0; i <= seg; i++) { const t = (i / seg) * TAU; a[i * 3] = Math.cos(t) * radius; a[i * 3 + 1] = Math.sin(t) * radius; }
  return a;
}
function ticks(radius: number, count: number, len: number): Float32Array {
  const p: number[] = [];
  for (let i = 0; i < count; i++) { const t = (i / count) * TAU, c = Math.cos(t), s = Math.sin(t); p.push(c * radius, s * radius, 0, c * (radius + len), s * (radius + len), 0); }
  return new Float32Array(p);
}

function Gate({ z, index, pulseRef }: { z: number; index: number; pulseRef: React.MutableRefObject<number> }) {
  const grp = useRef<THREE.Group>(null);
  const glow = useRef<THREE.Mesh>(null);
  const pts = useMemo(() => ({ r1: ring(RADIUS), r2: ring(RADIUS * 0.72), tk: ticks(RADIUS, 48, 0.12), tkM: ticks(RADIUS, 8, 0.28) }), []);
  useFrame((s) => {
    const d = Math.abs(pulseRef.current - z);
    const hit = Math.max(0, 1 - d / 0.9);
    if (grp.current) {
      grp.current.rotation.z = s.clock.elapsedTime * (index % 2 ? -0.08 : 0.08);
      grp.current.scale.setScalar(1 + hit * 0.06);
    }
    if (glow.current) (glow.current.material as THREE.MeshBasicMaterial).opacity = hit * 0.35;
  });
  return (
    <group position={[0, 0, z]}>
      <group ref={grp}>
        <Strip pts={pts.r1} opacity={0.5} loop />
        <Strip pts={pts.r2} opacity={0.2} loop />
        <Segs pts={pts.tk} opacity={0.3} />
        <Segs pts={pts.tkM} opacity={0.6} />
      </group>
      <mesh ref={glow}><ringGeometry args={[RADIUS * 0.95, RADIUS * 1.05, 64]} /><meshBasicMaterial color={LIGHT} transparent opacity={0} toneMapped={false} /></mesh>
    </group>
  );
}

function Scene({ reduced }: { reduced: boolean }) {
  const root = useRef<THREE.Group>(null);
  const spark = useRef<THREE.Group>(null);
  const trail = useRef<THREE.Points>(null);
  const pulse = useRef(2);
  const { pointer } = useThree();
  const rails = useMemo(() => {
    const p: number[] = [];
    for (let i = 0; i < 12; i++) { const t = (i / 12) * TAU; p.push(Math.cos(t) * RADIUS, Math.sin(t) * RADIUS, 1.5, Math.cos(t) * RADIUS, Math.sin(t) * RADIUS, -12); }
    return new Float32Array(p);
  }, []);
  const trailGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(40 * 3), 3));
    return g;
  }, []);

  useFrame((s) => {
    const t = s.clock.elapsedTime * (reduced ? 0.2 : 1);
    const u = (t * 0.22) % 1;
    const z = 2 - u * 16;
    pulse.current = z;
    if (spark.current) spark.current.position.z = z;
    if (trail.current) {
      const arr = trailGeo.getAttribute("position").array as Float32Array;
      for (let i = 0; i < 40; i++) { arr[i * 3] = 0; arr[i * 3 + 1] = 0; arr[i * 3 + 2] = z + i * 0.09; }
      trailGeo.getAttribute("position").needsUpdate = true;
    }
    if (root.current) {
      root.current.rotation.y += (1.0 + pointer.x * 0.1 - root.current.rotation.y) * 0.04;
      root.current.rotation.x += (0.1 - pointer.y * 0.08 - root.current.rotation.x) * 0.04;
    }
  });

  return (
    <group ref={root} position={[-0.2, 0.15, 0]} rotation={[0.1, 1.0, 0]}>
      <group position={[0, 0, 4.4]}>
        <Segs pts={rails} opacity={0.08} />
        {GATES.map((z, i) => <Gate key={i} z={z} index={i} pulseRef={pulse} />)}
        <group ref={spark}><Spark size={0.08} /></group>
        <points ref={trail} geometry={trailGeo}><pointsMaterial color={LIGHT} size={0.06} sizeAttenuation transparent opacity={0.5} toneMapped={false} depthWrite={false} /></points>
      </group>
      <fog attach="fog" args={["#060608", 6, 22]} />
    </group>
  );
}

export default function MethodTunnel() {
  const reduced = useReducedMotion();
  return (
    <AssetCanvas camera={{ position: [0, 0, 11.5], fov: 38 }} bloom={0.8}>
      <Scene reduced={reduced} />
    </AssetCanvas>
  );
}
