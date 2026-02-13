"use client";

import { useRef, useMemo, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Environment } from "@react-three/drei";

const DROP_COUNT = 10;
const TRICKLE_COUNT = 5; // mini-drops per drop on impact
const SURFACE_Y = -4; // Where they hit and split

function TrickleParticle({ parentPos, index }: { parentPos: THREE.Vector3, index: number }) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const data = useMemo(() => ({
        velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.1,
            -0.05 - Math.random() * 0.1,
            (Math.random() - 0.5) * 0.1
        ),
        scale: 0.04 + Math.random() * 0.06,
        life: 1.0,
    }), []);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.position.add(data.velocity);
            data.life -= delta * 0.5;
            meshRef.current.scale.setScalar(data.scale * data.life);
            if (data.life <= 0) {
                meshRef.current.visible = false;
            }
        }
    });

    return (
        <mesh ref={meshRef} position={parentPos}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
        </mesh>
    );
}

function DropWithTrickle({ index }: { index: number }) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const [isTrickling, setIsTrickling] = useState(false);
    const [impactPos, setImpactPos] = useState(new THREE.Vector3());

    const data = useMemo(() => ({
        x: (Math.random() - 0.5) * 0.5,
        z: (Math.random() - 0.5) * 1,
        offset: Math.random() * 10,
        speed: 2 + Math.random() * 2,
        scale: 0.15 + Math.random() * 0.1,
    }), []);

    useFrame((state) => {
        const t = (state.clock.getElapsedTime() + data.offset) * data.speed;
        const fallDistance = 15;
        const progress = t % 1;
        const y = 8 - progress * fallDistance;

        if (meshRef.current) {
            meshRef.current.position.set(data.x, y, data.z);
            meshRef.current.rotation.x += 0.02;

            // Impact detection
            if (y <= SURFACE_Y && !isTrickling) {
                setIsTrickling(true);
                setImpactPos(meshRef.current.position.clone());
                meshRef.current.visible = false;
            }

            // Reset
            if (y > SURFACE_Y) {
                setIsTrickling(false);
                meshRef.current.visible = true;
            }
        }
    });

    return (
        <group>
            <mesh ref={meshRef} scale={data.scale}>
                <icosahedronGeometry args={[1, 12]} />
                <MeshDistortMaterial
                    color="#000000"
                    roughness={0.05}
                    metalness={1}
                    distort={0.8}
                    speed={5}
                    emissive="#06b6d4"
                    emissiveIntensity={0.5}
                />
            </mesh>
            {isTrickling && (
                <group>
                    {Array.from({ length: TRICKLE_COUNT }).map((_, i) => (
                        <TrickleParticle key={i} index={i} parentPos={impactPos} />
                    ))}
                </group>
            )}
        </group>
    );
}

export function LiquidDrops() {
    return (
        <>
            <Environment preset="city" />
            <ambientLight intensity={0.5} />

            <spotLight position={[-5, 5, 5]} intensity={20} color="#4f46e5" />
            <pointLight position={[5, -5, 5]} intensity={15} color="#06b6d4" />

            <group>
                {Array.from({ length: DROP_COUNT }).map((_, i) => (
                    <DropWithTrickle key={i} index={i} />
                ))}
            </group>
        </>
    );
}
