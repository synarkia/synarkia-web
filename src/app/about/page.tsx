import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { H2, Text, Label } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function About() {
    return (
        <>
            <Navbar />
            <main className="bg-white text-black min-h-screen pt-32 pb-20 selection:bg-black selection:text-white">
                {/* HERO */}
                <Section className="py-24 md:py-40">
                    <Container>
                        <div className="max-w-4xl">
                            <h1 className="type-mega mb-12 text-black leading-[0.8]">
                                The Origin<br />
                                <span className="ml-12 md:ml-32 opacity-30 italic font-serif">Story</span>
                            </h1>
                            <Text className="text-xl md:text-3xl font-serif text-black leading-tight max-w-2xl">
                                Synarkia exists because the gap between &quot;Vision&quot; and &quot;Reality&quot; is where 99% of ventures die. We built the bridge.
                            </Text>
                        </div>
                    </Container>
                </Section>

                {/* MANIFESTO - Split Editorial */}
                <Section className="py-24 border-t border-black/10">
                    <Container>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                            <div className="md:col-span-4">
                                <Label className="text-black/40 mb-8">Etymology</Label>
                                <p className="text-2xl font-serif mb-2">Syn- (Together)</p>
                                <p className="text-2xl font-serif mb-8">+ Arkhein (To Command/Rule)</p>
                                <p className="text-sm text-black/60 max-w-xs">
                                    &quot;Joint Rule&quot; or &quot;Harmonious Command.&quot; A state where strategy and execution are perfectly aligned.
                                </p>
                            </div>
                            <div className="md:col-span-8">
                                <Text className="text-lg md:text-xl text-black/80 mb-6 font-light">
                                    Most agencies sell &quot;fragments.&quot; They sell a logo, or a funnel, or a consultation call. But fragments don&apos;t build empires. Systems do.
                                </Text>
                                <Text className="text-lg md:text-xl text-black/80 mb-6 font-light">
                                    We founded Synarkia to be the &quot;Execution Alliance&quot; for sovereign founders. We don&apos;t just advise; we embed. We bring the design systems of a luxury house and the operational rigor of a tech startup.
                                </Text>
                            </div>
                        </div>
                    </Container>
                </Section>

                {/* VALUES - Minimal List */}
                <Section className="py-24 bg-black text-white">
                    <Container>
                        <Label className="mb-16 opacity-50">Core Axioms</Label>
                        <div className="space-y-12">
                            {[
                                { title: "Beauty is Leverage", text: "Aesthetics are a trust shortcut. If it looks premium, the market assumes it is." },
                                { title: "Speed is Safety", text: "Slow execution allows doubt to creep in. We ship fast to validate reality." },
                                { title: "Sovereignty First", text: "We build assets you own. No platform dependencies. No rent-seeking." }
                            ].map((val, i) => (
                                <div key={i} className="flex flex-col md:flex-row md:items-baseline border-b border-white/20 pb-12 group hover:border-white transition-colors">
                                    <span className="text-sm font-mono text-white/40 md:w-32 mb-4 md:mb-0">AXIOM_0{i + 1}</span>
                                    <h3 className="text-4xl md:text-6xl font-serif md:w-1/2 mb-4 md:mb-0 group-hover:text-lavender transition-colors">{val.title}</h3>
                                    <p className="text-lg text-white/60 md:w-1/2">{val.text}</p>
                                </div>
                            ))}
                        </div>
                    </Container>
                </Section>

                {/* FOUNDER */}
                <Section className="py-32">
                    <Container className="flex flex-col items-center text-center">
                        <div className="w-32 h-32 bg-gray-200 rounded-full mb-8 grayscale hover:grayscale-0 transition-all duration-500" />
                        <H2 className="text-black mb-2">The Architect</H2>
                        <Text className="text-black/60 max-w-lg mb-8">
                            Founded by operators who got tired of weak agency deliverables. We built the firm we wished we could hire.
                        </Text>
                        <Button variant="outline" className="rounded-full border-black/20 text-black hover:bg-black hover:text-white" asChild>
                            <Link href="/contact">Talk to us</Link>
                        </Button>
                    </Container>
                </Section>
            </main>
            <Footer />
        </>
    );
}
