import Link from "next/link";
import { Check } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { H1, H2, H3, Text, Label } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function StudioPage() {
    return (
        <>
            <Navbar />
            <main className="bg-void min-h-screen pt-20">
                {/* HERO */}
                <Section className="py-20 md:py-32 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lavender/5 rounded-full blur-[120px] pointer-events-none" />
                    <Container>
                        <Label className="text-lavender">01 — Studio</Label>
                        <H1 className="mb-8 max-w-4xl">
                            Positioning, Brand, and Venture Architecture.
                        </H1>
                        <Text className="text-xl md:text-2xl max-w-2xl mb-12">
                            Strategy without structure is noise. We build the narrative and visual infrastructure that allows founders to command their market.
                        </Text>
                        <Button size="lg" asChild>
                            <Link href="/contact">Book Strategy Call</Link>
                        </Button>
                    </Container>
                </Section>

                {/* SERVICES DETAILED */}
                <Section className="bg-deep-ink/30 border-y border-white/5">
                    <Container>
                        <div className="space-y-24">

                            {/* Service 1 */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <H2 className="text-lavender/90">Positioning & Narrative</H2>
                                    <Text className="mb-6">
                                        Most founders can&apos;t explain what they do in one sentence. We fix that. We craft the &quot;Source Code&quot; of your business—the core narrative that aligns your team, investors, and customers.
                                    </Text>
                                    <ul className="space-y-3">
                                        {["Category Design", "Core Narrative Deck", "Investor Storytelling"].map(i => (
                                            <li key={i} className="flex items-center gap-3 text-stone"><Check className="w-4 h-4 text-lavender" /> {i}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-8 border border-white/5 bg-white/[0.02] rounded-sm">
                                    <div className="w-full h-64 bg-gradient-to-br from-lavender/10 to-transparent rounded flex items-center justify-center font-serif text-3xl italic text-lavender/50">
                                        The Story
                                    </div>
                                </div>
                            </div>

                            {/* Service 2 */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:flex-row-reverse">
                                <div className="lg:order-2">
                                    <H2 className="text-lavender/90">Brand Identity</H2>
                                    <Text className="mb-6">
                                        Aesthetics allow you to skip the line of trust. We build high-signal visual identities that separate you from the noise of &quot;startup template&quot; designs.
                                    </Text>
                                    <ul className="space-y-3">
                                        {["Visual Design System", "Web Experience", "Motion & Interaction"].map(i => (
                                            <li key={i} className="flex items-center gap-3 text-stone"><Check className="w-4 h-4 text-lavender" /> {i}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-8 border border-white/5 bg-white/[0.02] rounded-sm lg:order-1">
                                    <div className="w-full h-64 bg-gradient-to-bl from-lavender/10 to-transparent rounded flex items-center justify-center font-serif text-3xl italic text-lavender/50">
                                        The Visual
                                    </div>
                                </div>
                            </div>

                            {/* Service 3 */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <H2 className="text-lavender/90">Offer Architecture</H2>
                                    <Text className="mb-6">
                                        We restructure your pricing and delivery to maximize LTV and minimize operational drag. We turn services into products and products into ecosystems.
                                    </Text>
                                    <ul className="space-y-3">
                                        {["Pricing Strategy", "Product-Service Hybrids", "High-Ticket Sales Asset"].map(i => (
                                            <li key={i} className="flex items-center gap-3 text-stone"><Check className="w-4 h-4 text-lavender" /> {i}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-8 border border-white/5 bg-white/[0.02] rounded-sm">
                                    <div className="w-full h-64 bg-gradient-to-tr from-lavender/10 to-transparent rounded flex items-center justify-center font-serif text-3xl italic text-lavender/50">
                                        The Offer
                                    </div>
                                </div>
                            </div>

                        </div>
                    </Container>
                </Section>

                {/* PRICING / OFFERS TABLE */}
                <Section>
                    <Container>
                        <div className="border border-white/10 rounded-sm overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 bg-deep-ink/40">
                                {[
                                    { name: "Sprint", price: "€15k", time: "2 Weeks", desc: "For specific asset creation." },
                                    { name: "Build", price: "€45k", time: "6-8 Weeks", desc: "Full rebrand & site overhaul." },
                                    { name: "Partner", price: "€8k/mo", time: "Retainer", desc: "Fractional CMO & Studio access." },
                                ].map((plan, i) => (
                                    <div key={i} className="p-8 flex flex-col items-start hover:bg-white/[0.02] transition-colors">
                                        <H3 className="text-sm uppercase tracking-widest text-lavender mb-2">{plan.name}</H3>
                                        <div className="text-4xl font-serif text-cream mb-4">{plan.price}</div>
                                        <div className="text-sm font-mono text-stone mb-6">{plan.time}</div>
                                        <Text className="text-sm mb-8 flex-grow">{plan.desc}</Text>
                                        <Button variant="outline" className="w-full" asChild>
                                            <Link href="/contact">Inquire</Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Container>
                </Section>
            </main>
            <Footer />
        </>
    );
}
