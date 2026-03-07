import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { H1, H2, H3, Text, Label } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LightRays } from "@/components/3d/light-rays";

export default function StudioPage() {
    return (
        <>
            <Navbar />
            <main className="bg-void min-h-screen pt-20">
                {/* HERO */}
                <Section className="py-20 md:py-32 relative overflow-hidden bg-[#18181b]">
                    {/* LightRays Background */}
                    <LightRays
                        raysOrigin="top-center"
                        raysColor="#a855f7" // Iridescent purple/lavender
                        raysSpeed={1.5}
                        lightSpread={1.2}
                        rayLength={1.8}
                        followMouse={true}
                        mouseInfluence={0.3}
                        noiseAmount={0.03}
                        distortion={0.08}
                        className="opacity-70 mix-blend-screen"
                    />
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lavender/5 rounded-full blur-[120px] pointer-events-none" />
                    <Container className="relative z-10">
                        <Label className="text-lavender">01 — Studio</Label>
                        <H1 className="mb-8 max-w-4xl type-hero">
                            Speak to your ideal customer.
                        </H1>
                        <Text className="max-w-2xl mb-12 type-body">
                            SYNARKIA Studio builds the strategic layer —
                            brand positioning, identity, visual systems, and copywriting
                            that make your business the evident choice.
                        </Text>
                        <Button size="lg" className="type-cta" asChild>
                            <Link href="/contact">Book a free call</Link>
                        </Button>
                    </Container>
                </Section>

                {/* WHAT STUDIO BUILDS */}
                <Section className="bg-deep-ink/30 border-y border-white/5">
                    <Container>
                        <H2 className="mb-12 type-h2">What Studio Builds</H2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="p-8 border border-white/5 bg-white/[0.02] rounded-sm glass-panel">
                                <H3 className="type-h3 text-lavender/90 mb-4">Positioning & Narrative</H3>
                                <Text className="type-body text-stone">
                                    Who you are. What you do. Who it's for.<br />
                                    The language that makes your customer say yes.
                                </Text>
                            </div>
                            <div className="p-8 border border-white/5 bg-white/[0.02] rounded-sm glass-panel">
                                <H3 className="type-h3 text-lavender/90 mb-4">Visual Identity & Brand Direction</H3>
                                <Text className="type-body text-stone">
                                    Not just a logo. A coherent sensory system —<br />
                                    visual identity, style guide, tone — that makes you unmistakable.
                                </Text>
                            </div>
                            <div className="p-8 border border-white/5 bg-white/[0.02] rounded-sm glass-panel">
                                <H3 className="type-h3 text-lavender/90 mb-4">Copywriting & Messaging</H3>
                                <Text className="type-body text-stone">
                                    Website copy, pitch decks, email sequences.<br />
                                    Words that convert because they're precise.
                                </Text>
                            </div>
                            <div className="p-8 border border-white/5 bg-white/[0.02] rounded-sm glass-panel">
                                <H3 className="type-h3 text-lavender/90 mb-4">Offer Architecture</H3>
                                <Text className="type-body text-stone">
                                    What you sell. How it's structured. How it's priced.<br />
                                    Simple clarity that removes friction from the buying decision.
                                </Text>
                            </div>
                        </div>
                    </Container>
                </Section>

                {/* HOW IT WORKS */}
                <Section>
                    <Container>
                        <H2 className="mb-12 type-h2">How It Works</H2>
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start border-b border-white/10 pb-8">
                                <Label className="text-lavender shrink-0 md:w-48">01 — Clarity Call<br /><span className="text-stone">Free · 30 minutes</span></Label>
                                <div>
                                    <Text className="type-body text-white">
                                        We listen. You talk. We assess where you are and what you need. No pitch. You leave with a direction.
                                    </Text>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start border-b border-white/10 pb-8">
                                <Label className="text-lavender shrink-0 md:w-48">02 — Onboarding Session<br /><span className="text-stone">60 minutes</span></Label>
                                <div>
                                    <Text className="type-body text-white">
                                        Deep-dive into your business through the CILTPC framework:<br />
                                        Clarity → Integrity → Love → Transformation → Possibility → Creation.<br />
                                        We map the full picture before touching a single asset.
                                    </Text>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start pb-8">
                                <Label className="text-lavender shrink-0 md:w-48">03 — Creation</Label>
                                <div>
                                    <Text className="type-body text-white">
                                        We build. Positioning, identity, copy, visuals — whatever the map revealed.<br />
                                        Everything ships as a working asset, not a deck in a drawer.
                                    </Text>
                                </div>
                            </div>
                        </div>
                    </Container>
                </Section>

                {/* ENGAGEMENTS */}
                <Section className="bg-white/5 border-y border-white/5">
                    <Container>
                        <H2 className="mb-12 type-h2">Engagements</H2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { name: "Positioning Sprint", prefix: "from", price: "€1,500", time: "2 weeks" },
                                { name: "Brand Direction", prefix: "from", price: "€2,500", time: "3–4 weeks" },
                                { name: "Full Brand Build", prefix: "from", price: "€5,000", time: "6–8 weeks" },
                                { name: "Strategic Retainer", prefix: "from", price: "€1,500/mo", time: "Ongoing" },
                                { name: "Venture Build", prefix: "from", price: "€8,000", time: "2–4 months" },
                            ].map((plan, i) => (
                                <div key={i} className="p-8 border border-white/5 bg-white/[0.02] rounded-sm flex flex-col items-start glass-panel">
                                    <H3 className="type-h3 text-white mb-6">{plan.name}</H3>
                                    <div className="flex flex-col gap-1 mb-6">
                                        <span className="type-caption text-lavender-soft">{plan.prefix}</span>
                                        <span className="text-3xl md:text-4xl font-serif text-lavender tracking-tight">{plan.price}</span>
                                    </div>
                                    <div className="type-caption text-stone mt-auto">{plan.time}</div>
                                </div>
                            ))}
                        </div>
                    </Container>
                </Section>

                {/* CTA */}
                <Section>
                    <Container className="text-center max-w-2xl mx-auto">
                        <H2 className="type-h2 mb-6">Not sure what you need?</H2>
                        <Text className="type-body mb-8 text-stone">
                            That's what the clarity call is for.
                        </Text>
                        <Button size="lg" className="type-cta" asChild>
                            <Link href="/contact">Book a free call</Link>
                        </Button>
                    </Container>
                </Section>
            </main>
            <Footer />
        </>
    );
}
