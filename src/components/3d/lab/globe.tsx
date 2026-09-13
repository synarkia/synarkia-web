"use client";
/** Market Map — a dotted globe with isobar-style pressure curves and trajectories between markets. GTM. */
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { AssetCanvas, Dots, Strip, Spark, rng, TAU, useReducedMotion } from "./shared";

const R = 3.0;
const sph = (lat: number, lon: number, r = R) =>
  new THREE.Vector3(r * Math.cos(lat) * Math.cos(lon), r * Math.sin(lat), r * Math.cos(lat) * Math.sin(lon));

function Scene({ reduced }: { reduced: boolean }) {
  const root = useRef<THREE.Group>(null);
  const sats = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  const g = useMemo(() => {
    const r = rng(41);
    // dotted graticule
    const grid: number[] = [];
    for (let la = -75; la <= 75; la += 15) {
      const lat = (la / 180) * Math.PI;
      const n = Math.max(24, Math.round(160 * Math.cos(lat)));
      for (let i = 0; i < n; i++) { const p = sph(lat, (i / n) * TAU); grid.push(p.x, p.y, p.z); }
    }
    for (let lo = 0; lo < 360; lo += 20) {
      const lon = (lo / 180) * Math.PI;
      for (let i = 0; i < 120; i++) { const p = sph(-Math.PI / 2 + (i / 120) * Math.PI, lon); grid.push(p.x, p.y, p.z); }
    }
    // isobars: closed curves around two "pressure centres" projected onto the sphere
    const isobars: Float32Array[] = [];
    const centres = [{ lat: 0.9, lon: 0.6 }, { lat: -0.85, lon: 3.6 }, { lat: 0.2, lon: 2.2 }];
    centres.forEach((c, ci) => {
      for (let k = 1; k <= 6; k++) {
        const seg = 160, a = new Float32Array((seg + 1) * 3);
        for (let i = 0; i <= seg; i++) {
          const t = (i / seg) * TAU;
          const rad = k * 0.17 * (1 + 0.25 * Math.sin(t * 2 + ci) + 0.12 * Math.sin(t * 5 + k));
          const lat = c.lat + Math.sin(t) * rad, lon = c.lon + (Math.cos(t) * rad) / Math.max(0.25, Math.cos(c.lat));
          const p = sph(lat, lon, R * 1.004);
          a[i * 3] = p.x; a[i * 3 + 1] = p.y; a[i * 3 + 2] = p.z;
        }
        isobars.push(a);
      }
    });
    // great-circle trajectories
    const routes: { pts: Float32Array; a: THREE.Vector3; b: THREE.Vector3 }[] = [];
    for (let i = 0; i < 7; i++) {
      const a = sph((r() - 0.5) * 2.4, r() * TAU).normalize(), b = sph((r() - 0.5) * 2.4, r() * TAU).normalize();
      const seg = 80, arr = new Float32Array((seg + 1) * 3);
      for (let j = 0; j <= seg; j++) {
        const t = j / seg;
        const v = new THREE.Vector3().copy(a).lerp(b, t).normalize();
        const lift = R * (1 + Math.sin(t * Math.PI) * 0.12);
        arr[j * 3] = v.x * lift; arr[j * 3 + 1] = v.y * lift; arr[j * 3 + 2] = v.z * lift;
      }
      routes.push({ pts: arr, a, b });
    }
    // equator + solid rim rings
    const seg = 256, eq = new Float32Array((seg + 1) * 3);
    for (let i = 0; i <= seg; i++) { const p = sph(0, (i / seg) * TAU, R * 1.01); eq[i * 3] = p.x; eq[i * 3 + 1] = p.y; eq[i * 3 + 2] = p.z; }
    return { grid: new Float32Array(grid), isobars, routes, eq };
  }, []);

  useFrame((s) => {
    const t = s.clock.elapsedTime * (reduced ? 0.15 : 1);
    if (root.current) {
      root.current.rotation.y = t * 0.08 + pointer.x * 0.3;
      root.current.rotation.x += (0.28 - pointer.y * 0.2 - root.current.rotation.x) * 0.04;
    }
    if (sats.current) {
      sats.current.children.forEach((c, i) => {
        const rt = g.routes[i];
        const u = (t * 0.12 + i * 0.17) % 1;
        const v = new THREE.Vector3().copy(rt.a).lerp(rt.b, u).normalize();
        const lift = R * (1 + Math.sin(u * Math.PI) * 0.12);
        c.position.set(v.x * lift, v.y * lift, v.z * lift);
      });
    }
  });

  return (
    <group ref={root}>
      <Dots pts={g.grid} opacity={0.42} size={0.028} />
      <Strip pts={g.eq} opacity={0.5} />
      {g.isobars.map((p, i) => <Strip key={i} pts={p} opacity={0.34} />)}
      {g.routes.map((rt, i) => <Strip key={"r" + i} pts={rt.pts} opacity={0.22} />)}
      <group ref={sats}>{g.routes.map((_, i) => <Spark key={i} size={0.05} />)}</group>
      {/* occluder so the far side reads dimmer */}
      <mesh><sphereGeometry args={[R * 0.985, 48, 48]} /><meshBasicMaterial color="#060608" transparent opacity={0.72} /></mesh>
    </group>
  );
}

export default function Globe() {
  const reduced = useReducedMotion();
  return (
    <AssetCanvas camera={{ position: [0, 0, 8.4], fov: 45 }} bloom={0.55}>
      <Scene reduced={reduced} />
    </AssetCanvas>
  );
}
