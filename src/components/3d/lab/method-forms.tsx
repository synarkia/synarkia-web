"use client";

/**
 * The Method, as four forms.
 *
 * One plot of land, drawn four times, at four moments. The plot never
 * changes; what we know about it and what stands on it does. Read left to
 * right, the four stations are the argument:
 *
 *   01 MAP     the ground is surveyed. Readings scatter across it, then
 *              settle, and contours appear: we learn the terrain.
 *   02 DESIGN  the survey becomes a drawing. A grid, compass arcs, and the
 *              footprints of the parts, set out in plan.
 *   03 BUILD   the footprints rise. Volumes stand up out of the plan, with
 *              the tallest at the centre, and the works turn.
 *   04 SHIP    it is finished and lit. Something leaves it, travels out,
 *              and comes back carrying readings: launch, measure, refine.
 *
 * Everything is drawn as line work on one ground plane, seen from a low
 * axonometric angle, so the four plots read as the same place over time.
 *
 * It is driven by the section's own position on screen, and it never takes
 * hold of the scroll.
 */

import { useMemo, useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { rng, useReducedMotion } from "./shared";

const LIGHT = new THREE.Color("#F4F1E9");
const TAU = Math.PI * 2;

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const ramp = (p: number, a: number, b: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** the plot: a square of ground, half a side across */
const HALF = 1.25;
/** how far apart the four stations stand */
const GAP = 4.15;
/** a low angle: the ground squashes, height stays tall */
const TILT = -Math.PI / 6.2;

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/** the parts of the system, in plan: cx, cz, halfW, halfD, height */
const MODULES: [number, number, number, number, number][] = [
  [-0.6, -0.52, 0.4, 0.28, 1.0],
  [0.52, -0.48, 0.28, 0.26, 0.62],
  [-0.48, 0.56, 0.26, 0.3, 0.44],
  [0.56, 0.52, 0.4, 0.28, 0.78],
  [0.0, 0.02, 0.22, 0.2, 1.5], // the core, tallest
];

type Poly = { pts: THREE.Vector3[]; order: number };

const rectXZ = (hw: number, hd: number, cx = 0, cz = 0, y = 0) => [
  v(cx - hw, y, cz - hd),
  v(cx + hw, y, cz - hd),
  v(cx + hw, y, cz + hd),
  v(cx - hw, y, cz + hd),
  v(cx - hw, y, cz - hd),
];

const arcXZ = (rad: number, a0: number, a1: number, seg = 48, y = 0, cx = 0, cz = 0) =>
  Array.from({ length: seg + 1 }, (_, i) => {
    const a = a0 + (i / seg) * (a1 - a0);
    return v(cx + Math.cos(a) * rad, y, cz + Math.sin(a) * rad);
  });

/** the plot outline, with a tick at each corner so it reads as a survey */
function plot(order = 0): Poly[] {
  const out: Poly[] = [{ pts: rectXZ(HALF, HALF, 0, 0, 0), order }];
  const t = 0.22;
  for (const [sx, sz] of [[1, 1], [-1, 1], [-1, -1], [1, -1]] as [number, number][]) {
    out.push({ pts: [v(sx * HALF, 0, sz * HALF), v(sx * (HALF + t), 0, sz * HALF)], order: order + 0.04 });
    out.push({ pts: [v(sx * HALF, 0, sz * HALF), v(sx * HALF, 0, sz * (HALF + t))], order: order + 0.04 });
  }
  return out;
}

/* ── 01 · MAP ───────────────────────────────────────────── */
function buildMap() {
  const r = rng(1101);
  const polys: Poly[] = [...plot(0)];

  // contours: closed loops, warped so they read as land rather than circles
  for (let k = 0; k < 4; k++) {
    const rad = 0.3 + k * 0.23;
    const seed = r() * TAU;
    const seg = 72;
    const pts = Array.from({ length: seg + 1 }, (_, i) => {
      const a = (i / seg) * TAU;
      const warp = 1 + Math.sin(a * 3 + seed) * 0.16 + Math.sin(a * 5 - seed * 1.7) * 0.09;
      return v(Math.cos(a) * rad * warp - 0.06, 0, Math.sin(a) * rad * warp * 0.92 + 0.04);
    });
    polys.push({ pts, order: 0.2 + k * 0.14 });
  }

  // a crosshair through the reading
  polys.push({ pts: [v(-HALF, 0, 0), v(HALF, 0, 0)], order: 0.12 });
  polys.push({ pts: [v(0, 0, -HALF), v(0, 0, HALF)], order: 0.12 });

  // the readings themselves: they arrive scattered and settle onto the ground
  const N = 90;
  const pos = new Float32Array(N * 3);
  const scatter = new Float32Array(N * 3);
  const seed = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const x = (r() * 2 - 1) * HALF * 0.94;
    const z = (r() * 2 - 1) * HALF * 0.94;
    pos.set([x, 0.015, z], i * 3);
    scatter.set([x + (r() - 0.5) * 1.5, 0.5 + r() * 1.5, z + (r() - 0.5) * 1.5], i * 3);
    seed[i] = r();
  }
  return { polys, points: { pos, scatter, seed, count: N } };
}

/* ── 02 · DESIGN ────────────────────────────────────────── */
function buildDesign() {
  const polys: Poly[] = [...plot(0)];

  // the drawing grid
  for (let i = 1; i < 4; i++) {
    const t = -HALF + (i / 4) * HALF * 2;
    polys.push({ pts: [v(t, 0, -HALF), v(t, 0, HALF)], order: 0.1 + i * 0.02 });
    polys.push({ pts: [v(-HALF, 0, t), v(HALF, 0, t)], order: 0.12 + i * 0.02 });
  }

  // construction arcs: the compass work behind a plan
  polys.push({ pts: arcXZ(1.5, -0.5, 1.5, 56, 0, -0.9, -0.5), order: 0.3 });
  polys.push({ pts: arcXZ(1.5, 1.9, 3.7, 56, 0, 0.9, 0.5), order: 0.36 });

  // the parts, set out in plan
  MODULES.forEach((m, i) => {
    polys.push({ pts: rectXZ(m[2], m[3], m[0], m[1], 0.004), order: 0.46 + i * 0.07 });
  });

  // the core carries the mark: six circles around one
  const seg = 30;
  const rr = 0.085;
  const ring = (cx: number, cz: number, order: number) =>
    polys.push({
      pts: Array.from({ length: seg + 1 }, (_, i) => {
        const a = (i / seg) * TAU;
        return v(cx + Math.cos(a) * rr, 0.008, cz + Math.sin(a) * rr);
      }),
      order,
    });
  ring(0, 0.02, 0.8);
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * TAU;
    ring(Math.cos(a) * rr, 0.02 + Math.sin(a) * rr, 0.84 + k * 0.015);
  }
  return { polys };
}

/* ── 03 · BUILD ─────────────────────────────────────────── */
function buildBuild() {
  const polys: Poly[] = [...plot(0)];
  // the plan stays underneath, faint, as the volumes stand up on it
  for (let i = 1; i < 4; i++) {
    const t = -HALF + (i / 4) * HALF * 2;
    polys.push({ pts: [v(t, 0, -HALF), v(t, 0, HALF)], order: 0.08 });
    polys.push({ pts: [v(-HALF, 0, t), v(HALF, 0, t)], order: 0.08 });
  }
  return { polys };
}

/** the volumes, kept apart so they can rise on their own timing */
function buildVolumes() {
  const P: number[] = [];
  const U: number[] = [];
  const O: number[] = [];
  const base: number[] = [];
  const push = (a: THREE.Vector3, b: THREE.Vector3, order: number, baseY: number) => {
    P.push(a.x, a.y, a.z, b.x, b.y, b.z);
    U.push(0, 1);
    O.push(order, order);
    base.push(baseY, baseY);
  };
  MODULES.forEach((m, i) => {
    const [cx, cz, hw, hd, h] = m;
    const order = i === 4 ? 0.0 : 0.2 + i * 0.16; // the core goes up first
    const corners: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    for (let k = 0; k < 4; k++) {
      const [ax, az] = corners[k];
      const [bx, bz] = corners[(k + 1) % 4];
      // the rising edge, and the ring that closes the top
      push(v(cx + ax * hw, 0.01, cz + az * hd), v(cx + ax * hw, h, cz + az * hd), order, 0.01);
      push(v(cx + ax * hw, h, cz + az * hd), v(cx + bx * hw, h, cz + bz * hd), order, h);
    }
    // a floor line part way up, so it reads as built rather than extruded
    for (let k = 0; k < 4; k++) {
      const [ax, az] = corners[k];
      const [bx, bz] = corners[(k + 1) % 4];
      push(v(cx + ax * hw, h * 0.55, cz + az * hd), v(cx + bx * hw, h * 0.55, cz + bz * hd), order, h * 0.55);
    }
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(P), 3));
  g.setAttribute("aU", new THREE.BufferAttribute(new Float32Array(U), 1));
  g.setAttribute("aOrder", new THREE.BufferAttribute(new Float32Array(O), 1));
  g.setAttribute("aBase", new THREE.BufferAttribute(new Float32Array(base), 1));
  return g;
}

/* ── 04 · SHIP ──────────────────────────────────────────── */
function buildShip() {
  const polys: Poly[] = [...plot(0)];
  return { polys };
}

/**
 * Shipping is not the end of the line, it is the start of a circuit: the work
 * leaves the finished thing and keeps coming back around, carrying readings.
 * A standing loop above the plot says that in one shape, and stays inside the
 * plot's own width so four of these fit across a row.
 */
function buildLoop() {
  const CX = 0.1, CY = 2.0, CZ = 0.12;
  const RX = 0.9, RY = 0.68;
  const N = 96;
  const ring = Array.from({ length: N + 1 }, (_, i) => {
    const a = (i / N) * TAU - Math.PI / 2;
    return v(CX + Math.cos(a) * RX, CY + Math.sin(a) * RY, CZ + Math.cos(a) * 0.15);
  });
  const launch = [v(0, 1.5, 0), v(CX, CY - RY, CZ)];
  return { ring, launch };
}

/* ── shaders ────────────────────────────────────────────── */

/** line work that draws itself on, each part waiting its turn */
const DRAW_VERT = `
  attribute float aU;
  attribute float aOrder;
  varying float vU, vO;
  void main() {
    vU = aU; vO = aOrder;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const DRAW_FRAG = `
  uniform vec3 uColor;
  uniform float uOpacity, uReveal, uSpread;
  varying float vU, vO;
  void main() {
    float local = clamp((uReveal - vO * uSpread) / max(0.001, 1.0 - uSpread), 0.0, 1.0);
    if (vU > local) discard;
    float head = smoothstep(local - 0.09, local, vU) * (1.0 - step(0.999, local));
    gl_FragColor = vec4(uColor, uOpacity * (0.74 + head * 1.5));
  }
`;

/** volumes that grow from their own base rather than fading in */
const RISE_VERT = `
  attribute float aOrder;
  attribute float aBase;
  uniform float uGrow;
  varying float vH;
  void main() {
    float g = clamp((uGrow - aOrder * 0.55) / 0.45, 0.0, 1.0);
    g = g * g * (3.0 - 2.0 * g);
    vec3 p = position;
    p.y *= g;
    vH = clamp(p.y / 1.6, 0.0, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const RISE_FRAG = `
  uniform vec3 uColor; uniform float uOpacity;
  varying float vH;
  void main() { gl_FragColor = vec4(uColor, uOpacity * (0.55 + 0.45 * (1.0 - vH * 0.5))); }
`;

/** readings landing on the ground */
const SETTLE_VERT = `
  attribute vec3 aScatter;
  attribute float aSeed;
  uniform float uMix, uSize, uScale, uTime;
  varying float vA;
  void main() {
    float m = clamp((uMix - aSeed * 0.4) / 0.6, 0.0, 1.0);
    m = m * m * (3.0 - 2.0 * m);
    vec3 p = mix(aScatter, position, m);
    vA = (0.45 + 0.55 * aSeed) * m * (0.75 + 0.25 * sin(uTime * 1.6 + aSeed * 40.0));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = max(1.3, uSize * (0.7 + 0.5 * aSeed) * uScale);
    gl_Position = projectionMatrix * mv;
  }
`;
const SETTLE_FRAG = `
  uniform vec3 uColor; uniform float uOpacity;
  varying float vA;
  void main() {
    float l = length(gl_PointCoord - 0.5);
    if (l > 0.5) discard;
    gl_FragColor = vec4(uColor, smoothstep(0.5, 0.08, l) * vA * uOpacity);
  }
`;

const DOT_VERT = `
  uniform float uSize, uScale;
  void main() {
    gl_PointSize = max(1.4, uSize * uScale);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const DOT_FRAG = `
  uniform vec3 uColor; uniform float uOpacity;
  void main() {
    float l = length(gl_PointCoord - 0.5);
    if (l > 0.5) discard;
    gl_FragColor = vec4(uColor, smoothstep(0.5, 0.1, l) * uOpacity);
  }
`;

/* ── helpers ────────────────────────────────────────────── */

function drawGeometry(polys: Poly[]) {
  const P: number[] = [];
  const U: number[] = [];
  const O: number[] = [];
  polys.forEach(({ pts, order }) => {
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
}

function stripGeometry(pts: THREE.Vector3[]) {
  const P: number[] = [];
  const U: number[] = [];
  const O: number[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    for (const k of [i, i + 1]) {
      P.push(pts[k].x, pts[k].y, pts[k].z);
      U.push(k / (pts.length - 1));
      O.push(0);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(P), 3));
  g.setAttribute("aU", new THREE.BufferAttribute(new Float32Array(U), 1));
  g.setAttribute("aOrder", new THREE.BufferAttribute(new Float32Array(O), 1));
  return g;
}

/* ── the scene ──────────────────────────────────────────── */

function Scene({ getProgress, reduced }: { getProgress: () => number; reduced: boolean }) {
  const { size } = useThree();
  /* Four across only where the stepper below is also four across: that is
     the large breakpoint. Under it the stepper is one or two columns, and so
     is this. */
  const wide = size.width >= 930;
  const p = useRef(0);

  const mapF = useMemo(() => buildMap(), []);
  const designF = useMemo(() => buildDesign(), []);
  const buildF = useMemo(() => buildBuild(), []);
  const shipF = useMemo(() => buildShip(), []);
  const volumes = useMemo(() => buildVolumes(), []);
  const loop = useMemo(() => buildLoop(), []);

  const geo = useMemo(
    () => ({
      map: drawGeometry(mapF.polys),
      design: drawGeometry(designF.polys),
      build: drawGeometry(buildF.polys),
      ship: drawGeometry(shipF.polys),
      launch: stripGeometry(loop.launch),
      ring: stripGeometry(loop.ring),
      thread: stripGeometry([v(-GAP * 1.5 - HALF * 1.1, 0, 0), v(GAP * 1.5 + HALF * 1.1, 0, 0)]),
      needle: stripGeometry([v(0, 0.012, 0), v(HALF * 0.92, 0.012, 0)]),
      jib: stripGeometry([v(-0.22, 0, 0), v(0.92, 0, 0)]),
      mast: stripGeometry([v(0, 0, 0), v(0, 1.72, 0)]),
    }),
    [mapF, designF, buildF, shipF, loop]
  );

  const settle = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(mapF.points.pos, 3));
    g.setAttribute("aScatter", new THREE.BufferAttribute(mapF.points.scatter, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(mapF.points.seed, 1));
    return g;
  }, [mapF]);

  const travellers = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6 * 3), 3));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(1, 1, 0), 5);
    return g;
  }, []);

  const mats = useMemo(() => {
    const draw = (opacity: number, spread = 0.65) =>
      new THREE.ShaderMaterial({
        vertexShader: DRAW_VERT,
        fragmentShader: DRAW_FRAG,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uColor: { value: LIGHT },
          uOpacity: { value: opacity },
          uReveal: { value: 0 },
          uSpread: { value: spread },
        },
      });
    const dot = (sizePx: number) =>
      new THREE.ShaderMaterial({
        vertexShader: DOT_VERT,
        fragmentShader: DOT_FRAG,
        transparent: true,
        depthWrite: false,
        uniforms: { uColor: { value: LIGHT }, uOpacity: { value: 0 }, uSize: { value: sizePx }, uScale: { value: 1 } },
      });
    return {
      map: draw(0.6),
      design: draw(0.6),
      build: draw(0.42),
      ship: draw(0.42),
      volumes: new THREE.ShaderMaterial({
        vertexShader: RISE_VERT,
        fragmentShader: RISE_FRAG,
        transparent: true,
        depthWrite: false,
        uniforms: { uColor: { value: LIGHT }, uOpacity: { value: 0 }, uGrow: { value: 0 } },
      }),
      shipVolumes: new THREE.ShaderMaterial({
        vertexShader: RISE_VERT,
        fragmentShader: RISE_FRAG,
        transparent: true,
        depthWrite: false,
        uniforms: { uColor: { value: LIGHT }, uOpacity: { value: 0 }, uGrow: { value: 1 } },
      }),
      out: draw(0.75, 0),
      back: draw(0.66, 0),
      thread: draw(0.16, 0),
      settle: new THREE.ShaderMaterial({
        vertexShader: SETTLE_VERT,
        fragmentShader: SETTLE_FRAG,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uColor: { value: LIGHT },
          uOpacity: { value: 1 },
          uMix: { value: 0 },
          uTime: { value: 0 },
          uSize: { value: 0.028 },
          uScale: { value: 1 },
        },
      }),
      travellers: dot(0.05),
      spark: dot(0.055),
      beacon: dot(0.085),
      needle: draw(0.5, 0),
      works: draw(0.45, 0),
    };
  }, []);

  const compass = useRef<THREE.LineSegments>(null);
  const jib = useRef<THREE.LineSegments>(null);
  const beacon = useRef<THREE.Points>(null);
  const sparkGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(3), 3));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12);
    return g;
  }, []);
  const beaconGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1);
    return g;
  }, []);

  useFrame((state, delta) => {
    // aliased once: the materials are written through these each frame
    const U = {
      map: mats.map.uniforms, design: mats.design.uniforms, build: mats.build.uniforms,
      ship: mats.ship.uniforms, thread: mats.thread.uniforms, settle: mats.settle.uniforms,
      volumes: mats.volumes.uniforms, shipVolumes: mats.shipVolumes.uniforms,
      out: mats.out.uniforms, back: mats.back.uniforms, travellers: mats.travellers.uniforms,
      needle: mats.needle.uniforms, works: mats.works.uniforms,
      beacon: mats.beacon.uniforms, spark: mats.spark.uniforms,
    };
    const target = getProgress();
    const dt = Math.min(delta, 1 / 30);
    p.current += (target - p.current) * (1 - Math.exp(-dt / 0.28));
    const P = reduced ? 1 : p.current;
    const t = state.clock.elapsedTime * (reduced ? 0 : 1);

    // fit whichever arrangement we are using to the width we are given
    const span = wide ? GAP * 3 + HALF * 2.9 : GAP * 1.24 + HALF * 2.6;
    const tall = wide ? 3.4 : 6.6;
    const cam = state.camera as THREE.OrthographicCamera;
    const zoom = Math.min((size.width / span) * 0.98, size.height / tall);
    if (Math.abs(cam.zoom - zoom) > 0.01) {
      cam.zoom = zoom;
      cam.updateProjectionMatrix();
    }
    const px = zoom * (state.viewport.dpr || 1);

    // each station takes its turn, and holds
    const at = [0.0, 0.2, 0.4, 0.6];
    const reveal = (i: number) => ramp(P, at[i], at[i] + 0.3);

    U.map.uReveal.value = reveal(0);
    U.design.uReveal.value = reveal(1);
    U.build.uReveal.value = reveal(2);
    U.ship.uReveal.value = reveal(3);
    U.thread.uReveal.value = ramp(P, 0, 0.5);

    // 01 the readings land
    U.settle.uMix.value = ramp(P, 0.04, 0.34);
    U.settle.uTime.value = t;
    U.settle.uScale.value = px;

    // 02 the compass sweeps while the plan is drawn
    if (compass.current) compass.current.rotation.y = -t * 0.25;

    // 03 the volumes rise, and the works turn
    U.volumes.uGrow.value = ramp(P, 0.44, 0.78);
    U.volumes.uOpacity.value = 0.85 * ramp(P, 0.42, 0.52);
    if (jib.current) jib.current.rotation.y = t * 0.32;

    // 04 it stands finished, and something leaves it
    U.shipVolumes.uOpacity.value = 0.8 * ramp(P, 0.62, 0.74);
    U.out.uReveal.value = ramp(P, 0.66, 0.8);
    U.back.uReveal.value = ramp(P, 0.74, 0.98);

    // readings coming home along the return arc
    const arr = travellers.getAttribute("position") as THREE.BufferAttribute;
    const live = ramp(P, 0.84, 0.96);
    for (let i = 0; i < arr.count; i++) {
      const u = (t * 0.16 + i / arr.count) % 1;
      const k = Math.min(loop.ring.length - 1, Math.floor(u * loop.ring.length));
      const pt = loop.ring[k];
      arr.setXYZ(i, pt.x, pt.y, live > 0.02 ? pt.z : 9999);
    }
    arr.needsUpdate = true;
    U.travellers.uOpacity.value = 0.9 * live;
    U.travellers.uScale.value = px;

    // the compass and the works appear with their own stations
    U.needle.uReveal.value = ramp(P, 0.24, 0.34);
    U.works.uReveal.value = ramp(P, 0.6, 0.72);

    // the beacon on the finished core
    U.beacon.uOpacity.value = (0.55 + 0.45 * Math.sin(t * 1.9)) * ramp(P, 0.66, 0.78);
    U.beacon.uScale.value = px;
    U.spark.uOpacity.value = 0.55 * ramp(P, 0.06, 0.2);
    U.spark.uScale.value = px;

    // a light running the thread that ties the four together
    const sp = sparkGeo.getAttribute("position") as THREE.BufferAttribute;
    const u = (t * 0.075) % 1;
    const x0 = -GAP * 1.5 - HALF * 1.1;
    sp.setXYZ(0, x0 + u * (GAP * 3 + HALF * 2.2), 0.02, 0);
    sp.needsUpdate = true;
  });

  /* On a wide screen the four stand in a row, one above each column of the
     stepper below; the row is nudged left so each form sits over the words it
     belongs to rather than over the middle of the column. With no width to
     spare they fall into two rows of two, which stays legible on a phone. */
  const stations: [number, number][] = wide
    ? [[-GAP * 1.5 - 0.59, 0], [-GAP * 0.5 - 0.59, 0], [GAP * 0.5 - 0.59, 0], [GAP * 1.5 - 0.59, 0]]
    /* the ground axis is foreshortened on screen, so the two rows need far
       more separation in plan than they appear to need */
    : [[-GAP * 0.62, GAP * 0.95], [GAP * 0.62, GAP * 0.95], [-GAP * 0.62, -GAP * 0.95], [GAP * 0.62, -GAP * 0.95]];

  return (
    <group rotation={[TILT, 0, 0]}>
      {/* the thread through all four, when they stand in a line */}
      {wide && (
        <group position={[-0.59, 0, 0]}>
          <lineSegments geometry={geo.thread}>
            <primitive object={mats.thread} attach="material" />
          </lineSegments>
          <points geometry={sparkGeo}>
            <primitive object={mats.spark} attach="material" />
          </points>
        </group>
      )}

      {/* 01 · MAP */}
      <group position={[stations[0][0], 0, stations[0][1]]}>
        <lineSegments geometry={geo.map}>
          <primitive object={mats.map} attach="material" />
        </lineSegments>
        <points geometry={settle}>
          <primitive object={mats.settle} attach="material" />
        </points>
      </group>

      {/* 02 · DESIGN */}
      <group position={[stations[1][0], 0, stations[1][1]]}>
        <lineSegments geometry={geo.design}>
          <primitive object={mats.design} attach="material" />
        </lineSegments>
        <group ref={compass}>
          <lineSegments geometry={geo.needle}>
            <primitive object={mats.needle} attach="material" />
          </lineSegments>
        </group>
      </group>

      {/* 03 · BUILD */}
      <group position={[stations[2][0], 0, stations[2][1]]}>
        <lineSegments geometry={geo.build}>
          <primitive object={mats.build} attach="material" />
        </lineSegments>
        <lineSegments geometry={volumes}>
          <primitive object={mats.volumes} attach="material" />
        </lineSegments>
        <lineSegments geometry={geo.mast} position={[0.02, 0, 0.02]}>
          <primitive object={mats.works} attach="material" />
        </lineSegments>
        <group ref={jib} position={[0.02, 1.72, 0.02]}>
          <lineSegments geometry={geo.jib}>
            <primitive object={mats.works} attach="material" />
          </lineSegments>
        </group>
      </group>

      {/* 04 · SHIP */}
      <group position={[stations[3][0], 0, stations[3][1]]}>
        <lineSegments geometry={geo.ship}>
          <primitive object={mats.ship} attach="material" />
        </lineSegments>
        <lineSegments geometry={volumes}>
          <primitive object={mats.shipVolumes} attach="material" />
        </lineSegments>
        <lineSegments geometry={geo.launch}>
          <primitive object={mats.out} attach="material" />
        </lineSegments>
        <lineSegments geometry={geo.ring}>
          <primitive object={mats.back} attach="material" />
        </lineSegments>
        <points geometry={travellers} frustumCulled={false}>
          <primitive object={mats.travellers} attach="material" />
        </points>
        <points ref={beacon} position={[0, 1.56, 0.02]} geometry={beaconGeo}>
          <primitive object={mats.beacon} attach="material" />
        </points>
      </group>
    </group>
  );
}

export default function MethodForms({ height = "clamp(300px, 26vw, 344px)" }: { height?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [near, setNear] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const mount = new IntersectionObserver(([e]) => setNear((m) => m || e.isIntersecting), { rootMargin: "900px 0px" });
    // only spend frames while it is actually on screen
    const run = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "120px 0px" });
    mount.observe(el);
    run.observe(el);
    return () => {
      mount.disconnect();
      run.disconnect();
    };
  }, []);

  /** the four stations arrive as the band crosses the viewport. No scroll is taken. */
  const getProgress = () => {
    const el = host.current;
    if (!el || typeof window === "undefined") return 0;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = vh * 0.95;
    const travel = vh * 0.46;
    return clamp01((start - rect.top) / travel);
  };

  return (
    <div ref={host} className="relative w-full" style={{ height }}>
      {near && (
        <Canvas
          className="w-full h-full"
          orthographic
          camera={{ position: [0, 0, 40], zoom: 60, near: 1, far: 120 }}
          dpr={[1, 1.5]}
          frameloop={active ? "always" : "never"}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
            <Scene getProgress={getProgress} reduced={reduced} />
            <EffectComposer multisampling={4}>
              <Bloom intensity={0.5} luminanceThreshold={0.3} luminanceSmoothing={0.9} mipmapBlur radius={0.6} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
