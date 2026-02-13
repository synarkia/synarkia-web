"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";

const NODE_COUNT = 32;

// Custom shader for moving flux
const fluxShader = {
    uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#a78bfa") }, // Lavender
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    void main() {
      // Create a moving flux/pulse effect
      float pulse = sin((vUv.y * 5.0) - (uTime * 8.0)) * 0.5 + 0.5;
      float alpha = mix(0.1, 0.7, pulse);
      gl_FragColor = vec4(uColor, alpha);
    }
  `
};

function FluxConnection({ start, end }: { start: THREE.Vector3; end: THREE.Vector3 }) {
    const materialRef = useRef<THREE.ShaderMaterial>(null!);
    const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const distance = start.distanceTo(end);
    const lookAt = end.clone().sub(start).normalize();

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    return (
        <mesh position={midPoint} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), lookAt)}>
            <cylinderGeometry args={[0.012, 0.012, distance, 6]} />
            <shaderMaterial
                ref={materialRef}
                {...fluxShader}
                transparent
                depthWrite={false}
            />
        </mesh>
    );
}

// Material for obsidian glass
const obsidianParams = {
    color: "#020202",
    metalness: 1.0,
    roughness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    transmission: 0.95,
    thickness: 2.0,
    ior: 1.6,
    emissive: "#1e1b4b", // Very dim deep blue
    emissiveIntensity: 0.1,
};

export function ObsidianNetwork() {
    const groupRef = useRef<THREE.Group>(null!);

    const nodes = useMemo(() => {
        const temp = [];
        for (let i = 0; i < NODE_COUNT; i++) {
            temp.push(new THREE.Vector3(
                (Math.random() - 0.5) * 26,
                (Math.random() - 0.5) * 6,
                (Math.random() - 0.5) * 5
            ));
        }
        return temp;
    }, []);

    const connections = useMemo(() => {
        const temp = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dist = nodes[i].distanceTo(nodes[j]);
                if (dist < 5.5 && Math.random() < 0.5) {
                    temp.push({ start: nodes[i], end: nodes[j] });
                }
            }
        }
        return temp;
    }, [nodes]);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
            groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.03;
        }
    });

    return (
        <>
            <Environment preset="night" />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 5, 5]} intensity={20} color="#4f46e5" />
            <pointLight position={[-10, -5, 5]} intensity={10} color="#a855f7" />

            <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.2}>
                <group ref={groupRef} position={[0, -0.6, 0]}>
                    {connections.map((conn, i) => (
                        <FluxConnection key={i} start={conn.start} end={conn.end} />
                    ))}

                    {nodes.map((pos, i) => (
                        <mesh key={i} position={pos}>
                            <boxGeometry args={[0.3 + Math.random() * 0.5, 0.3 + Math.random() * 0.5, 0.3 + Math.random() * 0.5]} />
                            <meshPhysicalMaterial {...obsidianParams} />
                        </mesh>
                    ))}
                </group>
            </Float>
        </>
    );
}
