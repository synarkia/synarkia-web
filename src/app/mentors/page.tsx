import type { Metadata } from "next";
import { LightCursor } from "@/components/kingdom/light-cursor";
import { LightsCanvas } from "@/components/kingdom/lights-canvas";
import { Metatron } from "@/components/kingdom/metatron";
import { KLNav } from "@/components/kingdom/nav";
import { KLFooter } from "@/components/kingdom/footer";
import { Reveal } from "@/components/ui/reveal";
import { MentorsGrid } from "@/components/kingdom/mentors-grid";

const SECTION = "mx-auto max-w-[1280px] px-6 lg:px-10";

export const metadata: Metadata = {
  title: "Mentors & Lineage — SYNARKIA",
  description:
    "The wisdom streams behind SYNARKIA — visionary thinkers, mentors, and guides who have illuminated the path of sovereign co-creation.",
};

export default function Mentors() {
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
            <p className="kl-eyebrow mb-8">Lineage &amp; Inspirations</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="kl-display text-light kl-text-glow">
              We stand on the
              <br />
              <span style={{ fontStyle: "italic" }}>shoulders of giants.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.28}>
            <p className="kl-lead max-w-2xl mx-auto mt-10">
              Wisdom streams woven from the visionary thinkers and guides who
              illuminated the path of sovereign co-creation.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── THE LINEAGE ───────────────── */}
      <section className="relative py-24 md:py-32 kl-border-t bg-obsidian">
        <div className={SECTION}>
          <Reveal>
            <p className="kl-eyebrow mb-6">The Lineage</p>
            <h2 className="kl-h1 text-light max-w-3xl mb-6">
              Mentors, makers, and <span style={{ fontStyle: "italic" }}>mystics.</span>
            </h2>
            <p className="kl-body max-w-xl mb-16">
              Synarkia weaves together wisdom streams from these visionary thinkers,
              mentors, and guides. Each carries a thread of the larger pattern.
            </p>
          </Reveal>
          <MentorsGrid />
        </div>
      </section>

      <KLFooter />
    </div>
  );
}
