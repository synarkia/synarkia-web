import { ThreeCanvas } from '@remotion/three';
import { AbsoluteFill, useVideoConfig, useCurrentFrame, interpolate, random } from 'remotion';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// --- Shaders for Particle Material ---
const particleVertexShader = `
  attribute float size;
  attribute vec3 color;
  varying vec3 vColor;
  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragmentShader = `
  varying vec3 vColor;
  void main() {
    // Circular particle
    float r = distance(gl_PointCoord, vec2(0.5));
    if (r > 0.5) discard;
    
    // Soft edge glow
    float glow = 1.0 - (r * 2.0);
    glow = pow(glow, 1.5);
    
    gl_FragColor = vec4(vColor, glow);
  }
`;

const HyperObject = () => {
    const pointsRef = useRef<THREE.Points>(null);
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Configuration
    const particleCount = 2000; // Dots for structure + flow
    const radiationCount = 1000; // Floating field dots

    // 4D Vertices (Hypercube)
    const vertices4D = useMemo(() => {
        const v: THREE.Vector4[] = [];
        for (let x = -1; x <= 1; x += 2) {
            for (let y = -1; y <= 1; y += 2) {
                for (let z = -1; z <= 1; z += 2) {
                    for (let w = -1; w <= 1; w += 2) {
                        v.push(new THREE.Vector4(x, y, z, w));
                    }
                }
            }
        }
        return v;
    }, []);

    // 32 Edges
    const edges = useMemo(() => {
        const e: [number, number][] = [];
        for (let i = 0; i < 16; i++) {
            for (let j = i + 1; j < 16; j++) {
                const vi = vertices4D[i];
                const vj = vertices4D[j];
                let diff = 0;
                if (vi.x !== vj.x) diff++;
                if (vi.y !== vj.y) diff++;
                if (vi.z !== vj.z) diff++;
                if (vi.w !== vj.w) diff++;
                if (diff === 1) e.push([i, j]);
            }
        }
        return e;
    }, [vertices4D]);

    // Initialize Geometry
    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();

        // Structure Particles (along edges)
        const positions = new Float32Array((particleCount + radiationCount) * 3);
        const sizes = new Float32Array(particleCount + radiationCount);
        const colors = new Float32Array((particleCount + radiationCount) * 3);

        // Initialize radiation particles randomly in a sphere
        for (let i = particleCount; i < particleCount + radiationCount; i++) {
            const r = 4 + Math.random() * 4;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            sizes[i] = Math.random() * 4 + 1;
            colors[i * 3] = 0.5; // R
            colors[i * 3 + 1] = 0.4; // G
            colors[i * 3 + 2] = 0.8; // B (Lavenderish)
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        return geo;
    }, []);

    useFrame(() => {
        if (!geometry.attributes.position) return;

        const positions = geometry.attributes.position.array as Float32Array;
        const colors = geometry.attributes.color.array as Float32Array;
        const sizes = geometry.attributes.size.array as Float32Array;

        const t = frame / fps;

        // 4D Rotation params
        const angleXW = t * 0.4;
        const angleZW = t * 0.2;
        const cosXW = Math.cos(angleXW), sinXW = Math.sin(angleXW);
        const cosZW = Math.cos(angleZW), sinZW = Math.sin(angleZW);

        // Project 4D vertices to 3D
        const projectedVertices: THREE.Vector3[] = vertices4D.map(v => {
            let x = v.x, y = v.y, z = v.z, w = v.w;

            // Rotate XW
            const rx = x * cosXW - w * sinXW;
            const rw = x * sinXW + w * cosXW;
            x = rx; w = rw;

            // Rotate ZW
            const rz = z * cosZW - w * sinZW;
            const rw2 = z * sinZW + w * cosZW;
            z = rz; w = rw2;

            // Perspective Projection
            const distance = 3;
            const factor = 1 / (distance - w);
            return new THREE.Vector3(x * factor, y * factor, z * factor);
        });

        // Update Structure Particles (Interpolate along edges)
        let pIndex = 0;
        const particlesPerEdge = Math.floor(particleCount / edges.length);

        edges.forEach(([startIdx, endIdx], edgeI) => {
            const startV = projectedVertices[startIdx];
            const endV = projectedVertices[endIdx];

            for (let i = 0; i < particlesPerEdge; i++) {
                // Moving particles pattern
                // Use sine wave to cluster density or create flow
                const offset = (i / particlesPerEdge) + (t * 0.5); // Flow speed
                const progress = offset % 1.0;

                const x = startV.x + (endV.x - startV.x) * progress;
                const y = startV.y + (endV.y - startV.y) * progress;
                const z = startV.z + (endV.z - startV.z) * progress;

                // Wiggle / Noise
                const noise = Math.sin(progress * 10 + t * 5) * 0.02;

                positions[pIndex * 3] = x + noise;
                positions[pIndex * 3 + 1] = y + noise;
                positions[pIndex * 3 + 2] = z + noise;

                // Dynamic sizing based on w-depth (simulated here by perspective factor logic roughly)
                sizes[pIndex] = 3.0 + Math.sin(progress * Math.PI) * 2;

                // Color pulse (Gold/Saffron to Lavender)
                const pulse = Math.sin(t * 2 + edgeI) * 0.5 + 0.5;
                colors[pIndex * 3] = 0.9; // R
                colors[pIndex * 3 + 1] = 0.7 + pulse * 0.2; // G
                colors[pIndex * 3 + 2] = 0.3 + pulse * 0.6; // B

                pIndex++;
            }
        });

        // Update Radiation Particles (Magnetic Field Flow)
        for (let i = particleCount; i < particleCount + radiationCount; i++) {
            let x = positions[i * 3];
            let y = positions[i * 3 + 1];
            let z = positions[i * 3 + 2];

            // Magnetic dipole flow simulation (simplified)
            // Move particles around Y axis in toroidal path
            const r = Math.sqrt(x * x + z * z);
            const theta = Math.atan2(x, z) + 0.005; // Rotate around
            const phi = Math.atan2(y, r);

            // Flow outwards/inwards based on simple flow field noise
            // Just simple orbit + slight drift
            x = r * Math.sin(theta);
            z = r * Math.cos(theta);
            // y += Math.sin(t + r) * 0.01;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            // Fade based on distance
            const dist = Math.sqrt(x * x + y * y + z * z);
            sizes[i] = Math.max(0, 5 - dist * 0.5);
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
        geometry.attributes.size.needsUpdate = true;
    });

    return (
        <points ref={pointsRef} geometry={geometry}>
            <shaderMaterial
                vertexShader={particleVertexShader}
                fragmentShader={particleFragmentShader}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

const Scene = () => {
    return (
        <ThreeCanvas
            width={1920}
            height={1080}
            style={{
                backgroundColor: '#000000',
            }}
            camera={{
                fov: 50,
                position: [0, 0, 5], // Closer camera for "Big" feel, or object scaled up?
            }}
        >
            <group scale={1.8}> {/* Scale up to fill background */}
                <HyperObject />
            </group>
        </ThreeCanvas>
    );
};

export const TesseractLoop = () => {
    return (
        <AbsoluteFill>
            <Scene />
            {/* Vignette / Glow Overlay */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/10 to-black/90 pointer-events-none" />
        </AbsoluteFill>
    );
};
