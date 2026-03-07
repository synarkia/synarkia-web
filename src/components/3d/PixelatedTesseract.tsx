'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Pixelation, Bloom } from '@react-three/postprocessing';

// 4D Rotation matrices
const rotateXW = (theta: number) => {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    return [[c, 0, 0, -s], [0, 1, 0, 0], [0, 0, 1, 0], [s, 0, 0, c]];
};

const rotateYW = (theta: number) => {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    return [[1, 0, 0, 0], [0, c, 0, -s], [0, 0, 1, 0], [0, s, 0, c]];
};

const rotateZW = (theta: number) => {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    return [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, c, -s], [0, 0, s, c]];
};

const matMul4x1 = (a: number[][], b: number[]) => {
    const res = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            res[i] += a[i][j] * b[j];
        }
    }
    return res;
};

const getTesseractVertices = () => {
    const vertices = [];
    for (let i = 0; i < 16; i++) {
        const x = (i & 1) ? 1 : -1;
        const y = (i & 2) ? 1 : -1;
        const z = (i & 4) ? 1 : -1;
        const w = (i & 8) ? 1 : -1;
        vertices.push([x, y, z, w]);
    }
    return vertices;
};

const getTesseractEdges = () => {
    const edges = [];
    for (let i = 0; i < 16; i++) {
        for (let j = i + 1; j < 16; j++) {
            let diff = i ^ j;
            if (diff === 1 || diff === 2 || diff === 4 || diff === 8) {
                edges.push([i, j]);
            }
        }
    }
    return edges;
};

export function PixelatedTesseract({
    pixelSize = 3,
    rotationSpeed = 0.5,
    size = 3.5
}: {
    pixelSize?: number;
    rotationSpeed?: number;
    size?: number;
}) {
    const groupRef = useRef<THREE.Group>(null);
    const vertices4D = useMemo(() => getTesseractVertices(), []);
    const edges = useMemo(() => getTesseractEdges(), []);

    const vertexColors = useMemo(() => {
        // White lines on black with iridescent & obsidian accents
        const white = new THREE.Color("#ffffff");
        const obsidian = new THREE.Color("#111111"); // very dark grey/black
        const teal = new THREE.Color("#00ffcc").multiplyScalar(1.5); // Boost for bloom
        const purple = new THREE.Color("#b800ff").multiplyScalar(1.5);
        const cyan = new THREE.Color("#00ccff").multiplyScalar(1.5);

        return vertices4D.map((v) => {
            const c = new THREE.Color();
            // Start with obsidian or white based on the 4th dimension (w)
            if (v[3] > 0) {
                c.copy(white);
            } else {
                c.copy(obsidian);
            }

            // Add iridescent highlights
            if (v[0] > 0 && v[1] > 0) c.lerp(teal, 0.7);
            else if (v[1] < 0 && v[2] > 0) c.lerp(purple, 0.7);
            else if (v[0] < 0 && v[2] < 0) c.lerp(cyan, 0.7);

            return c;
        });
    }, [vertices4D]);

    const [projectedVertices, setProjectedVertices] = React.useState<THREE.Vector3[]>(
        new Array(16).fill(new THREE.Vector3())
    );

    useFrame((state) => {
        const time = state.clock.getElapsedTime() * rotationSpeed;

        // Complex 4D rotations for a mesmerizing hyperspace feel
        const rXW = rotateXW(time * 0.8);
        const rYW = rotateYW(time * 0.6);
        const rZW = rotateZW(time * 0.4);

        const projected = vertices4D.map(v => {
            let rotated = matMul4x1(rXW, v);
            rotated = matMul4x1(rYW, rotated);
            rotated = matMul4x1(rZW, rotated);

            // Stereographic projection from 4D to 3D
            // Adding a subtle breathing/pulsing directly into the projection distance
            const distance = 2.5 + Math.sin(time * 1.5) * 0.15;
            const w = 1 / (distance - rotated[3]);

            const x = rotated[0] * w * size;
            const y = rotated[1] * w * size;
            const z = rotated[2] * w * size;

            return new THREE.Vector3(x, y, z);
        });

        setProjectedVertices(projected);

        if (groupRef.current) {
            groupRef.current.rotation.x = time * 0.3;
            groupRef.current.rotation.y = time * 0.2;
            groupRef.current.rotation.z = time * 0.1;
        }
    });

    return (
        <>
            <group ref={groupRef}>
                {projectedVertices.map((v, i) => (
                    <Sphere args={[0.04, 16, 16]} position={v} key={`v-${i}`}>
                        <meshBasicMaterial color={vertexColors[i]} toneMapped={false} />
                    </Sphere>
                ))}

                {projectedVertices.length > 0 && edges.map((edge, i) => {
                    const start = projectedVertices[edge[0]];
                    const end = projectedVertices[edge[1]];
                    const colorStart = vertexColors[edge[0]];
                    const colorEnd = vertexColors[edge[1]];

                    return (
                        <Line
                            key={`e-${i}`}
                            points={[start, end]}
                            vertexColors={[colorStart, colorEnd]}
                            lineWidth={2}
                            transparent
                            opacity={0.8}
                            toneMapped={false}
                        />
                    )
                })}
            </group>

            <EffectComposer multisampling={0}>
                <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} intensity={1.2} />
                <Pixelation granularity={pixelSize} />
            </EffectComposer>
        </>
    );
}
