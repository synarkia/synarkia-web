"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Float } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { SceneCanvas } from "./scene-canvas";
import { TOKEN_HEX } from "@/hooks/use-design-tokens";

export interface GradientBlobProps {
  /** Primary color — defaults to lavender */
  colorA?: string;
  /** Secondary color — defaults to saffron */
  colorB?: string;
  /** Distortion intensity 0-1 — defaults to 0.4 */
  distort?: number;
  /** Animation speed — defaults to 2 */
  speed?: number;
  /** Blob scale — defaults to 2.5 */
  scale?: number;
  /** Show bloom glow — defaults to true */
  bloom?: boolean;
  className?: string;
}

function BlobScene({
  colorA = TOKEN_HEX.lavender,
  colorB = TOKEN_HEX.saffron,
  distort = 0.4,
  speed = 2,
  scale = 2.5,
  bloom = true,
}: Omit<GradientBlobProps, "className">) {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const colorStart = useRef(new THREE.Color(colorA));
  const colorEnd = useRef(new THREE.Color(colorB));

  useFrame((state) => {
    if (materialRef.current) {
      const t = (Math.sin(state.clock.elapsedTime * 0.3) + 1) / 2;
      materialRef.current.color.lerpColors(colorStart.current, colorEnd.current, t);
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 3, 5]} intensity={0.8} />

      <Float
        speed={1.5}
        rotationIntensity={0.4}
        floatIntensity={0.6}
        floatingRange={[-0.1, 0.1]}
      >
        <Sphere args={[1, 128, 128]} scale={scale}>
          <MeshDistortMaterial
            ref={materialRef}
            color={colorA}
            roughness={0.2}
            metalness={0.1}
            distort={distort}
            speed={speed}
            transparent
            opacity={0.85}
          />
        </Sphere>
      </Float>

      {bloom && (
        <EffectComposer>
          <Bloom
            intensity={0.6}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </>
  );
}

export function GradientBlob({ className, ...sceneProps }: GradientBlobProps) {
  return (
    <SceneCanvas className={className} fov={45} cameraPosition={[0, 0, 6]}>
      <BlobScene {...sceneProps} />
    </SceneCanvas>
  );
}
