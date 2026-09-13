"use client";
/** Launch — a particle plume rising from a dark ground; the moment a build ships. */
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { AssetCanvas, Dots, softPointShader, rng, TAU, useReducedMotion } from "./shared";

const N = 9000;
const PERIOD = 11; // seconds per launch

function path(u: number) { // u 0..1
  return new THREE.Vector3(-0.6 + u * 2.4 + u * u * 1.2, -3.2 + u * 9.5, 0);
}

function Plume({ reduced }: { reduced: boolean }) {
  const pts = useRef<THREE.Points>(null);
  const head = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  const data = useMemo(() => {
    const r = rng(99);
    const pos = new Float32Array(N * 3), alpha = new Float32Array(N), sz = new Float32Array(N);
    const u0 = new Float32Array(N), born = new Float32Array(N), dir = new Float32Array(N * 3), life = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      u0[i] = -1; born[i] = -100; life[i] = 2 + r() * 6;
      const th = r() * TAU, ph = Math.acos(2 * r() - 1);
      dir[i * 3] = Math.sin(ph) * Math.cos(th); dir[i * 3 + 1] = Math.sin(ph) * Math.sin(th); dir[i * 3 + 2] = Math.cos(ph);
      sz[i] = 2 + r() * 6;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aAlpha", new THREE.BufferAttribute(alpha, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sz, 1));
    // ground: a rough dotted terrain
    const ground: number[] = [];
    for (let i = 0; i < 2600; i++) {
      const x = (r() - 0.5) * 16, z = (r() - 0.5) * 8;
      const y = -3.4 + Math.sin(x * 0.7) * 0.25 + Math.cos(z * 1.1 + x) * 0.18 + (r() - 0.5) * 0.12;
      ground.push(x, y, z);
    }
    return { geo, pos, alpha, u0, born, dir, life, r, ground: new Float32Array(ground) };
  }, []);

  useFrame((s, delta) => {
    const t = s.clock.elapsedTime * (reduced ? 0.3 : 1);
    const cycle = t % PERIOD;
    const uRocket = Math.min(1, cycle / 7.5);
    const rocket = path(uRocket);
    if (head.current) {
      head.current.position.copy(rocket);
      head.current.visible = uRocket < 1;
    }
    const { pos, alpha, u0, born, dir, life, r } = data;
    // spawn a batch each frame at the current rocket position
    const dt = Math.min(0.05, delta);
    const spawn = uRocket < 1 ? Math.round(2400 * dt) : 0;
    let spawned = 0;
    for (let i = 0; i < N; i++) {
      const age = t - born[i];
      if (age > life[i] || born[i] < 0) {
        if (spawned < spawn) {
          born[i] = t; u0[i] = uRocket; spawned++;
          alpha[i] = 0;
        } else { alpha[i] = 0; continue; }
      }
      const a = t - born[i];
      const base = path(u0[i]);
      const spread = Math.sqrt(a) * (0.25 + (1 - u0[i]) * 0.7);
      const gravity = a * a * 0.12;
      pos[i * 3] = base.x + dir[i * 3] * spread + Math.sin(a * 1.3 + i) * 0.04;
      pos[i * 3 + 1] = Math.max(-3.4, base.y + dir[i * 3 + 1] * spread * 0.8 - gravity + a * 0.15);
      pos[i * 3 + 2] = base.z + dir[i * 3 + 2] * spread;
      const k = a / life[i];
      alpha[i] = (1 - k) * (1 - k) * (0.3 - u0[i] * 0.12) * (0.4 + 0.6 * r());
    }
    data.geo.getAttribute("position").needsUpdate = true;
    data.geo.getAttribute("aAlpha").needsUpdate = true;
  });

  return (
    <>
      <Dots pts={data.ground} opacity={0.3} size={0.025} />
      <points ref={pts} geometry={data.geo}>
        <shaderMaterial {...softPointShader} transparent depthWrite={false} blending={THREE.AdditiveBlending}
          uniforms={{ uColor: { value: new THREE.Color("#F4F1E9") }, uScale: { value: size.height * 0.1 } }} />
      </points>
      <mesh ref={head}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshBasicMaterial color="#F4F1E9" toneMapped={false} />
      </mesh>
    </>
  );
}

export default function PlumeAsset() {
  const reduced = useReducedMotion();
  return (
    <AssetCanvas camera={{ position: [0, 0.6, 11], fov: 44 }} bloom={0.5}>
      <Plume reduced={reduced} />
    </AssetCanvas>
  );
}
