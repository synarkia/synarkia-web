import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, Mail, Filter, MessageCircle, FileText } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Reveal } from "@/components/ui/reveal";
import { CursorLight } from "@/components/ui/cursor-light";

export const metadata: Metadata = {
  title: "Lab — Syndao",
  description:
    "Syndao Lab builds the infrastructure that captures, qualifies, and converts — so you stop doing manually what a machine should be doing for you.",
};

const builds = [
  { icon: Bot, title: "AI Chatbots", desc: "Instant response. 24/7 qualification. Your first line of defense against lost leads." },
  { icon: Mail, title: "Email Automation", desc: "Sequences that nurture, follow up, and re-engage. Written well, timed right, running while you sleep." },
  { icon: Filter, title: "Funnel Systems", desc: "Landing pages, lead capture, conversion tracking. End-to-end — so your ads actually lead somewhere." },
  { icon: MessageCircle, title: "DM Automation", desc: "Instagram and WhatsApp flows that capture and qualify straight from social." },
  { icon: FileText, title: "Content Systems", desc: "AI-assisted pipelines. Consistent output without the ten-hour weekly grind." },
];

const tiers = [
  {
    name: "Starter",
    price: "from €1,500/mo",
    points: ["Single channel", "CRM setup", "Weekly reporting"],
  },
  {
    name: "Core",
    price: "from €3,000/mo",
    featured: true,
    points: ["Multi-channel", "Landing pages", "Follow-up sequences", "A/B testing"],
  },
  {
    name: "Premium",
    price: "from €5,000/mo",
    points: ["Full stack", "Paid traffic", "Custom automations", "Strategy calls"],
  },
];

const speed = [
  ["DM / ManyChat setup", "2–5 days"],
  ["Email automation", "3–7 days"],
  ["AI chatbot", "1–2 weeks"],
  ["Full funnel", "1–2 weeks"],
  ["Growth Engine", "qualified leads in 30 days"],
];

export default function LabsPage() {
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
              <span className="kl-eyebrow">Syndao Lab · The operational layer</span>
              <h1 className="kl-display mt-7 mb-8 max-w-4xl">Your best clients are lost to your worst systems.</h1>
              <p className="kl-lead max-w-2xl">
                Lab builds the infrastructure that captures, qualifies, and converts — so you stop doing
                manually what a machine should be doing for you.
              </p>
            </Reveal>
          </div>
        </section>

        {/* COST OF SLOW */}
        <section className="py-20 md:py-28 border-t border-[rgba(244,241,233,0.07)]">
          <div className="mx-auto w-full max-w-[860px] px-5 sm:px-8">
            <Reveal>
              <span className="kl-eyebrow">The cost of slow</span>
              <div className="mt-8 space-y-6">
                <p className="kl-h2">A lead fills out your form on Saturday. You reply Monday. They already booked with someone else.</p>
                <p className="kl-body">
                  A prospect DMs you on Instagram. You see it Tuesday. Gone. You know this is happening —
                  you just haven&apos;t had time to fix it. That&apos;s what Lab is for.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* WHAT LAB BUILDS */}
        <section className="py-20 md:py-28 border-t border-[rgba(244,241,233,0.07)]">
          <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-8">
            <Reveal className="mb-14">
              <span className="kl-eyebrow">What Lab builds</span>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {builds.map((b, i) => {
                const Icon = b.icon;
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
              <span className="kl-eyebrow">The Growth Engine</span>
              <h2 className="kl-h1 mt-6 mb-5">Pricing.</h2>
              <p className="kl-body">
                For businesses that don&apos;t need one tool — they need a complete system. A functioning
                lead capture → qualification → booking engine, producing qualified conversations within 30 days.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
              {tiers.map((t, i) => (
                <Reveal key={t.name} delay={i * 0.08}>
                  <div
                    className={`kl-card p-9 h-full flex flex-col ${
                      t.featured ? "border-[rgba(244,241,233,0.28)] bg-[rgba(244,241,233,0.04)]" : ""
                    }`}
                  >
                    {t.featured && <span className="kl-eyebrow mb-4 text-ash">Most chosen</span>}
                    <h3 className="kl-h3 text-light mb-2">{t.name}</h3>
                    <p className="kl-metric text-light text-[2rem] mb-8">{t.price}</p>
                    <ul className="space-y-3 pt-6 border-t border-[rgba(244,241,233,0.07)] mt-auto">
                      {t.points.map((p) => (
                        <li key={p} className="kl-body-sm">{p}</li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* SPEED */}
        <section className="py-20 md:py-28 border-t border-[rgba(244,241,233,0.07)]">
          <div className="mx-auto w-full max-w-[900px] px-5 sm:px-8">
            <Reveal className="mb-12">
              <span className="kl-eyebrow">Speed</span>
              <h2 className="kl-h1 mt-6">We build fast, because speed is part of the value.</h2>
            </Reveal>
            <Reveal>
              <div className="kl-card overflow-hidden">
                {speed.map(([k, v], i) => (
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
              <h2 className="kl-h1 mb-5">Want to know where you&apos;re losing leads?</h2>
              <p className="kl-body max-w-md mx-auto mb-10">Start with a call. Free, 30 minutes. We&apos;ll map your pipeline and tell you what to fix first.</p>
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
