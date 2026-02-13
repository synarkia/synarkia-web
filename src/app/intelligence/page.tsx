import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Text, Label } from "@/components/ui/typography";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import SceneCanvas from "@/components/3d/scene-canvas";
import { ObsidianNetwork } from "@/components/3d/obsidian-network";

const intelligence = [
    {
        category: "Frameworks",
        items: [
            { title: "The Energy Leak of Misalignment", date: "INT_01" },
            { title: "Structure vs. Stifle: The Balance", date: "INT_02" },
            { title: "AI as a Force Multiplier", date: "INT_03" }
        ]
    },
    {
        category: "Signals",
        items: [
            { title: "The Pivot Protocol", date: "SIG_01" },
            { title: "Hire vs. Automate", date: "SIG_02" },
            { title: "Founder Energy Allocation", date: "SIG_03" }
        ]
    },
    {
        category: "Case Studies",
        items: [
            { title: "CityzenAdvisors: Restoring coherence", date: "CS_01" },
            { title: "Hedone: Operationalizing experience", date: "CS_02" },
            { title: "ViePure: Brand as system", date: "CS_03" }
        ]
    }
];

export default function Intelligence() {
    return (
        <>
            <Navbar />
            <main className="bg-black min-h-screen">
                {/* HERO */}
                <section className="relative w-full min-h-screen flex items-center overflow-hidden border-b border-white/10">
                    {/* 3D Foreground - Brighter, full opacity, shifted down to clear header */}
                    <div className="absolute inset-0 top-[180px] z-20 pointer-events-none mix-blend-lighten opacity-100">
                        <SceneCanvas cameraPosition={[0, 0, 12]}>
                            <ObsidianNetwork />
                        </SceneCanvas>
                    </div>

                    <Container className="relative z-10 pt-48 pb-32">
                        <Label className="text-white/40 mb-8">Intelligence</Label>
                        <h1 className="type-mega text-white mb-8 leading-[0.85] select-none">
                            Thought<br />Structure
                        </h1>
                        <Text className="text-xl md:text-3xl font-serif text-white/80 leading-tight max-w-4xl select-none">
                            Playbooks, signals, and architectural patterns for the sovereign founder.
                        </Text>
                    </Container>

                    {/* Bottom fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent z-30 pointer-events-none" />
                </section>

                {/* CONTENT LIST */}
                <Section className="py-24">
                    <Container>
                        <div className="space-y-24">
                            {intelligence.map((section, i) => (
                                <div key={i}>
                                    <div className="flex items-baseline gap-4 mb-12 border-b border-white/10 pb-4">
                                        <h2 className="text-4xl font-serif text-white">{section.category}</h2>
                                        <span className="text-xs font-mono text-white/40">0{i + 1}</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {section.items.map((item, j) => (
                                            <Link key={j} href="#" className="group flex items-center justify-between p-6 border border-white/5 hover:bg-white hover:border-white transition-all duration-300 rounded-lg">
                                                <span className="text-xl md:text-2xl font-serif text-white group-hover:text-black transition-colors">{item.title}</span>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs font-mono text-white/40 group-hover:text-black/40 transition-colors uppercase tracking-widest">{item.date}</span>
                                                    <ArrowUpRight className="w-5 h-5 text-white/40 group-hover:text-black transition-colors opacity-0 group-hover:opacity-100" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Container>
                </Section>
            </main>
            <Footer />
        </>
    );
}
