import Link from "next/link";
import {
  ArrowRight,
  Database,
  Code2,
  Sparkles,
  Zap,
  Rocket,
  Compass,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Contact } from "@/components/sections/contact";
import { Reveal } from "@/components/ui/reveal";
import { CursorLight } from "@/components/ui/cursor-light";
import CosmicBalanceMount from "@/components/3d/cosmic-balance-mount";

const services = [
  {
    icon: Database,
    title: "CRM Consulting",
    desc: "Select, implement, and optimize the right CRM for your business. From Pipedrive to HubSpot, we build sales pipelines that convert.",
    points: ["CRM selection & implementation", "Pipeline optimization", "Team training & onboarding", "Data migration & cleanup"],
  },
  {
    icon: Code2,
    title: "No-Code Development",
    desc: "Powerful web apps, internal tools, and customer portals without traditional coding. Ship faster, iterate quicker.",
    points: ["Web app development", "Internal tools & dashboards", "Customer portals", "Database design"],
  },
  {
    icon: Sparkles,
    title: "Vibe Coding Development",
    desc: "AI-powered development tools — v0, Cursor, Lovable — to build production-ready applications at unprecedented speed.",
    points: ["AI-assisted development", "Rapid prototyping", "Full-stack applications", "Modern UI/UX"],
  },
  {
    icon: Zap,
    title: "Automation Consulting",
    desc: "Eliminate repetitive tasks and connect your tools. Build workflows that save hours every week and reduce human error.",
    points: ["Workflow automation", "Tool integrations", "Data synchronization", "Process optimization"],
  },
  {
    icon: Rocket,
    title: "GTM Consulting",
    desc: "Launch products and enter markets with a solid go-to-market strategy. From positioning to sales enablement, we've got you covered.",
    points: ["Market positioning", "Sales enablement", "Lead generation systems", "Growth strategy"],
  },
  {
    icon: Compass,
    title: "Brand & Studio",
    desc: "The strategic layer — positioning, identity, visual systems, and copywriting that make your business the evident choice.",
    points: ["Positioning & narrative", "Visual identity systems", "Conversion copywriting", "Offer architecture"],
  },
];

const method = [
  { n: "01", t: "Clarity", h: "Where you are on the map.", d: "Vision, resources, obstacles — a clear picture of what is." },
  { n: "02", t: "Integrity", h: "What you stand for.", d: "Brand identity and values — coherence between who you are and what you show." },
  { n: "03", t: "Resonance", h: "Who you serve, and why.", d: "Deep understanding of your audience — their world, their language, their needs." },
  { n: "04", t: "Transformation", h: "What needs to change.", d: "The specific shift your customers move through — and where you fit in that journey." },
  { n: "05", t: "Possibility", h: "What avenues open.", d: "New directions and untapped markets that align with your strengths." },
  { n: "06", t: "Creation", h: "The next step, built.", d: "Working assets that drive process improvement, savings, or revenue." },
];

export default function Home() {
  return (
    <>
      <CursorLight />
      <Navbar />
      <main id="top" className="min-h-screen bg-ink">
        {/* ════════ HERO ════════ */}
        <section className="relative w-full h-[100svh] min-h-[680px] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <CosmicBalanceMount />
          </div>

          {/* vignette + horizon fade */}
          <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(6,6,8,0.5)_100%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-56 z-[2] pointer-events-none bg-gradient-to-t from-ink to-transparent" />

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 pointer-events-none">
            <div className="animate-fade-in" style={{ animationDelay: "0.2s", opacity: 0 }}>
              <span className="kl-eyebrow">Venture Lab &amp; Studio</span>
            </div>
            <h1 className="kl-display mt-7 mb-7 max-w-5xl kl-text-glow animate-fade-in" style={{ animationDelay: "0.35s", opacity: 0 }}>
              Syndao
            </h1>
            <p className="kl-lead max-w-2xl mb-4 animate-fade-in" style={{ animationDelay: "0.5s", opacity: 0 }}>
              The equilibrium of art, science, and metaphysics.
            </p>
            <p className="kl-body max-w-xl mb-10 animate-fade-in" style={{ animationDelay: "0.65s", opacity: 0 }}>
              We build, deploy, and operate intelligent systems that turn complex vision into
              operational reality — repeatedly.
            </p>
            <div className="pointer-events-auto flex flex-col sm:flex-row items-center gap-4 animate-fade-in" style={{ animationDelay: "0.8s", opacity: 0 }}>
              <Link href="#contact" className="kl-cta-solid">
                Start a conversation <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#services" className="kl-cta">
                Explore services
              </Link>
            </div>
          </div>

          {/* scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 pointer-events-none">
            <span className="kl-eyebrow text-[10px]">Scroll</span>
            <span className="w-px h-10 bg-gradient-to-b from-[rgba(244,241,233,0.4)] to-transparent kl-breathe" />
          </div>
        </section>

        {/* ════════ SIGNAL ════════ */}
        <section className="py-28 md:py-36">
          <div className="mx-auto w-full max-w-[860px] px-5 sm:px-8 text-center">
            <Reveal>
              <span className="kl-eyebrow">The Signal</span>
              <p className="kl-h2 mt-8 mb-8">
                We work with those who sense that what they&apos;re building is larger than what
                they&apos;ve been able to express.
              </p>
              <p className="kl-body max-w-xl mx-auto">
                The vision exists. The capacity exists. What&apos;s missing is the architecture between
                the two. Here we map your universe — and build the bridge from where you are to where
                you know you belong.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ════════ SERVICES ════════ */}
        <section id="services" className="py-24 md:py-32 border-t border-[rgba(244,241,233,0.07)]">
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
            <Reveal className="max-w-2xl mb-16 md:mb-20">
              <span className="kl-eyebrow">What we do</span>
              <h2 className="kl-h1 mt-6 mb-6">Services across the venture.</h2>
              <p className="kl-body">
                Six disciplines, one continuum — from first strategy to shipped, self-running systems.
                Engage one, or compose the whole.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {services.map((s, i) => {
                const Icon = s.icon;
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

        {/* ════════ DIVISIONS — Lab & Studio ════════ */}
        <section id="divisions" className="py-24 md:py-32 border-t border-[rgba(244,241,233,0.07)] relative overflow-hidden">
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] kl-glow opacity-30" />
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 relative z-10">
            <Reveal className="text-center mb-16">
              <span className="kl-eyebrow">Two hemispheres, one mind</span>
              <h2 className="kl-h1 mt-6">Lab &amp; Studio.</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <Reveal>
                <div className="kl-card p-10 md:p-12 h-full flex flex-col justify-between">
                  <div>
                    <span className="kl-eyebrow">01 — Studio</span>
                    <h3 className="kl-h2 mt-6 mb-5 text-light">Clarity. Positioning. Brand.</h3>
                    <p className="kl-body mb-10">
                      The strategic layer — positioning, identity, visual systems, and copywriting that
                      make your business the evident choice.
                    </p>
                  </div>
                  <Link href="/studio" className="kl-link inline-flex items-center gap-2">
                    Enter Studio <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="kl-card p-10 md:p-12 h-full flex flex-col justify-between">
                  <div>
                    <span className="kl-eyebrow">02 — Lab</span>
                    <h3 className="kl-h2 mt-6 mb-5 text-light">Automation. AI. Systems.</h3>
                    <p className="kl-body mb-10">
                      The operational layer — for when your pipeline leaks, your follow-up is manual, and
                      you&apos;re leaving outcomes on the table.
                    </p>
                  </div>
                  <Link href="/labs" className="kl-link inline-flex items-center gap-2">
                    Enter Lab <ArrowRight className="w-4 h-4" />
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
              <span className="kl-eyebrow">How we work</span>
              <h2 className="kl-h1 mt-6">The Method.</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
              {method.map((step, i) => (
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
        <section id="work" className="py-24 md:py-32 border-t border-[rgba(244,241,233,0.07)]">
          <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <Reveal className="lg:col-span-4">
                <span className="kl-eyebrow">Select Work</span>
                <h2 className="kl-h2 mt-6 text-light">Proof, not promises.</h2>
              </Reveal>
              <Reveal delay={0.1} className="lg:col-span-8">
                <div className="kl-card p-10">
                  <h3 className="kl-h2 text-light mb-2">CityzenAdvisors</h3>
                  <p className="kl-eyebrow mb-8">Buyer-side real estate advisory · Lisbon</p>
                  <blockquote className="border-l border-[rgba(244,241,233,0.2)] pl-6 mb-8">
                    <p className="kl-lead not-italic mb-4">
                      &ldquo;Working with someone who was actually on our side changed everything.&rdquo;
                    </p>
                    <footer className="kl-eyebrow">— Natalia, Co-founder</footer>
                  </blockquote>
                  <Link href="#contact" className="kl-link inline-flex items-center gap-2">
                    Request the case study <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ════════ CONTACT ════════ */}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
