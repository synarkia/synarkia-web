"use client";
/** Structure — a triangulated dome of nodes and edges; light travels the network. Websites & Apps. */
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { AssetCanvas, Dots, Spark, LIGHT, rng, TAU, useReducedMotion } from "./shared";

function Scene({ reduced }: { reduced: boolean }) {
  const root = useRef<THREE.Group>(null);
  const sats = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  const g = useMemo(() => {
    const R = 3.1;
    const inner = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(R, 3));
    const outer = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(R * 1.28, 1));
    const verts = new THREE.IcosahedronGeometry(R, 3).getAttribute("position") as THREE.BufferAttribute;
    const nodes = new Float32Array(verts.array as Float32Array);
    // far starlets
    const r = rng(23);
    const stars: number[] = [];
    for (let i = 0; i < 700; i++) {
      const rad = 9 + r() * 14, th = r() * TAU, ph = Math.acos(2 * r() - 1);
      stars.push(rad * Math.sin(ph) * Math.cos(th), rad * Math.sin(ph) * Math.sin(th), rad * Math.cos(ph) - 8);
    }
    // random long chords across the sphere (links)
    const chords: number[] = [];
    for (let i = 0; i < 60; i++) {
      const th1 = r() * TAU, ph1 = Math.acos(2 * r() - 1), th2 = r() * TAU, ph2 = Math.acos(2 * r() - 1);
      chords.push(
        R * Math.sin(ph1) * Math.cos(th1), R * Math.sin(ph1) * Math.sin(th1), R * Math.cos(ph1),
        R * Math.sin(ph2) * Math.cos(th2), R * Math.sin(ph2) * Math.sin(th2), R * Math.cos(ph2)
      );
    }
    const chordGeo = new THREE.BufferGeometry();
    chordGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(chords), 3));
    const orbits = Array.from({ length: 5 }, () => ({ tilt: r() * Math.PI, spin: r() * Math.PI, v: 0.15 + r() * 0.3, ph: r() * TAU }));
    return { inner, outer, nodes, stars: new Float32Array(stars), chordGeo, orbits, R };
  }, []);

  useFrame((s) => {
    const t = s.clock.elapsedTime * (reduced ? 0.15 : 1);
    if (root.current) {
      root.current.rotation.y = t * 0.06;
      root.current.rotation.x += (0.18 - pointer.y * 0.2 - root.current.rotation.x) * 0.04;
    }
    if (sats.current) {
      sats.current.children.forEach((c, i) => {
        const o = g.orbits[i];
        const a = t * o.v + o.ph;
        const v = new THREE.Vector3(Math.cos(a) * g.R * 1.01, Math.sin(a) * g.R * 1.01, 0);
        v.applyEuler(new THREE.Euler(o.tilt, o.spin, 0));
        c.position.copy(v);
      });
    }
  });

  return (
    <>
      <Dots pts={g.stars} opacity={0.4} size={0.03} />
      <group ref={root} position={[0, -1.4, 0]}>
        <lineSegments geometry={g.inner}>
          <lineBasicMaterial color={LIGHT} transparent opacity={0.22} toneMapped={false} depthWrite={false} />
        </lineSegments>
        <lineSegments geometry={g.outer}>
          <lineBasicMaterial color={LIGHT} transparent opacity={0.06} toneMapped={false} depthWrite={false} />
        </lineSegments>
        <lineSegments geometry={g.chordGeo}>
          <lineBasicMaterial color={LIGHT} transparent opacity={0.05} toneMapped={false} depthWrite={false} />
        </lineSegments>
        <Dots pts={g.nodes} opacity={0.85} size={0.05} />
        <group ref={sats}>
          {g.orbits.map((_, i) => (<Spark key={i} size={0.055} />))}
        </group>
      </group>
    </>
  );
}

export default function LatticeSphere() {
  const reduced = useReducedMotion();
  return (
    <AssetCanvas camera={{ position: [0, 0.6, 7.4], fov: 42 }} bloom={0.7}>
      <Scene reduced={reduced} />
    </AssetCanvas>
  );
}
