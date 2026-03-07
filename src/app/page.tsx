import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import SceneCanvas from "@/components/3d/scene-canvas";
import { HyperObject } from "@/components/3d/hyper-object";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-void selection:bg-lavender selection:text-void">

        {/* HERO */}
        <section className="relative w-full h-screen overflow-hidden bg-void">
          <div className="absolute inset-0 z-0">
            <SceneCanvas cameraPosition={[0, 0, 12]}>
              <HyperObject />
            </SceneCanvas>
          </div>

          {/* Superimposed text */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none mt-20">
            <h1 className="type-hero text-center mb-8">
              Navigating<br />complex reality.
            </h1>
            <p className="type-body text-center max-w-lg mb-8 text-cream">
              Strategy. Systems. Intelligence.<br />
              Berlin · Zurich · Lyon · Lisbon
            </p>
            <div className="pointer-events-auto">
              <Button variant="outline" size="lg" className="rounded-full" asChild>
                <Link href="/contact">Start a conversation <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-void to-transparent z-10 pointer-events-none" />

          {/* Subtle Glows */}
          <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-lavender/5 mix-blend-screen filter blur-[100px] pointer-events-none transform -translate-x-1/2" />
          <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] rounded-full bg-saffron/5 mix-blend-screen filter blur-[120px] pointer-events-none transform translate-x-1/2" />
        </section>

        {/* THE SIGNAL */}
        <Section className="py-24 md:py-32">
          <Container>
            <div className="max-w-3xl mx-auto space-y-8 text-center">
              <p className="type-h2">
                We work with those who sense that what they're building is larger than what they've been able to express.
              </p>
              <p className="type-body text-stone">
                The vision exists. The capacity exists. What's missing is the architecture between the two.
              </p>
              <p className="type-body text-stone">
                Here we map your universe — and build the bridge from where you are to where you know you belong.
              </p>
            </div>
          </Container>
        </Section>

        {/* DIVISIONS */}
        <Section className="py-24 bg-deep-ink border-y border-white/5 relative overflow-hidden">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10">
              {/* Studio */}
              <div className="glass-panel p-10 md:p-14 rounded-2xl flex flex-col justify-between group">
                <div>
                  <span className="type-caption text-lavender mb-6 block">01 — Studio</span>
                  <h3 className="type-h2 mb-4">Clarity. Positioning. Brand.</h3>
                  <p className="type-body mb-12">
                    The strategic layer — positioning, identity, visual systems, and copywriting that make your business the evident choice.
                  </p>
                </div>
                <div>
                  <Link href="/studio" className="type-cta text-lavender hover:text-white transition-colors flex items-center gap-2">
                    Enter Studio <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Labs */}
              <div className="glass-panel p-10 md:p-14 rounded-2xl flex flex-col justify-between group relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                  <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src="/videos/grid-loop.mp4" type="video/mp4" />
                  </video>
                </div>
                <div className="relative z-10">
                  <span className="type-caption text-saffron mb-6 block">02 — Labs</span>
                  <h3 className="type-h2 mb-4">Automation. AI. Systems.</h3>
                  <p className="type-body mb-12">
                    The operational layer — for when your pipeline leaks, your follow-up is manual, and you're leaving money on the table.
                  </p>
                </div>
                <div className="relative z-10">
                  <Link href="/labs" className="type-cta text-saffron hover:text-white transition-colors flex items-center gap-2">
                    Enter Labs <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* SELECT WORK */}
        <Section id="work" className="py-32">
          <Container>
            <div className="border-t border-white/10 pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-4">
                <h2 className="type-h3 text-lavender">Select Work</h2>
              </div>
              <div className="lg:col-span-8 group cursor-pointer">
                <h3 className="type-h2 mb-2 group-hover:text-lavender transition-colors">CityzenAdvisors</h3>
                <p className="type-caption text-sand mb-8">Buyer-side real estate advisory · Lisbon</p>

                <blockquote className="border-l border-lavender/30 pl-6 mb-8 py-2">
                  <p className="type-body text-cream italic mb-4">
                    "Working with someone who was actually on our side changed everything."
                  </p>
                  <footer className="type-caption text-stone">— Natalia, Co-founder</footer>
                </blockquote>

                <Link href="#" className="type-cta text-sand hover:text-cream transition-colors flex items-center gap-2">
                  See the work <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </Container>
        </Section>

        {/* WHO THIS IS FOR */}
        <Section className="py-32 bg-deep-ink border-t border-white/5 relative">
          <Container className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="type-hero mb-8 text-cream">Who This Is For</h2>
                <div className="space-y-6">
                  <p className="type-body">
                    You already know the work is excellent. You sense the infrastructure hasn't caught up.
                  </p>
                  <p className="type-body">
                    Something is misaligned between what you deliver and how the world perceives it.
                  </p>
                  <p className="type-body text-cream">
                    If the quality of your work exceeds the quality of your systems, we should talk.
                  </p>
                </div>
                <div className="mt-12">
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/contact">Book a call</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block relative h-[400px]">
                {/* Visual anchor point without complex logic */}
                <div className="absolute inset-0 bg-twilight/20 rounded-2xl border border-white/5 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border border-lavender/30 flex items-center justify-center animate-spin-slow">
                    <div className="w-16 h-16 rounded-full border border-saffron/30" />
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* THE METHOD */}
        <Section className="py-32">
          <Container>
            <div className="mb-20">
              <h2 className="type-hero">The Method</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
              {[
                { n: "01", t: "Clarity", h: "Where are you on the map.", d: "Vision, resources, obstacles — a clear picture of what is." },
                { n: "02", t: "Integrity", h: "What do you stand for.", d: "Brand identity, values, coherence between who you are and what you show." },
                { n: "03", t: "Love", h: "Who do you serve, and why.", d: "Deep understanding of your audience — their world, their language, their needs." },
                { n: "04", t: "Transformation", h: "What needs to change.", d: "The specific shift your customers go through — and where you fit in that journey." },
                { n: "05", t: "Possibility", h: "What avenues open up.", d: "New directions, untapped markets, emerging opportunities that align with your strengths." },
                { n: "06", t: "Creation", h: "The next step, built.", d: "Doing the best with what we have — driving process improvement, savings, or revenue." }
              ].map((step, i) => (
                <div key={i} className="border-t border-white/10 pt-8 group">
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="type-metric text-lavender/50 group-hover:text-lavender transition-colors">{step.n}</span>
                    <h3 className="type-h3 text-saffron">→ {step.t}</h3>
                  </div>
                  <h4 className="type-body text-cream font-medium mb-3">{step.h}</h4>
                  <p className="type-body text-stone">{step.d}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* CTA */}
        <Section className="py-40 bg-twilight border-t border-white/5">
          <Container className="text-center">
            <h2 className="type-h2 mb-6 text-cream">The first step is always the same.</h2>
            <p className="type-body max-w-md mx-auto mb-12">
              A conversation. 30 minutes. Free. No pitch.<br />
              You leave with clarity on what to do next.
            </p>
            <Button variant="primary" size="lg" asChild>
              <Link href="/contact">Book your call <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </Container>
        </Section>

      </main>
      <Footer />
    </>
  );
}
