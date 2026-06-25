"use client";

import Link from "next/link";
import { ArrowRight, Compass, Palette, PenLine, Layers } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Reveal } from "@/components/ui/reveal";
import { CursorLight } from "@/components/ui/cursor-light";
import InstrumentMount from "@/components/3d/instrument-mount";
import { useLang } from "@/i18n/language-provider";

const buildIcons = [Compass, Palette, PenLine, Layers];

export function StudioView() {
  const { t } = useLang();
  const s = t.studio;

  return (
    <>
      <CursorLight />
      <Navbar />
      <main id="top" className="min-h-screen bg-ink">
        {/* HERO */}
        <section className="relative pt-40 pb-24 md:pt-48 md:pb-28 overflow-hidden min-h-[70svh] flex items-center">
          <div className="absolute inset-0 z-0 opacity-90">
            <InstrumentMount variant="studio" />
          </div>
          <div className="absolute inset-0 z-[1] pointer-events-none bg-[linear-gradient(90deg,rgba(6,6,8,0.85)_30%,transparent_100%)]" />
          <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-8 relative z-10">
            <Reveal>
              <span className="kl-eyebrow">{s.eyebrow}</span>
              <h1 className="kl-h1 mt-7 mb-8 max-w-2xl">{s.h}</h1>
              <p className="kl-lead max-w-2xl">{s.lead}</p>
            </Reveal>
          </div>
        </section>

        {/* WHAT STUDIO BUILDS */}
        <section className="py-20 md:py-28 border-t border-[rgba(244,241,233,0.07)]">
          <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-8">
            <Reveal className="mb-14">
              <span className="kl-eyebrow">{s.buildsEyebrow}</span>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
              {s.builds.map((b, i) => {
                const Icon = buildIcons[i] ?? Compass;
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
              <span className="kl-eyebrow">{s.worksEyebrow}</span>
              <h2 className="kl-h1 mt-6">{s.worksH}</h2>
            </Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-12">
              {s.steps.map((step, i) => (
                <Reveal key={step.n} delay={i * 0.08}>
                  <div className="pt-7 border-t border-[rgba(244,241,233,0.12)]">
                    <div className="flex items-baseline gap-4 mb-3">
                      <span className="kl-metric text-smoke">{step.n}</span>
                      <h3 className="kl-h3 text-light">{step.t}</h3>
                    </div>
                    <p className="kl-eyebrow mb-4">{step.meta}</p>
                    <p className="kl-body">{step.d}</p>
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
              <span className="kl-eyebrow">{s.priceEyebrow}</span>
              <h2 className="kl-h1 mt-6 mb-5">{s.priceH}</h2>
              <p className="kl-body max-w-xl">{s.priceIntro}</p>
            </Reveal>

            <Reveal>
              <div className="kl-card overflow-hidden">
                {s.engagements.map((e, i) => (
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
            <Reveal delay={0.1}>
              <p className="kl-body-sm mt-7 max-w-xl">{s.priceNote}</p>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 md:py-32 border-t border-[rgba(244,241,233,0.07)]">
          <div className="mx-auto w-full max-w-[760px] px-5 sm:px-8 text-center">
            <Reveal>
              <h2 className="kl-h1 mb-5">{s.ctaH}</h2>
              <p className="kl-body max-w-md mx-auto mb-10">{s.ctaBody}</p>
              <Link href="/#contact" className="kl-cta-solid">
                {s.ctaBtn} <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
