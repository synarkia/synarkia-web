import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { H2, Text, Label } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const roles = [
    { title: "Legal", desc: "Sovereign structures. IP protection. Global tax efficiency." },
    { title: "Finance", desc: "Fractional CFOs. Fundraising strategy. M&A advisory." },
    { title: "Growth", desc: "Paid acquisition experts. SEO architects. Viral engineers." },
    { title: "Product", desc: "Full-stack dev teams. AI engineers. UX researchers." },
    { title: "Media", desc: "Video production. Podcast scaling. Personal brand PR." },
    { title: "Space", desc: "Interior design. Office procurement. Retreat planning." }
];

export default function Allies() {
    return (
        <>
            <Navbar />
            <main className="bg-white text-black min-h-screen pt-32 pb-20 selection:bg-black selection:text-white">
                {/* HERO */}
                <Section className="py-24 md:py-40 border-b border-black/10">
                    <Container>
                        <Label className="text-black/40 mb-8">network_01</Label>
                        <h1 className="type-mega text-black mb-8 leading-[0.85]">
                            The Alliance
                        </h1>
                        <Text className="text-xl md:text-3xl font-serif text-black leading-tight max-w-3xl">
                            We are not a traditional agency. We are a decentralized node for sovereign operators.
                        </Text>
                    </Container>
                </Section>

                {/* ROLES GRID */}
                <Section className="py-24">
                    <Container>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                            {roles.map((role, i) => (
                                <div key={i} className="group border-t border-black/10 pt-6 hover:border-black transition-colors">
                                    <div className="flex justify-between items-baseline mb-4">
                                        <H2 className="text-3xl font-serif text-black group-hover:text-black transition-colors">{role.title}</H2>
                                        <span className="text-xs font-mono text-black/40">0{i + 1}</span>
                                    </div>
                                    <Text className="text-black/60 text-lg mb-8">{role.desc}</Text>
                                    <div className="h-px w-0 bg-black group-hover:w-full transition-all duration-500" />
                                </div>
                            ))}
                        </div>
                    </Container>
                </Section>

                {/* JOIN CTA */}
                <Section className="py-32 bg-black text-white">
                    <Container className="flex flex-col items-center text-center">
                        <Label className="mb-8 opacity-50">Join the Node</Label>
                        <H2 className="text-white mb-8">Are you an operator?</H2>
                        <Text className="text-white/60 max-w-lg mb-12">
                            We are always looking for elite talent to add to our network. If you are top 1% in your field, let&apos;s talk.
                        </Text>
                        <Button className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-12" asChild>
                            <Link href="/contact">Apply for Alliance</Link>
                        </Button>
                    </Container>
                </Section>
            </main>
            <Footer />
        </>
    );
}
