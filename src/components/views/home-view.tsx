"use client";

import Link from "next/link";
import { ArrowRight, Database, Code2, Sparkles, Zap, Rocket, Compass, Check } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Contact } from "@/components/sections/contact";
import { WorkGallery } from "@/components/sections/work-gallery";
import { Reveal } from "@/components/ui/reveal";
import { CursorLight } from "@/components/ui/cursor-light";
import InstrumentMount from "@/components/3d/instrument-mount";
import { useLang } from "@/i18n/language-provider";
import { BOOKING_URL } from "@/lib/links";
import { track } from "@vercel/analytics";

const serviceIcons = [Database, Code2, Sparkles, Zap, Rocket, Compass];

export function HomeView() {
  const { t } = useLang();
  const h = t.home;

  return (
    <>
      <CursorLight />
      <Navbar />
      <main id="top" className="min-h-screen bg-ink">
        {/* ════════ HERO ════════ */}
        <section className="relative w-full h-[100svh] min-h-[680px] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <InstrumentMount variant="core" />
          </div>

          <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(6,6,8,0.55)_100%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-56 z-[2] pointer-events-none bg-gradient-to-t from-ink to-transparent" />

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 pointer-events-none">
            <div className="animate-fade-in" style={{ animationDelay: "0.2s", opacity: 0 }}>
              <span className="kl-eyebrow">{h.hero.eyebrow}</span>
            </div>
            <h1 className="kl-display mt-7 mb-8 max-w-5xl kl-text-glow animate-fade-in" style={{ animationDelay: "0.35s", opacity: 0 }}>
              Syndao
            </h1>
            <p
              className="font-serif text-light text-[1.5rem] sm:text-[1.9rem] md:text-[2.15rem] leading-[1.32] max-w-3xl mb-11 animate-fade-in"
              style={{ animationDelay: "0.55s", opacity: 0 }}
            >
              {h.hero.lead}
            </p>
            <div className="pointer-events-auto flex flex-col sm:flex-row items-center gap-4 animate-fade-in" style={{ animationDelay: "0.75s", opacity: 0 }}>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" onClick={() => track("cta_book", { where: "home_hero" })} className="kl-cta-solid">
                {h.hero.cta1} <ArrowRight className="w-4 h-4" />
              </a>
              <Link href="#services" className="kl-cta">
                {h.hero.cta2}
              </Link>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 pointer-events-none">
            <span className="kl-eyebrow text-[10px]">{h.hero.scroll}</span>
            <span className="w-px h-10 bg-gradient-to-b from-[rgba(244,241,233,0.4)] to-transparent kl-breathe" />
          </div>
        </section>

        {/* ════════ SIGNAL ════════ */}
        <section className="py-28 md:py-36">
          <div className="mx-auto w-full max-w-[860px] px-5 sm:px-8 text-center">
            <Reveal>
              <span className="kl-eyebrow">{h.signal.eyebrow}</span>
              <p className="kl-h2 mt-8 mb-8">{h.signal.h}</p>
              <p className="kl-body max-w-xl mx-auto">{h.signal.body}</p>
            </Reveal>
          </div>
        </section>

        {/* ════════ SERVICES ════════ */}
        <section id="services" className="py-24 md:py-32 border-t border-[rgba(244,241,233,0.07)]">
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
            <Reveal className="max-w-2xl mb-16 md:mb-20">
              <span className="kl-eyebrow">{h.services.eyebrow}</span>
              <h2 className="kl-h1 mt-6 mb-6">{h.services.h}</h2>
              <p className="kl-body">{h.services.intro}</p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {h.services.items.map((s, i) => {
                const Icon = serviceIcons[i] ?? Compass;
                return (
                  <Reveal key={s.title} delay={(i % 3) * 0.08}>
                    <div className="kl-card p-8 h-full flex flex-col group">
                      <span className="flex items-center justify-center w-12 h-12 rounded-xl border border-[rgba(244,241,233,0.10)] mb-7 group-hover:border-[rgba(244,241,233,0.28)] transition-colors">
                        <Icon className="w-5 h-5 text-light" strokeWidth={1.3} />
                      </span>
                      <h3 className="kl-h3 text-light mb-3">{s.title}</h3>
                      <p className="kl-body-sm mb-7 flex-1">{s.desc}</p>
                      <ul className="space-y-2.5 pt-6 border-t border-[rgba(244,241,233,0.07)]">
                        {s.points.map((p) => (
                          <li key={p} className="flex items-center gap-3 kl-body-sm">
                            <Check className="w-3.5 h-3.5 text-ash shrink-0" strokeWidth={1.6} />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ════════ DIVISIONS ════════ */}
        <section id="divisions" className="py-24 md:py-32 border-t border-[rgba(244,241,233,0.07)] relative overflow-hidden">
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] kl-glow opacity-30" />
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 relative z-10">
            <Reveal className="text-center mb-16">
              <span className="kl-eyebrow">{h.divisions.eyebrow}</span>
              <h2 className="kl-h1 mt-6">{h.divisions.h}</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <Reveal>
                <div className="kl-card p-10 md:p-12 h-full flex flex-col justify-between">
                  <div>
                    <span className="kl-eyebrow">{h.divisions.studio.tag}</span>
                    <h3 className="kl-h2 mt-6 mb-5 text-light">{h.divisions.studio.h}</h3>
                    <p className="kl-body mb-10">{h.divisions.studio.body}</p>
                  </div>
                  <Link href="/studio" className="kl-link inline-flex items-center gap-2">
                    {h.divisions.studio.cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="kl-card p-10 md:p-12 h-full flex flex-col justify-between">
                  <div>
                    <span className="kl-eyebrow">{h.divisions.lab.tag}</span>
                    <h3 className="kl-h2 mt-6 mb-5 text-light">{h.divisions.lab.h}</h3>
                    <p className="kl-body mb-10">{h.divisions.lab.body}</p>
                  </div>
                  <Link href="/labs" className="kl-link inline-flex items-center gap-2">
                    {h.divisions.lab.cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ════════ METHOD ════════ */}
        <section id="method" className="py-24 md:py-32 border-t border-[rgba(244,241,233,0.07)]">
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
            <Reveal className="mb-16 md:mb-20 max-w-2xl">
              <span className="kl-eyebrow">{h.method.eyebrow}</span>
              <h2 className="kl-h1 mt-6">{h.method.h}</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
              {h.method.steps.map((step, i) => (
                <Reveal key={step.n} delay={(i % 3) * 0.08}>
                  <div className="pt-7 border-t border-[rgba(244,241,233,0.12)] group">
                    <div className="flex items-baseline gap-4 mb-4">
                      <span className="kl-metric text-smoke group-hover:text-light transition-colors duration-500">{step.n}</span>
                      <h3 className="kl-h3 text-light">{step.t}</h3>
                    </div>
                    <h4 className="kl-body text-light mb-2">{step.h}</h4>
                    <p className="kl-body-sm">{step.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ════════ WORK ════════ */}
        <WorkGallery />

        {/* ════════ WHO ════════ */}
        <section className="py-24 md:py-32 border-t border-[rgba(244,241,233,0.07)] relative overflow-hidden">
          <div className="pointer-events-none absolute top-1/2 right-0 translate-x-1/3 -translate-y-1/2 w-[600px] h-[400px] kl-glow opacity-25" />
          <div className="mx-auto w-full max-w-[860px] px-5 sm:px-8 relative z-10">
            <Reveal>
              <span className="kl-eyebrow">{h.who.eyebrow}</span>
              <h2 className="kl-h2 mt-7 mb-7 max-w-2xl">{h.who.h}</h2>
              <p className="kl-body max-w-xl">{h.who.body}</p>
            </Reveal>
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
    </>
  );
}
