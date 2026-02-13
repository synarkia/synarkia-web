import Link from "next/link";
import { Database, Zap, Cpu } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
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
                    {/* Background Video */}
                    <div className="absolute inset-0 z-0 opacity-20 mix-blend-screen pointer-events-none">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        >
                            <source src="/videos/grid-loop.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-b from-void/80 to-void" />
                    </div>

                    <div className="absolute top-0 right-1/2 translate-x-1/2 w-[600px] h-[600px] bg-saffron/5 rounded-full blur-[100px] pointer-events-none z-0" />
                    <Container>
                        <Label className="text-saffron">02 — Labs</Label>
                        <H1 className="mb-8 max-w-4xl">
                            The Tactical Engines of Growth.
                        </H1>
                        <Text className="text-xl md:text-2xl max-w-2xl mb-12">
                            Automation. AI Systems. Funnels. We build the machines that run your business while you sleep.
                        </Text>
                        <Button className="bg-saffron text-deep-ink hover:bg-saffron-warm" size="lg" asChild>
                            <Link href="/contact">Deploy Systems</Link>
                        </Button>
                    </Container>
                </Section>

                {/* CAPABILTIES GRID */}
                <Section>
                    <Container>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-8 border border-white/5 bg-deep-ink/50 hover:border-saffron/30 transition-colors group rounded-sm">
                                <Zap className="w-8 h-8 text-saffron mb-6" />
                                <H3>Automations</H3>
                                <Text className="text-sm mb-4">
                                    Replace manual grunt work with code. Zapier, Make.com, and custom scripts to connect your stack.
                                </Text>
                            </div>
                            <div className="p-8 border border-white/5 bg-deep-ink/50 hover:border-saffron/30 transition-colors group rounded-sm">
                                <Cpu className="w-8 h-8 text-saffron mb-6" />
                                <H3>AI Agents</H3>
                                <Text className="text-sm mb-4">
                                    Customer support, lead qualification, and outreach handled by trained LLMs that speak your voice.
                                </Text>
                            </div>
                            <div className="p-8 border border-white/5 bg-deep-ink/50 hover:border-saffron/30 transition-colors group rounded-sm">
                                <Database className="w-8 h-8 text-saffron mb-6" />
                                <H3>Data Systems</H3>
                                <Text className="text-sm mb-4">
                                    Clean, enriched CRM data. Dashboards that tell the truth about your CAC and LTV.
                                </Text>
                            </div>
                        </div>
                    </Container>
                </Section>

                {/* SPRINT TIERS */}
                <Section className="bg-white/5 border-y border-white/5">
                    <Container>
                        <H2 className="mb-12 text-center">Execution Protocols</H2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Tier 1 */}
                            <div className="p-8 border border-white/10 bg-void rounded-sm">
                                <Label className="text-stone mb-2">Protocol</Label>
                                <H3 className="text-3xl text-saffron mb-2">Audit</H3>
                                <div className="text-stone font-mono text-sm mb-6">€3,500 One-time</div>
                                <Text className="text-sm mb-8">
                                    Full analysis of your current stack and leakages.
                                </Text>
                                <Button variant="outline" className="w-full" asChild><Link href="/contact">Select</Link></Button>
                            </div>

                            {/* Tier 2 */}
                            <div className="p-8 border border-saffron/30 bg-deep-ink rounded-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 px-3 py-1 bg-saffron text-deep-ink text-xs font-bold">POPULAR</div>
                                <Label className="text-saffron mb-2">Protocol</Label>
                                <H3 className="text-3xl text-white mb-2">Build</H3>
                                <div className="text-stone font-mono text-sm mb-6">From €8,000</div>
                                <Text className="text-sm mb-8">
                                    Custom build of 1-3 core systems (e.g. Sales Bot + CRM).
                                </Text>
                                <Button className="w-full bg-saffron text-deep-ink hover:bg-saffron-warm" asChild><Link href="/contact">Select</Link></Button>
                            </div>

                            {/* Tier 3 */}
                            <div className="p-8 border border-white/10 bg-void rounded-sm">
                                <Label className="text-stone mb-2">Protocol</Label>
                                <H3 className="text-3xl text-saffron mb-2">Scale</H3>
                                <div className="text-stone font-mono text-sm mb-6">€4,000 / mo</div>
                                <Text className="text-sm mb-8">
                                    Ongoing optimization and new system deployment.
                                </Text>
                                <Button variant="outline" className="w-full" asChild><Link href="/contact">Select</Link></Button>
                            </div>
                        </div>
                    </Container>
                </Section>
            </main>
            <Footer />
        </>
    );
}
