import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { H1, H2, H3, Text, Label } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function About() {
    return (
        <>
            <Navbar />
            <main className="bg-void min-h-screen pt-20">
                {/* HERO */}
                <Section className="py-24 md:py-40">
                    <Container>
                        <div className="max-w-4xl">
                            <H1 className="type-hero mb-8">
                                The thinking and the building happen in the same room.
                            </H1>
                        </div>
                    </Container>
                </Section>

                {/* ORIGIN */}
                <Section className="py-24 border-t border-white/10">
                    <Container>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                            <div className="md:col-span-4">
                                <Label className="text-lavender mb-8 block">Origin</Label>
                            </div>
                            <div className="md:col-span-8">
                                <Text className="type-h3 text-white mb-6">
                                    SYNARKIA exists because we kept seeing the same pattern.
                                </Text>
                                <Text className="type-body text-stone mb-6">
                                    Talented people. Excellent work. Broken infrastructure.
                                </Text>
                                <Text className="type-body text-stone mb-6">
                                    Lawyers losing clients to faster competitors. Consultants competing on price because they hadn't differentiated. Founders launching with chaos instead of clarity. Clinics running ads that led nowhere.
                                </Text>
                                <Text className="type-body text-stone mb-6">
                                    The work was never the problem.<br />
                                    The systems around the work were.
                                </Text>
                                <Text className="type-body text-white mb-6">
                                    We built SYNARKIA to be the rare thing most agencies claim to be but aren't: strategy and execution, integrated.
                                </Text>
                                <Text className="type-body text-white">
                                    The people who think about your problem are the same people who build the solution.
                                </Text>
                            </div>
                        </div>
                    </Container>
                </Section>

                {/* HOW WE OPERATE */}
                <Section className="py-24 bg-deep-ink/30 border-y border-white/10">
                    <Container>
                        <Label className="text-lavender mb-16 block">How We Operate</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="glass-panel p-8">
                                <H3 className="type-h3 mb-4 text-white">Small and senior.</H3>
                                <Text className="type-body text-stone">
                                    You work with the people doing the work.<br />
                                    No account managers. No handoffs.
                                </Text>
                            </div>
                            <div className="glass-panel p-8">
                                <H3 className="type-h3 mb-4 text-white">Strategy that ships.</H3>
                                <Text className="type-body text-stone">
                                    We don't produce decks that sit in drawers.<br />
                                    Everything we build is a working asset.
                                </Text>
                            </div>
                            <div className="glass-panel p-8">
                                <H3 className="type-h3 mb-4 text-white">Built to run without us.</H3>
                                <Text className="type-body text-stone">
                                    Our goal is your operational independence.<br />
                                    If we do our job right, you won't need us for months.
                                </Text>
                            </div>
                            <div className="glass-panel p-8">
                                <H3 className="type-h3 mb-4 text-white">Value, not hours.</H3>
                                <Text className="type-body text-stone">
                                    Our fees reflect what the outcome is worth to you —<br />
                                    not how long it took us to build it.
                                </Text>
                            </div>
                        </div>
                    </Container>
                </Section>

                {/* THE TEAM & NAME */}
                <Section className="py-24 border-b border-white/10">
                    <Container>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                            <div>
                                <Label className="text-lavender mb-8 block">The Team</Label>
                                <Text className="type-body text-white mb-6">
                                    Led by Leï Zagato — systems thinker, AI builder, brand strategist.<br />
                                    French-born. Working across Europe from Berlin, Zurich, Lyon, and Lisbon.
                                </Text>
                                <Text className="type-body text-stone mb-6">
                                    Supported by a curated network of senior operators — designers, developers, copywriters, and specialists — activated per project, not carried as overhead.
                                </Text>
                                <Text className="type-body text-stone">
                                    You get the right expertise for exactly what you need. Nothing more. Nothing you're paying for that you don't.
                                </Text>
                            </div>
                            <div>
                                <Label className="text-lavender mb-8 block">Name</Label>
                                <Text className="type-h3 font-mono text-white mb-2">syn·ark·ia</Text>
                                <Text className="type-caption text-stone mb-6">/sɪˈnɑːrkiə/</Text>
                                <ul className="type-body text-stone space-y-2 mb-8">
                                    <li><strong className="text-white">syn</strong> — together</li>
                                    <li><strong className="text-white">archia</strong> — to rise, to lead</li>
                                </ul>
                                <Text className="type-h3 text-lavender mt-4">
                                    A system of coordinated ascent.
                                </Text>
                            </div>
                        </div>
                    </Container>
                </Section>

                {/* FOOTER CTA */}
                <Section className="py-32">
                    <Container className="flex flex-col items-center text-center">
                        <H2 className="type-hero mb-12 max-w-3xl text-white">
                            If the quality of your work exceeds the quality of your systems —
                        </H2>
                        <Button size="lg" className="type-cta" asChild>
                            <Link href="/contact">Let's talk</Link>
                        </Button>
                    </Container>
                </Section>
            </main>
            <Footer />
        </>
    );
}
