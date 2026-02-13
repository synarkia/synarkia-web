"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Environment, Float } from "@react-three/drei";

const DROP_COUNT = 8;

function FloatingDrip({ index }: { index: number }) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const data = useMemo(() => ({
        delay: Math.random() * 5,
        speed: 0.5 + Math.random() * 0.5,
        x: (Math.random() - 0.5) * 0.4,
        z: (Math.random() - 0.5) * 0.4,
    }), []);

    useFrame((state) => {
        const t = (state.clock.getElapsedTime() + data.delay) * data.speed;
        const progress = t % 1; // 0 to 1 loop

        if (meshRef.current) {
            // Drip from bottom of sphere
            meshRef.current.position.y = -1.5 - progress * 2;
            meshRef.current.position.x = data.x;
            meshRef.current.position.z = data.z;

            // Scale down as it falls
            const s = 0.15 * (1 - progress * 0.5);
            meshRef.current.scale.set(s, s, s);

            // Fade out
            meshRef.current.material.opacity = 1 - progress;
        }
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[1, 16, 16]} />
            <MeshDistortMaterial
                color="#000000"
                roughness={0.05}
                metalness={1}
                distort={0.4}
                speed={4}
                transparent
                emissive="#4f46e5"
                emissiveIntensity={0.2}
            />
        </mesh>
    );
}

export function HyperObject() {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const { clock } = state;
        if (meshRef.current) {
            meshRef.current.rotation.y = clock.getElapsedTime() * 0.08;
            meshRef.current.rotation.z = clock.getElapsedTime() * 0.04;
        }
    });

    return (
        <>
            <Environment preset="city" />
            <ambientLight intensity={0.5} />

            <spotLight
                position={[-10, 10, 8]}
                angle={0.2}
                penumbra={1}
                intensity={25}
                color="#4f46e5"
            />

            <pointLight position={[10, -10, 5]} intensity={15} color="#06b6d4" />

            <group position={[0, 0, -2]}>
                <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
                    <mesh ref={meshRef} scale={5.5}>
                        <icosahedronGeometry args={[1, 15]} />
                        <MeshDistortMaterial
                            color="#000000"
                            roughness={0.05}
                            metalness={1}
                            distort={0.4}
                            speed={2}
                            emissive="#4f46e5"
                            emissiveIntensity={0.1}
                        />
                    </mesh>
                </Float>

                {/* Drips appearing to come out of the sphere */}
                {Array.from({ length: DROP_COUNT }).map((_, i) => (
                    <FloatingDrip key={i} index={i} />
                ))}
            </group>
        </>
    );
}
