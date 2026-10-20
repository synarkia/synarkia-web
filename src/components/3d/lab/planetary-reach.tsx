"use client";

/**
 * Planetary Reach — the merge of 03 Structure, 05 Market Map and 07 Reach.
 *
 * One scroll-driven journey in four acts:
 *   I   STRUCTURE  the geodesic lattice: the system before it carries anything
 *   II  WORLD      real coastlines settle onto the lattice, outward from Paris
 *   III FLOW       great-circle routes draw to real cities, packets run them
 *   IV  REACH      the camera pulls back, a wavefront crosses the sphere,
 *                  orbital shells fade in around it
 *
 * Everything is tied to scroll progress, so the piece evolves as you read.
 * All motion is analytic: great-circle slerp, constant angular velocity,
 * exact distances in km. Monochrome, Light on Ink.
 */

import { useMemo, useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { decodeLand, decodeCoast } from "./land-data";
import { rng, useReducedMotion } from "./shared";

const R = 3;
const EARTH_KM = 6371;
const LIGHT = new THREE.Color("#F4F1E9");
const D2R = Math.PI / 180;

/* ── geography ─────────────────────────────────────────── */
const ORIGIN = { name: "PARIS", lat: 48.8566, lon: 2.3522 };
const CITIES = [
  { name: "LONDON", lat: 51.5072, lon: -0.1276 },
  { name: "BERLIN", lat: 52.52, lon: 13.405 },
  { name: "NEW YORK", lat: 40.7128, lon: -74.006 },
  { name: "SAN FRANCISCO", lat: 37.7749, lon: -122.4194 },
  { name: "SAO PAULO", lat: -23.5505, lon: -46.6333 },
  { name: "LAGOS", lat: 6.5244, lon: 3.3792 },
  { name: "DUBAI", lat: 25.2048, lon: 55.2708 },
  { name: "SINGAPORE", lat: 1.3521, lon: 103.8198 },
  { name: "TOKYO", lat: 35.6762, lon: 139.6503 },
  { name: "SYDNEY", lat: -33.8688, lon: 151.2093 },
];

/**
 * Geographic to cartesian. Greenwich faces +Z (the camera), east runs toward +X,
 * so from outside the sphere the Americas sit left of Europe, as on a globe.
 */
function unit(lat: number, lon: number) {
  const a = lat * D2R;
  const b = lon * D2R;
  return new THREE.Vector3(Math.cos(a) * Math.sin(b), Math.sin(a), Math.cos(a) * Math.cos(b));
}
/** exact great-circle interpolation */
function slerp(a: THREE.Vector3, b: THREE.Vector3, omega: number, u: number) {
  const s = Math.sin(omega);
  if (s < 1e-6) return a.clone();
  return a.clone().multiplyScalar(Math.sin((1 - u) * omega) / s).add(b.clone().multiplyScalar(Math.sin(u * omega) / s));
}

/* ── easing helpers ────────────────────────────────────── */
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** smoothstep ramp between two scroll positions */
const ramp = (p: number, a: number, b: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ── shared GLSL: fade by depth through the globe ──────── */
const DEPTH_FADE = `
  float depthFade(vec4 mv, float radius) {
    vec4 c = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    return mix(0.09, 1.0, smoothstep(-radius * 0.9, radius * 0.3, mv.z - c.z));
  }
`;

const LAND_VERT = `
  attribute vec3 aFrom;
  attribute float aStagger;
  attribute float aSeed;
  attribute float aCoast;
  uniform float uMorph, uOpacity, uSize, uScale, uWave, uWave2, uBand, uWaveAmp, uR, uTime;
  uniform vec3 uOrigin;
  varying float vAlpha, vHot;
  ${DEPTH_FADE}
  void main() {
    float m = clamp((uMorph - aStagger * 0.62) / 0.38, 0.0, 1.0);
    m = m * m * (3.0 - 2.0 * m);
    vec3 p = mix(aFrom, position, m);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float face = depthFade(mv, uR);

    float ang = acos(clamp(dot(normalize(position), uOrigin), -1.0, 1.0));
    float w1 = exp(-pow((ang - uWave) / uBand, 2.0));
    float w2 = exp(-pow((ang - uWave2) / (uBand * 0.45), 2.0)) * 0.28;
    float hot = clamp(w1 + w2, 0.0, 1.3) * uWaveAmp;
    vHot = hot;

    // coastlines read brighter and larger than interior fill, so the outlines carry the detail
    float coastW = 0.5 + aCoast * 0.8;
    float sizeW = 0.6 + aCoast * 0.62 + 0.3 * aSeed;
    // a sparse few points breathe, slowly, so nothing blinks
    float tw = step(0.93, aSeed) * (0.5 + 0.5 * sin(uTime * 0.5 + aSeed * 51.0));

    vAlpha = (uOpacity * m * coastW + hot * 0.6 + tw * 0.16 * m) * face;
    // A soft sprite under ~2 device px covers a different share of each pixel
    // as the globe drifts, so it twinkles; and clamping it up to a floor at full
    // strength made the small, distant globe brighter and sparklier still. Draw
    // small points at a steady 2.4 px and dim them by how much they were
    // enlarged, so each point puts out the same light it would have at its true size.
    float natural = (uSize * (sizeW + hot * 1.5 + tw * 0.3)) * uScale / max(0.001, -mv.z);
    float sz = max(2.4, natural);
    vAlpha *= clamp(natural / sz, 0.3, 1.0);
    gl_PointSize = sz;
    gl_Position = projectionMatrix * mv;
  }
`;
const LAND_FRAG = `
  uniform vec3 uColor;
  varying float vAlpha, vHot;
  void main() {
    vec2 d = gl_PointCoord - 0.5;
    float r = length(d);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.08, r) * vAlpha;
    gl_FragColor = vec4(uColor + vHot * 0.25, a);
  }
`;

const FADE_VERT = `
  uniform float uSize, uScale, uR;
  varying float vF;
  ${DEPTH_FADE}
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vF = depthFade(mv, uR);
    // same constant-light floor as the land points (see LAND_VERT)
    float natural = uSize * uScale / max(0.001, -mv.z);
    float sz = max(2.4, natural);
    vF *= clamp(natural / sz, 0.3, 1.0);
    gl_PointSize = sz;
    gl_Position = projectionMatrix * mv;
  }
`;
const FADE_POINT_FRAG = `
  uniform vec3 uColor; uniform float uOpacity;
  varying float vF;
  void main() {
    vec2 d = gl_PointCoord - 0.5;
    float r = length(d);
    if (r > 0.5) discard;
    // a soft edge: hard-edged discs of a pixel or two alias as they turn
    gl_FragColor = vec4(uColor, uOpacity * vF * smoothstep(0.5, 0.2, r));
  }
`;
const FADE_LINE_VERT = `
  uniform float uR;
  varying float vF;
  ${DEPTH_FADE}
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vF = depthFade(mv, uR);
    gl_Position = projectionMatrix * mv;
  }
`;
const FADE_LINE_FRAG = `
  uniform vec3 uColor; uniform float uOpacity;
  varying float vF;
  void main() { gl_FragColor = vec4(uColor, uOpacity * vF); }
`;
const BUNDLE_VERT = `
  attribute float aU;
  attribute float aPhase;
  uniform float uR;
  varying float vU, vF, vPhase;
  ${DEPTH_FADE}
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vF = depthFade(mv, uR);
    vU = aU;
    vPhase = aPhase;
    gl_Position = projectionMatrix * mv;
  }
`;
const BUNDLE_FRAG = `
  uniform vec3 uColor;
  uniform float uOpacity, uTime, uReveal, uDensity, uSpeed;
  varying float vU, vF, vPhase;
  void main() {
    if (vU > uReveal) discard;
    // dashes travel the filament at a fixed rate, so flow reads as transmission
    float s = fract(vU * uDensity - uTime * uSpeed + vPhase);
    float dash = smoothstep(0.0, 0.05, s) * smoothstep(0.26, 0.09, s);
    float head = smoothstep(uReveal - 0.05, uReveal, vU);
    gl_FragColor = vec4(uColor, uOpacity * vF * (0.07 + dash * 1.05 + head * 0.55));
  }
`;
const RIM_VERT = `
  varying vec3 vN, vV;
  void main() {
    vN = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const RIM_FRAG = `
  uniform vec3 uColor; uniform float uOpacity;
  varying vec3 vN, vV;
  void main() {
    float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 4.5);
    gl_FragColor = vec4(uColor, f * uOpacity);
  }
`;

/* ── telemetry surfaced to the HUD ─────────────────────── */
export type Telemetry = {
  act: string;
  progress: number;
  reach: number;
  links: number;
  route: string;
  km: number;
};

/** decimal degrees to degrees/minutes/seconds */
function dms(v: number, axis: "NS" | "EW") {
  const hemi = axis === "NS" ? (v >= 0 ? "N" : "S") : v >= 0 ? "E" : "W";
  const a = Math.abs(v);
  const d = Math.floor(a);
  const m = Math.floor((a - d) * 60);
  const sec = ((a - d) * 60 - m) * 60;
  return `${d}\u00B0${String(m).padStart(2, "0")}'${sec.toFixed(1).padStart(4, "0")}"${hemi}`;
}

const ACTS = ["I · STRUCTURE", "II · WORLD", "III · FLOW", "IV · REACH"];

function Scene({
  getProgress,
  reduced,
  onTelemetry,
  dim = 1,
  lookY = 0,
  smooth = 0,
  drift = 0,
  getOutro,
}: {
  getProgress: () => number;
  reduced: boolean;
  onTelemetry: (t: Telemetry) => void;
  /** overall brightness, lowered when the scene sits behind type */
  dim?: number;
  /** raise the camera target to push the globe lower in frame */
  lookY?: number;
  /** seconds of easing applied to progress: 0 scrubs exactly, higher glides */
  smooth?: number;
  /** slow continuous turn in rad/s, so the globe lives when nothing is scrolling */
  drift?: number;
  /** 0..1 of travel after the journey is finished: it keeps receding, leading the page down */
  getOutro?: () => number;
}) {
  const { camera, size, pointer } = useThree();
  const globe = useRef<THREE.Group>(null);
  const shells = useRef<THREE.Group>(null);
    const p = useRef(0);
  const lastPush = useRef(0);

  const originVec = useMemo(() => unit(ORIGIN.lat, ORIGIN.lon), []);

  /* ---- land mask: real coastlines ---- */
  const land = useMemo(() => {
    const ll = decodeLand();
    const coastFlags = decodeCoast();
    const n = ll.length / 2;
    const pos = new Float32Array(n * 3);
    const from = new Float32Array(n * 3);
    const stagger = new Float32Array(n);
    const seed = new Float32Array(n);
    const coast = new Float32Array(n);
    const r = rng(1337);
    for (let i = 0; i < n; i++) {
      const v = unit(ll[i * 2], ll[i * 2 + 1]);
      pos[i * 3] = v.x * R;
      pos[i * 3 + 1] = v.y * R;
      pos[i * 3 + 2] = v.z * R;
      // dots fall inward from a scattered shell
      const k = R * (1.06 + r() * 0.1);
      from[i * 3] = v.x * k + (r() - 0.5) * 0.12;
      from[i * 3 + 1] = v.y * k + (r() - 0.5) * 0.12;
      from[i * 3 + 2] = v.z * k + (r() - 0.5) * 0.12;
      // the world assembles outward from Paris
      stagger[i] = Math.acos(Math.max(-1, Math.min(1, v.dot(originVec)))) / Math.PI;
      seed[i] = r();
      coast[i] = coastFlags[i] ?? 0;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aFrom", new THREE.BufferAttribute(from, 3));
    g.setAttribute("aStagger", new THREE.BufferAttribute(stagger, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.setAttribute("aCoast", new THREE.BufferAttribute(coast, 1));
    return { geo: g, count: n };
  }, [originVec]);

  /* ---- geodesic lattice (act I) ---- */
  const lattice = useMemo(() => {
    const edges = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(R, 2), 1);
    const frame = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(R * 1.001, 1));
    const verts = new THREE.IcosahedronGeometry(R, 2).getAttribute("position");
    return { edges, frame, nodes: new Float32Array(verts.array as Float32Array) };
  }, []);

  /* ---- graticule ---- */
  const graticule = useMemo(() => {
    const pts: number[] = [];
    for (let lat = -60; lat <= 60; lat += 20) {
      const n = Math.round(300 * Math.cos(lat * D2R));
      for (let i = 0; i < n; i++) {
        const v = unit(lat, (i / n) * 360 - 180).multiplyScalar(R * 1.002);
        pts.push(v.x, v.y, v.z);
      }
    }
    for (let lon = -180; lon < 180; lon += 20) {
      for (let i = 0; i < 150; i++) {
        const v = unit(-80 + (i / 150) * 160, lon).multiplyScalar(R * 1.002);
        pts.push(v.x, v.y, v.z);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
    return g;
  }, []);

  /**
   * Routes are bundles, not single lines: each city is linked by four to six
   * filaments that fan apart across the middle of the crossing and converge
   * again at both ends, each with its own drift, lift and dash phase.
   */
  const SEG = 90;
  const routes = useMemo(() => {
    const a = originVec;
    const r = rng(2024);
    return CITIES.map((city, i) => {
      const b = unit(city.lat, city.lon);
      const omega = Math.acos(Math.max(-1, Math.min(1, a.dot(b))));
      const nrm = new THREE.Vector3().crossVectors(a, b).normalize();
      const count = 4 + Math.floor(r() * 3);
      const amp = 0.05 + r() * 0.1;

      const filaments = Array.from({ length: count }, (_, k) => ({
        side: (k / Math.max(1, count - 1) - 0.5) * amp + (r() - 0.5) * 0.016,
        lift: (r() - 0.5) * 0.07,
        wig: (r() - 0.5) * 0.022,
        freq: 1 + Math.floor(r() * 3),
        phase: r(),
      }));

      type Fil = (typeof filaments)[number];
      const at = (f: Fil, u: number, out: THREE.Vector3) => {
        const env = Math.sin(Math.PI * u);
        const off = f.side * env + f.wig * Math.sin(u * f.freq * Math.PI * 2 + f.phase * Math.PI * 2) * env;
        out.copy(slerp(a, b, omega, u)).normalize().addScaledVector(nrm, off).normalize();
        out.multiplyScalar(R * (1 + env * (0.025 + (omega / Math.PI) * 0.13 + f.lift * 0.5)));
      };

      // pack every filament of this bundle into one line-segment buffer
      const verts = count * SEG * 2;
      const pos = new Float32Array(verts * 3);
      const us = new Float32Array(verts);
      const phases = new Float32Array(verts);
      const tmp = new THREE.Vector3();
      let w = 0;
      filaments.forEach((f) => {
        for (let j = 0; j < SEG; j++) {
          for (const u of [j / SEG, (j + 1) / SEG]) {
            at(f, u, tmp);
            pos[w * 3] = tmp.x;
            pos[w * 3 + 1] = tmp.y;
            pos[w * 3 + 2] = tmp.z;
            us[w] = u;
            phases[w] = f.phase;
            w++;
          }
        }
      });
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("aU", new THREE.BufferAttribute(us, 1));
      geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

      const mat = new THREE.ShaderMaterial({
        vertexShader: BUNDLE_VERT,
        fragmentShader: BUNDLE_FRAG,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uColor: { value: LIGHT },
          uOpacity: { value: 0 },
          uTime: { value: 0 },
          uReveal: { value: 0 },
          // dash spacing stays constant in real distance, so long hauls carry more
          uDensity: { value: Math.max(3, Math.round(omega * 5)) },
          uSpeed: { value: 0.5 },
          uR: { value: R },
        },
      });

      // two or three packets per bundle, each riding its own filament
      const nPackets = 2 + Math.floor(r() * 2);
      const packets = Array.from({ length: nPackets }, () => ({
        fil: filaments[Math.floor(r() * count)],
        speed: (0.6 / omega) * (0.9 + r() * 0.25),
        phase: r() * 1.3,
        trail: (() => {
          const g = new THREE.BufferGeometry();
          g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(12 * 3), 3));
          return g;
        })(),
      }));

      return { city, a, b, omega, nrm, filaments, at, geo, mat, packets, km: omega * EARTH_KM, start: 0.44 + i * 0.022 };
    });
  }, [originVec]);

  /** every packet across every bundle, flattened for ref bookkeeping */
  const allPackets = useMemo(
    () => routes.flatMap((rt, ri) => rt.packets.map((pk) => ({ ...pk, ri, rt }))),
    [routes]
  );

  /* ---- city markers ---- */
  const markers = useMemo(
    () => [{ name: ORIGIN.name, v: originVec }, ...CITIES.map((c) => ({ name: c.name, v: unit(c.lat, c.lon) }))],
    [originVec]
  );
  const markerRefs = useRef<(THREE.Mesh | null)[]>([]);
  const flash = useRef<number[]>(new Array(markers.length).fill(0));
  const glow = useRef<number[]>([]);
  const prevU = useRef<number[]>([]);
  const packetRefs = useRef<(THREE.Mesh | null)[]>([]);
  const trailRefs = useRef<(THREE.Points<THREE.BufferGeometry<THREE.NormalOrGLBufferAttributes>> | null)[]>([]);

  /* ---- hub reticle: a ring lying tangent on the surface at the origin ---- */
  const hub = useMemo(() => {
    const seg = 72;
    const arr = new Float32Array((seg + 1) * 3);
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      arr[i * 3] = Math.cos(a) * 0.16;
      arr[i * 3 + 1] = Math.sin(a) * 0.16;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), originVec.clone().normalize());
    return { geo, quaternion: q, position: originVec.clone().multiplyScalar(R * 1.015) };
  }, [originVec]);

  /* ---- orbital shells (act IV: reach) ---- */
  const shellData = useMemo(() => {
    const r = rng(77);
    return Array.from({ length: 5 }, (_, i) => {
      const radius = R * (1.26 + i * 0.16);
      const n = 320 + i * 60;
      const arr = new Float32Array(n * 3);
      for (let j = 0; j < n; j++) {
        const t = (j / n) * Math.PI * 2;
        const wob = 1 + Math.sin(t * (3 + i) + i) * 0.012;
        arr[j * 3] = Math.cos(t) * radius * wob;
        arr[j * 3 + 1] = 0;
        arr[j * 3 + 2] = Math.sin(t) * radius * wob;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
      return { geo: g, tilt: (r() - 0.5) * 1.5, spin: r() * Math.PI, speed: (0.05 + r() * 0.07) * (i % 2 ? -1 : 1), radius };
    });
  }, []);

  /* ---- materials: created once, mutated directly (no ref timing) ---- */
  const mats = useMemo(() => {
    const fadePoints = (size: number) =>
      new THREE.ShaderMaterial({
        vertexShader: FADE_VERT,
        fragmentShader: FADE_POINT_FRAG,
        transparent: true,
        depthWrite: false,
        uniforms: { uColor: { value: LIGHT }, uOpacity: { value: 0 }, uSize: { value: size }, uScale: { value: 400 }, uR: { value: R } },
      });
    return {
      land: new THREE.ShaderMaterial({
        vertexShader: LAND_VERT,
        fragmentShader: LAND_FRAG,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uColor: { value: LIGHT },
          uOrigin: { value: originVec },
          uMorph: { value: 0 },
          uOpacity: { value: 0 },
          uSize: { value: 0.072 },
          uScale: { value: 400 },
          uWave: { value: 0 },
          uWave2: { value: 0 },
          uWaveAmp: { value: 0 },
          uBand: { value: 0.1 },
          uTime: { value: 0 },
          uR: { value: R },
        },
      }),
      graticule: fadePoints(0.022),
      shells: shellData.map(() => fadePoints(0.024)),
      hub: new THREE.LineBasicMaterial({ color: LIGHT, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }),
      lattice: new THREE.LineBasicMaterial({ color: LIGHT, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }),
      frame: new THREE.LineBasicMaterial({ color: LIGHT, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }),
      nodes: new THREE.PointsMaterial({ color: LIGHT, size: 0.04, sizeAttenuation: true, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }),
      rim: new THREE.ShaderMaterial({
        vertexShader: RIM_VERT,
        fragmentShader: RIM_FRAG,
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        uniforms: { uColor: { value: LIGHT }, uOpacity: { value: 0 } },
      }),
      marker: new THREE.MeshBasicMaterial({ color: LIGHT, transparent: true, opacity: 0, toneMapped: false }),
      packet: new THREE.MeshBasicMaterial({ color: LIGHT, toneMapped: false }),
      trail: new THREE.PointsMaterial({ color: LIGHT, size: 0.042, sizeAttenuation: true, transparent: true, opacity: 0.3, depthWrite: false, toneMapped: false }),
    };
  }, [originVec, shellData]);

  useFrame((state, delta) => {
    /* ----- progress, optionally eased so fast scrolls glide rather than snap ----- */
    // progress is a pure function of scroll, lightly damped: it runs the same
    // backwards as forwards, and settles exactly where the scroll says
    const target = getProgress();
    const dt = Math.min(delta, 1 / 30);
    p.current = smooth > 0 ? p.current + (target - p.current) * (1 - Math.exp(-dt / smooth)) : target;
    if (Math.abs(target - p.current) < 0.0004) p.current = target;
    const P = p.current;
    const t = state.clock.elapsedTime;
    const idle = reduced ? 0 : 1;

    /* ----- camera on a keyframed dolly ----- */
    const camX = lerp(0, 1.15, ramp(P, 0.3, 0.56)) * (1 - ramp(P, 0.72, 1));
    const camY = lerp(1.1, 0.5, ramp(P, 0, 0.3)) + ramp(P, 0.7, 1) * 1.3;
    const camZ = 14.6 - ramp(P, 0, 0.28) * 2.3 - ramp(P, 0.3, 0.55) * 0.9 + ramp(P, 0.68, 1) * 4.2;
    // keep the whole sphere in frame on narrow viewports, where the
    // horizontal field of view is the binding constraint
    const aspect = size.width / Math.max(1, size.height);
    const fit = Math.min(2.2, Math.max(1, 1 / Math.min(1, aspect * 1.15)));
    // once the journey is complete the globe keeps moving with the page:
    // it draws back and settles lower, leading the reader into what follows
    const outro = getOutro ? getOutro() : 0;
    // it drops out from behind the type early, then keeps drawing back slowly
    const eo = Math.pow(outro, 0.62);
    camera.position.set((camX + pointer.x * 0.25) * fit, (camY - pointer.y * 0.2) * fit, (camZ + eo * 9.0) * fit);
    camera.lookAt(0, lookY + eo * 3.6, 0);

    /* ----- globe orientation, driven by scroll ----- */
    if (globe.current) {
      // Centre the view ~27deg west of the origin meridian: that puts Europe and the
      // hub right of centre and brings the Americas fully into the left of frame.
      const face = -(ORIGIN.lon - 27) * D2R;
      globe.current.rotation.y = face - 0.85 + ramp(P, 0, 0.55) * 0.85 + ramp(P, 0.55, 1) * 0.3 + t * drift + pointer.x * 0.12 + Math.sin(t * 0.11) * 0.015 * idle;
      // tilt keeps the origin latitude in the upper middle of frame rather than on the rim
      globe.current.rotation.x = lerp(0.40, 0.30, ramp(P, 0, 0.5)) + ramp(P, 0.7, 1) * 0.1 - pointer.y * 0.1;
      globe.current.rotation.z = Math.sin(t * 0.07) * 0.01 * idle;
    }

    /* ----- act I: lattice ----- */
    const latticeIn = ramp(P, 0.0, 0.12);
    const latticeOut = 1 - ramp(P, 0.22, 0.46) * 0.955;
    mats.lattice.opacity = 0.3 * dim * latticeIn * latticeOut;
    mats.frame.opacity = 0.12 * dim * latticeIn * (1 - ramp(P, 0.3, 0.52) * 0.55);
    mats.nodes.opacity = 0.55 * dim * latticeIn * (1 - ramp(P, 0.2, 0.42) * 0.94);

    /* ----- act II: the world settles ----- */
    const wave = ramp(P, 0.74, 1) * Math.PI * 1.04;
    const wave2 = ((t * 0.42) % (Math.PI * 1.2)) * idle;
    {
      const u = mats.land.uniforms;
      u.uMorph.value = ramp(P, 0.14, 0.56);
      u.uOpacity.value = 0.82 * dim * ramp(P, 0.14, 0.34);
      u.uScale.value = size.height * 0.62;
      u.uWave.value = wave;
      u.uWave2.value = wave2;
      u.uWaveAmp.value = ramp(P, 0.72, 0.82) * (0.85 + Math.sin(t * 1.2) * 0.12 * idle);
      u.uBand.value = 0.1;
      u.uTime.value = t;
    }
    mats.graticule.uniforms.uOpacity.value = 0.13 * dim * ramp(P, 0.2, 0.42);
    mats.graticule.uniforms.uScale.value = size.height * 0.62;
    mats.rim.uniforms.uOpacity.value = 0.2 * dim * ramp(P, 0.18, 0.45);

    /* ----- act III: bundles and packets ----- */
    let links = 0;
    let active = "";
    let activeKm = 0;
    const tmp = new THREE.Vector3();

    routes.forEach((rt, i) => {
      const drawn = ramp(P, rt.start, rt.start + 0.1);
      const u = rt.mat.uniforms;
      u.uReveal.value = drawn;
      u.uOpacity.value = 0.72 * dim * (drawn > 0 ? 1 : 0);
      u.uTime.value = t;
      if (drawn > 0.999) links++;
      if (i === Math.floor((t * 0.22) % routes.length)) {
        active = `${ORIGIN.name} → ${rt.city.name}`;
        activeKm = rt.km;
      }
    });

    allPackets.forEach((pkt, idx) => {
      const mesh = packetRefs.current[idx];
      const trail = trailRefs.current[idx];
      const drawn = ramp(P, pkt.rt.start, pkt.rt.start + 0.1);
      if (!mesh) return;
      if (drawn < 0.999) {
        mesh.visible = false;
        if (trail) trail.visible = false;
        return;
      }
      const raw = (t * pkt.speed + pkt.phase) % 1.3;
      const uc = clamp01(raw);
      // The city lights when the packet actually lands (raw crosses 1), not when
      // the cycle wraps and it relaunches from the origin: that blink came a beat
      // after the packet had gone, and read as random flicker.
      const prev = prevU.current[idx] ?? raw;
      if (prev <= 1 && raw > 1) flash.current[pkt.ri + 1] = 1;
      prevU.current[idx] = raw;

      // Nothing pops. The head grows in as it leaves and shrinks into the city
      // as it lands; the trail keeps travelling after it and drains in behind it,
      // so it is fully gathered at the destination before it is hidden.
      const TAIL = 11 * 0.011;
      const drained = raw > 1 + TAIL;
      const head = ramp(raw, 0, 0.04) * (1 - ramp(raw, 0.97, 1));
      mesh.visible = head > 0.001;
      if (mesh.visible) {
        pkt.rt.at(pkt.fil, uc, tmp);
        mesh.position.copy(tmp);
        mesh.scale.setScalar(head);
      }
      if (trail) {
        trail.visible = !drained;
        if (!drained) {
          const arr = trail.geometry.getAttribute("position") as THREE.BufferAttribute;
          for (let k = 0; k < 12; k++) {
            pkt.rt.at(pkt.fil, clamp01(raw - k * 0.011), tmp);
            arr.setXYZ(k, tmp.x, tmp.y, tmp.z);
          }
          arr.needsUpdate = true;
        }
      }
    });

    /* ----- markers ----- */
    const markerIn = ramp(P, 0.4, 0.55);
    mats.marker.opacity = markerIn;
    mats.hub.opacity = markerIn * (0.45 + Math.sin(t * 1.1) * 0.18 * idle);
    markers.forEach((_, i) => {
      // the flash is a target; the glow follows it with a quick but soft rise,
      // so a landing swells the city instead of snapping it to 2.7x in one frame
      flash.current[i] = Math.max(0, flash.current[i] - dt * 1.6);
      glow.current[i] = (glow.current[i] ?? 0) + (flash.current[i] - (glow.current[i] ?? 0)) * (1 - Math.exp(-dt / 0.08));
      const m = markerRefs.current[i];
      if (m) {
        const s = (i === 0 ? 1.25 : 1) * (1 + glow.current[i] * 1.7) * markerIn;
        m.scale.setScalar(Math.max(0.001, s));
        m.visible = markerIn > 0.01;
      }
    });

    /* ----- act IV: orbital shells ----- */
    const shellIn = 0.4 * dim * ramp(P, 0.7, 0.92);
    mats.shells.forEach((m) => {
      m.uniforms.uOpacity.value = shellIn;
      m.uniforms.uScale.value = size.height * 0.62;
    });
    if (shells.current) {
      shells.current.children.forEach((c, i) => {
        c.rotation.y = t * shellData[i].speed * idle + shellData[i].spin;
      });
      shells.current.visible = P > 0.66;
    }

    /* ----- telemetry ----- */
    if (t - lastPush.current > 0.1) {
      lastPush.current = t;
      const actIndex = P < 0.16 ? 0 : P < 0.46 ? 1 : P < 0.72 ? 2 : 3;
      onTelemetry({
        act: ACTS[actIndex],
        progress: P,
        reach: ((1 - Math.cos(Math.min(Math.PI, wave))) / 2) * 100,
        links,
        route: active,
        km: activeKm,
      });
    }
  });

  return (
    <>
      <group ref={globe}>
        {/* act I — the lattice */}
        <lineSegments geometry={lattice.edges}>
          <primitive object={mats.lattice} attach="material" />
        </lineSegments>
        <lineSegments geometry={lattice.frame}>
          <primitive object={mats.frame} attach="material" />
        </lineSegments>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[lattice.nodes, 3]} />
          </bufferGeometry>
          <primitive object={mats.nodes} attach="material" />
        </points>

        {/* act II — real coastlines */}
        <points geometry={land.geo}>
          <primitive object={mats.land} attach="material" />
        </points>
        <points geometry={graticule}>
          <primitive object={mats.graticule} attach="material" />
        </points>

        {/* limb glow */}
        <mesh>
          <sphereGeometry args={[R * 1.012, 64, 64]} />
          <primitive object={mats.rim} attach="material" />
        </mesh>

        {/* act III — data bundles */}
        {routes.map((rt) => (
          <primitive key={rt.city.name} object={new THREE.LineSegments(rt.geo, rt.mat)} />
        ))}
        {allPackets.map((pkt, idx) => (
          <group key={`${pkt.rt.city.name}-${idx}`}>
            <points ref={(el) => { trailRefs.current[idx] = el; }} geometry={pkt.trail}>
              <primitive object={mats.trail} attach="material" />
            </points>
            <mesh ref={(el) => { packetRefs.current[idx] = el; }}>
              <sphereGeometry args={[0.028, 8, 8]} />
              <primitive object={mats.packet} attach="material" />
            </mesh>
          </group>
        ))}

        {/* hub reticle at the origin */}
        <group position={hub.position} quaternion={hub.quaternion}>
          <primitive object={new THREE.LineLoop(hub.geo, mats.hub)} />
        </group>

        {/* city markers */}
        {markers.map((m, i) => (
          <mesh
            key={m.name}
            ref={(el) => { markerRefs.current[i] = el; }}
            position={m.v.clone().multiplyScalar(R * 1.012)}
            visible={false}
          >
            <sphereGeometry args={[i === 0 ? 0.036 : 0.026, 10, 10]} />
            <primitive object={mats.marker} attach="material" />
          </mesh>
        ))}
      </group>

      {/* act IV — orbital shells */}
      <group ref={shells} visible={false}>
        {shellData.map((s, i) => (
          <group key={i} rotation={[s.tilt, 0, 0]}>
            <points geometry={s.geo}>
              <primitive object={mats.shells[i]} attach="material" />
            </points>
          </group>
        ))}
      </group>
    </>
  );
}

/* ── HUD + scroll host ─────────────────────────────────── */
export default function PlanetaryReach({ hud = false }: { hud?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const act = useRef<HTMLSpanElement>(null);
  const reach = useRef<HTMLSpanElement>(null);
  const links = useRef<HTMLSpanElement>(null);
  const route = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setMounted((m) => m || e.isIntersecting), { rootMargin: "300px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const labProgress = () => {
    const el = host.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const span = rect.height - window.innerHeight;
    return span > 0 ? clamp01(-rect.top / span) : 0;
  };

  const onTelemetry = (t: Telemetry) => {
    if (!hud) return;
    if (act.current) act.current.textContent = t.act;
    if (reach.current) reach.current.textContent = `${t.reach.toFixed(1)}%`;
    if (links.current) links.current.textContent = `${t.links} / ${CITIES.length}`;
    if (route.current) route.current.textContent = t.route ? `${t.route} · ${Math.round(t.km).toLocaleString("en-US")} KM` : "STANDBY";
    if (bar.current) bar.current.style.transform = `scaleX(${t.progress})`;
  };

  return (
    <div ref={host} className="relative h-[460vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink">
        <div className="absolute inset-0">
          {mounted && (
            <Canvas
              className="w-full h-full"
              camera={{ position: [0, 1.1, 14.6], fov: 40 }}
              dpr={[1, 1.75]}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            >
              <Suspense fallback={null}>
                <Scene getProgress={labProgress} reduced={reduced} onTelemetry={onTelemetry} />
                <EffectComposer>
                  <Bloom intensity={0.5} luminanceThreshold={0.55} luminanceSmoothing={0.85} mipmapBlur radius={0.68} />
                </EffectComposer>
              </Suspense>
            </Canvas>
          )}
        </div>

        {hud && (
          <div className="pointer-events-none absolute inset-0 kl-mono text-[10px] sm:text-[11px] tracking-[0.16em] text-ash/75">
            <div className="absolute top-24 left-6 sm:top-8 sm:left-10">SYNDAO · PLANETARY REACH</div>
            <div className="absolute top-24 right-6 sm:top-8 sm:right-10 text-light/90"><span ref={act}>I · STRUCTURE</span></div>
            <div className="absolute bottom-16 left-6 sm:bottom-20 sm:left-10 leading-5">
              <div>ORIGIN · {ORIGIN.name}</div>
              <div>{dms(ORIGIN.lat, "NS")} · {dms(ORIGIN.lon, "EW")}</div>
            </div>
            <div className="absolute bottom-16 right-6 sm:bottom-20 sm:right-10 leading-5 text-right">
              <div>SURFACE REACH <span ref={reach} className="text-light/90">0.0%</span></div>
              <div>LINKS LIVE <span ref={links} className="text-light/90">0 / {CITIES.length}</span></div>
            </div>
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 sm:bottom-20 hidden md:block">
              <span ref={route} className="text-light/90">STANDBY</span>
            </div>
            <div className="absolute bottom-8 left-6 right-6 sm:left-10 sm:right-10">
              <div className="h-px w-full bg-[rgba(244,241,233,0.12)] relative">
                <div ref={bar} className="absolute inset-0 origin-left bg-light/70" style={{ transform: "scaleX(0)" }} />
                {[0, 0.25, 0.5, 0.75, 1].map((x) => (
                  <span key={x} className="absolute top-[-3px] h-[7px] w-px bg-[rgba(244,241,233,0.3)]" style={{ left: `${x * 100}%` }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


/**
 * PlanetaryHero — the same scene as a hero background.
 *
 * It must look finished the moment the page loads, so the journey plays itself
 * from the lattice up to live links over the first few seconds, and from there
 * scrolling out of the hero drives the reach act.
 */
export function PlanetaryHero({ dim, lookY = 0.95 }: { dim?: number; lookY?: number }) {
  const reduced = useReducedMotion();
  const started = useRef(0);
  const shell = useRef<HTMLDivElement>(null);

  const FLOOR = 0.1; // first paint already has the lattice, never an empty frame
  const AMBIENT_MS = 19000; // untouched at the top, the world still builds itself

  // the globe competes with the type on a phone, so it sits back a little there.
  // Decided before the first frame (this only ever renders on the client), so
  // a phone never sees one bright frame before it dims.
  const [auto] = useState(() => (typeof window !== "undefined" && window.innerWidth < 768 ? 0.72 : 1));
  // once it has handed over it is invisible: stop drawing it, so it never
  // competes with the scene that follows for the GPU
  const [live, setLive] = useState(true);

  /**
   * The globe finishes its journey inside the hero and then stays.
   * It steps back so the sentence can be read over it, holds there while the
   * words arrive, and only hands over in the last stretch before the next scene.
   */
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = shell.current;
      if (el) {
        const vh = Math.max(1, window.innerHeight);
        const y = window.scrollY / vh;
        const settle = 1 - clamp01((y - 1.25) / 0.7) * 0.58; // steps back, does not leave
        const handover = 1 - clamp01((y - 3.95) / 0.6); // only now does it give way
        const f = settle * handover;
        el.style.opacity = String(f * f * (3 - 2 * f));
        const shouldRun = f > 0.001;
        setLive((prev) => (prev === shouldRun ? prev : shouldRun));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const getOutro = () => {
    if (typeof window === "undefined") return 0;
    const vh = Math.max(1, window.innerHeight);
    return clamp01((window.scrollY / vh - 1.1) / 3.2);
  };

  const getProgress = () => {
    if (typeof window === "undefined") return FLOOR;
    if (!started.current) started.current = performance.now();
    // at the very top, with no scroll yet, it still builds itself
    const ambient = reduced ? 1 : clamp01((performance.now() - started.current) / AMBIENT_MS);
    const idle = FLOOR + ambient * ambient * (3 - 2 * ambient) * 0.5;
    // Scroll carries it on from wherever the self-build has reached, never
    // back from it. (Taking the larger of a fading idle term and the raw scroll
    // rewound it from 0.6 to 0.14 in the first sixth of a screen: the lattice
    // snapped back in and the land unformed, which read as a flicker.)
    // Still a pure function of scroll at any moment, so it reverses exactly.
    const scrolled = clamp01(window.scrollY / Math.max(1, window.innerHeight * 1.1));
    return idle + (1 - idle) * scrolled;
  };

  return (
    <div ref={shell} className="w-full h-full">
      <Canvas
        className="w-full h-full"
        frameloop={live ? "always" : "never"}
        // the camera draws back to ~60 units: an explicit range keeps depth
        // precision for the lattice and land, where the default 0.1/2000 lets lines z-fight
        camera={{ position: [0, 1.1, 14.6], fov: 40, near: 1, far: 200 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <Scene
            getProgress={getProgress}
            reduced={reduced}
            onTelemetry={() => {}}
            dim={dim ?? auto}
            lookY={lookY}
            smooth={0.18}
            drift={0.012}
            getOutro={getOutro}
          />
          <EffectComposer multisampling={4}>
            <Bloom intensity={0.5} luminanceThreshold={0.55} luminanceSmoothing={0.85} mipmapBlur radius={0.68} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
