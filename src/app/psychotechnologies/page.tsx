import type { Metadata } from "next";
import { LightCursor } from "@/components/kingdom/light-cursor";
import { LightsCanvas } from "@/components/kingdom/lights-canvas";
import { Metatron } from "@/components/kingdom/metatron";
import { KLNav } from "@/components/kingdom/nav";
import { KLFooter } from "@/components/kingdom/footer";
import { Reveal } from "@/components/ui/reveal";
import { PsytechGrid } from "@/components/kingdom/psytech-grid";

const SECTION = "mx-auto max-w-[1280px] px-6 lg:px-10";

export const metadata: Metadata = {
  title: "Psychotechnologies — SYNARKIA",
  description:
    "The family of psychotechnologies SYNARKIA works with — ways of training attention, expanding perception, deepening soul, and upgrading cognition.",
};

export default function Psychotechnologies() {
  return (
    <div className="kl min-h-screen relative" id="top">
      <LightCursor />
      <KLNav />

      {/* ───────────────── HERO ───────────────── */}
      <section className="relative min-h-[64svh] flex flex-col items-center justify-center overflow-hidden pt-28 pb-20">
        <div className="absolute inset-0 z-0">
          <LightsCanvas />
        </div>
        <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none">
          <Metatron className="w-[clamp(320px,70vw,720px)] h-[clamp(320px,70vw,720px)] opacity-60" />
        </div>
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-ink/40 via-transparent to-ink pointer-events-none" />

        <div className={`${SECTION} relative z-10 text-center`}>
          <Reveal y={10}>
            <p className="kl-eyebrow mb-8">The Inner Toolkit</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="kl-display text-light kl-text-glow">
              Psycho&shy;technologies
            </h1>
          </Reveal>
          <Reveal delay={0.28}>
            <p className="kl-lead max-w-2xl mx-auto mt-10">
              Ways of training attention, expanding perception, deepening soul,
              and upgrading cognition.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── THE FAMILY ───────────────── */}
      <section className="relative py-24 md:py-32 kl-border-t bg-obsidian">
        <div className={SECTION}>
          <Reveal>
            <p className="kl-eyebrow mb-6">The Family</p>
            <h2 className="kl-h1 text-light max-w-3xl mb-6">
              Systemic change is rooted in a shift of <span style={{ fontStyle: "italic" }}>consciousness.</span>
            </h2>
            <p className="kl-body max-w-xl mb-16">
              Synarkia works with a broad family of psychotechnologies. Each is a
              door; together they form an inner architecture for the work of building
              the world to come.
            </p>
          </Reveal>
          <PsytechGrid />
        </div>
      </section>

      <KLFooter />
    </div>
  );
}
