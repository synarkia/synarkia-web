"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, LayoutDashboard, Bot, Zap, Filter, Share2 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Reveal } from "@/components/ui/reveal";
import { CursorLight } from "@/components/ui/cursor-light";
import InstrumentMount from "@/components/3d/instrument-mount";
import { useLang } from "@/i18n/language-provider";
import { BOOKING_URL } from "@/lib/links";
import { track } from "@vercel/analytics";

const buildIcons = [LayoutDashboard, Bot, Zap, Filter, Share2];

export function LabsView() {
  const { t } = useLang();
  const l = t.labs;

  return (
    <>
      <CursorLight />
      <Navbar />
      <main id="top" className="min-h-screen bg-ink">
        {/* HERO */}
        <section className="relative pt-40 pb-24 md:pt-48 md:pb-28 overflow-hidden min-h-[70svh] flex items-center">
          <div className="absolute inset-0 z-0 opacity-90">
            <InstrumentMount variant="labs" />
          </div>
          <div className="absolute inset-0 z-[1] pointer-events-none bg-[linear-gradient(270deg,rgba(6,6,8,0.85)_30%,transparent_100%)]" />
          <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-8 relative z-10">
            <Reveal>
              <span className="kl-eyebrow">{l.eyebrow}</span>
              <h1 className="kl-h1 mt-7 mb-8 max-w-3xl">{l.h}</h1>
              <p className="kl-lead max-w-2xl">{l.lead}</p>
            </Reveal>
          </div>
        </section>

        {/* FLAGSHIP BUILD — EncadrePro */}
        <section className="py-20 md:py-28 border-t border-[rgba(244,241,233,0.07)] relative overflow-hidden">
          <div className="pointer-events-none absolute top-1/2 left-0 -translate-x-1/3 -translate-y-1/2 w-[600px] h-[400px] kl-glow opacity-25" />
          <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-8 relative z-10">
            <Reveal className="mb-10">
              <span className="kl-eyebrow">{l.flagship.eyebrow}</span>
            </Reveal>
            <Reveal>
              <div className="kl-card p-5 md:p-7">
                {/* the proof: a real screenshot */}
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-[linear-gradient(160deg,#131317,#0b0b0e)] border border-[rgba(244,241,233,0.08)] mb-8">
                  <Image
                    src="/work/encadrepro-1.jpg"
                    alt="EncadrePro dashboard"
                    fill
                    sizes="(max-width: 1100px) 100vw, 1040px"
                    className="object-cover object-top"
                    priority
                  />
                </div>

                <div className="px-2 md:px-4 pb-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-3 mb-8">
                    <h3 className="kl-h2 text-light">{l.flagship.name}</h3>
                    <span className="kl-mono text-smoke">{l.flagship.role}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-8 border-t border-[rgba(244,241,233,0.07)]">
                    <div>
                      <span className="kl-eyebrow block mb-3">{l.flagship.problemLabel}</span>
                      <p className="kl-body">{l.flagship.problem}</p>
                    </div>
                    <div>
                      <span className="kl-eyebrow block mb-3">{l.flagship.buildLabel}</span>
                      <p className="kl-body">{l.flagship.build}</p>
                    </div>
                  </div>
                  <div className="mt-10 pt-6 border-t border-[rgba(244,241,233,0.07)]">
                    <span className="kl-mono text-ash">{l.flagship.status}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* COST OF SLOW */}
        <section className="py-20 md:py-28 border-t border-[rgba(244,241,233,0.07)]">
          <div className="mx-auto w-full max-w-[860px] px-5 sm:px-8">
            <Reveal>
              <span className="kl-eyebrow">{l.costEyebrow}</span>
              <div className="mt-8 space-y-6">
                <p className="kl-h2">{l.costH}</p>
                <p className="kl-body">{l.costBody}</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* WHAT LAB BUILDS */}
        <section className="py-20 md:py-28 border-t border-[rgba(244,241,233,0.07)]">
          <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-8">
            <Reveal className="mb-14">
              <span className="kl-eyebrow">{l.buildsEyebrow}</span>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {l.builds.map((b, i) => {
                const Icon = buildIcons[i] ?? Bot;
                return (
                  <Reveal key={b.title} delay={(i % 3) * 0.08}>
                    <div className="kl-card p-8 h-full">
                      <span className="flex items-center justify-center w-12 h-12 rounded-xl border border-[rgba(244,241,233,0.10)] mb-7">
                        <Icon className="w-5 h-5 text-light" strokeWidth={1.3} />
                      </span>
                      <h3 className="kl-h3 text-light mb-3">{b.title}</h3>
                      <p className="kl-body-sm">{b.desc}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* GROWTH ENGINE / PRICING */}
        <section className="py-20 md:py-28 border-t border-[rgba(244,241,233,0.07)] relative overflow-hidden">
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] kl-glow opacity-25" />
          <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-8 relative z-10">
            <Reveal className="mb-12 md:mb-16 max-w-xl">
              <span className="kl-eyebrow">{l.priceEyebrow}</span>
              <h2 className="kl-h1 mt-6 mb-5">{l.priceH}</h2>
              <p className="kl-body">{l.priceIntro}</p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
              {l.tiers.map((tier, i) => (
                <Reveal key={tier.name} delay={i * 0.08}>
                  <div
                    className={`kl-card p-9 h-full flex flex-col ${
                      "featured" in tier && tier.featured ? "border-[rgba(244,241,233,0.28)] bg-[rgba(244,241,233,0.04)]" : ""
                    }`}
                  >
                    {"featured" in tier && tier.featured && <span className="kl-eyebrow mb-4 text-ash">{l.mostChosen}</span>}
                    <h3 className="kl-h3 text-light mb-3">{tier.name}</h3>
                    <p className="kl-mono text-ash text-[13px] mb-8">{tier.price}</p>
                    <ul className="space-y-3 pt-6 border-t border-[rgba(244,241,233,0.07)] mt-auto">
                      {tier.points.map((p) => (
                        <li key={p} className="kl-body-sm">{p}</li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.1}>
              <p className="kl-body-sm mt-7 max-w-xl">{l.priceNote}</p>
            </Reveal>
          </div>
        </section>

        {/* SPEED */}
        <section className="py-20 md:py-28 border-t border-[rgba(244,241,233,0.07)]">
          <div className="mx-auto w-full max-w-[900px] px-5 sm:px-8">
            <Reveal className="mb-12">
              <span className="kl-eyebrow">{l.speedEyebrow}</span>
              <h2 className="kl-h1 mt-6">{l.speedH}</h2>
            </Reveal>
            <Reveal>
              <div className="kl-card overflow-hidden">
                {l.speed.map(([k, v], i) => (
                  <div key={k} className={`flex items-baseline justify-between px-7 md:px-9 py-5 ${i > 0 ? "border-t border-[rgba(244,241,233,0.07)]" : ""}`}>
                    <span className="kl-body text-light">{k}</span>
                    <span className="kl-mono text-ash">{v}</span>
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
              <h2 className="kl-h1 mb-5">{l.ctaH}</h2>
              <p className="kl-body max-w-md mx-auto mb-10">{l.ctaBody}</p>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" onClick={() => track("cta_book", { where: "labs" })} className="kl-cta-solid">
                {l.ctaBtn} <ArrowRight className="w-4 h-4" />
              </a>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
