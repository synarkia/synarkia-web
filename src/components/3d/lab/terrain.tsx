"use client";
/** Summit — a contour-line mountain that keeps rising out of noise. Vibe Coding. */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { AssetCanvas, useReducedMotion } from "./shared";

const NOISE = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);m=m*m;m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;vec3 h=abs(x)-0.5;vec3 ox=floor(x+0.5);vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;return 130.0*dot(m,g);
}`;

const vert = `
uniform float uTime;
varying float vH; varying float vZ;
${NOISE}
void main(){
  vec3 p = position;
  float d = length(p.xz * vec2(1.0, 1.4));
  float peak = exp(-d * d * 0.09) * 5.2;                       // central summit
  float n = snoise(p.xz * 0.35 + uTime * 0.05) * 1.1
          + snoise(p.xz * 0.9 + uTime * 0.08) * 0.42
          + snoise(p.xz * 2.4) * 0.12;
  float ridge = 1.0 - abs(snoise(p.xz * 0.5 + 3.0));
  p.y = peak * (0.65 + 0.35 * ridge) + n * (0.4 + peak * 0.25) - 1.6;
  vH = p.y; vZ = p.z;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;
const frag = `
uniform vec3 uColor; varying float vH; varying float vZ;
void main(){
  float a = smoothstep(-2.4, 2.5, vH) * 0.55 + 0.05;
  a *= smoothstep(-14.0, 2.0, vZ);
  gl_FragColor = vec4(uColor, a);
}`;

function Mountain({ reduced }: { reduced: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geo = useMemo(() => {
    const cols = 140, rows = 70, w = 22, d = 18;
    const pts: number[] = [];
    for (let j = 0; j < rows; j++) {
      const z = -d / 2 + (j / (rows - 1)) * d;
      for (let i = 0; i < cols - 1; i++) {
        const x0 = -w / 2 + (i / (cols - 1)) * w, x1 = -w / 2 + ((i + 1) / (cols - 1)) * w;
        pts.push(x0, 0, z, x1, 0, z);
      }
    }
    // a few across-lines for structure
    for (let i = 0; i < cols; i += 10) {
      const x = -w / 2 + (i / (cols - 1)) * w;
      for (let j = 0; j < rows - 1; j++) {
        const z0 = -d / 2 + (j / (rows - 1)) * d, z1 = -d / 2 + ((j + 1) / (rows - 1)) * d;
        pts.push(x, 0, z0, x, 0, z1);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
    return g;
  }, []);
  useFrame((s) => { if (mat.current) mat.current.uniforms.uTime.value = s.clock.elapsedTime * (reduced ? 0.1 : 1); });
  return (
    <lineSegments geometry={geo}>
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} transparent depthWrite={false}
        uniforms={{ uTime: { value: 0 }, uColor: { value: new THREE.Color("#F4F1E9") } }} />
    </lineSegments>
  );
}

export default function Terrain() {
  const reduced = useReducedMotion();
  return (
    <AssetCanvas camera={{ position: [0, 2.2, 11], fov: 48 }} bloom={0.5}>
      <Mountain reduced={reduced} />
    </AssetCanvas>
  );
}
