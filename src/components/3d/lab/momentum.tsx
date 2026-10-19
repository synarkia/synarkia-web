"use client";

/**
 * Momentum — the picture of the Signal sentence.
 *
 *   "Most small businesses lose momentum in the gap between a good idea
 *    and a system that runs. Syndao closes that gap."
 *
 * One filament carries the whole argument, in seven acts driven by scroll:
 *   I    LINE      a clean idea, travelling
 *   II   TANGLE    it starts looping back on itself
 *   III  SNARL     it knots into turbulence and stops advancing: the gap
 *   IV   CONVERGE  the strands find one line again and drive to a point
 *   V    IGNITION  the point catches
 *   VI   CHAIN     it resolves into a world, and descends: brand, market,
 *                  systems, site, socials, automations
 *   VII  KINGDOM   the last vessel is a place. Walls rise, spires, roads,
 *                  the tools orbit it and the whole thing runs on its own.
 *                  Then the camera pulls back and the system is seen whole.
 *
 * Timing is one table (TL) so the pacing can be read in one place. Every act
 * is a window in scroll progress 0..1; the camera has its own keyframes and
 * always arrives at a row a beat before that row builds.
 */

import { useMemo, useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { decodeLand } from "./land-data";
import { rng, useReducedMotion } from "./shared";
import { ArrowDown } from "lucide-react";

const LIGHT = new THREE.Color("#F4F1E9");
const TAU = Math.PI * 2;
const FOCUS = new THREE.Vector3(0, 3.4, 0); // the crown: where the line converges and the system is struck

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const ramp = (p: number, a: number, b: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** a single beat: rises over [a, b], decays over [b, c] */
const beat = (p: number, a: number, b: number, c: number) => ramp(p, a, b) * (1 - ramp(p, b, c));

/* ── the timeline ──────────────────────────────────────────
   Progress windows for every act. The old dark stretch (the filament
   falling) took 40% of the scroll; it now takes 20%, and the kingdom,
   which used to be a footnote, has the last quarter to itself. */
const TL = {
  fall: [0.0, 0.2] as const,        // acts I-III, the filament falls and snarls
  ignite: [0.175, 0.225] as const,  // act V, the point catches
  world: [0.2, 0.31] as const,      // act VI-a, a world resolves at the crown
  chainStart: 0.305,                // the first path opens
  kingdom: 0.72,                    // the last vessel starts to build
  pulse: 0.875,                     // the kingdom is complete: the system fires
  wide: [0.9, 0.99] as const,       // the camera pulls back and shows it whole
};

/* ── the tree the system descends into ─────────────────────
   A sephirotic arrangement: one source at the crown, two pillars,
   a centre, and a foot. Each vessel is filled in turn, and each one
   builds itself in the shape of what it does. */
export type Kind = "seal" | "zoom" | "converge" | "page" | "multiply" | "mechanism" | "kingdom";

/** the chain: one service leads to the next, and the last one opens the kingdom */
const NODES: { id: string; label: string; pos: THREE.Vector3; r: number; kind: Kind; at: number }[] = [
  { id: "brand", label: "Brand & studio", pos: new THREE.Vector3(-3.6, 0.2, 0), r: 1.0, kind: "seal", at: 0.33 },
  { id: "gtm", label: "GTM consulting", pos: new THREE.Vector3(3.6, 0.2, 0), r: 1.0, kind: "zoom", at: 0.39 },
  { id: "systems", label: "Internal systems", pos: new THREE.Vector3(0, -4.5, 0), r: 1.05, kind: "converge", at: 0.455 },
  { id: "web", label: "Websites & apps", pos: new THREE.Vector3(-3.6, -9.2, 0), r: 1.1, kind: "page", at: 0.52 },
  { id: "social", label: "Social media", pos: new THREE.Vector3(3.6, -9.2, 0), r: 1.0, kind: "multiply", at: 0.58 },
  { id: "auto", label: "Automations", pos: new THREE.Vector3(0, -13.9, 0), r: 1.0, kind: "mechanism", at: 0.645 },
  { id: "kingdom", label: "The kingdom", pos: new THREE.Vector3(0, -20.8, 0), r: 1.5, kind: "kingdom", at: TL.kingdom },
];
const BUILD = 0.04; // how long a vessel takes to draw itself

/** each path opens a beat before the vessel it feeds */
const PATHS: { from: string; to: string; at: number }[] = [
  { from: "source", to: "brand", at: 0.305 },
  { from: "brand", to: "gtm", at: 0.36 },
  { from: "gtm", to: "systems", at: 0.425 },
  { from: "systems", to: "web", at: 0.49 },
  { from: "web", to: "social", at: 0.55 },
  { from: "social", to: "auto", at: 0.615 },
  { from: "auto", to: "kingdom", at: 0.685 },
];
const PATH_DRAW = 0.045; // how long a path takes to draw

/**
 * The camera: [progress, y, z, look-offset]. Monotonic in progress, so the
 * camera never jumps. It settles on each row just before that row builds,
 * holds while the row builds, then glides to the next.
 */
const CAM: [number, number, number, number][] = [
  [0.215, FOCUS.y, 9.0, -0.15],
  [0.315, 0.2, 13.2, -0.15],    // row 1: brand, market
  [0.415, 0.2, 13.2, -0.15],
  [0.45, -4.5, 13.4, -0.15],    // systems
  [0.485, -4.5, 13.4, -0.15],
  [0.515, -9.2, 13.6, -0.15],   // row 3: site, socials
  [0.61, -9.2, 13.6, -0.15],
  [0.64, -13.9, 12.8, -0.15],   // automations
  [0.68, -13.9, 12.8, -0.15],
  [0.725, -18.4, 17.6, -1.75],  // the kingdom, from slightly above
  [0.87, -18.0, 16.2, -2.05],   // a slow drift in while it builds
  [0.9, -18.0, 16.2, -2.05],    // and a hold once it runs
  [0.99, -11.6, 46.0, -0.6],    // the whole system, seen at once, the kingdom clear of the caption
];

const SIMPLEX = `
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

/** the filament: shape lives here, not in the buffer */
const VEIL_VERT = `
  attribute float aU;      // 0..1 along the filament
  attribute float aStrand; // 0..1 across the veil
  uniform float uTime, uReveal, uSettle;
  uniform vec3 uFocus;
  varying float vU, vStrand, vChaos;
  ${SIMPLEX}
  void main() {
    float u = aU;
    float s = aStrand;

    // the idea falls from above, then stalls through the gap
    float march = smoothstep(0.0, 0.40, u) * 0.52 + smoothstep(0.40, 0.66, u) * 0.10 + smoothstep(0.66, 1.0, u) * 0.38;
    vec3 p = vec3(0.0, mix(17.5, uFocus.y, march), 0.0);

    // envelopes: looping starts, turbulence peaks, both die as it converges
    float loops = smoothstep(0.12, 0.42, u) * (1.0 - smoothstep(0.62, 0.80, u));
    float chaos = smoothstep(0.34, 0.56, u) * (1.0 - smoothstep(0.62, 0.78, u));
    chaos *= mix(1.0, 0.55, uSettle); // the snarl relaxes once the system takes over
    vChaos = chaos;

    // it coils back through itself
    float coil = u * 52.0 + s * 6.2831 * 0.42 + uTime * 0.30;
    float rad = (0.28 + s * 0.42) * loops;
    p.x += sin(coil) * rad;
    p.z += cos(coil) * rad * 0.8;

    // then loses the thread entirely
    float tw = uTime * 0.14;
    p.x += snoise(vec2(u * 6.5 + 31.0, s * 3.1 - tw)) * 1.65 * chaos;
    p.y += snoise(vec2(u * 6.5 + tw, s * 3.1)) * 1.15 * chaos;
    p.z += snoise(vec2(u * 4.8 - 17.0, s * 2.4 + tw * 0.7)) * 1.35 * chaos;

    // and is drawn back to a single point
    float conv = smoothstep(0.70, 0.97, u);
    p = mix(p, uFocus, conv * conv);

    vU = u;
    vStrand = s;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`;
const VEIL_FRAG = `
  uniform vec3 uColor;
  uniform float uOpacity, uReveal, uTime;
  varying float vU, vStrand, vChaos;
  void main() {
    if (vU > uReveal) discard;
    // the drawing edge burns brighter
    float head = smoothstep(uReveal - 0.035, uReveal, vU);
    // the clean stretches read solid, the snarl thins out into a veil
    float body = mix(0.9, 0.18, smoothstep(0.0, 0.7, vChaos));
    // a slow shimmer travelling the strands keeps the veil alive
    float shimmer = 0.5 + 0.5 * sin(vU * 26.0 - uTime * 1.1 + vStrand * 5.0);
    float a = uOpacity * (body * (0.58 + 0.42 * shimmer) + head * 1.5);
    gl_FragColor = vec4(uColor, a);
  }
`;

/**
 * Emergence: data thrown out of the singularity, then resolving onto the world.
 * The same points do both, so complexity visibly simplifies into structure.
 */
const EMERGE_VERT = `
  attribute vec3 aDir;
  attribute float aSeed;
  attribute float aStagger;
  uniform float uEmerge, uResolve, uTime, uSize, uScale;
  varying float vAlpha, vHot;
  ${SIMPLEX}
  void main() {
    float st = aStagger;
    float e = clamp((uEmerge - st * 0.55) / 0.45, 0.0, 1.0);
    e = e * e * (3.0 - 2.0 * e);
    float r = clamp((uResolve - st * 0.5) / 0.5, 0.0, 1.0);
    r = r * r * (3.0 - 2.0 * r);

    // thrown outward, still turbulent
    float d = e * (1.5 + aSeed * 3.1);
    vec3 burst = aDir * d;
    float tw = uTime * 0.22;
    burst += vec3(
      snoise(vec2(aSeed * 17.0, tw)),
      snoise(vec2(aSeed * 17.0 + 9.0, tw)),
      snoise(vec2(aSeed * 17.0 + 23.0, tw * 0.8))
    ) * 0.62 * e * (1.0 - r);

    // then pulled into its place on the sphere
    vec3 p = mix(burst, position, r);

    vHot = e * (1.0 - r);
    vAlpha = (0.3 + 0.7 * aSeed) * e * mix(1.0, 0.62, r);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = max(1.5, uSize * (0.55 + 0.75 * aSeed) * mix(1.8, 1.0, r) * uScale / max(0.001, -mv.z));
    gl_Position = projectionMatrix * mv;
  }
`;
const EMERGE_FRAG = `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha, vHot;
  void main() {
    vec2 d = gl_PointCoord - 0.5;
    float l = length(d);
    if (l > 0.5) discard;
    float a = smoothstep(0.5, 0.06, l) * vAlpha * uOpacity;
    gl_FragColor = vec4(uColor + vHot * 0.3, a);
  }
`;

/** volumes rising out of the ground: the world that gets built */
const CITY_VERT = `
  attribute float aOrder;
  attribute float aBase;
  uniform float uGrow, uTime;
  varying float vH;
  void main() {
    float g = clamp((uGrow - aOrder * 0.6) / 0.4, 0.0, 1.0);
    g = g * g * (3.0 - 2.0 * g);
    vec3 p = position;
    p.y = aBase + (p.y - aBase) * g;
    vH = clamp((p.y - aBase) / 2.2, 0.0, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const CITY_FRAG = `
  uniform vec3 uColor; uniform float uOpacity;
  varying float vH;
  void main() {
    // foundations stay quiet; the light is in the rising edges and the points
    float k = (0.35 + 0.65 * (1.0 - vH * 0.55)) * mix(0.4, 1.0, smoothstep(0.0, 0.06, vH));
    gl_FragColor = vec4(uColor, uOpacity * k);
  }
`;

/** embers: light rising off the kingdom, the sign that it is alive */
const EMBER_VERT = `
  attribute float aSeed;
  uniform float uTime, uBuild, uSize, uScale;
  varying float vA;
  void main() {
    float life = fract(aSeed * 7.31 + uTime * (0.045 + aSeed * 0.05));
    vec3 p = position;
    p.y += life * 7.5;
    p.x += sin(uTime * 0.5 + aSeed * 40.0) * 0.18;
    p.z += cos(uTime * 0.4 + aSeed * 31.0) * 0.12;
    vA = smoothstep(0.0, 0.12, life) * (1.0 - smoothstep(0.55, 1.0, life)) * (0.35 + 0.65 * aSeed) * uBuild;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = max(1.2, uSize * (0.6 + 0.8 * aSeed) * uScale / max(0.001, -mv.z));
    gl_Position = projectionMatrix * mv;
  }
`;
const EMBER_FRAG = `
  uniform vec3 uColor; uniform float uOpacity;
  varying float vA;
  void main() {
    float l = length(gl_PointCoord - 0.5);
    if (l > 0.5) discard;
    gl_FragColor = vec4(uColor, smoothstep(0.5, 0.1, l) * vA * uOpacity);
  }
`;

/** a market: many, then a few, then one, each with its own readings */
const POP_VERT = `
  attribute float aSeed;
  uniform vec2 uFocus;
  uniform float uRadius, uSize, uScale, uBuild;
  varying float vA;
  void main() {
    float d = distance(position.xy, uFocus);
    float inFocus = 1.0 - smoothstep(uRadius * 0.55, uRadius, d);
    vA = mix(0.16, 1.0, inFocus) * uBuild;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = max(1.5, uSize * mix(0.75, 1.7, inFocus) * (0.8 + 0.4 * aSeed) * uScale / max(0.001, -mv.z));
    gl_Position = projectionMatrix * mv;
  }
`;
const POP_FRAG = `
  uniform vec3 uColor; uniform float uOpacity;
  varying float vA;
  void main() {
    if (length(gl_PointCoord - 0.5) > 0.5) discard;
    gl_FragColor = vec4(uColor, vA * uOpacity);
  }
`;

/** anything that draws itself along its own length */
const DRAW_VERT = `
  attribute float aU;
  attribute float aOrder;
  uniform float uReveal;
  varying float vU, vOrder;
  void main() {
    vU = aU; vOrder = aOrder;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const DRAW_FRAG = `
  uniform vec3 uColor;
  uniform float uOpacity, uReveal;
  varying float vU, vOrder;
  void main() {
    // each element waits its turn, then draws from its own start
    float local = clamp((uReveal - vOrder * 0.42) / 0.58, 0.0, 1.0);
    if (vU > local) discard;
    float head = smoothstep(local - 0.06, local, vU);
    gl_FragColor = vec4(uColor, uOpacity * (0.72 + head * 1.5));
  }
`;
/** a path draws at its own moment in the scroll, not on a shared clock */
const PATH_FRAG = `
  uniform vec3 uColor;
  uniform float uOpacity, uP, uDur, uLift;
  varying float vU, vOrder;
  void main() {
    float local = clamp((uP - vOrder) / uDur, 0.0, 1.0);
    local = local * local * (3.0 - 2.0 * local);
    if (vU > local) discard;
    float head = smoothstep(local - 0.08, local, vU) * (1.0 - step(1.0, local));
    gl_FragColor = vec4(uColor, uOpacity * (0.72 + uLift + head * 1.6));
  }
`;

/** rays leaving the ignition point */
const RAY_VERT = `
  attribute float aU;
  attribute float aSeed;
  uniform float uTime, uGrow;
  varying float vU, vSeed;
  void main() {
    vU = aU; vSeed = aSeed;
    vec3 p = position;
    // rays uncurl outward and sway
    float g = clamp(uGrow * 1.15 - aU * 0.15, 0.0, 1.0);
    p = mix(vec3(0.0), p, g);
    float sway = sin(uTime * 0.5 + aSeed * 6.2831 + aU * 3.0) * 0.09 * aU;
    p.y += sway;
    p.z += cos(uTime * 0.42 + aSeed * 5.0 + aU * 2.4) * 0.07 * aU;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p + vec3(0.0, ${FOCUS.y.toFixed(2)}, 0.0), 1.0);
  }
`;
const RAY_FRAG = `
  uniform vec3 uColor; uniform float uOpacity;
  varying float vU, vSeed;
  void main() {
    float taper = 1.0 - smoothstep(0.55, 1.0, vU);
    gl_FragColor = vec4(uColor, uOpacity * taper * (0.55 + 0.45 * vSeed));
  }
`;

const DOT_VERT = `
  uniform float uSize, uScale;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = max(1.35, uSize * uScale / max(0.001, -mv.z));
    gl_Position = projectionMatrix * mv;
  }
`;
const DOT_FRAG = `
  uniform vec3 uColor; uniform float uOpacity;
  void main() {
    if (length(gl_PointCoord - 0.5) > 0.5) discard;
    gl_FragColor = vec4(uColor, uOpacity);
  }
`;

/**
 * Judder is far more visible than a slightly softer image, and a wireframe
 * scene at full resolution on a large retina display is the one thing likely
 * to push a machine below a steady frame. Watch the frame time and spend
 * fewer pixels when it slips. Hysteresis and a cooldown keep it from
 * oscillating, which would be its own kind of flicker.
 */
function AdaptiveResolution() {
  const setDpr = useThree((st) => st.setDpr);
  const ema = useRef(1 / 60);
  const step = useRef(0);
  const hold = useRef(1.2);
  useFrame((_, delta) => {
    ema.current += (Math.min(delta, 0.25) - ema.current) * 0.05;
    hold.current -= delta;
    if (hold.current > 0) return;
    // start crisp: sharp lines are themselves a defence against shimmer
    const top = Math.min(typeof window === "undefined" ? 1.5 : window.devicePixelRatio || 1, 1.75);
    const ladder = [top, Math.min(top, 1.15), 1];
    if (ema.current > 1 / 38 && step.current < ladder.length - 1) {
      step.current += 1;
      setDpr(ladder[step.current]);
      hold.current = 3;
    } else if (ema.current < 1 / 56 && step.current > 0) {
      step.current -= 1;
      setDpr(ladder[step.current]);
      hold.current = 5;
    }
  });
  return null;
}

const ACTS = ["I · LINE", "II · TANGLE", "III · SNARL", "IV · CONVERGE", "V · IGNITION", "VI · CHAIN", "VII · KINGDOM"];

export type MomentumLabels = { kingdom: string; kingdomSub: string; skip: string };
const DEFAULT_LABELS: MomentumLabels = { kingdom: "The kingdom", kingdomSub: "Brand, site, socials and tools, running as one.", skip: "Skip to services" };

function Scene({
  getProgress,
  reduced,
  caption,
}: {
  getProgress: () => number;
  reduced: boolean;
  caption: React.RefObject<HTMLDivElement | null>;
}) {
  const { camera, size } = useThree();
  const p = useRef(0);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const STRANDS = 30;
  const SEG = 420;

  /* ---- the filament veil: a parameter grid, shaped in the shader ---- */
  const veil = useMemo(() => {
    const verts = STRANDS * SEG * 2;
    const pos = new Float32Array(verts * 3);
    const us = new Float32Array(verts);
    const strand = new Float32Array(verts);
    let w = 0;
    for (let s = 0; s < STRANDS; s++) {
      const sv = s / (STRANDS - 1);
      for (let j = 0; j < SEG; j++) {
        for (const u of [j / SEG, (j + 1) / SEG]) {
          us[w] = u;
          strand[w] = sv;
          w++;
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aU", new THREE.BufferAttribute(us, 1));
    g.setAttribute("aStrand", new THREE.BufferAttribute(strand, 1));
    // the shader builds the shape, so the bounds are declared rather than
    // measured. A truthful sphere lets three.js cull it when it leaves frame.
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 10.5, 0), 10);
    return g;
  }, []);

  /* ---- rays from the ignition ---- */
  const rays = useMemo(() => {
    const r = rng(808);
    const N = 26;
    const S = 34;
    const pos: number[] = [];
    const us: number[] = [];
    const seeds: number[] = [];
    for (let i = 0; i < N; i++) {
      const a = (i / N) * TAU + r() * 0.12;
      const len = 3.0 + r() * 2.4;
      const bend = (r() - 0.5) * 1.5;
      const seed = r();
      for (let j = 0; j < S; j++) {
        for (const k of [j, j + 1]) {
          const u = k / S;
          const ang = a + bend * u * u;
          const d = len * u;
          pos.push(Math.cos(ang) * d, Math.sin(ang) * d, (r() - 0.5) * 0.04);
          us.push(u);
          seeds.push(seed);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute("aU", new THREE.BufferAttribute(new Float32Array(us), 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(new Float32Array(seeds), 1));
    // the shader lifts the rays to the crown, so declare them there
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, FOCUS.y, 0), 6.5);
    return g;
  }, []);

  /* ---- the world, assembled out of the burst ---- */
  const R_WORLD = 1.85;
  const emergence = useMemo(() => {
    const D2R = Math.PI / 180;
    const unit = (lat: number, lon: number) =>
      new THREE.Vector3(Math.cos(lat * D2R) * Math.sin(lon * D2R), Math.sin(lat * D2R), Math.cos(lat * D2R) * Math.cos(lon * D2R));
    const ll = decodeLand();
    const total = ll.length / 2;
    const step = 2;
    const n = Math.floor(total / step);
    const pos = new Float32Array(n * 3);
    const dir = new Float32Array(n * 3);
    const seed = new Float32Array(n);
    const stag = new Float32Array(n);
    const r = rng(4242);
    for (let i = 0; i < n; i++) {
      const k = i * step;
      const v = unit(ll[k * 2], ll[k * 2 + 1]).multiplyScalar(R_WORLD * 1.004);
      pos[i * 3] = v.x;
      pos[i * 3 + 1] = v.y;
      pos[i * 3 + 2] = v.z;
      // thrown out in every direction, biased forward so it reads as a burst
      const th = r() * TAU;
      const ph = Math.acos(2 * r() - 1);
      dir[i * 3] = Math.sin(ph) * Math.cos(th) * 1.25;
      dir[i * 3 + 1] = Math.sin(ph) * Math.sin(th);
      dir[i * 3 + 2] = Math.cos(ph);
      seed[i] = r();
      stag[i] = r();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aDir", new THREE.BufferAttribute(dir, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.setAttribute("aStagger", new THREE.BufferAttribute(stag, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12);

    // the meridians draw themselves once the points have landed
    const grat: number[] = [];
    const gu: number[] = [];
    const go: number[] = [];
    let ring = 0;
    const pushLine = (pts: THREE.Vector3[], order: number) => {
      for (let i = 0; i < pts.length - 1; i++) {
        for (const k of [i, i + 1]) {
          grat.push(pts[k].x, pts[k].y, pts[k].z);
          gu.push(k / (pts.length - 1));
          go.push(order);
        }
      }
    };
    for (let lat = -60; lat <= 60; lat += 20) {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 96; i++) pts.push(unit(lat, (i / 96) * 360 - 180).multiplyScalar(R_WORLD));
      pushLine(pts, (ring++ % 5) / 5);
    }
    for (let lon = -180; lon < 180; lon += 20) {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 48; i++) pts.push(unit(-84 + (i / 48) * 168, lon).multiplyScalar(R_WORLD));
      pushLine(pts, (ring++ % 5) / 5);
    }
    const gg = new THREE.BufferGeometry();
    gg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(grat), 3));
    gg.setAttribute("aU", new THREE.BufferAttribute(new Float32Array(gu), 1));
    gg.setAttribute("aOrder", new THREE.BufferAttribute(new Float32Array(go), 1));
    return { points: g, grat: gg, count: n };
  }, []);

  /* ---- depth: sparse dot lattices sitting at three distances ---- */
  const layers = useMemo(() => {
    const r = rng(31);
    return [-3.5, -7.5, -12.5].map((z, li) => {
      const pts: number[] = [];
      const spacing = 1.1 + li * 0.5;
      for (let x = -16; x <= 16; x += spacing) {
        for (let y = -25; y <= 7; y += spacing) {
          pts.push(x + (r() - 0.5) * 0.1, y + (r() - 0.5) * 0.1, z + (r() - 0.5) * 0.6);
        }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
      return { geo: g, z, depth: li };
    });
  }, []);

  /* ---- the tree: paths, streams, and a vessel per node ---- */
  const tree = useMemo(() => {
    const at = (id: string) => (id === "source" ? FOCUS.clone() : NODES.find((n) => n.id === id)!.pos.clone());
    const rad = (id: string) => (id === "source" ? R_WORLD : NODES.find((n) => n.id === id)!.r);

    // paths, trimmed to the edge of each vessel
    const pp: number[] = [];
    const pu: number[] = [];
    const po: number[] = [];
    const routes = PATHS.map((path, i) => {
      const A = at(path.from);
      const B = at(path.to);
      const d = new THREE.Vector3().subVectors(B, A).normalize();
      const a0 = A.clone().addScaledVector(d, rad(path.from));
      // the last path lands on the mark raised above the keep, not on the vessel's centre
      const b0 = B.clone().addScaledVector(d, -(path.to === "kingdom" ? 5.2 : rad(path.to)));
      // the chain descends in a gentle serpentine rather than a straight rule
      const mid = new THREE.Vector3().lerpVectors(a0, b0, 0.5);
      const perp = new THREE.Vector3(-d.y, d.x, 0).normalize();
      mid.addScaledVector(perp, a0.distanceTo(b0) * (i % 2 === 0 ? 0.12 : -0.12));
      const curve = new THREE.QuadraticBezierCurve3(a0, mid, b0);
      const SEGN = 40;
      for (let j = 0; j < SEGN; j++) {
        for (const k of [j, j + 1]) {
          const u = k / SEGN;
          const v = curve.getPoint(u);
          pp.push(v.x, v.y, v.z);
          pu.push(u);
          po.push(path.at);
        }
      }
      return { ...path, a: a0, b: b0, curve, index: i };
    });
    const pathGeo = new THREE.BufferGeometry();
    pathGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pp), 3));
    pathGeo.setAttribute("aU", new THREE.BufferAttribute(new Float32Array(pu), 1));
    pathGeo.setAttribute("aOrder", new THREE.BufferAttribute(new Float32Array(po), 1));

    // particles that travel the paths and fill the vessels
    const PER = 16;
    const total = routes.length * PER;
    const spos = new Float32Array(total * 3);
    const r = rng(515);
    const stream = routes.flatMap((rt) =>
      Array.from({ length: PER }, (_, k) => ({ route: rt, phase: k / PER + r() * 0.02, speed: 0.16 + r() * 0.06 }))
    );
    const streamGeo = new THREE.BufferGeometry();
    streamGeo.setAttribute("position", new THREE.BufferAttribute(spos, 3));
    streamGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, -5, 0), 22);

    /* each vessel is built in the shape of what it does */
    const mkDraw = (lines: { pts: THREE.Vector3[]; order: number }[]) => {
      const P: number[] = [];
      const U: number[] = [];
      const O: number[] = [];
      lines.forEach(({ pts, order }) => {
        for (let i = 0; i < pts.length - 1; i++) {
          for (const k of [i, i + 1]) {
            P.push(pts[k].x, pts[k].y, pts[k].z);
            U.push(k / (pts.length - 1));
            O.push(order);
          }
        }
      });
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(P), 3));
      g.setAttribute("aU", new THREE.BufferAttribute(new Float32Array(U), 1));
      g.setAttribute("aOrder", new THREE.BufferAttribute(new Float32Array(O), 1));
      return g;
    };
    /** seven circles: one held, six around it */
    const seedOfLife = (rr: number, seg = 44): number[] => {
      const out: number[] = [];
      const ring = (cx: number, cy: number) => {
        for (let i = 0; i < seg; i++) {
          const t0 = (i / seg) * TAU;
          const t1 = ((i + 1) / seg) * TAU;
          out.push(cx + Math.cos(t0) * rr, cy + Math.sin(t0) * rr, 0, cx + Math.cos(t1) * rr, cy + Math.sin(t1) * rr, 0);
        }
      };
      ring(0, 0);
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * TAU;
        ring(Math.cos(a) * rr, Math.sin(a) * rr);
      }
      return out;
    };
    const circle = (rr: number, seg = 72, cx = 0, cy = 0) =>
      Array.from({ length: seg + 1 }, (_, i) => {
        const t = -Math.PI / 2 + (i / seg) * TAU;
        return new THREE.Vector3(cx + Math.cos(t) * rr, cy + Math.sin(t) * rr, 0);
      });
    /** a ring lying on the ground (XZ), squashed by the view */
    const ground = (rr: number, seg = 96, sq = 0.52, y = 0) =>
      Array.from({ length: seg + 1 }, (_, i) => {
        const t = (i / seg) * TAU;
        return new THREE.Vector3(Math.cos(t) * rr, y, Math.sin(t) * rr * sq);
      });

    const segs = (pts: THREE.Vector3[]) => {
      const o: number[] = [];
      for (let i = 0; i < pts.length - 1; i++) o.push(pts[i].x, pts[i].y, pts[i].z, pts[i + 1].x, pts[i + 1].y, pts[i + 1].z);
      return o;
    };
    const geoOf = (arr: number[]) =>
      new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(new Float32Array(arr), 3)) as THREE.BufferGeometry;
    const rect = (w: number, h: number, cx = 0, cy = 0) => [
      new THREE.Vector3(cx - w, cy + h, 0), new THREE.Vector3(cx + w, cy + h, 0),
      new THREE.Vector3(cx + w, cy - h, 0), new THREE.Vector3(cx - w, cy - h, 0), new THREE.Vector3(cx - w, cy + h, 0),
    ];

    const vessels = NODES.map((n) => {
      const R = n.r;
      const lines: { pts: THREE.Vector3[]; order: number }[] = [];
      const parts: { key: string; type: "lines" | "points"; mat: string; geo: THREE.BufferGeometry; offset?: [number, number, number] }[] = [];
      const r2 = rng(n.id.length * 977 + Math.round(n.at * 1000));

      if (n.kind === "seal") {
        lines.push({ pts: circle(R), order: 0 });
        lines.push({ pts: circle(R * 0.6), order: 0.55 });
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * TAU;
          lines.push({ pts: circle(R * 0.42, 48, Math.cos(a) * R * 0.42, Math.sin(a) * R * 0.42), order: 0.15 + i * 0.06 });
        }
        parts.push({ key: "spin", type: "lines", mat: "A", geo: geoOf(seedOfLife(R * 0.3)) });
        parts.push({ key: "halo", type: "lines", mat: "halo", geo: geoOf(segs(circle(1, 80))) });
      } else if (n.kind === "zoom") {
        // a market of many; the frame closes on a few, then on one, and reads it
        const pop: number[] = [];
        const seeds: number[] = [];
        for (let i = 0; i < 70; i++) {
          const a = r2() * TAU;
          const rr = Math.sqrt(r2()) * R * 0.92;
          pop.push(Math.cos(a) * rr, Math.sin(a) * rr, 0);
          seeds.push(r2());
        }
        const pg = geoOf(pop);
        pg.setAttribute("aSeed", new THREE.BufferAttribute(new Float32Array(seeds), 1));
        parts.push({ key: "pop", type: "points", mat: "pop", geo: pg });
        // the closing frame: four corner brackets
        const br: number[] = [];
        for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]] as [number, number][]) {
          br.push(sx, sy * 0.55, 0, sx, sy, 0);
          br.push(sx * 0.55, sy, 0, sx, sy, 0);
        }
        parts.push({ key: "bracket", type: "lines", mat: "A", geo: geoOf(br) });
        // the readout it pulls off the one it found
        const card: number[] = [];
        for (let i = 0; i < 5; i++) {
          const y = 0.42 - i * 0.2;
          card.push(0.1, y, 0, 0.35 + (i % 3) * 0.32, y, 0);
        }
        card.push(0.1, 0.56, 0, 0.1, -0.52, 0);
        parts.push({ key: "card", type: "lines", mat: "B", geo: geoOf(card) });
      } else if (n.kind === "converge") {
        // every kind of data, arriving from everywhere, becoming one thing
        lines.push({ pts: circle(R * 1.02), order: 0 });
        const rays: number[] = [];
        for (let i = 0; i < 7; i++) {
          const a = (i / 7) * TAU + 0.2;
          rays.push(Math.cos(a) * R * 2.5, Math.sin(a) * R * 2.5, 0, Math.cos(a) * R * 0.3, Math.sin(a) * R * 0.3, 0);
        }
        parts.push({ key: "rays", type: "lines", mat: "B", geo: geoOf(rays) });
        // the streams themselves
        const fl: number[] = [];
        const flSeed: number[] = [];
        for (let i = 0; i < 7; i++) {
          for (let k = 0; k < 9; k++) {
            fl.push(0, 0, 0);
            flSeed.push(i + k / 9);
          }
        }
        const fg = geoOf(fl);
        fg.setAttribute("aSeed", new THREE.BufferAttribute(new Float32Array(flSeed), 1));
        parts.push({ key: "flow", type: "points", mat: "dots", geo: fg });
        const core = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(R * 0.3, 1));
        parts.push({ key: "core", type: "lines", mat: "A", geo: core as unknown as THREE.BufferGeometry });
        parts.push({ key: "shellRing", type: "lines", mat: "C", geo: geoOf(segs(circle(R * 0.55, 64))) });
      } else if (n.kind === "page") {
        // the site, with everything in it: the mark, the nav, the content, the socials, the numbers
        const w = R * 1.25;
        const h = R * 0.95;
        lines.push({ pts: rect(w, h), order: 0 });
        lines.push({ pts: [new THREE.Vector3(-w, h - 0.24, 0), new THREE.Vector3(w, h - 0.24, 0)], order: 0.1 });
        for (let i = 0; i < 3; i++) {
          lines.push({ pts: circle(0.035, 12, -w + 0.14 + i * 0.12, h - 0.12), order: 0.12 });
        }
        // the mark, carried through from brand
        parts.push({ key: "mark", type: "lines", mat: "A", geo: geoOf(seedOfLife(0.062, 26)), offset: [-w + 0.32, h - 0.62, 0] });
        for (let i = 0; i < 4; i++) {
          lines.push({ pts: [new THREE.Vector3(-w + 0.62 + i * 0.28, h - 0.62, 0), new THREE.Vector3(-w + 0.62 + i * 0.28 + 0.18, h - 0.62, 0)], order: 0.26 + i * 0.04 });
        }
        lines.push({ pts: rect(w * 0.42, 0.24, -w * 0.5, h - 1.2), order: 0.45 });
        for (let i = 0; i < 4; i++) {
          lines.push({ pts: [new THREE.Vector3(-w * 0.92, h - 1.62 - i * 0.16, 0), new THREE.Vector3(-w * 0.92 + (0.55 - (i % 2) * 0.18), h - 1.62 - i * 0.16, 0)], order: 0.55 + i * 0.05 });
        }
        lines.push({ pts: rect(w * 0.32, 0.42, w * 0.52, h - 1.28), order: 0.5 });
        // the socials living inside the page
        const soc: number[] = [];
        for (let i = 0; i < 4; i++) {
          const cx = -w * 0.8 + i * 0.34;
          const c = circle(0.1, 16, cx, -h + 0.34);
          soc.push(...segs(c));
          if (i < 3) soc.push(cx + 0.1, -h + 0.34, 0, cx + 0.24, -h + 0.34, 0);
        }
        parts.push({ key: "social", type: "lines", mat: "C", geo: geoOf(soc) });
        // and the numbers it reports
        const bars: number[] = [];
        for (let i = 0; i < 5; i++) {
          const bx = w * 0.35 + i * 0.14;
          bars.push(bx, -h + 0.2, 0, bx, -h + 0.2 + 0.16 + r2() * 0.4, 0);
        }
        parts.push({ key: "bars", type: "lines", mat: "B", geo: geoOf(bars) });
      } else if (n.kind === "multiply") {
        lines.push({ pts: circle(R * 1.02), order: 0 });
        const LV = 4;
        const P: number[] = [];
        const U: number[] = [];
        const O: number[] = [];
        const place = (lv: number, idx: number) => {
          const count = Math.pow(2, lv);
          const x = count === 1 ? 0 : (-0.78 + (idx / (count - 1)) * 1.56) * (R * 1.1);
          return new THREE.Vector3(x, R * 0.62 - (lv / LV) * R * 1.35, 0);
        };
        for (let lv = 0; lv < LV; lv++) {
          for (let i = 0; i < Math.pow(2, lv); i++) {
            const a = place(lv, i);
            for (const child of [i * 2, i * 2 + 1]) {
              const b = place(lv + 1, child);
              for (let k = 0; k < 8; k++) {
                for (const q of [k, k + 1]) {
                  const v = new THREE.Vector3().lerpVectors(a, b, q / 8);
                  P.push(v.x, v.y, 0);
                  U.push(q / 8);
                  O.push(lv / LV);
                }
              }
            }
          }
        }
        const cas = geoOf(P);
        cas.setAttribute("aU", new THREE.BufferAttribute(new Float32Array(U), 1));
        cas.setAttribute("aOrder", new THREE.BufferAttribute(new Float32Array(O), 1));
        parts.push({ key: "cascade", type: "lines", mat: "cascade", geo: cas });
        const nodesP: number[] = [];
        for (let lv = 0; lv <= LV; lv++) for (let i = 0; i < Math.pow(2, lv); i++) {
          const v = place(lv, i);
          nodesP.push(v.x, v.y, 0);
        }
        parts.push({ key: "seeds", type: "points", mat: "dots", geo: geoOf(nodesP) });
      } else if (n.kind === "mechanism") {
        lines.push({ pts: circle(R * 0.66), order: 0 });
        lines.push({ pts: circle(R * 0.28), order: 0.6 });
        const teeth: number[] = [];
        for (let i = 0; i < 16; i++) {
          const a = (i / 16) * TAU;
          teeth.push(Math.cos(a) * R * 0.66, Math.sin(a) * R * 0.66, 0, Math.cos(a) * R * 0.84, Math.sin(a) * R * 0.84, 0);
        }
        parts.push({ key: "gear", type: "lines", mat: "A", geo: geoOf(teeth) });
        const dial: number[] = [];
        for (let i = 0; i < 3; i++) {
          const a = (i / 3) * TAU;
          dial.push(0, 0, 0, Math.cos(a) * R * 0.28, Math.sin(a) * R * 0.28, 0);
        }
        parts.push({ key: "dial", type: "lines", mat: "B", geo: geoOf(dial) });
        const small: number[] = [];
        small.push(...segs(circle(R * 0.28, 40, R * 0.92, -R * 0.5)));
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * TAU;
          small.push(R * 0.92 + Math.cos(a) * R * 0.28, -R * 0.5 + Math.sin(a) * R * 0.28, 0, R * 0.92 + Math.cos(a) * R * 0.36, -R * 0.5 + Math.sin(a) * R * 0.36, 0);
        }
        parts.push({ key: "small", type: "lines", mat: "C", geo: geoOf(small) });
        // work moving through the machine
        const belt: number[] = [];
        const bs: number[] = [];
        for (let i = 0; i < 12; i++) {
          belt.push(0, 0, 0);
          bs.push(i / 12);
        }
        const bg = geoOf(belt);
        bg.setAttribute("aSeed", new THREE.BufferAttribute(new Float32Array(bs), 1));
        parts.push({ key: "belt", type: "points", mat: "dots", geo: bg });
      } else {
        /* ══════════ THE KINGDOM ══════════
           It does not appear; it is built, and then it runs.
           Ground first: the survey grid, three walls, the roads. Then the
           spires rise, tallest at the centre. The tools take orbit around
           the keep, the mark is raised above it, and the whole place
           starts to trade: traders on the roads, embers in the air, a
           pulse that leaves the keep every few seconds. */
        const SQ = 0.52; // the ground seen from a little above
        const WALLS = [2.2, 3.7, 5.2];
        /* Everything here lies on one plane, so each family gets its own
           height. Without this they share a depth value and fight. */
        const Y_ROAD = 0.01;
        const Y_WALL = 0.02;
        const Y_SPIRE = 0.03;

        // the survey grid, drawn in first: rings and spokes, very faint
        for (let rr = 0.9; rr <= 7.7; rr += 1.1) {
          lines.push({ pts: ground(rr, 96, SQ), order: 0.0 + (rr / 7.7) * 0.12 });
        }
        for (let i = 0; i < 16; i++) {
          const a = (i / 16) * TAU;
          lines.push({ pts: [new THREE.Vector3(Math.cos(a) * 0.9, 0, Math.sin(a) * 0.9 * SQ), new THREE.Vector3(Math.cos(a) * 7.7, 0, Math.sin(a) * 7.7 * SQ)], order: 0.04 + (i / 16) * 0.1 });
        }
        // three walls, each drawn as one continuous ring, the outer last
        const wallLines: number[] = [];
        WALLS.forEach((rr, k) => {
          lines.push({ pts: ground(rr, 128, SQ, Y_WALL), order: 0.16 + k * 0.1 });
          // battlements
          const count = 44 + k * 16;
          const hgt = k === 0 ? 0.22 : k === 1 ? 0.16 : 0.12;
          for (let i = 0; i < count; i++) {
            const a = (i / count) * TAU;
            wallLines.push(Math.cos(a) * rr, Y_WALL, Math.sin(a) * rr * SQ, Math.cos(a) * rr, hgt, Math.sin(a) * rr * SQ);
          }
          // the parapet, a second ring at the top of the battlements
          const top = ground(rr, 128, SQ, hgt + Y_WALL);
          wallLines.push(...segs(top));
        });
        parts.push({ key: "walls", type: "lines", mat: "B", geo: geoOf(wallLines) });
        // roads out through the gates to the edge of the land
        const roads: number[] = [];
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * TAU;
          roads.push(Math.cos(a) * 1.0, Y_ROAD, Math.sin(a) * SQ, Math.cos(a) * 7.9, Y_ROAD, Math.sin(a) * 7.9 * SQ);
          // gate posts where the road crosses each wall
          WALLS.forEach((rr) => {
            const px = Math.cos(a) * rr;
            const pz = Math.sin(a) * rr * SQ;
            const nx = -Math.sin(a) * 0.12;
            const nz = Math.cos(a) * 0.12 * SQ;
            roads.push(px + nx, Y_ROAD, pz + nz, px + nx, 0.3, pz + nz, px - nx, Y_ROAD, pz - nz, px - nx, 0.3, pz - nz);
          });
        }
        parts.push({ key: "roads", type: "lines", mat: "C", geo: geoOf(roads) });

        // spires: tapered, with a point. not boxes.
        const towers: number[] = [];
        const order: number[] = [];
        const base: number[] = [];
        const spire = (cx: number, cz: number, w: number, h: number, ord: number) => {
          const tw = w * 0.42;
          const corners: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
          for (let i = 0; i < 4; i++) {
            const [ax, az] = corners[i];
            const [bx, bz] = corners[(i + 1) % 4];
            towers.push(cx + ax * w, Y_SPIRE, cz + az * w, cx + bx * w, Y_SPIRE, cz + bz * w);
            towers.push(cx + ax * tw, h * 0.78, cz + az * tw, cx + bx * tw, h * 0.78, cz + bz * tw);
            towers.push(cx + ax * w, Y_SPIRE, cz + az * w, cx + ax * tw, h * 0.78, cz + az * tw);
            towers.push(cx + ax * tw, h * 0.78, cz + az * tw, cx, h, cz);
          }
          for (let k = 0; k < 16; k++) {
            order.push(ord, ord);
            base.push(Y_SPIRE, Y_SPIRE);
          }
        };
        // a ring of towers on each wall, then the town inside
        WALLS.forEach((rr, k) => {
          const count = 6 + k * 4;
          for (let i = 0; i < count; i++) {
            const a = (i / count) * TAU + (k % 2) * 0.2 + 0.13;
            spire(Math.cos(a) * rr, Math.sin(a) * rr * SQ, 0.11 - k * 0.015, 0.9 - k * 0.18, 0.3 + k * 0.18 + (i / count) * 0.12);
          }
        });
        const keeps: [number, number, number, number][] = [];
        for (let i = 0; i < 34; i++) {
          const a = r2() * TAU;
          const rr = 0.55 + Math.pow(r2(), 0.75) * 4.4;
          keeps.push([Math.cos(a) * rr, Math.sin(a) * rr * SQ, 0.09 + r2() * 0.14, (1 - rr / 5.4) * (1.5 + r2() * 1.9) + 0.4]);
        }
        keeps.sort((a, b) => b[3] - a[3]);
        keeps.forEach((k, i) => spire(k[0], k[1], k[2], k[3], 0.12 + (i / keeps.length) * 0.7));
        // the inner bailey: four corner towers around the keep
        for (const [sx, sz] of [[1, 1], [-1, 1], [-1, -1], [1, -1]] as [number, number][]) {
          spire(sx * 0.95, sz * 0.95 * SQ, 0.14, 2.4, 0.08);
        }
        spire(0, 0, 0.32, 4.8, 0); // the keep
        const tg = geoOf(towers);
        tg.setAttribute("aOrder", new THREE.BufferAttribute(new Float32Array(order), 1));
        tg.setAttribute("aBase", new THREE.BufferAttribute(new Float32Array(base), 1));
        parts.push({ key: "towers", type: "lines", mat: "city", geo: tg });

        // the tools in orbit: three tilted rings around the keep, and what rides them
        const orbitSpec = [
          { r: 1.75, y: 2.1, tilt: 0.16, n: 3 },
          { r: 2.45, y: 3.05, tilt: -0.22, n: 4 },
          { r: 3.2, y: 3.9, tilt: 0.3, n: 5 },
        ];
        const orbits: number[] = [];
        const ou: number[] = [];
        const oo: number[] = [];
        orbitSpec.forEach((o, k) => {
          const SEGO = 120;
          for (let i = 0; i < SEGO; i++) {
            for (const q of [i, i + 1]) {
              const t = (q / SEGO) * TAU;
              const x = Math.cos(t) * o.r;
              const z = Math.sin(t) * o.r * SQ;
              orbits.push(x, o.y + Math.sin(t) * o.tilt * o.r, z);
              ou.push(q / SEGO);
              oo.push(k / 3);
            }
          }
        });
        const og = geoOf(orbits);
        og.setAttribute("aU", new THREE.BufferAttribute(new Float32Array(ou), 1));
        og.setAttribute("aOrder", new THREE.BufferAttribute(new Float32Array(oo), 1));
        parts.push({ key: "orbits", type: "lines", mat: "cascade", geo: og });
        // the satellites: small glyphs, each a tiny seal, so they read as tools, not sparks
        const satN = orbitSpec.reduce((s, o) => s + o.n, 0);
        const sats: number[] = [];
        const satSeed: number[] = [];
        for (let i = 0; i < satN; i++) {
          sats.push(0, 0, 0);
          satSeed.push(i);
        }
        const sg = geoOf(sats);
        sg.setAttribute("aSeed", new THREE.BufferAttribute(new Float32Array(satSeed), 1));
        parts.push({ key: "sats", type: "points", mat: "sats", geo: sg });
        // each satellite also trails a short arc of its orbit behind it
        const trails: number[] = [];
        for (let i = 0; i < satN; i++) for (let k = 0; k < 10; k++) trails.push(0, 0, 0, 0, 0, 0);
        parts.push({ key: "trails", type: "lines", mat: "D", geo: geoOf(trails) });

        // the mark above the keep, with a crown ring it sits in
        parts.push({ key: "mark", type: "lines", mat: "A", geo: geoOf(seedOfLife(0.19, 32)), offset: [0, 5.55, 0] });
        parts.push({ key: "crown", type: "lines", mat: "A", geo: geoOf(segs(ground(0.42, 64, 0.35))), offset: [0, 5.05, 0] });
        parts.push({ key: "halo", type: "lines", mat: "halo", geo: geoOf(segs(circle(1, 80))), offset: [0, 5.55, 0] });
        // pulses leaving the keep across the ground
        for (let k = 0; k < 3; k++) {
          parts.push({ key: `ripple${k}`, type: "lines", mat: `ripple${k}`, geo: geoOf(segs(ground(1, 96, SQ))) });
        }
        // the market: traders on the roads, both ways
        const market: number[] = [];
        const ms: number[] = [];
        for (let i = 0; i < 84; i++) {
          market.push(0, 0, 0);
          ms.push(i / 84);
        }
        const mg = geoOf(market);
        mg.setAttribute("aSeed", new THREE.BufferAttribute(new Float32Array(ms), 1));
        parts.push({ key: "market", type: "points", mat: "dots", geo: mg });
        // embers rising off the town
        const em: number[] = [];
        const es: number[] = [];
        for (let i = 0; i < 160; i++) {
          const a = r2() * TAU;
          const rr = Math.sqrt(r2()) * 5.0;
          em.push(Math.cos(a) * rr, 0, Math.sin(a) * rr * SQ);
          es.push(r2());
        }
        const eg = geoOf(em);
        eg.setAttribute("aSeed", new THREE.BufferAttribute(new Float32Array(es), 1));
        eg.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 4, 0), 10);
        parts.push({ key: "embers", type: "points", mat: "embers", geo: eg });
      }
      return { node: n, draw: mkDraw(lines), parts };
    });

    return { pathGeo, routes, stream, streamGeo, spos, vessels };
  }, []);

  const mats = useMemo(() => {
    const softSprite = (inner: number, mid: number) => {
      const c = document.createElement("canvas");
      c.width = c.height = 256;
      const g = c.getContext("2d")!;
      const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(inner, "rgba(255,255,255,0.9)");
      grad.addColorStop(mid, "rgba(255,255,255,0.16)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, 256, 256);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    };
    const drawMat = (op: number) =>
      new THREE.ShaderMaterial({
        vertexShader: DRAW_VERT,
        fragmentShader: DRAW_FRAG,
        transparent: true,
        depthWrite: false,
        uniforms: { uColor: { value: LIGHT }, uOpacity: { value: op }, uReveal: { value: 0 } },
      });
    const dotMat = (size: number) =>
      new THREE.ShaderMaterial({
        vertexShader: DOT_VERT,
        fragmentShader: DOT_FRAG,
        transparent: true,
        depthWrite: false,
        uniforms: { uColor: { value: LIGHT }, uOpacity: { value: 0 }, uSize: { value: size }, uScale: { value: 400 } },
      });
    const lineMat = () => new THREE.LineBasicMaterial({ color: LIGHT, transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
    return {
      veil: new THREE.ShaderMaterial({
        vertexShader: VEIL_VERT,
        fragmentShader: VEIL_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uColor: { value: LIGHT },
          uOpacity: { value: 0.5 },
          uReveal: { value: 0 },
          uTime: { value: 0 },
          uSettle: { value: 0 },
          uFocus: { value: FOCUS },
        },
      }),
      rays: new THREE.ShaderMaterial({
        vertexShader: RAY_VERT,
        fragmentShader: RAY_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uColor: { value: LIGHT }, uOpacity: { value: 0 }, uTime: { value: 0 }, uGrow: { value: 0 } },
      }),
      emerge: new THREE.ShaderMaterial({
        vertexShader: EMERGE_VERT,
        fragmentShader: EMERGE_FRAG,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uColor: { value: LIGHT },
          uOpacity: { value: 1 },
          uEmerge: { value: 0 },
          uResolve: { value: 0 },
          uTime: { value: 0 },
          uSize: { value: 0.075 },
          uScale: { value: 400 },
        },
      }),
      grat: drawMat(0.26),
      paths: new THREE.ShaderMaterial({
        vertexShader: DRAW_VERT,
        fragmentShader: PATH_FRAG,
        transparent: true,
        depthWrite: false,
        uniforms: { uColor: { value: LIGHT }, uOpacity: { value: 0.4 }, uP: { value: 0 }, uDur: { value: PATH_DRAW }, uLift: { value: 0 } },
      }),
      vessels: NODES.map((n) => drawMat(n.kind === "kingdom" ? 0.2 : 0.72)),
      partA: NODES.map(lineMat),
      partB: NODES.map(lineMat),
      partC: NODES.map(lineMat),
      partD: NODES.map(lineMat),
      nodeDots: NODES.map(() => dotMat(0.06)),
      sats: NODES.map(() => dotMat(0.11)),
      cascade: NODES.map(() => drawMat(0.6)),
      city: NODES.map(
        () =>
          new THREE.ShaderMaterial({
            vertexShader: CITY_VERT,
            fragmentShader: CITY_FRAG,
            transparent: true,
            depthWrite: false,
            uniforms: { uColor: { value: LIGHT }, uOpacity: { value: 0 }, uGrow: { value: 0 }, uTime: { value: 0 } },
          })
      ),
      cityRef: NODES.map(
        () =>
          new THREE.ShaderMaterial({
            vertexShader: CITY_VERT,
            fragmentShader: CITY_FRAG,
            transparent: true,
            depthWrite: false,
            uniforms: { uColor: { value: LIGHT }, uOpacity: { value: 0 }, uGrow: { value: 0 }, uTime: { value: 0 } },
          })
      ),
      embers: NODES.map(
        () =>
          new THREE.ShaderMaterial({
            vertexShader: EMBER_VERT,
            fragmentShader: EMBER_FRAG,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            uniforms: { uColor: { value: LIGHT }, uOpacity: { value: 0.8 }, uTime: { value: 0 }, uBuild: { value: 0 }, uSize: { value: 0.05 }, uScale: { value: 400 } },
          })
      ),
      pop: NODES.map(
        () =>
          new THREE.ShaderMaterial({
            vertexShader: POP_VERT,
            fragmentShader: POP_FRAG,
            transparent: true,
            depthWrite: false,
            uniforms: {
              uColor: { value: LIGHT }, uOpacity: { value: 1 }, uFocus: { value: new THREE.Vector2(0, 0) },
              uRadius: { value: 1 }, uSize: { value: 0.055 }, uScale: { value: 400 }, uBuild: { value: 0 },
            },
          })
      ),
      halo: NODES.map(lineMat),
      ripple: [0, 1, 2].map(lineMat),
      stream: dotMat(0.062),
      layers: [dotMat(0.03), dotMat(0.026), dotMat(0.022)],
      // a tight core, not a haze
      core: new THREE.SpriteMaterial({ color: LIGHT, map: softSprite(0.06, 0.2), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
      // the anamorphic streak that says "singularity"
      flare: new THREE.SpriteMaterial({ color: LIGHT, map: softSprite(0.1, 0.34), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
      // the keep lights when the kingdom is complete
      beacon: new THREE.SpriteMaterial({ color: LIGHT, map: softSprite(0.05, 0.22), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
      shock: [0, 1, 2].map(
        () => new THREE.MeshBasicMaterial({ color: LIGHT, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
      ),
    };
  }, []);

  const worldGroup = useRef<THREE.Group>(null);
  const vesselRefs = useRef<(THREE.Group | null)[]>([]);
  const core = useRef<THREE.Sprite>(null);
  const flare = useRef<THREE.Sprite>(null);
  const beacon = useRef<THREE.Sprite>(null);
  const shocks = useRef<(THREE.Mesh | null)[]>([]);
  const partRefs = useRef<Record<string, THREE.Object3D | null>[]>([]);

  /** camera keyframes: smooth in, smooth out, so it settles on each row */
  const cam = (P: number, idx: 1 | 2 | 3) => {
    if (P <= CAM[0][0]) return CAM[0][idx];
    for (let k = 0; k < CAM.length - 1; k++) {
      if (P <= CAM[k + 1][0]) {
        const f = ramp(P, CAM[k][0], CAM[k + 1][0]);
        return lerp(CAM[k][idx], CAM[k + 1][idx], f);
      }
    }
    return CAM[CAM.length - 1][idx];
  };

  useFrame((state, delta) => {
    // Pure function of scroll, lightly damped, so it reverses exactly. The
    // reader owns the pace: the picture follows the page, never the other way.
    const target = getProgress();
    // A dropped frame must not become a jump: clamp the step hard, so a slow
    // machine plays the film a little slower rather than lurching through it.
    const dt = Math.min(delta, 1 / 30);
    p.current += (target - p.current) * (1 - Math.exp(-dt / 0.35));
    if (Math.abs(target - p.current) < 0.0004) p.current = target;
    // QA hook: a test can pin the sequence to an exact moment (window.__momentumPin = 0..1)
    const pin = (window as Window & { __momentumPin?: number }).__momentumPin;
    if (typeof pin === "number") p.current = clamp01(pin);
    const P = p.current;
    const t = state.clock.elapsedTime * (reduced ? 0.25 : 1);

    /* ── the camera ── */
    const fallY = 13.2 - ramp(P, 0, 0.15) * 4.6 - ramp(P, 0.15, 0.215) * 5.4;
    const fallZ = 8.6 + ramp(P, 0, 0.17) * 2.2 + ramp(P, 0.185, 0.235) * 2.8;
    const toChain = ramp(P, 0.19, 0.235);
    const cy = lerp(fallY, cam(P, 1), toChain);
    const cz = lerp(fallZ, cam(P, 2), toChain);
    const look = lerp(-0.15, cam(P, 3), toChain);
    const cx = Math.sin(t * 0.09) * 0.12;
    const aspect = size.width / Math.max(1, size.height);
    const fit = Math.min(2.2, Math.max(1, 1.35 / Math.max(0.45, aspect)));
    camera.position.set(cx, cy, cz * fit);
    camera.lookAt(0, cy + look, 0);

    /* acts I-IV: the filament falls and loses itself */
    const v = mats.veil.uniforms;
    v.uReveal.value = 0.15 + ramp(P, TL.fall[0], TL.fall[1]) * 0.85;
    v.uTime.value = t;
    v.uSettle.value = ramp(P, 0.18, 0.26);
    v.uOpacity.value = 0.5 * (1 - ramp(P, 0.225, 0.32) * 0.66);

    /* act V: the singularity */
    const ignite = ramp(P, TL.ignite[0], TL.ignite[1]);
    const decay = 1 - ramp(P, 0.22, 0.29);
    mats.core.opacity = ignite * decay;
    mats.flare.opacity = ignite * decay * 0.85;
    if (core.current) {
      const sc = 0.5 + ignite * 1.15 + Math.sin(t * 2.1) * 0.04 * ignite;
      core.current.scale.set(sc, sc, 1);
    }
    if (flare.current) flare.current.scale.set(3.0 + ignite * 13.0, 0.34 + ignite * 0.22, 1);
    shocks.current.forEach((m, i) => {
      if (!m) return;
      const born = 0.176 + i * 0.012;
      const life = ramp(P, born, born + 0.045);
      m.scale.setScalar(0.2 + life * (3.4 + i * 1.15));
      mats.shock[i].opacity = Math.pow(life * (1 - life) * 4, 1.4) * 0.85;
    });
    mats.rays.uniforms.uGrow.value = ramp(P, 0.19, 0.245);
    mats.rays.uniforms.uTime.value = t;
    mats.rays.uniforms.uOpacity.value = 0.42 * ramp(P, 0.19, 0.245) * (1 - ramp(P, 0.29, 0.4) * 0.55);

    /* act VI-a: data emerges, then resolves into a world at the crown */
    const em = mats.emerge.uniforms;
    em.uEmerge.value = ramp(P, TL.world[0], 0.26);
    em.uResolve.value = ramp(P, 0.225, TL.world[1]);
    em.uTime.value = t;
    em.uScale.value = size.height * 0.6;
    if (worldGroup.current) worldGroup.current.rotation.y = t * 0.07;
    mats.grat.uniforms.uReveal.value = ramp(P, 0.275, 0.34);

    /* the system, once complete, lifts everything a little and stays lit */
    const pulse = reduced ? 0 : beat(P, TL.pulse, TL.pulse + 0.035, TL.pulse + 0.11);
    const lit = ramp(P, TL.pulse, TL.pulse + 0.03) * 0.1 + pulse * 0.16;
    const wide = ramp(P, TL.wide[0], TL.wide[1]);

    mats.layers.forEach((m, i) => {
      m.uniforms.uOpacity.value = (0.2 - i * 0.05) * ramp(P, 0.2, 0.3) * (1 - wide * 0.55);
      m.uniforms.uScale.value = size.height * 0.6;
    });

    /* act VI-b: the chain fills, path by path, vessel by vessel */
    const pathOpen = tree.routes.map((rt) => ramp(P, rt.at, rt.at + PATH_DRAW));
    mats.paths.uniforms.uP.value = P;
    mats.paths.uniforms.uLift.value = lit * 1.6;

    // particles walking the open paths
    const sp = tree.spos;
    tree.stream.forEach((pt, i) => {
      const open = pathOpen[pt.route.index];
      const u = (t * pt.speed + pt.phase) % 1;
      const vv = pt.route.curve.getPoint(u);
      sp[i * 3] = vv.x;
      sp[i * 3 + 1] = open > 0.02 && u < open ? vv.y : 9999;
      sp[i * 3 + 2] = vv.z;
    });
    tree.streamGeo.getAttribute("position").needsUpdate = true;
    mats.stream.uniforms.uOpacity.value = (0.85 + lit) * ramp(P, TL.chainStart, TL.chainStart + 0.04);
    mats.stream.uniforms.uScale.value = size.height * 0.6;

    /* the chain fills, one service at a time, each behaving like itself */
    tree.vessels.forEach((ves, i) => {
      const n = ves.node;
      /* An opacity of zero still costs a full draw, and the per-particle
         loops below still run. Until a vessel's moment arrives it is simply
         not in the scene, which is most of the film for the kingdom. */
      const onStage = P > n.at - 0.03;
      const grp = vesselRefs.current[i];
      if (grp) grp.visible = onStage;
      if (!onStage) return;

      const build = ramp(P, n.at, n.at + BUILD);
      const live = build * (1 + lit);
      const parts = partRefs.current[i] ?? {};
      mats.vessels[i].uniforms.uReveal.value = n.kind === "kingdom" ? ramp(P, n.at, n.at + 0.06) : build;

      if (n.kind === "seal") {
        if (parts.spin) parts.spin.rotation.z = -t * 0.12;
        mats.partA[i].opacity = 0.55 * live;
        if (parts.halo) {
          const ph = (t * 0.3) % 1;
          parts.halo.scale.setScalar(n.r * (0.9 + ph * 1.5));
          mats.halo[i].opacity = (1 - ph) * 0.4 * live;
        }
      } else if (n.kind === "zoom") {
        // many, then a few, then one, and what we know about them
        const loop = (t * 0.16) % 1;
        const stage = loop < 0.34 ? 0 : loop < 0.64 ? 1 : 2;
        const k = stage === 0 ? 1 : stage === 1 ? 0.42 : 0.14;
        const smooth = 1 - Math.exp(-delta / 0.45);
        const m = mats.pop[i].uniforms;
        m.uRadius.value += (n.r * k - m.uRadius.value) * smooth;
        const fx = stage === 0 ? 0 : stage === 1 ? -n.r * 0.3 : -n.r * 0.34;
        const fy = stage === 0 ? 0 : stage === 1 ? n.r * 0.26 : n.r * 0.3;
        m.uFocus.value.x += (fx - m.uFocus.value.x) * smooth;
        m.uFocus.value.y += (fy - m.uFocus.value.y) * smooth;
        m.uBuild.value = live;
        m.uScale.value = size.height * 0.6;
        if (parts.bracket) {
          parts.bracket.scale.setScalar(Math.max(0.05, m.uRadius.value * 1.08));
          parts.bracket.position.set(m.uFocus.value.x, m.uFocus.value.y, 0);
        }
        mats.partA[i].opacity = 0.6 * live;
        // the readout only exists once it has found the one
        mats.cascade[i].uniforms.uReveal.value = stage === 2 ? ramp(loop, 0.66, 0.78) : 0;
        mats.partB[i].opacity = (stage === 2 ? ramp(loop, 0.66, 0.8) : 0) * 0.7 * live;
        if (parts.card) parts.card.position.set(n.r * 0.18, n.r * 0.05, 0);
      } else if (n.kind === "converge") {
        // everything arrives, and becomes one thing
        const g = parts.flow as THREE.Points | undefined;
        if (g) {
          const arr = g.geometry.getAttribute("position") as THREE.BufferAttribute;
          const seed = g.geometry.getAttribute("aSeed") as THREE.BufferAttribute;
          for (let k = 0; k < arr.count; k++) {
            const sv = seed.getX(k);
            const lane = Math.floor(sv);
            const a = (lane / 7) * TAU + 0.2;
            const u = (t * (0.18 + (lane % 3) * 0.05) + (sv % 1)) % 1;
            const d = n.r * (2.5 - u * 2.2);
            arr.setXYZ(k, Math.cos(a) * d, Math.sin(a) * d, 0);
          }
          arr.needsUpdate = true;
        }
        mats.nodeDots[i].uniforms.uOpacity.value = 0.9 * live;
        mats.nodeDots[i].uniforms.uScale.value = size.height * 0.6;
        const pulseC = 1 + Math.sin(t * 1.4) * 0.09;
        if (parts.core) {
          parts.core.scale.setScalar(pulseC);
          parts.core.rotation.y = t * 0.4;
          parts.core.rotation.x = t * 0.22;
        }
        if (parts.shellRing) parts.shellRing.rotation.z = -t * 0.1;
        mats.partA[i].opacity = 0.85 * live;
        mats.partB[i].opacity = 0.13 * live;
        mats.partC[i].opacity = 0.3 * live * (0.6 + 0.4 * Math.sin(t * 1.4));
      } else if (n.kind === "page") {
        mats.partA[i].opacity = 0.75 * ramp(P, n.at + 0.014, n.at + 0.026) * (1 + lit);
        mats.partB[i].opacity = 0.6 * ramp(P, n.at + 0.026, n.at + 0.038) * (1 + lit);
        mats.partC[i].opacity = 0.62 * ramp(P, n.at + 0.03, n.at + 0.042) * (1 + lit);
        if (parts.mark) parts.mark.rotation.z = -t * 0.16;
      } else if (n.kind === "multiply") {
        const loop = ((t * 0.42) % 1.25) / 1.0;
        mats.cascade[i].uniforms.uReveal.value = Math.max(build, clamp01(loop)) * build;
        mats.cascade[i].uniforms.uOpacity.value = (0.34 + 0.42 * (1 - clamp01((loop - 1.0) / 0.25))) * live;
        mats.nodeDots[i].uniforms.uOpacity.value = 0.9 * live;
        mats.nodeDots[i].uniforms.uScale.value = size.height * 0.6;
      } else if (n.kind === "mechanism") {
        if (parts.gear) parts.gear.rotation.z = t * 0.24;
        if (parts.dial) parts.dial.rotation.z = -t * 0.62;
        if (parts.small) parts.small.rotation.z = -t * 0.58;
        mats.partA[i].opacity = 0.6 * live;
        mats.partB[i].opacity = 0.45 * live;
        mats.partC[i].opacity = 0.42 * live;
        const b = parts.belt as THREE.Points | undefined;
        if (b) {
          const arr = b.geometry.getAttribute("position") as THREE.BufferAttribute;
          const seed = b.geometry.getAttribute("aSeed") as THREE.BufferAttribute;
          for (let k = 0; k < arr.count; k++) {
            const u = (t * 0.2 + seed.getX(k)) % 1;
            arr.setXYZ(k, -n.r * 1.5 + u * n.r * 3, -n.r * 1.05, 0);
          }
          arr.needsUpdate = true;
          mats.nodeDots[i].uniforms.uOpacity.value = 0.75 * live;
          mats.nodeDots[i].uniforms.uScale.value = size.height * 0.6;
        }
      } else if (n.kind === "kingdom") {
        /* ══════════ act VII ══════════ */
        const K = n.at; // 0.72
        const SQ = 0.52;
        const ground = ramp(P, K, K + 0.06);              // the survey grid
        const walls = ramp(P, K + 0.03, K + 0.08);        // walls and roads
        const found = ramp(P, K + 0.05, K + 0.08);        // foundations light up
        const grow = ramp(P, K + 0.06, K + 0.14);         // spires rise, the keep first
        const orbit = ramp(P, K + 0.1, K + 0.145);        // the tools take orbit
        const crownUp = ramp(P, K + 0.12, K + 0.145);     // the mark is raised
        const alive = ramp(P, K + 0.125, K + 0.155);      // traders, embers, pulses
        const glow = 1 + lit * 0.8;

        mats.vessels[i].uniforms.uReveal.value = ground;
        mats.vessels[i].uniforms.uOpacity.value = 0.22 * (1 - wide * 0.4) * glow;
        mats.partB[i].opacity = 0.55 * walls * glow;   // walls
        mats.partC[i].opacity = 0.3 * walls * glow;    // roads and gates
        mats.city[i].uniforms.uGrow.value = grow;
        mats.city[i].uniforms.uOpacity.value = 0.95 * found * glow;

        // the tools in orbit
        mats.cascade[i].uniforms.uReveal.value = orbit;
        mats.cascade[i].uniforms.uOpacity.value = 0.28 * glow;
        const sats = parts.sats as THREE.Points | undefined;
        const trails = parts.trails as THREE.LineSegments | undefined;
        if (sats && trails) {
          const arr = sats.geometry.getAttribute("position") as THREE.BufferAttribute;
          const tr = trails.geometry.getAttribute("position") as THREE.BufferAttribute;
          const spec = [
            { r: 1.75, y: 2.1, tilt: 0.16, n: 3, w: 0.21 },
            { r: 2.45, y: 3.05, tilt: -0.22, n: 4, w: -0.15 },
            { r: 3.2, y: 3.9, tilt: 0.3, n: 5, w: 0.11 },
          ];
          let idx = 0;
          spec.forEach((o) => {
            for (let k = 0; k < o.n; k++) {
              const base = (k / o.n) * TAU + t * o.w;
              const posAt = (ang: number, out: THREE.Vector3) =>
                out.set(Math.cos(ang) * o.r, o.y + Math.sin(ang) * o.tilt * o.r, Math.sin(ang) * o.r * SQ);
              const vtmp = new THREE.Vector3();
              posAt(base, vtmp);
              arr.setXYZ(idx, vtmp.x, vtmp.y, vtmp.z);
              // a short trail behind, 10 segments
              const back = Math.sign(o.w) * 0.55;
              for (let s = 0; s < 10; s++) {
                const a0 = base - (s / 10) * back;
                const a1 = base - ((s + 1) / 10) * back;
                posAt(a0, vtmp);
                tr.setXYZ((idx * 10 + s) * 2, vtmp.x, vtmp.y, vtmp.z);
                posAt(a1, vtmp);
                tr.setXYZ((idx * 10 + s) * 2 + 1, vtmp.x, vtmp.y, vtmp.z);
              }
              idx++;
            }
          });
          arr.needsUpdate = true;
          tr.needsUpdate = true;
        }
        mats.sats[i].uniforms.uOpacity.value = 0.95 * orbit * glow;
        mats.sats[i].uniforms.uScale.value = size.height * 0.6;
        mats.partD[i].opacity = 0.32 * orbit * glow;

        // the mark, raised above the keep once the keep stands
        mats.partA[i].opacity = 0.85 * crownUp * glow;
        if (parts.mark) {
          parts.mark.rotation.z = -t * 0.18;
          parts.mark.position.y = 5.55 - (1 - crownUp) * 1.2;
        }
        if (parts.crown) {
          parts.crown.rotation.y = t * 0.25;
          parts.crown.position.y = 5.05 - (1 - crownUp) * 1.2;
        }
        if (parts.halo) {
          const ph = (t * 0.28) % 1;
          parts.halo.scale.setScalar(0.3 + ph * 1.6);
          parts.halo.position.y = 5.55 - (1 - crownUp) * 1.2;
          mats.halo[i].opacity = (1 - ph) * 0.45 * crownUp * glow;
        }
        // the beacon: the keep lights when the system fires, then keeps a low flame
        mats.beacon.opacity = (pulse * 1.0 + ramp(P, TL.pulse, TL.pulse + 0.02) * 0.22) * crownUp;
        if (beacon.current) {
          const s = 1.6 + pulse * 5.5 + Math.sin(t * 1.7) * 0.12;
          beacon.current.scale.set(s, s, 1);
        }

        // pulses leaving the keep across the ground, every few seconds
        for (let k = 0; k < 3; k++) {
          const rp = parts[`ripple${k}`];
          if (!rp) continue;
          const ph = (t * 0.16 + k / 3) % 1;
          const s = 0.4 + ph * 7.4;
          rp.scale.set(s, 1, s);
          rp.position.y = 0.06;
          mats.ripple[k].opacity = Math.pow(1 - ph, 2.2) * 0.5 * alive * glow;
        }

        // the market: traders on the roads, both ways
        const mk = parts.market as THREE.Points | undefined;
        if (mk) {
          const arr = mk.geometry.getAttribute("position") as THREE.BufferAttribute;
          const seed = mk.geometry.getAttribute("aSeed") as THREE.BufferAttribute;
          for (let k = 0; k < arr.count; k++) {
            const sv = seed.getX(k);
            const lane = Math.floor(sv * 12) / 12;
            const a = lane * TAU;
            const dir = k % 2 === 0 ? 1 : -1;
            const u = ((t * (0.05 + (k % 5) * 0.012) * dir + sv * 7) % 1 + 1) % 1;
            const d = 1.0 + u * 6.9;
            arr.setXYZ(k, Math.cos(a) * d, 0.08, Math.sin(a) * d * SQ);
          }
          arr.needsUpdate = true;
          mats.nodeDots[i].uniforms.uOpacity.value = 0.85 * alive * glow;
          mats.nodeDots[i].uniforms.uScale.value = size.height * 0.6;
        }
        // embers rising
        const eb = mats.embers[i].uniforms;
        eb.uTime.value = t;
        eb.uBuild.value = alive;
        eb.uScale.value = size.height * 0.6;

        if (parts.kingdom) parts.kingdom.rotation.y = Math.sin(t * 0.07) * 0.22;
      }
    });

    // row labels fade in with their vessel and give way once the kingdom begins
    const rowsOut = 1 - ramp(P, TL.kingdom + 0.01, TL.kingdom + 0.05);
    labelRefs.current.forEach((el, i) => {
      if (el) el.style.opacity = String(clamp01((P - NODES[i].at - 0.004) / 0.016) * rowsOut);
    });
    // the caption arrives as the mark is raised, and stays for the wide shot
    if (caption.current) {
      const f = ramp(P, TL.kingdom + 0.12, TL.kingdom + 0.15);
      caption.current.style.opacity = String(f);
      caption.current.style.transform = `translateY(${(1 - f) * 0.8}rem)`;
    }
  });

  const setPart = (i: number, key: string) => (el: THREE.Object3D | null) => {
    if (!partRefs.current[i]) partRefs.current[i] = {};
    partRefs.current[i][key] = el;
  };
  const matFor = (i: number, name: string): THREE.Material =>
    name === "A" ? mats.partA[i]
      : name === "B" ? mats.partB[i]
      : name === "C" ? mats.partC[i]
      : name === "D" ? mats.partD[i]
      : name === "halo" ? mats.halo[i]
      : name === "dots" ? mats.nodeDots[i]
      : name === "sats" ? mats.sats[i]
      : name === "cascade" ? mats.cascade[i]
      : name === "pop" ? mats.pop[i]
      : name === "city" ? mats.city[i]
      : name === "embers" ? mats.embers[i]
      : name.startsWith("ripple") ? mats.ripple[Number(name.slice(6))]
      : mats.cityRef[i];

  const KING = NODES[6];

  return (
    <>
      {layers.map((l, i) => (
        <points key={i} geometry={l.geo}>
          <primitive object={mats.layers[i]} attach="material" />
        </points>
      ))}

      <lineSegments geometry={veil}>
        <primitive object={mats.veil} attach="material" />
      </lineSegments>
      <lineSegments geometry={rays}>
        <primitive object={mats.rays} attach="material" />
      </lineSegments>

      <sprite ref={core} position={FOCUS}>
        <primitive object={mats.core} attach="material" />
      </sprite>
      <sprite ref={flare} position={FOCUS}>
        <primitive object={mats.flare} attach="material" />
      </sprite>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => { shocks.current[i] = el; }} position={FOCUS}>
          <ringGeometry args={[0.9875, 1, 160]} />
          <primitive object={mats.shock[i]} attach="material" />
        </mesh>
      ))}

      <group ref={worldGroup} position={FOCUS}>
        <points geometry={emergence.points} frustumCulled={false}>
          <primitive object={mats.emerge} attach="material" />
        </points>
        <lineSegments geometry={emergence.grat}>
          <primitive object={mats.grat} attach="material" />
        </lineSegments>
      </group>

      <lineSegments geometry={tree.pathGeo} frustumCulled={false}>
        <primitive object={mats.paths} attach="material" />
      </lineSegments>
      <points geometry={tree.streamGeo} frustumCulled={false}>
        <primitive object={mats.stream} attach="material" />
      </points>

      {/* the beacon sits on the keep's spire */}
      <sprite ref={beacon} position={[KING.pos.x, KING.pos.y - KING.r * 0.5 + 4.8, KING.pos.z]}>
        <primitive object={mats.beacon} attach="material" />
      </sprite>

      {tree.vessels.map((ves, i) => {
        const n = ves.node;
        const king = n.kind === "kingdom";
        const body = ves.parts;
        return (
          <group key={n.id} ref={(el) => { vesselRefs.current[i] = el; }} position={n.pos} visible={false}>
            {!king && (
              <lineSegments geometry={ves.draw} frustumCulled={false}>
                <primitive object={mats.vessels[i]} attach="material" />
              </lineSegments>
            )}
            <group ref={king ? setPart(i, "kingdom") : undefined} position={king ? [0, -n.r * 0.5, 0] : [0, 0, 0]}>
              {king && (
                <lineSegments geometry={ves.draw} frustumCulled={false}>
                  <primitive object={mats.vessels[i]} attach="material" />
                </lineSegments>
              )}
              {body.map((pt) =>
                pt.type === "points" ? (
                  <points key={pt.key} ref={setPart(i, pt.key)} geometry={pt.geo} position={pt.offset ?? [0, 0, 0]} frustumCulled={false}>
                    <primitive object={matFor(i, pt.mat)} attach="material" />
                  </points>
                ) : (
                  <lineSegments key={pt.key} ref={setPart(i, pt.key)} geometry={pt.geo} position={pt.offset ?? [0, 0, 0]} frustumCulled={false}>
                    <primitive object={matFor(i, pt.mat)} attach="material" />
                  </lineSegments>
                )
              )}
            </group>
            {!king && (
              <Html position={[0, -n.r - 0.6, 0]} center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
                <div
                  ref={(el) => { labelRefs.current[i] = el; }}
                  className="font-serif text-light text-[17px] leading-tight whitespace-nowrap"
                  style={{ opacity: 0 }}
                >
                  {n.label}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </>
  );
}

export default function Momentum({
  intro,
  height = "600vh",
  labels = DEFAULT_LABELS,
}: {
  intro?: React.ReactNode;
  height?: string;
  labels?: MomentumLabels;
}) {
  const host = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setMounted((m) => m || e.isIntersecting), { rootMargin: "1800px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // the opening beat is held for a breath so the scene can fade up before anything happens
  const HOLD = 0.012;
  const getProgress = () => {
    const el = host.current;
    if (!el || typeof window === "undefined") return 0;
    const rect = el.getBoundingClientRect();
    const span = rect.height - window.innerHeight;
    const raw = span > 0 ? clamp01(-rect.top / span) : 0;
    return clamp01((raw - HOLD) / (1 - HOLD));
  };

  // the scene fades up rather than cutting in
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = fadeRef.current;
      const h = host.current;
      if (el && h) {
        const rect = h.getBoundingClientRect();
        const span = rect.height - window.innerHeight;
        const sc = span > 0 ? clamp01(-rect.top / span) : 0;
        // fades up at the start only; at the end it stays lit and the page carries past it
        const f = clamp01(sc / 0.018);
        el.style.opacity = String(f * f * (3 - 2 * f));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const caption = useRef<HTMLDivElement>(null);

  /**
   * The way past it. A pinned control while the film runs: its hairline fills
   * with the reader's place in the sequence, so the length is never a mystery,
   * and one click lands on the services. It steps aside before the kingdom's
   * caption arrives, when the services are a scroll away anyway.
   */
  const skip = useRef<HTMLAnchorElement>(null);
  const skipFill = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = skip.current;
      const h = host.current;
      if (el && h) {
        const rect = h.getBoundingClientRect();
        const span = rect.height - window.innerHeight;
        const sc = span > 0 ? clamp01(-rect.top / span) : 0;
        const f = clamp01((sc - 0.02) / 0.04) * (1 - clamp01((sc - 0.78) / 0.05));
        el.style.opacity = String(f);
        el.style.visibility = f > 0.01 ? "visible" : "hidden";
        if (skipFill.current) skipFill.current.style.transform = `scaleX(${sc})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const fadeRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!intro) return;
    let raf = 0;
    const tick = () => {
      const el = introRef.current;
      const h = host.current;
      if (el && h) {
        const rect = h.getBoundingClientRect();
        const span = rect.height - window.innerHeight;
        const sc = span > 0 ? clamp01(-rect.top / span) : 0;
        const f = 1 - clamp01((sc - 0.02) / 0.04);
        el.style.opacity = String(f * f * (3 - 2 * f));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [intro]);

  return (
    <div ref={host} className="relative" style={{ height }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink">
        {intro && (
          <div ref={introRef} className="absolute inset-0 z-10 flex items-center justify-center px-5 pointer-events-none">
            {intro}
          </div>
        )}
        {/* the kingdom's caption: a line of the page, not of the scene, so it holds its place when the camera pulls back */}
        <div
          ref={caption}
          className="absolute inset-x-0 bottom-[7vh] z-10 flex flex-col items-center text-center px-5 pointer-events-none"
          style={{ opacity: 0, willChange: "opacity, transform" }}
        >
          <span className="kl-eyebrow text-[10px]">{ACTS[6]}</span>
          <span className="font-serif text-light text-[1.7rem] md:text-[2.1rem] leading-tight mt-4">{labels.kingdom}</span>
          <span className="font-sans text-ash text-[13px] md:text-[14px] mt-2 max-w-[40ch]">{labels.kingdomSub}</span>
        </div>
        <a
          ref={skip}
          href="#services"
          className="group absolute bottom-6 right-5 md:bottom-8 md:right-8 z-20 flex flex-col items-end gap-2 py-2 pl-3 font-mono text-[11px] uppercase tracking-[0.32em] text-ash transition-colors duration-200 hover:text-light focus-visible:text-light"
          style={{ opacity: 0, visibility: "hidden" }}
        >
          <span className="flex items-center gap-2">
            {labels.skip}
            <ArrowDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-y-0.5" strokeWidth={1.5} aria-hidden />
          </span>
          <span className="block h-px w-full bg-[rgba(244,241,233,0.14)]" aria-hidden>
            <span ref={skipFill} className="block h-full w-full origin-left bg-light" style={{ transform: "scaleX(0)" }} />
          </span>
        </a>
        <div ref={fadeRef} className="absolute inset-0" style={{ opacity: 0 }}>
          {mounted && (
            <Canvas
              className="w-full h-full"
              // near/far matter here: the camera ends up 45+ units out, and the
              // kingdom stacks many shapes on one ground plane. With the default
              // 0.1/2000 range there is almost no depth precision left at that
              // distance and coplanar lines z-fight, which reads as flicker.
              camera={{ position: [-6.4, 0, 9.5], fov: 40, near: 1, far: 220 }}
              dpr={[1, 1.75]}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            >
              <Suspense fallback={null}>
                <Scene getProgress={getProgress} reduced={reduced} caption={caption} />
                <AdaptiveResolution />
                <EffectComposer multisampling={4}>
                  <Bloom intensity={0.85} luminanceThreshold={0.28} luminanceSmoothing={0.9} mipmapBlur radius={0.75} />
                </EffectComposer>
              </Suspense>
            </Canvas>
          )}
        </div>
      </div>
    </div>
  );
}

export { ACTS as MOMENTUM_ACTS };
