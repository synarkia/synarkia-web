import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container, Section } from "@/components/ui/container";
import { Text, Label } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

export default function Contact() {
    return (
        <>
            <Navbar />
            <main className="bg-void min-h-screen pt-32 pb-20 flex flex-col justify-center">
                <Section>
                    <Container>
                        <div className="max-w-4xl mx-auto text-center mb-16">
                            <Label className="text-saffron mb-8">Initiate Sequence</Label>
                            <h1 className="type-mega text-white mb-8">
                                Let&apos;s Build<br />
                                The Future.
                            </h1>
                            <Text className="text-xl md:text-2xl text-stone max-w-2xl mx-auto">
                                We engage with a limited number of partners each quarter. Tell us about your vision.
                            </Text>
                        </div>

                        <div className="max-w-xl mx-auto bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-[2rem]">
                            <form className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-stone/50">Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-void border-b border-white/20 py-4 text-xl text-white placeholder-white/10 focus:outline-none focus:border-saffron transition-colors"
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-stone/50">Email</label>
                                    <input
                                        type="email"
                                        className="w-full bg-void border-b border-white/20 py-4 text-xl text-white placeholder-white/10 focus:outline-none focus:border-saffron transition-colors"
                                        placeholder="john@company.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-stone/50">Details</label>
                                    <textarea
                                        rows={4}
                                        className="w-full bg-void border-b border-white/20 py-4 text-xl text-white placeholder-white/10 focus:outline-none focus:border-saffron transition-colors resize-none"
                                        placeholder="Tell us about the project..."
                                    />
                                </div>
                                <Button size="lg" className="w-full bg-white text-black hover:bg-white/90 rounded-full h-16 text-lg tracking-widest uppercase">
                                    Submit Request
                                </Button>
                            </form>
                        </div>

                        <div className="mt-24 text-center">
                            <p className="text-stone/40 text-sm uppercase tracking-widest font-mono">
                                Lisbon • London • Dubai
                            </p>
                            <a href="mailto:hello@synarkia.com" className="text-2xl font-serif text-white hover:text-saffron transition-colors block mt-4">
                                hello@synarkia.com
                            </a>
                        </div>
                    </Container>
                </Section>
            </main>
            <Footer />
        </>
    );
}
