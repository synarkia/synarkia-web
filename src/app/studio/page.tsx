import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Palette, PenLine, Layers } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Reveal } from "@/components/ui/reveal";
import { CursorLight } from "@/components/ui/cursor-light";

export const metadata: Metadata = {
  title: "Studio — Syndao",
  description:
    "Syndao Studio builds the strategic layer: positioning, identity, visual systems, and copywriting that make your business the evident choice.",
};

const builds = [
  {
    icon: Compass,
    title: "Positioning & Narrative",
    desc: "Who you are. What you do. Who it's for. The language that makes your customer say yes.",
  },
  {
    icon: Palette,
    title: "Visual Identity & Brand Direction",
    desc: "Not just a logo. A coherent sensory system — identity, style guide, tone — that makes you unmistakable.",
  },
  {
    icon: PenLine,
    title: "Copywriting & Messaging",
    desc: "Website copy, pitch decks, email sequences. Words that convert because they're precise.",
  },
  {
    icon: Layers,
    title: "Offer Architecture",
    desc: "What you sell. How it's structured. How it's priced. Clarity that removes friction from the decision.",
  },
];

const steps = [
  {
    n: "01",
    t: "Clarity Call",
    meta: "Free · 30 minutes",
    d: "We listen. You talk. We assess where you are and what you need. No pitch — you leave with a direction.",
  },
  {
    n: "02",
    t: "Onboarding Session",
    meta: "60 minutes",
    d: "A deep-dive through the framework: Clarity → Integrity → Resonance → Transformation → Possibility → Creation. We map the full picture before touching a single asset.",
  },
  {
    n: "03",
    t: "Creation",
    meta: "Ongoing",
    d: "We build. Positioning, identity, copy, visuals — whatever the map revealed. Everything ships as a working asset, not a deck in a drawer.",
  },
];

const engagements = [
  { name: "Positioning Sprint", scope: "Sharpen who you are, what you do, and who it's for.", price: "from €1,500", time: "2 weeks" },
  { name: "Brand Direction", scope: "Identity, art direction, and a coherent visual language.", price: "from €2,500", time: "3–4 weeks" },
  { name: "Full Brand Build", scope: "End-to-end: positioning, identity, copy, and system.", price: "from €5,000", time: "6–8 weeks" },
  { name: "Strategic Retainer", scope: "Ongoing direction and creative partnership.", price: "from €1,500/mo", time: "Ongoing" },
  { name: "Venture Build", scope: "Zero-to-one brand and go-to-market for a new venture.", price: "from €8,000", time: "2–4 months" },
];

export default function StudioPage() {
  return (
    <>
      <CursorLight />
      <Navbar />
      <main id="top" className="min-h-screen bg-ink">
        {/* HERO */}
        <section className="relative pt-40 pb-24 md:pt-52 md:pb-28 overflow-hidden">
          <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[900px] h-[500px] kl-glow opacity-40" />
          <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-8 relative z-10">
            <Reveal>
              <span className="kl-eyebrow">Syndao Studio · The strategic layer</span>
              <h1 className="kl-display mt-7 mb-8 max-w-3xl">Speak to your ideal customer.</h1>
              <p className="kl-lead max-w-2xl">
                Studio builds the strategic layer — brand positioning, identity, visual systems, and
                copywriting that make your business the evident choice.
              </p>
            </Reveal>
          </div>
        </section>

        {/* WHAT STUDIO BUILDS */}
        <section className="py-20 md:py-28 border-t border-[rgba(244,241,233,0.07)]">
          <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-8">
            <Reveal className="mb-14">
              <span className="kl-eyebrow">What Studio builds</span>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
              {builds.map((b, i) => {
                const Icon = b.icon;
                return (
                  <Reveal key={b.title} delay={(i % 2) * 0.08}>
                    <div className="kl-card p-9 h-full">
                      <span className="flex items-center justify-center w-12 h-12 rounded-xl border border-[rgba(244,241,233,0.10)] mb-7">
                        <Icon className="w-5 h-5 text-light" strokeWidth={1.3} />
                      </span>
                      <h3 className="kl-h3 text-light mb-3">{b.title}</h3>
                      <p className="kl-body">{b.desc}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-20 md:py-28 border-t border-[rgba(244,241,233,0.07)]">
          <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-8">
            <Reveal className="mb-14 md:mb-16">
              <span className="kl-eyebrow">How it works</span>
              <h2 className="kl-h1 mt-6">Three movements.</h2>
            </Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-12">
              {steps.map((s, i) => (
                <Reveal key={s.n} delay={i * 0.08}>
                  <div className="pt-7 border-t border-[rgba(244,241,233,0.12)]">
                    <div className="flex items-baseline gap-4 mb-3">
                      <span className="kl-metric text-smoke">{s.n}</span>
                      <h3 className="kl-h3 text-light">{s.t}</h3>
                    </div>
                    <p className="kl-eyebrow mb-4">{s.meta}</p>
                    <p className="kl-body">{s.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ENGAGEMENTS / PRICING */}
        <section className="py-20 md:py-28 border-t border-[rgba(244,241,233,0.07)] relative overflow-hidden">
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] kl-glow opacity-25" />
          <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-8 relative z-10">
            <Reveal className="mb-12 md:mb-16">
              <span className="kl-eyebrow">Engagements</span>
              <h2 className="kl-h1 mt-6 mb-5">Pricing.</h2>
              <p className="kl-body max-w-xl">
                Fixed-scope where it helps, ongoing where it matters. Every number is a starting point —
                the clarity call sets the right shape.
              </p>
            </Reveal>

            <Reveal>
              <div className="kl-card overflow-hidden">
                {engagements.map((e, i) => (
                  <div
                    key={e.name}
                    className={`grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-baseline px-7 md:px-9 py-7 ${
                      i > 0 ? "border-t border-[rgba(244,241,233,0.07)]" : ""
                    }`}
                  >
                    <div className="sm:col-span-4">
                      <h3 className="kl-h3 text-light">{e.name}</h3>
                    </div>
                    <p className="sm:col-span-5 kl-body-sm">{e.scope}</p>
                    <div className="sm:col-span-3 sm:text-right">
                      <p className="kl-metric text-light text-[1.6rem] leading-none">{e.price}</p>
                      <p className="kl-eyebrow mt-2">{e.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 md:py-32 border-t border-[rgba(244,241,233,0.07)]">
          <div className="mx-auto w-full max-w-[760px] px-5 sm:px-8 text-center">
            <Reveal>
              <h2 className="kl-h1 mb-5">Not sure what you need?</h2>
              <p className="kl-body max-w-md mx-auto mb-10">That&apos;s exactly what the clarity call is for. Free, 30 minutes, no pitch.</p>
              <Link href="/#contact" className="kl-cta-solid">
                Book a free call <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
