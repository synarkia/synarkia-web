import Link from "next/link";
import { Database, Zap, Cpu, Mail, LayoutTemplate, MessageSquare } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import SceneCanvas from "@/components/3d/scene-canvas";
import { ObsidianNetwork } from "@/components/3d/obsidian-network";
import { H1, H2, H3, Text, Label } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function LabsPage() {
    return (
        <>
            <Navbar />
            <main className="bg-void min-h-screen pt-20">
                {/* HERO */}
                <Section className="pb-16 pt-16 md:pt-24 border-b border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 z-0 opacity-20 mix-blend-screen pointer-events-none">
                        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                            <source src="/videos/grid-loop.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-b from-void/80 to-void" />
                    </div>
                    <div className="absolute top-0 right-1/2 translate-x-1/2 w-[600px] h-[600px] bg-saffron/5 rounded-full blur-[100px] pointer-events-none z-0" />

                    {/* 3D Network Background */}
                    <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
                        <SceneCanvas cameraPosition={[0, 0, 12]}>
                            <ObsidianNetwork />
                        </SceneCanvas>
                    </div>

                    <Container className="relative z-10">
                        <Label className="text-saffron">02 — Labs</Label>
                        <H1 className="mb-8 max-w-4xl type-hero">
                            Your best clients are being lost to your worst systems.
                        </H1>
                        <Text className="max-w-2xl mb-12 type-body">
                            SYNARKIA Labs builds the infrastructure that captures, qualifies, and converts —
                            so you stop doing manually what a machine should be doing for you.
                        </Text>
                    </Container>
                </Section>

                {/* THE COST OF SLOW */}
                <Section>
                    <Container>
                        <div className="max-w-3xl">
                            <H2 className="type-h2 mb-8">The Cost of Slow</H2>
                            <Text className="type-body text-stone mb-6">
                                A lead fills out your form on Saturday.<br />
                                You reply Monday.<br />
                                They already booked with someone else.
                            </Text>
                            <Text className="type-body text-stone mb-6">
                                A prospect DMs you on Instagram.<br />
                                You see it Tuesday.<br />
                                Gone.
                            </Text>
                            <Text className="type-body text-white mb-6">
                                You know this is happening. You just haven't had time to fix it.
                            </Text>
                            <Text className="type-h3 text-saffron">
                                That's what Labs is for.
                            </Text>
                        </div>
                    </Container>
                </Section>

                {/* WHAT LABS BUILDS */}
                <Section className="bg-deep-ink/30 border-y border-white/5">
                    <Container>
                        <H2 className="type-h2 mb-12">What Labs Builds</H2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="p-8 border border-white/5 bg-deep-ink/50 hover:border-saffron/30 transition-colors group rounded-sm glass-panel">
                                <Cpu className="w-8 h-8 text-saffron mb-6" />
                                <H3 className="type-h3 mb-4 text-white">AI Agents</H3>
                                <Text className="type-body text-stone">
                                    Intelligent systems that handle complex tasks, qualify leads, and act as your 24/7 digital workforce.
                                </Text>
                            </div>
                            <div className="p-8 border border-white/5 bg-deep-ink/50 hover:border-saffron/30 transition-colors group rounded-sm glass-panel">
                                <Mail className="w-8 h-8 text-saffron mb-6" />
                                <H3 className="type-h3 mb-4 text-white">Email Automation</H3>
                                <Text className="type-body text-stone">
                                    Sequences that nurture, follow up, and re-engage.<br />
                                    Written well. Timed right. Running while you sleep.
                                </Text>
                            </div>
                            <div className="p-8 border border-white/5 bg-deep-ink/50 hover:border-saffron/30 transition-colors group rounded-sm glass-panel">
                                <LayoutTemplate className="w-8 h-8 text-saffron mb-6" />
                                <H3 className="type-h3 mb-4 text-white">Funnel Systems</H3>
                                <Text className="type-body text-stone">
                                    Landing pages. Lead capture. Conversion tracking.<br />
                                    End-to-end — so your ads actually lead somewhere.
                                </Text>
                            </div>
                            <div className="p-8 border border-white/5 bg-deep-ink/50 hover:border-saffron/30 transition-colors group rounded-sm glass-panel">
                                <Zap className="w-8 h-8 text-saffron mb-6" />
                                <H3 className="type-h3 mb-4 text-white">Workflow Automation</H3>
                                <Text className="type-body text-stone">
                                    Connecting your apps, eliminating manual data entry, and making your operations run flawlessly.
                                </Text>
                            </div>
                            <div className="p-8 border border-white/5 bg-deep-ink/50 hover:border-saffron/30 transition-colors group rounded-sm glass-panel">
                                <Database className="w-8 h-8 text-saffron mb-6" />
                                <H3 className="type-h3 mb-4 text-white">Content Systems</H3>
                                <Text className="type-body text-stone">
                                    AI-assisted pipelines.<br />
                                    Consistent output without the 10-hour weekly grind.
                                </Text>
                            </div>
                        </div>
                    </Container>
                </Section>

                {/* THE GROWTH ENGINE Tiers */}
                <Section>
                    <Container>
                        <div className="max-w-3xl mb-12">
                            <H2 className="type-h2 mb-4">The Growth Engine</H2>
                            <Text className="type-body text-stone">
                                For businesses that don't need one tool — they need a complete system.<br />
                                A functioning lead capture → qualification → booking system.<br />
                                Qualified conversations within 30 days.
                            </Text>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-8 border border-white/10 bg-void rounded-sm flex flex-col items-start hover:-translate-y-1 transition-transform">
                                <H3 className="type-h3 text-saffron mb-6">Starter</H3>
                                <div className="flex flex-col gap-1 mb-6">
                                    <span className="type-caption text-stone">from</span>
                                    <span className="text-3xl md:text-4xl font-serif text-white tracking-tight">€1,500/mo</span>
                                </div>
                                <Text className="type-body text-stone mt-auto">
                                    Single channel. CRM. Weekly reporting.
                                </Text>
                            </div>
                            <div className="p-8 border border-saffron/30 bg-deep-ink rounded-sm relative overflow-hidden flex flex-col items-start hover:-translate-y-1 hover:border-saffron/50 transition-all glow-saffron hidden-border">
                                <div className="absolute top-0 right-0 px-3 py-1 bg-saffron text-deep-ink text-xs font-bold uppercase z-10">Popular</div>
                                <H3 className="type-h3 text-white mb-6 relative z-10">Core</H3>
                                <div className="flex flex-col gap-1 mb-6 relative z-10">
                                    <span className="type-caption text-saffron-warm">from</span>
                                    <span className="text-3xl md:text-4xl font-serif text-saffron tracking-tight">€3,000/mo</span>
                                </div>
                                <Text className="type-body text-stone mt-auto relative z-10">
                                    Multi-channel. Landing pages. Follow-up sequences. A/B testing.
                                </Text>
                            </div>
                            <div className="p-8 border border-white/10 bg-void rounded-sm flex flex-col items-start hover:-translate-y-1 transition-transform">
                                <H3 className="type-h3 text-saffron mb-6">Premium</H3>
                                <div className="flex flex-col gap-1 mb-6">
                                    <span className="type-caption text-stone">from</span>
                                    <span className="text-3xl md:text-4xl font-serif text-white tracking-tight">€5,000/mo</span>
                                </div>
                                <Text className="type-body text-stone mt-auto">
                                    Full stack. Paid traffic. Custom automations. Strategy calls.
                                </Text>
                            </div>
                        </div>
                    </Container>
                </Section>

                {/* SPEED */}
                <Section className="bg-white/5 border-y border-white/5">
                    <Container>
                        <div className="max-w-3xl">
                            <H2 className="type-h2 mb-8">Speed</H2>
                            <ul className="space-y-4 mb-8 type-body text-stone">
                                <li><strong>ManyChat setup</strong> — 2–5 days.</li>
                                <li><strong>Email automation</strong> — 3–7 days.</li>
                                <li><strong>AI chatbot</strong> — 1–2 weeks.</li>
                                <li><strong>Full funnel</strong> — 1–2 weeks.</li>
                                <li><strong className="text-white">Growth Engine</strong> — qualified leads in 30 days.</li>
                            </ul>
                            <Text className="type-h3 text-saffron">
                                We build fast because speed is part of the value.
                            </Text>
                        </div>
                    </Container>
                </Section>

                {/* CTA */}
                <Section>
                    <Container className="text-center max-w-2xl mx-auto">
                        <H2 className="type-h2 mb-4">Want to know exactly where you're losing leads?</H2>
                        <Text className="type-body text-stone mb-8">
                            Start with a call. Free. 30 minutes.<br />
                            We'll map your pipeline and tell you what to fix first.
                        </Text>
                        <Button className="bg-saffron text-deep-ink hover:bg-saffron-warm type-cta" size="lg" asChild>
                            <Link href="/contact">Book a free call</Link>
                        </Button>
                    </Container>
                </Section>
            </main>
            <Footer />
        </>
    );
}
