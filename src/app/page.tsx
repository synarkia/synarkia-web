import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Label } from "@/components/ui/typography";
import SceneCanvas from "@/components/3d/scene-canvas";
import { HyperObject } from "@/components/3d/hyper-object";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-void selection:bg-white selection:text-black">

        {/* 1. HYPER OBJECT (HERO) — text superimposed over full-screen 3D */}
        <section className="relative w-full h-screen overflow-hidden bg-black">
          {/* Full-screen 3D background */}
          <div className="absolute inset-0 z-0">
            <SceneCanvas cameraPosition={[0, 0, 12]}>
              <HyperObject />
            </SceneCanvas>
          </div>

          {/* Superimposed headline — centered over 3D */}
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <h1 className="type-mega text-white text-center">
              Complex<br />Reality
            </h1>
          </div>

          {/* Bottom fade to next section */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
        </section>


        {/* WORK BENTO GRID */}
        <Section className="py-32">
          <Container>
            <div className="mb-24 flex items-end justify-between border-b border-white/20 pb-8">
              <h2 className="text-6xl md:text-8xl font-serif text-white">Capabilities</h2>
              <span className="text-white/60 mb-2 font-mono">01 — 04</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {/* STUDIO CARD - Large */}
              <div className="glass-panel p-12 rounded-[2rem] min-h-[500px] flex flex-col justify-between group hover:bg-white/5 transition-colors">
                <div>
                  <Label className="text-white/50 mb-4">01 — Studio</Label>
                  <h3 className="text-4xl md:text-5xl font-serif mb-6">The Elevated Work</h3>
                  <p className="text-lg text-white/70 max-w-sm">Brand Direction. Positioning. Offer Architecture. For those who need clarity.</p>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" className="rounded-full border-white/20 text-white hover:bg-white hover:text-black" asChild>
                    <Link href="/studio">Explore Studio</Link>
                  </Button>
                </div>
              </div>

              {/* LABS CARD - Large (Video Background) */}
              <div className="relative overflow-hidden p-12 rounded-[2rem] min-h-[500px] flex flex-col justify-between group">
                <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity">
                  <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src="/videos/grid-loop.mp4" type="video/mp4" />
                  </video>
                </div>
                <div className="relative z-10">
                  <Label className="text-saffron mb-4">02 — Labs</Label>
                  <h3 className="text-4xl md:text-5xl font-serif mb-6 text-white">Tactical Engines</h3>
                  <p className="text-lg text-white/70 max-w-sm">AI Systems. Automations. Funnels. Built fast, measuring ROI.</p>
                </div>
                <div className="relative z-10 flex justify-end">
                  <Button variant="outline" className="rounded-full border-saffron/50 text-saffron hover:bg-saffron hover:text-black" asChild>
                    <Link href="/labs">Explore Labs</Link>
                  </Button>
                </div>
              </div>

              {/* ALLIES - Wide */}
              <div className="md:col-span-2 glass-panel p-12 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-8 group hover:bg-white/5 transition-colors">
                <div>
                  <h3 className="text-4xl font-serif mb-2">The Alliance</h3>
                  <p className="text-white/60">A curated network of sovereign operators.</p>
                </div>
                <div className="flex gap-4">
                  {["Dev", "Design", "Legal", "Finance", "Growth"].map(i => (
                    <span key={i} className="px-4 py-2 rounded-full border border-white/10 text-sm text-white/80">{i}</span>
                  ))}
                </div>
                <Button variant="ghost" className="text-white hover:text-lavender" asChild>
                  <Link href="/allies">Join Alliance <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
              </div>
            </div>
          </Container>
        </Section>

        {/* CLIENTS LIST - Editorial */}
        <Section className="pb-32">
          <Container>
            <div className="mb-16 border-b border-white/20 pb-8">
              <h2 className="text-6xl md:text-8xl font-serif text-white">Select Partners</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {[
                "Funded Founders", "Regenerative Biotech", "AI Infrastructure",
                "Sovereign Wealth", "Private Equity", "Legacy Brands"
              ].map((client, i) => (
                <div key={i} className="group border-t border-white/10 pt-6 hover:border-white transition-colors">
                  <h4 className="text-2xl text-white/40 group-hover:text-white transition-colors font-serif">{client}</h4>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* CTA - Minimal */}
        <Section className="py-40 flex justify-center bg-white text-black">
          <Container className="text-center">
            <h2 className="type-mega text-black mb-12 text-[8rem] md:text-[12rem] leading-[0.8]">
              Ready?
            </h2>
            <Button size="lg" className="bg-black text-white hover:bg-void/80 rounded-full px-12 h-16 text-lg" asChild>
              <Link href="/contact">Start Project</Link>
            </Button>
          </Container>
        </Section>

      </main>
      <Footer />
    </>
  );
}
