"use client";

import Link from "next/link";
import Image from "next/image";
import { Container, Section } from "@/components/ui/container";
import { H1, H2, H3, Text, Label } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

// Add these for the 3D background
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { PixelatedTesseract } from "@/components/3d/PixelatedTesseract";

export default function WorkPage() {
    return (
        <>
            <Navbar />
            <main className="bg-void min-h-screen pt-20">
                {/* HERO with 3D 4D Tesseract Background */}
                <Section className="relative min-h-[80vh] flex items-center overflow-hidden">
                    {/* The immersive 3D background */}
                    <div className="absolute inset-0 z-0 translate-x-[50px]">
                        <Canvas camera={{ position: [0, 0, 7], fov: 60 }}>
                            <ambientLight intensity={0.5} />
                            <PixelatedTesseract pixelSize={3} size={4.0} />
                            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                        </Canvas>
                    </div>

                    {/* Content layered on top */}
                    <Container className="relative z-10 pointer-events-none">
                        <Label className="text-lavender mb-2 block">03 — Work</Label>
                        <H1 className="mb-8 type-mega text-white max-w-4xl tracking-tight leading-tight mix-blend-difference">
                            Selected work.
                        </H1>
                    </Container>

                    {/* Fade out gradient at the bottom to transition smoothly to the content below */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-void to-transparent z-10 pointer-events-none" />
                </Section>

                {/* CityzenAdvisors */}
                <Section className="border-t border-white/10">
                    <Container>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                            <div className="md:col-span-5">
                                <H2 className="type-h2 mb-2 text-white">CityzenAdvisors</H2>
                                <Label className="text-stone mb-8 block">Buyer-side real estate advisory · Lisbon</Label>

                                <blockquote className="border-l-2 border-lavender pl-6 mb-8">
                                    <Text className="type-h3 text-white italic mb-4">
                                        "Working with someone who was actually on our side changed everything."
                                    </Text>
                                    <footer className="type-caption text-stone">
                                        — Natalia, Co-founder
                                    </footer>
                                </blockquote>
                            </div>
                            <div className="md:col-span-7 aspect-[4/3] bg-white/[0.02] border border-white/10 rounded-sm relative group overflow-hidden">
                                <Image
                                    src="/work/cityzen.png"
                                    alt="CityzenAdvisors Live Site"
                                    fill
                                    className="object-cover object-top"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-lavender/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                <a href="https://www.cityzenadvisors.com" target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-20 cursor-pointer">
                                    <span className="sr-only">Visit CityzenAdvisors website</span>
                                </a>
                            </div>
                        </div>
                    </Container>
                </Section>

                {/* Thyme Travellers Lab */}
                <Section className="py-24 bg-deep-ink/30 border-y border-white/10">
                    <Container>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                            <div className="md:col-span-7 aspect-[4/3] bg-white/[0.02] border border-white/10 rounded-sm flex items-center justify-center relative group overflow-hidden order-2 md:order-1">
                                <Image
                                    src="/work/thyme.png"
                                    alt="Thyme Travellers Lab Instagram"
                                    fill
                                    className="object-cover object-top"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-lavender/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                <a href="https://www.instagram.com/thyme.travellers.lab/" target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-20 cursor-pointer">
                                    <span className="sr-only">Visit Thyme Travellers Lab Instagram</span>
                                </a>
                            </div>
                            <div className="md:col-span-5 order-1 md:order-2">
                                <H2 className="type-h2 mb-2 text-white">Thyme Travellers Lab</H2>
                                <Label className="text-stone mb-8 block">Strategy · Ops · Bus Dev · Content</Label>

                                <Text className="type-body text-stone">
                                    We drive comprehensive strategy, streamline operations, spearhead business development, and craft custom content creation to amplify their footprint and accelerate growth.
                                </Text>
                            </div>
                        </div>
                    </Container>
                </Section>

                {/* Viepure */}
                <Section className="py-24 border-b border-white/10">
                    <Container>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                            <div className="md:col-span-5">
                                <H2 className="type-h2 mb-2 text-white">Viepure.co</H2>
                                <Label className="text-stone mb-8 block">Passion Project · Leï</Label>

                                <Text className="type-body text-stone border-l-2 border-lavender pl-6">
                                    A side company founded by Leï as a passion project, dedicating creative energy to building a compelling and elegant brand from the ground up.
                                </Text>
                            </div>
                            <div className="md:col-span-7 aspect-[4/3] bg-white/[0.02] border border-white/10 rounded-sm relative group overflow-hidden">
                                <Image
                                    src="/work/viepure.png"
                                    alt="Viepure Live Site"
                                    fill
                                    className="object-cover object-top"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-lavender/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                <a href="https://www.viepure.co" target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-20 cursor-pointer">
                                    <span className="sr-only">Visit Viepure website</span>
                                </a>
                            </div>
                        </div>
                    </Container>
                </Section>

                {/* Holding Statement CTA */}
                <Section className="py-32">
                    <Container className="flex flex-col items-center text-center">
                        <Text className="type-body text-stone mb-4">More work is in progress.</Text>
                        <H2 className="type-h2 mb-12 max-w-2xl text-white">
                            Book a conversation and we'll share relevant examples directly.
                        </H2>
                        <Button size="lg" className="type-cta" asChild>
                            <Link href="/contact">Book a conversation</Link>
                        </Button>
                    </Container>
                </Section>
            </main>
            <Footer />
        </>
    );
}
