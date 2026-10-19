"use client";

/**
 * Asset Lab — internal review page (noindex, unlinked).
 * Nine WebGL scenes + one SVG system diagram, each mapped to a Syndao service or section.
 */

import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Reveal } from "@/components/ui/reveal";
import { CursorLight } from "@/components/ui/cursor-light";

const load = (p: () => Promise<{ default: React.ComponentType }>) => dynamic(p, { ssr: false, loading: () => null });
const GridRoom = load(() => import("@/components/3d/lab/grid-room"));
const Iris = load(() => import("@/components/3d/lab/iris"));
const LatticeSphere = load(() => import("@/components/3d/lab/lattice-sphere"));
const Terrain = load(() => import("@/components/3d/lab/terrain"));
const Globe = load(() => import("@/components/3d/lab/globe"));
const Metatron = load(() => import("@/components/3d/lab/metatron"));
const OrbitField = load(() => import("@/components/3d/lab/orbit-field"));
const MethodTunnel = load(() => import("@/components/3d/lab/method-tunnel"));
const Plume = load(() => import("@/components/3d/lab/plume"));
const PlanetaryReach = dynamic(() => import("@/components/3d/lab/planetary-reach"), { ssr: false, loading: () => null });
const Momentum = dynamic(() => import("@/components/3d/lab/momentum"), { ssr: false, loading: () => null });

type Asset = {
  id: string;
  n: string;
  service: string;
  title: string;
  reads: string;
  placement: string;
  tech: string;
  Scene: React.ComponentType;
  overlay?: React.ReactNode;
  aspect?: string;
};

const HUD = ({ tl, tr, bl, br }: { tl: string; tr: string; bl: string; br: string }) => (
  <div className="pointer-events-none absolute inset-0 kl-mono text-[10px] sm:text-[11px] text-ash/80 tracking-[0.14em]">
    <span className="absolute top-4 left-5">{tl}</span>
    <span className="absolute top-4 right-5">{tr}</span>
    <span className="absolute bottom-4 left-5">{bl}</span>
    <span className="absolute bottom-4 right-5">{br}</span>
    <span className="absolute top-4 left-1/2 -translate-x-1/2">N</span>
    <span className="absolute bottom-4 left-1/2 -translate-x-1/2">S</span>
    <span className="absolute left-5 top-1/2 -translate-y-1/2">W</span>
    <span className="absolute right-5 top-1/2 -translate-y-1/2">E</span>
  </div>
);

const ASSETS: Asset[] = [
  {
    id: "engine-room", n: "01", service: "Internal Tools", title: "The Engine Room",
    reads: "A corridor of rails with packets running through it. Leads captured, followed up, invoiced: the unglamorous flow that compounds.",
    placement: "Background of the Internal Tools card on home, or the /labs hero.",
    tech: "R3F · 2 line batches + 1 point cloud · 26 sparks · seamless loop by modulo · fog",
    Scene: GridRoom, overlay: <HUD tl="LEADS  IN" tr="INVOICES  OUT" bl="LOOP  02.0s" br="26 PACKETS" />,
  },
  {
    id: "iris", n: "02", service: "AI & Automation", title: "The Iris",
    reads: "A dark core reading everything around it. Rings turn at different speeds, and every few seconds a spoke flashes: an event handled without a human.",
    placement: "AI & Automation card, or a full-bleed section divider on home.",
    tech: "R3F · 1,400 streaks in 3 opacity groups · 5 dotted rings · 3 wobble traces · flashing spokes",
    Scene: Iris,
  },
  {
    id: "structure", n: "03", service: "Websites & Apps", title: "Structure",
    reads: "A triangulated dome: nodes, edges, and light travelling the network. What a site looks like under the skin when it is built properly.",
    placement: "Websites & Apps card, or the /studio hero offset right.",
    tech: "R3F · icosahedron edges (detail 3) + faint outer shell · 60 chords · 5 orbiting sparks",
    Scene: LatticeSphere,
  },
  {
    id: "summit", n: "04", service: "Websites & Apps", title: "Summit",
    reads: "A contour-line mountain rising out of noise and never settling. Prototype to production, in one continuous surface.",
    placement: "Websites & Apps card background, or a wide band above the Work gallery.",
    tech: "R3F · single lineSegments (≈10k segs) · GLSL simplex displacement in the vertex shader · height/depth fade",
    Scene: Terrain,
  },
  {
    id: "market-map", n: "05", service: "GTM Consulting", title: "Market Map",
    reads: "A dotted globe with pressure curves over three markets and trajectories between them. Positioning, routes to market, movement.",
    placement: "GTM Consulting card, or the pricing section on /studio.",
    tech: "R3F · dotted graticule (points) · 18 isobar curves · 7 great-circle routes with sparks · dark occluder sphere",
    Scene: Globe, overlay: <HUD tl="+48.86°N" tr="+2.35°E" bl="PARIS  ·  EU" br="7 ROUTES" />,
  },
  {
    id: "identity-system", n: "06", service: "Brand & Studio", title: "Identity System",
    reads: "Metatron's cube: thirteen centres, every pair connected, a faint lattice repeating behind. A brand is a system, not a logo.",
    placement: "Brand & Studio card, or the /studio hero.",
    tech: "R3F · 78 chords + 13 circles + hexagram · tiled background lattice · mouse parallax",
    Scene: Metatron,
  },
  {
    id: "reach", n: "07", service: "Social Media Management", title: "Reach",
    reads: "One voice at the centre, rings of attention widening outward, and an audience standing in the field. Consistency is what makes the rings.",
    placement: "Social Media card, or the Signal section on home.",
    tech: "R3F · 64 wobbled rings in 3 counter-rotating layers · 90 standing figures · wireframe core + beam · fog",
    Scene: OrbitField,
  },
  {
    id: "method", n: "08", service: "Method · Map / Design / Build / Ship", title: "Four Gates",
    reads: "Four instrument gates in a line. A pulse passes each one in order and the gate answers. The method, as a machine.",
    placement: "Replace or back the 4-step stepper on home; labels sit under each gate.",
    tech: "R3F · 4 gates (rings + tick bezels) · pulse with 40-point trail · per-gate proximity glow",
    Scene: MethodTunnel,
    overlay: (
      <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center gap-6 sm:gap-10 kl-mono text-[10px] sm:text-[11px] tracking-[0.18em] text-ash/80">
        <span>01 MAP</span><span>02 DESIGN</span><span>03 BUILD</span><span>04 SHIP</span>
      </div>
    ),
  },
  {
    id: "launch", n: "09", service: "Ship · Launch moment", title: "Launch",
    reads: "A particle plume climbing out of a dark ground, then the cycle resets. For the moment a build goes live.",
    placement: "Contact / booking section, or the closing band of /labs.",
    tech: "R3F · 9,000 particles with per-vertex alpha & size (custom shader) · additive blending · 11s cycle",
    Scene: Plume,
  },
];

/* ─── 10 · SVG system diagram ─────────────────────────── */
function SystemDiagram() {
  const nodes = [
    { id: "brand", x: 120, y: 200, label: "Brand" },
    { id: "site", x: 360, y: 90, label: "Website" },
    { id: "social", x: 360, y: 310, label: "Socials" },
    { id: "tools", x: 620, y: 200, label: "Internal tools" },
    { id: "cash", x: 860, y: 200, label: "Invoicing" },
  ];
  const links: [string, string][] = [
    ["brand", "site"], ["brand", "social"], ["site", "tools"], ["social", "tools"], ["tools", "cash"], ["cash", "brand"],
  ];
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  return (
    <div className="absolute inset-0 flex items-center justify-center p-6">
      <svg viewBox="0 0 980 400" className="w-full h-full max-h-full" fill="none" stroke="#F4F1E9">
        <defs>
          <radialGradient id="g" r="0.5"><stop offset="0" stopColor="#F4F1E9" stopOpacity="0.9" /><stop offset="1" stopColor="#F4F1E9" stopOpacity="0" /></radialGradient>
        </defs>
        <style>{`
          .flow { stroke-dasharray: 3 9; animation: flow 3.2s linear infinite; }
          .flow.slow { animation-duration: 5.4s; }
          @keyframes flow { to { stroke-dashoffset: -48; } }
          .pulse { animation: pulse 4s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
          @keyframes pulse { 0%,100% { opacity: .35 } 50% { opacity: 1 } }
          .spin { animation: spin 40s linear infinite; transform-origin: center; transform-box: fill-box; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
        {links.map(([a, b], i) => {
          const A = byId[a], B = byId[b];
          const back = a === "cash";
          const d = back
            ? `M${A.x},${A.y + 60} C ${A.x},${A.y + 170} ${B.x},${B.y + 170} ${B.x},${B.y + 60}`
            : `M${A.x},${A.y} L${B.x},${B.y}`;
          return (
            <g key={i}>
              <path d={d} strokeOpacity="0.14" />
              <path d={d} strokeOpacity="0.9" className={`flow ${back ? "slow" : ""}`} strokeWidth="1.5" />
            </g>
          );
        })}
        {nodes.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r="60" fill="url(#g)" opacity="0.18" />
            <circle cx={n.x} cy={n.y} r="44" strokeOpacity="0.25" />
            <g className="spin"><circle cx={n.x} cy={n.y} r="52" strokeOpacity="0.5" strokeDasharray="2 14" /></g>
            <circle cx={n.x} cy={n.y} r="44" fill="#060608" />
            <circle cx={n.x} cy={n.y} r="44" strokeOpacity="0.25" />
            <circle cx={n.x} cy={n.y} r="3" fill="#F4F1E9" className="pulse" />
            <text x={n.x} y={n.y + 74} textAnchor="middle" fill="#B6B3AB" stroke="none" fontSize="11" letterSpacing="2.5" fontFamily="var(--font-ibm-plex-mono)">{n.label.toUpperCase()}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function Frame({ a, index }: { a: Asset; index: number }) {
  return (
    <section id={a.id} className="py-16 md:py-24 border-t border-[rgba(244,241,233,0.07)]">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
            <div className="flex items-baseline gap-5">
              <span className="kl-mono text-smoke">{a.n}</span>
              <h2 className="kl-h3">{a.title}</h2>
            </div>
            <span className="kl-eyebrow">{a.service}</span>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div className={`relative w-full ${a.aspect ?? "aspect-[4/3] md:aspect-[16/9]"} rounded-2xl overflow-hidden border border-[rgba(244,241,233,0.10)] bg-ink`}>
            <a.Scene />
            {a.overlay}
            <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_120px_rgba(0,0,0,0.55)]" />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mt-8">
            <p className="kl-body md:col-span-1">{a.reads}</p>
            <div><span className="kl-eyebrow">Suggested placement</span><p className="kl-body-sm mt-3">{a.placement}</p></div>
            <div><span className="kl-eyebrow">Under the hood</span><p className="kl-mono text-[11px] leading-6 text-ash mt-3">{a.tech}</p></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function AssetsView() {
  return (
    <>
      <CursorLight />
      <Navbar />
      <main id="top" className="min-h-screen bg-ink">
        <section className="pt-40 pb-16 md:pt-48 md:pb-20">
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
            <Reveal>
              <span className="kl-eyebrow">Asset Lab · internal review · not indexed</span>
              <h1 className="kl-h1 mt-7 mb-8 max-w-3xl">Two pieces of light, and they are one piece.</h1>
              <p className="kl-lead max-w-2xl">
                Every scene is code, not video: monochrome, real-time, mouse-aware, and rendered only while on screen.
                These two run back to back on the homepage: the globe carries the hero, and the second begins in the background of the section below it.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <ol className="mt-12 flex flex-col gap-3 kl-mono text-[11px] tracking-[0.14em] text-ash">
                <li><a href="#planetary-reach" className="kl-link text-light/90">01 · PLANETARY REACH  (THE HERO)</a></li>
                <li><a href="#momentum" className="kl-link text-light/90">02 · MOMENTUM  (THE SECTION BELOW IT)</a></li>
                {ASSETS.map((a) => (
                  <li key={a.id}><a href={`#${a.id}`} className="kl-link">{a.n} · {a.title.toUpperCase()}</a></li>
                ))}
                <li><a href="#one-system" className="kl-link">10 · ONE SYSTEM</a></li>
              </ol>
            </Reveal>
          </div>
        </section>


        {/* ════════ 00 · FEATURED — scroll-driven ════════ */}
        <section id="planetary-reach" className="border-t border-[rgba(244,241,233,0.07)]">
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 pt-16 md:pt-24 pb-10">
            <Reveal>
              <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
                <div className="flex items-baseline gap-5">
                  <span className="kl-mono text-smoke">00</span>
                  <h2 className="kl-h2">Planetary Reach</h2>
                </div>
                <span className="kl-eyebrow">Featured · merges 03 · 05 · 07</span>
              </div>
              <p className="kl-lead max-w-2xl">
                One piece instead of three. Scroll it: the lattice becomes a world, the world starts trading,
                and the reach spreads until it covers the sphere.
              </p>
            </Reveal>
          </div>

          <PlanetaryReach />

          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 pt-12 pb-16 md:pb-24">
            <Reveal>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
                <div>
                  <span className="kl-eyebrow">Act I · Structure</span>
                  <p className="kl-body-sm mt-3">The geodesic lattice. The system before it carries anything.</p>
                </div>
                <div>
                  <span className="kl-eyebrow">Act II · World</span>
                  <p className="kl-body-sm mt-3">Real coastlines settle onto the lattice, assembling outward from Paris.</p>
                </div>
                <div>
                  <span className="kl-eyebrow">Act III · Flow</span>
                  <p className="kl-body-sm mt-3">Bundled links draw from Paris to ten real cities. Dashes stream along each filament and packets run them, lighting the marker on arrival.</p>
                </div>
                <div>
                  <span className="kl-eyebrow">Act IV · Reach</span>
                  <p className="kl-body-sm mt-3">The camera pulls back, a wavefront crosses the sphere, orbital shells fade in around it.</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mt-10 pt-10 border-t border-[rgba(244,241,233,0.07)]">
                <p className="kl-body">
                  The journey is the argument. You start with a structure, you put the world on it, you move real traffic
                  across it, and then you watch how far it goes. That is the offer in one object.
                </p>
                <div>
                  <span className="kl-eyebrow">Suggested placement</span>
                  <p className="kl-body-sm mt-3">
                    Home, as the scroll section between the Signal and the services. It replaces a static band and carries
                    the whole narrative on its own.
                  </p>
                </div>
                <div>
                  <span className="kl-eyebrow">Under the hood</span>
                  <p className="kl-mono text-[11px] leading-6 text-ash mt-3">
                    R3F · 14,651 real land points (Natural Earth 110m) with coastlines flagged and drawn brighter · morph, wavefront,
                    node twinkle and depth fade in one vertex shader · each link is a bundle of 4 to 6 filaments that fan apart
                    mid-crossing and reconverge, carrying dashes that travel at a fixed rate · exact great-circle slerp, constant
                    angular velocity, so distant cities take proportionally longer
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ════════ 00B · FEATURED — the Signal sentence, drawn ════════ */}
        <section id="momentum" className="border-t border-[rgba(244,241,233,0.07)]">
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 pt-16 md:pt-24 pb-10">
            <Reveal>
              <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
                <div className="flex items-baseline gap-5">
                  <span className="kl-mono text-smoke">00B</span>
                  <h2 className="kl-h2">Momentum</h2>
                </div>
                <span className="kl-eyebrow">Featured · the Signal, drawn</span>
              </div>
              <p className="kl-lead max-w-3xl">
                One filament carries the whole argument. A clean idea travels, starts looping back on itself, knots into
                turbulence and stops advancing. That is the gap. Then the strands find one line again, drive to a point,
                and the point catches.
              </p>
            </Reveal>
          </div>

          <Momentum />

          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 pt-12 pb-16 md:pb-24">
            <Reveal>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-6 md:gap-8">
                {[
                  ["I · Line", "A good idea, travelling clean."],
                  ["II · Tangle", "It starts looping back through itself."],
                  ["III · Snarl", "Turbulence. It stops advancing. The gap."],
                  ["IV · Converge", "The strands find one line and drive to a point."],
                  ["V · Ignition", "The point catches."],
                  ["VI · System", "A world, then brand, site, socials, tools as one."],
                ].map(([k, v]) => (
                  <div key={k}>
                    <span className="kl-eyebrow">{k}</span>
                    <p className="kl-body-sm mt-3">{v}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mt-10 pt-10 border-t border-[rgba(244,241,233,0.07)]">
                <p className="kl-body">
                  It is the Signal sentence as a picture. Losing momentum is something you watch happen, and closing the
                  gap is something you watch resolve.
                </p>
                <div>
                  <span className="kl-eyebrow">Suggested placement</span>
                  <p className="kl-body-sm mt-3">Behind the Signal section on home, with the sentence held over it.</p>
                </div>
                <div>
                  <span className="kl-eyebrow">Under the hood</span>
                  <p className="kl-mono text-[11px] leading-6 text-ash mt-3">
                    R3F · 30 strands x 420 segments in one draw call · the filament&apos;s entire shape, coiling and turbulence
                    computed in the vertex shader from two attributes, so the snarl writhes for free · GLSL simplex noise ·
                    additive veil with a burning draw edge · labels via drei Html so they stay real type
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>


        <section className="py-16 md:py-20 border-t border-[rgba(244,241,233,0.07)]">
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
            <Reveal>
              <span className="kl-eyebrow">Review notes</span>
              <ul className="kl-body-sm mt-5 space-y-2 max-w-2xl list-disc pl-5">
                <li>All scenes respect prefers-reduced-motion and pause when scrolled out of view.</li>
                <li>Palette is locked to Light on Ink. No accent colour, so any piece can sit next to any other.</li>
                <li>Each piece can be dropped into a card, a hero, or a full-bleed band by changing the camera and one config line.</li>
                <li>Pick the keepers and we wire them into the live pages, EN and FR.</li>
              </ul>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
