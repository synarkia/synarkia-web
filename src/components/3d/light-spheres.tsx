"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Float } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function MovingSphere({ position, color, scale, speed, phase }: { position: [number, number, number], color: string, scale: number, speed: number, phase: number }) {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.elapsedTime * speed + phase;
        // Organic movement
        meshRef.current.position.x = position[0] + Math.sin(t) * 1.5;
        meshRef.current.position.y = position[1] + Math.cos(t * 0.8) * 0.8;
    });

    return (
        <Float speed={speed * 2} rotationIntensity={0.5} floatIntensity={1}>
            <Sphere ref={meshRef} args={[1, 64, 64]} scale={scale}>
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={1.5}
                    roughness={0.2}
                    metalness={0.8}
                    toneMapped={false}
                />
            </Sphere>
        </Float>
    );
}

export function LightSpheres() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />

            {/* Sphere 1 - Lavender-ish */}
            <MovingSphere position={[-1.5, 0, 0]} color="#E0D4FF" scale={1.4} speed={0.4} phase={0} />

            {/* Sphere 2 - Saffron-ish/Warm */}
            <MovingSphere position={[1.5, 0, 0]} color="#FFF8D4" scale={1.3} speed={0.5} phase={Math.PI} />

            {/* Sphere 3 - White Core */}
            <MovingSphere position={[0, -0.5, 1]} color="#FFFFFF" scale={0.9} speed={0.3} phase={Math.PI / 2} />

            <EffectComposer disableNormalPass>
                <Bloom
                    luminanceThreshold={1}
                    mipmapBlur
                    intensity={1.2}
                    radius={0.6}
                />
            </EffectComposer>
        </>
    );
}
