"use client";

import { useRef } from "react";
import { useFrame, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { SceneCanvas } from "./scene-canvas";
import { TOKEN_HEX } from "@/hooks/use-design-tokens";

const NoisePlaneMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorA: new THREE.Color(TOKEN_HEX.twilight),
    uColorB: new THREE.Color(TOKEN_HEX.lavender),
    uNoiseScale: 1.5,
    uNoiseStrength: 0.5,
    uOpacity: 0.8,
  },
  // Vertex shader
  /* glsl */ `
    uniform float uTime;
    uniform float uNoiseScale;
    uniform float uNoiseStrength;
    varying vec2 vUv;
    varying float vElevation;

    vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
    vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v){
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod(i, 289.0);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 1.0/7.0;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vUv = uv;
      vec3 pos = position;
      float noise = snoise(vec3(pos.x * uNoiseScale, pos.y * uNoiseScale, uTime * 0.3));
      pos.z += noise * uNoiseStrength;
      vElevation = noise;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment shader
  /* glsl */ `
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uOpacity;
    varying vec2 vUv;
    varying float vElevation;

    void main() {
      float mixFactor = (vElevation + 1.0) * 0.5;
      vec3 color = mix(uColorA, uColorB, mixFactor);
      float edgeFade = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x)
                     * smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
      gl_FragColor = vec4(color, uOpacity * edgeFade);
    }
  `
);

extend({ NoisePlaneMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    noisePlaneMaterial: JSX.IntrinsicElements["shaderMaterial"] & {
      uTime?: number;
      uColorA?: THREE.Color;
      uColorB?: THREE.Color;
      uNoiseScale?: number;
      uNoiseStrength?: number;
      uOpacity?: number;
    };
  }
}

export interface NoisePlaneProps {
  /** Base color (low elevation) — defaults to twilight */
  colorA?: string;
  /** Peak color (high elevation) — defaults to lavender */
  colorB?: string;
  /** Noise frequency — defaults to 1.5 */
  noiseScale?: number;
  /** Displacement height — defaults to 0.5 */
  noiseStrength?: number;
  /** Opacity — defaults to 0.8 */
  opacity?: number;
  /** Plane width — defaults to 10 */
  width?: number;
  /** Plane height — defaults to 6 */
  height?: number;
  /** Mesh segments — defaults to 128 */
  segments?: number;
  /** Rotation [x, y, z] — defaults to [-Math.PI/3, 0, 0] */
  rotation?: [number, number, number];
  /** Position [x, y, z] — defaults to [0, -1, 0] */
  position?: [number, number, number];
  className?: string;
}

function NoisePlaneScene({
  colorA = TOKEN_HEX.twilight,
  colorB = TOKEN_HEX.lavender,
  noiseScale = 1.5,
  noiseStrength = 0.5,
  opacity = 0.8,
  width = 10,
  height = 6,
  segments = 128,
  rotation = [-Math.PI / 3, 0, 0],
  position = [0, -1, 0],
}: Omit<NoisePlaneProps, "className">) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh rotation={rotation} position={position}>
      <planeGeometry args={[width, height, segments, segments]} />
      <noisePlaneMaterial
        ref={materialRef}
        uColorA={new THREE.Color(colorA)}
        uColorB={new THREE.Color(colorB)}
        uNoiseScale={noiseScale}
        uNoiseStrength={noiseStrength}
        uOpacity={opacity}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function NoisePlane({ className, ...sceneProps }: NoisePlaneProps) {
  return (
    <SceneCanvas className={className} fov={50} cameraPosition={[0, 0, 5]}>
      <NoisePlaneScene {...sceneProps} />
    </SceneCanvas>
  );
}
