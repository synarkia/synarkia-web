"use client";

/**
 * Light Constellation — a quiet field of points joined by a faint mesh.
 * Understated, background-weight: drifting dots, thin connecting lines,
 * a barely-there crystalline core. Strictly monochrome; light is the only color.
 *
 * Optimized: positions + line mesh precomputed once, single points buffer,
 * capped DPR, gentle drift, pointer parallax, respects reduced-motion.
 */

import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const LIGHT = new THREE.Color("#F4F1E9");

/* ── Build the constellation: nodes + nearest-neighbour links ── */
function useConstellation(nodeCount: number, links: number) {
  return useMemo(() => {
    const spread = { x: 11, y: 6.5, z: 5 };
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * spread.x * 2,
          (Math.random() - 0.5) * spread.y * 2,
          (Math.random() - 0.5) * spread.z * 2
        )
      );
    }

    const nodePos = new Float32Array(nodeCount * 3);
    nodes.forEach((n, i) => {
      nodePos[i * 3] = n.x;
      nodePos[i * 3 + 1] = n.y;
      nodePos[i * 3 + 2] = n.z;
    });

    // connect each node to its `links` nearest neighbours (deduped)
    const seen = new Set<string>();
    const segs: number[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const dists: { j: number; d: number }[] = [];
      for (let j = 0; j < nodeCount; j++) {
        if (i === j) continue;
        dists.push({ j, d: nodes[i].distanceToSquared(nodes[j]) });
      }
      dists.sort((a, b) => a.d - b.d);
      for (let k = 0; k < links && k < dists.length; k++) {
        const j = dists[k].j;
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) continue;
        seen.add(key);
        segs.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z);
      }
    }

    return { nodePos, linePos: new Float32Array(segs), nodeCount };
  }, [nodeCount, links]);
}

function Network({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const { nodePos, linePos } = useConstellation(120, 2);

  // fine background dust
  const dust = useMemo(() => {
    const n = 900;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 9 + Math.random() * 16;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  const crystal = useRef<THREE.Mesh>(null);
  const s = reduced ? 0.18 : 1;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = t * 0.018 * s;
      group.current.position.y = Math.sin(t * 0.12) * 0.25 * s;
      // gentle pointer parallax
      const tx = pointer.y * 0.06;
      const ty = pointer.x * 0.12;
      group.current.rotation.x += (tx - group.current.rotation.x) * 0.03;
      group.current.rotation.z += (ty * 0.2 - group.current.rotation.z) * 0.03;
    }
    if (crystal.current) {
      crystal.current.rotation.y = t * 0.05 * s;
      crystal.current.rotation.x = t * 0.03 * s;
    }
  });

  return (
    <group ref={group}>
      {/* faint connecting mesh */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePos, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={LIGHT} transparent opacity={0.1} toneMapped={false} />
      </lineSegments>

      {/* constellation nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePos, 3]} />
        </bufferGeometry>
        <pointsMaterial color={LIGHT} size={0.06} sizeAttenuation transparent opacity={0.85} depthWrite={false} toneMapped={false} />
      </points>

      {/* background dust */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dust, 3]} />
        </bufferGeometry>
        <pointsMaterial color={LIGHT} size={0.022} sizeAttenuation transparent opacity={0.4} depthWrite={false} toneMapped={false} />
      </points>

      {/* barely-there crystalline core */}
      <mesh ref={crystal}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial color={LIGHT} wireframe transparent opacity={0.06} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function Constellation() {
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
      camera={{ position: [0, 0, 13], fov: 46 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <Network reduced={reduced} />
        <EffectComposer>
          <Bloom intensity={0.45} luminanceThreshold={0.5} luminanceSmoothing={0.9} mipmapBlur radius={0.6} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
