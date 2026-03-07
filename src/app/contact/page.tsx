import { Container, Section } from "@/components/ui/container";
import { H1, H2, H3, Text, Label } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ContactPage() {
    return (
        <>
            <Navbar />
            <main className="bg-void min-h-screen pt-20">
                <Section className="py-20 md:py-32 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-lavender/5 rounded-full blur-[120px] pointer-events-none" />
                    <Container>
                        <Label className="text-lavender">04 — Contact</Label>
                        <H1 className="mb-8 type-mega text-white">
                            Start here.
                        </H1>
                        <Text className="max-w-2xl mb-12 type-body text-stone">
                            Every engagement begins with conversation.
                        </Text>
                    </Container>
                </Section>

                <Section className="border-t border-white/10">
                    <Container>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
                            {/* Left Column: Clarity Call & What to Expect */}
                            <div className="space-y-16">
                                <div>
                                    <H2 className="type-h2 mb-6 text-white">Clarity Call</H2>
                                    <Text className="type-body text-stone mb-6">
                                        <strong className="text-white">30 minutes. Free.</strong><br />
                                        A focused conversation about where you are and what you need.<br />
                                        No pitch. You leave with a direction.
                                    </Text>
                                    <Button size="lg" className="type-cta" asChild>
                                        <Link href="https://calendly.com/" target="_blank" rel="noopener noreferrer">
                                            Book a call <ArrowRight className="w-4 h-4 ml-2" />
                                        </Link>
                                    </Button>
                                </div>
                                <div className="p-8 border border-white/10 bg-deep-ink/30 rounded-sm glass-panel">
                                    <H3 className="type-h3 text-lavender mb-6">What to Expect</H3>
                                    <ul className="space-y-4 type-body text-stone list-disc list-inside">
                                        <li>Before our call, we review your business — website, presence, landscape.</li>
                                        <li>During the call, we listen and assess. No pitching.</li>
                                        <li>If there's a fit, we propose a 60-minute onboarding session to map your full picture through the CILTPC framework.</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Right Column: Contact Form */}
                            <div>
                                <H2 className="type-h2 mb-6 text-white">Or, just tell us what you're working on.</H2>
                                <form className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="type-caption text-stone block mb-2">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="w-full bg-void border border-white/20 p-4 rounded-sm text-white focus:outline-none focus:border-lavender transition-colors type-body"
                                            placeholder="Jane Doe"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="type-caption text-stone block mb-2">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full bg-void border border-white/20 p-4 rounded-sm text-white focus:outline-none focus:border-lavender transition-colors type-body"
                                            placeholder="jane@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="type-caption text-stone block mb-2">What are you building?</label>
                                        <textarea
                                            id="message"
                                            rows={5}
                                            className="w-full bg-void border border-white/20 p-4 rounded-sm text-white focus:outline-none focus:border-lavender transition-colors resize-none type-body"
                                            placeholder="Tell us about your project, your challenges, and what you're looking to achieve."
                                        ></textarea>
                                    </div>
                                    <Button size="lg" className="w-full type-cta" type="button">
                                        Send
                                    </Button>
                                    <Text className="type-caption text-stone text-center mt-4">
                                        We respond within 48 hours.
                                    </Text>
                                </form>
                            </div>
                        </div>

                        <div className="mt-32 text-center border-t border-white/10 pt-16">
                            <Text className="type-h3 text-white">
                                Don't know what you need? That's exactly what the call is for.
                            </Text>
                        </div>
                    </Container>
                </Section>
            </main>
            <Footer />
        </>
    );
}
