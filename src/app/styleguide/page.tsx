"use client";

import { motion } from "framer-motion";
import { Container, Section } from "@/components/ui/container";
import { Label } from "@/components/ui/typography";

/* ─── Animation Variants ────────────────────────────────────── */
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut", delay: i * 0.08 },
    }),
};

const stagger = {
    visible: { transition: { staggerChildren: 0.07 } },
};

/* ─── Color Data ─────────────────────────────────────────────── */
const deepBase = [
    { name: "Void", hex: "#0C0A12", role: "Primary background", tw: "bg-void" },
    { name: "Deep Ink", hex: "#141020", role: "Card surfaces", tw: "bg-deep-ink" },
    { name: "Twilight", hex: "#1C1830", role: "Elevated surfaces", tw: "bg-twilight" },
    { name: "Dusk", hex: "#2A2440", role: "Hover / active states", tw: "bg-dusk" },
];

const luminousAccents = [
    { name: "Lavender", hex: "#B8A9E8", role: "Primary accent", tw: "bg-lavender" },
    { name: "Lavender Soft", hex: "#9B88D4", role: "Secondary accent", tw: "bg-lavender-soft" },
    { name: "Saffron", hex: "#E8B84A", role: "Warm highlight", tw: "bg-saffron" },
    { name: "Saffron Warm", hex: "#D4A63C", role: "Warm secondary", tw: "bg-saffron-warm" },
];

const warmNeutrals = [
    { name: "Cream", hex: "#E8E0D4", role: "Primary text", tw: "bg-cream" },
    { name: "Stone", hex: "#C8BFB0", role: "Secondary text", tw: "bg-stone" },
    { name: "Sand", hex: "#A89F90", role: "Tertiary text", tw: "bg-sand" },
    { name: "Haze", hex: "#9890A8", role: "Cool neutral", tw: "bg-haze" },
    { name: "Muted", hex: "#6A6278", role: "Disabled / hint", tw: "bg-muted" },
];

/* ─── Typography Data ────────────────────────────────────────── */
const typeScale = [
    { role: "Display", specimen: "Complex Reality", font: "Instrument Serif", weight: "400", sizeLabel: "64 – 88 px", className: "font-serif text-[clamp(3.5rem,8vw,5.5rem)] leading-[0.9] tracking-[-0.04em]" },
    { role: "H1", specimen: "The Elevated Work", font: "Instrument Serif", weight: "400", sizeLabel: "40 – 48 px", className: "font-serif text-[clamp(2.5rem,5vw,3rem)] leading-[1] tracking-tight" },
    { role: "H2", specimen: "Strategic Clarity", font: "Instrument Serif", weight: "400", sizeLabel: "28 – 32 px", className: "font-serif text-[clamp(1.75rem,3vw,2rem)] leading-[1.1] tracking-tight" },
    { role: "H3", specimen: "Offer Architecture", font: "Instrument Serif", weight: "400", sizeLabel: "22 – 24 px", className: "font-serif text-[clamp(1.375rem,2.5vw,1.5rem)] leading-[1.2]" },
    { role: "Body", specimen: "Synarkia builds execution systems for ventures that need presence, not personality.", font: "Instrument Sans", weight: "400", sizeLabel: "15 – 16 px", className: "font-sans text-[15px] md:text-base leading-relaxed" },
    { role: "Body Emphasis", specimen: "Precision over performance. Structure over spectacle.", font: "Instrument Sans", weight: "500", sizeLabel: "15 – 16 px", className: "font-sans text-[15px] md:text-base leading-relaxed font-medium" },
    { role: "Caption", specimen: "Updated Feb 2026 · 3 min read", font: "Instrument Sans", weight: "400", sizeLabel: "12 – 13 px", className: "font-sans text-[12px] md:text-[13px] leading-normal text-white/50" },
    { role: "Label", specimen: "DESIGN SYSTEM", font: "Instrument Sans", weight: "600", sizeLabel: "11 px", className: "font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-saffron" },
    { role: "Nav", specimen: "Studio  Labs  Alliance  Contact", font: "Instrument Sans", weight: "500", sizeLabel: "14 px", className: "font-sans text-sm font-medium tracking-wide text-white/70" },
];

/* ─── Helpers ────────────────────────────────────────────────── */
function Divider() {
    return (
        <div
            className="w-full h-px my-0"
            style={{
                background:
                    "linear-gradient(90deg, transparent 0%, var(--color-lavender) 30%, var(--color-saffron) 70%, transparent 100%)",
                opacity: 0.2,
            }}
        />
    );
}

function ColorGroup({
    title,
    colors,
}: {
    title: string;
    colors: typeof deepBase;
}) {
    return (
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
            <motion.h4 variants={fadeUp} className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-6">
                {title}
            </motion.h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                {colors.map((c, i) => {
                    const isLight = luminousAccents.includes(c) || warmNeutrals.includes(c);
                    return (
                        <motion.div
                            key={c.hex}
                            custom={i}
                            variants={fadeUp}
                            className="group relative rounded-2xl overflow-hidden border border-white/[0.06] hover:border-lavender/30 transition-colors duration-500"
                        >
                            {/* Swatch */}
                            <div
                                className="h-24 w-full transition-transform duration-500 group-hover:scale-[1.03]"
                                style={{ backgroundColor: c.hex }}
                            />

                            {/* Info */}
                            <div className="p-3 bg-deep-ink/80 backdrop-blur-sm">
                                <p className={`text-xs font-medium mb-0.5 ${isLight ? "text-white" : "text-white/80"}`}>
                                    {c.name}
                                </p>
                                <p className="text-[10px] font-mono text-white/40 mb-1">{c.hex}</p>
                                <p className="text-[10px] text-white/30">{c.role}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function BrandPage() {
    return (
        <main className="relative bg-void min-h-screen overflow-x-hidden">
            {/* ── Hero ──────────────────────────────────────────── */}
            <section className="relative flex flex-col items-center justify-center min-h-[70vh] pt-32 pb-20 px-4">
                {/* Radial glow */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[160px] pointer-events-none"
                    style={{ background: "radial-gradient(ellipse, rgba(184,169,232,0.12) 0%, transparent 70%)" }}
                />

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                    className="relative z-10 text-center max-w-3xl mx-auto"
                >
                    <motion.div variants={fadeUp}>
                        <Label className="text-saffron mb-8 inline-block">Design System</Label>
                    </motion.div>

                    <motion.h1
                        variants={fadeUp}
                        custom={1}
                        className="font-serif text-[clamp(3rem,10vw,6rem)] leading-[0.9] tracking-[-0.04em] text-white mb-8"
                    >
                        Visual Identity
                    </motion.h1>

                    <motion.p
                        variants={fadeUp}
                        custom={2}
                        className="font-sans text-lg md:text-xl text-white/50 leading-relaxed font-light max-w-xl mx-auto"
                    >
                        The complete design language of Synarkia — colors, typography, composition, motion, and atmosphere. This page both documents and demonstrates the system.
                    </motion.p>
                </motion.div>
            </section>

            <Divider />

            {/* ── Color Palette ─────────────────────────────────── */}
            <Section>
                <Container size="xl">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
                        <motion.div variants={fadeUp}>
                            <Label className="text-saffron">01</Label>
                        </motion.div>
                        <motion.h2 variants={fadeUp} custom={1} className="font-serif text-4xl md:text-6xl tracking-tight text-white mb-4">
                            Color Palette
                        </motion.h2>
                        <motion.p variants={fadeUp} custom={2} className="font-sans text-lg text-white/50 font-light max-w-2xl mb-16">
                            Every surface and accent maps to this palette. Deep bases create immersion; luminous accents guide the eye; warm neutrals carry the text.
                        </motion.p>
                    </motion.div>

                    <div className="space-y-12">
                        <ColorGroup title="Deep Base" colors={deepBase} />
                        <ColorGroup title="Luminous Accents" colors={luminousAccents} />
                        <ColorGroup title="Warm Neutrals (Text & Texture)" colors={warmNeutrals} />
                    </div>
                </Container>
            </Section>

            <Divider />

            {/* ── Typography Scale ──────────────────────────────── */}
            <Section>
                <Container size="xl">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
                        <motion.div variants={fadeUp}>
                            <Label className="text-saffron">02</Label>
                        </motion.div>
                        <motion.h2 variants={fadeUp} custom={1} className="font-serif text-4xl md:text-6xl tracking-tight text-white mb-4">
                            Typography
                        </motion.h2>
                        <motion.p variants={fadeUp} custom={2} className="font-sans text-lg text-white/50 font-light max-w-2xl mb-16">
                            Two typefaces, one intention. <span className="font-serif italic text-white/70">Instrument Serif</span> anchors headings with quiet authority. <span className="text-white/70">Instrument Sans</span> carries body text with clean precision.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={stagger}
                        className="space-y-1"
                    >
                        {typeScale.map((t, i) => (
                            <motion.div
                                key={t.role}
                                custom={i}
                                variants={fadeUp}
                                className="group grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 md:gap-8 py-6 border-b border-white/[0.06] last:border-b-0 items-baseline"
                            >
                                {/* Meta */}
                                <div className="flex flex-col gap-1">
                                    <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-lavender">
                                        {t.role}
                                    </span>
                                    <span className="font-sans text-[10px] text-white/30">
                                        {t.sizeLabel} · {t.font} · {t.weight}
                                    </span>
                                </div>

                                {/* Specimen */}
                                <p className={`text-white ${t.className}`}>{t.specimen}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </Container>
            </Section>

            <Divider />

            {/* ── Layout & Composition ──────────────────────────── */}
            <Section>
                <Container size="xl">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
                        <motion.div variants={fadeUp}>
                            <Label className="text-saffron">03</Label>
                        </motion.div>
                        <motion.h2 variants={fadeUp} custom={1} className="font-serif text-4xl md:text-6xl tracking-tight text-white mb-4">
                            Layout &amp; Composition
                        </motion.h2>
                        <motion.p variants={fadeUp} custom={2} className="font-sans text-lg text-white/50 font-light max-w-2xl mb-16">
                            Strong vertical rhythm, generous white space, and a modular card system create a layout that breathes.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={stagger}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        {[
                            { title: "8 px Grid", desc: "Every spacing value is a multiple of 8. Padding, margins, gaps — all snap to the grid.", icon: "⊞" },
                            { title: "960 / 1200", desc: "Content stays at 960px. Full-width sections extend to 1200px. Nothing touches the edges.", icon: "↔" },
                            { title: "White Space", desc: "\"White space is structural, not decorative — it signals confidence.\" Space is an active design element.", icon: "◻" },
                        ].map((card, i) => (
                            <motion.div
                                key={card.title}
                                custom={i}
                                variants={fadeUp}
                                className="group rounded-2xl border border-white/[0.06] hover:border-lavender/20 bg-deep-ink/50 p-8 transition-all duration-500"
                            >
                                <span className="text-2xl mb-4 block opacity-40 group-hover:opacity-70 transition-opacity">{card.icon}</span>
                                <h4 className="font-serif text-xl text-white mb-2">{card.title}</h4>
                                <p className="font-sans text-sm text-white/40 leading-relaxed">{card.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Card System Demo */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={stagger}
                        className="mt-16"
                    >
                        <motion.h4 variants={fadeUp} className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-6">
                            Modular Card System
                        </motion.h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.div variants={fadeUp} custom={0} className="rounded-2xl border border-white/[0.06] bg-deep-ink/40 p-10 min-h-[200px] flex flex-col justify-end">
                                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-lavender/60 mb-2">Standard Card</span>
                                <p className="font-serif text-2xl text-white">Content lives here</p>
                                <p className="font-sans text-sm text-white/40 mt-2">Border: 1px white at 6% opacity. Radius: 16px. Padding: 40px.</p>
                            </motion.div>
                            <motion.div
                                variants={fadeUp}
                                custom={1}
                                className="rounded-2xl border border-lavender/20 p-10 min-h-[200px] flex flex-col justify-end relative overflow-hidden"
                                style={{ background: "linear-gradient(135deg, rgba(184,169,232,0.06) 0%, rgba(12,10,18,0.8) 100%)" }}
                            >
                                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-saffron/60 mb-2">Accent Card</span>
                                <p className="font-serif text-2xl text-white">With lavender glow</p>
                                <p className="font-sans text-sm text-white/40 mt-2">Border: lavender at 20%. Background: gradient with subtle accent.</p>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Divider Demo */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={stagger}
                        className="mt-16"
                    >
                        <motion.h4 variants={fadeUp} className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-6">
                            Gradient-Fade Divider
                        </motion.h4>
                        <motion.div variants={fadeUp}>
                            <Divider />
                            <p className="font-sans text-sm text-white/30 mt-4">
                                Thin gradient line: transparent → lavender → saffron → transparent. Opacity: 20%.
                            </p>
                        </motion.div>
                    </motion.div>
                </Container>
            </Section>

            <Divider />

            {/* ── Imagery & Graphics ────────────────────────────── */}
            <Section>
                <Container size="xl">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
                        <motion.div variants={fadeUp}>
                            <Label className="text-saffron">04</Label>
                        </motion.div>
                        <motion.h2 variants={fadeUp} custom={1} className="font-serif text-4xl md:text-6xl tracking-tight text-white mb-4">
                            Imagery &amp; Graphics
                        </motion.h2>
                        <motion.p variants={fadeUp} custom={2} className="font-sans text-lg text-white/50 font-light max-w-2xl mb-16">
                            Visual material follows a strict editorial sensibility. Everything must feel intentional, tactile, and composed.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={stagger}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        {/* Allowed */}
                        <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.06] bg-deep-ink/40 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-2 h-2 rounded-full bg-lavender" />
                                <h4 className="font-sans text-sm font-semibold uppercase tracking-[0.15em] text-lavender">Allowed</h4>
                            </div>
                            <ul className="space-y-3">
                                {[
                                    "Minimal sacred geometry — thin lines, low opacity, as structural accents",
                                    "Abstract diagrams — network maps, flow charts, system maps",
                                    "Architecture photography — monochrome or desaturated, strong contrast",
                                    "Light & shadow compositions — natural, high-contrast, cinematic",
                                    "Craft close-ups — hands working, tools, materials, texture studies",
                                ].map((item) => (
                                    <li key={item} className="font-sans text-sm text-white/50 leading-relaxed pl-4 border-l border-lavender/20">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Forbidden */}
                        <motion.div variants={fadeUp} custom={1} className="rounded-2xl border border-white/[0.06] bg-deep-ink/40 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-2 h-2 rounded-full bg-saffron" />
                                <h4 className="font-sans text-sm font-semibold uppercase tracking-[0.15em] text-saffron">Forbidden</h4>
                            </div>
                            <ul className="space-y-3">
                                {[
                                    "Generic stock photography — office scenes, staged handshakes, laptop flatlay",
                                    "Character illustrations — cartoon style, mascots, pixel art",
                                    "Emojis or decorative icons in body content",
                                    "Psychedelic or fractal-heavy visuals",
                                    "Smiling portraits or lifestyle photography",
                                ].map((item) => (
                                    <li key={item} className="font-sans text-sm text-white/50 leading-relaxed pl-4 border-l border-saffron/20">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>
                </Container>
            </Section>

            <Divider />

            {/* ── Motion & Interaction ──────────────────────────── */}
            <Section>
                <Container size="xl">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
                        <motion.div variants={fadeUp}>
                            <Label className="text-saffron">05</Label>
                        </motion.div>
                        <motion.h2 variants={fadeUp} custom={1} className="font-serif text-4xl md:text-6xl tracking-tight text-white mb-4">
                            Motion &amp; Interaction
                        </motion.h2>
                        <motion.p variants={fadeUp} custom={2} className="font-sans text-lg text-white/50 font-light max-w-2xl mb-16">
                            Animation exists to reveal, not to entertain. Every transition should feel like a curtain drawing — slow, deliberate, inevitable.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={stagger}
                        className="space-y-4"
                    >
                        {[
                            { spec: "Fade-Up on Scroll", value: "translateY(30px) → 0 · opacity 0 → 1", timing: "0.6 – 0.8s ease-out" },
                            { spec: "Staggered Grid", value: "50 – 100ms delay between siblings", timing: "Sequential reveal" },
                            { spec: "Hover States", value: "Border opacity shift · scale 1.03 · color transitions", timing: "300 – 500ms" },
                            { spec: "Smooth Scroll", value: "Lenis library · lerp-based interpolation", timing: "Continuous" },
                            { spec: "Page Transitions", value: "Fade between routes · no slide animations", timing: "0.4 – 0.6s" },
                        ].map((row, i) => (
                            <motion.div
                                key={row.spec}
                                custom={i}
                                variants={fadeUp}
                                className="grid grid-cols-1 md:grid-cols-[200px_1fr_160px] gap-2 md:gap-6 py-5 border-b border-white/[0.06] items-baseline"
                            >
                                <span className="font-sans text-sm font-medium text-white">{row.spec}</span>
                                <span className="font-sans text-sm text-white/40">{row.value}</span>
                                <span className="font-mono text-xs text-lavender/60">{row.timing}</span>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Anti-patterns */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={fadeUp}
                        className="mt-12 rounded-2xl border border-saffron/10 bg-saffron/[0.03] p-8"
                    >
                        <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-saffron/60 mb-4">
                            Anti-Patterns
                        </h4>
                        <p className="font-sans text-sm text-white/40 leading-relaxed">
                            No bouncing, springing, or elastic easing. No attention-seeking looping animations. No parallax scrolling. No rapid-fire micro-interactions. Motion should never compete with content — it should serve it.
                        </p>
                    </motion.div>
                </Container>
            </Section>

            <Divider />

            {/* ── Atmosphere ────────────────────────────────────── */}
            <Section>
                <Container size="xl">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
                        <motion.div variants={fadeUp}>
                            <Label className="text-saffron">06</Label>
                        </motion.div>
                        <motion.h2 variants={fadeUp} custom={1} className="font-serif text-4xl md:text-6xl tracking-tight text-white mb-4">
                            Atmosphere
                        </motion.h2>
                        <motion.p variants={fadeUp} custom={2} className="font-sans text-lg text-white/50 font-light max-w-2xl mb-16">
                            The feel of the interface — a subtle grain, positioned glows, and the absence of distraction.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={stagger}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        {/* Grain */}
                        <motion.div variants={fadeUp} className="rounded-2xl border border-white/[0.06] bg-deep-ink/40 p-8 flex flex-col">
                            <h4 className="font-serif text-xl text-white mb-3">CSS Grain</h4>
                            <p className="font-sans text-sm text-white/40 leading-relaxed mb-4 flex-1">
                                SVG turbulence filter applied as a fixed overlay across the viewport. Adds tactile warmth without visual noise.
                            </p>
                            <div className="font-mono text-[10px] text-lavender/50 space-y-1">
                                <p>opacity: 0.03 (3%)</p>
                                <p>position: fixed</p>
                                <p>pointer-events: none</p>
                                <p>z-index: 50</p>
                            </div>
                        </motion.div>

                        {/* Radial Glows */}
                        <motion.div variants={fadeUp} custom={1} className="rounded-2xl border border-white/[0.06] bg-deep-ink/40 p-8 flex flex-col relative overflow-hidden">
                            {/* Live glow demo */}
                            <div
                                className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[80px] pointer-events-none"
                                style={{ background: "radial-gradient(circle, rgba(184,169,232,0.15) 0%, transparent 70%)" }}
                            />
                            <h4 className="font-serif text-xl text-white mb-3 relative z-10">Radial Glows</h4>
                            <p className="font-sans text-sm text-white/40 leading-relaxed mb-4 flex-1 relative z-10">
                                Asymmetrical radial gradients in lavender or saffron, positioned off-center. They create depth without distraction.
                            </p>
                            <div className="font-mono text-[10px] text-lavender/50 space-y-1 relative z-10">
                                <p>blur: 120 – 200px</p>
                                <p>opacity: 8 – 15%</p>
                                <p>position: asymmetric</p>
                            </div>
                        </motion.div>

                        {/* No Parallax */}
                        <motion.div variants={fadeUp} custom={2} className="rounded-2xl border border-saffron/10 bg-saffron/[0.03] p-8 flex flex-col">
                            <h4 className="font-serif text-xl text-white mb-3">No Parallax</h4>
                            <p className="font-sans text-sm text-white/40 leading-relaxed mb-4 flex-1">
                                Parallax scrolling is explicitly forbidden. It creates cognitive friction and undermines the sense of grounded precision that defines Synarkia.
                            </p>
                            <div className="font-mono text-[10px] text-saffron/50 space-y-1">
                                <p>parallax: never</p>
                                <p>scroll-based transforms: none</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </Container>
            </Section>

            <Divider />

            {/* ── Glow Effects & Borders ────────────────────────── */}
            <Section>
                <Container size="xl">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
                        <motion.div variants={fadeUp}>
                            <Label className="text-saffron">07</Label>
                        </motion.div>
                        <motion.h2 variants={fadeUp} custom={1} className="font-serif text-4xl md:text-6xl tracking-tight text-white mb-4">
                            Glow Effects &amp; Borders
                        </motion.h2>
                        <motion.p variants={fadeUp} custom={2} className="font-sans text-lg text-white/50 font-light max-w-2xl mb-16">
                            Interactive surfaces come alive through light. Borders shift on hover; glows breathe around focal points.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={stagger}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        {/* Lavender Glow */}
                        <motion.div
                            variants={fadeUp}
                            className="group relative rounded-2xl border border-white/[0.06] hover:border-lavender/30 bg-deep-ink/40 p-10 min-h-[240px] flex flex-col justify-end overflow-hidden transition-all duration-500 cursor-pointer"
                        >
                            <div
                                className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                                style={{ background: "radial-gradient(circle, rgba(184,169,232,0.2) 0%, transparent 60%)" }}
                            />
                            <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-lavender/50 mb-2 relative z-10">Hover to activate</span>
                            <h4 className="font-serif text-2xl text-white relative z-10">Lavender Glow</h4>
                            <p className="font-sans text-sm text-white/40 mt-2 relative z-10">
                                border: white/6% → lavender/30% · background glow: lavender at 20% · blur: 100px
                            </p>
                        </motion.div>

                        {/* Saffron Glow */}
                        <motion.div
                            variants={fadeUp}
                            custom={1}
                            className="group relative rounded-2xl border border-white/[0.06] hover:border-saffron/30 bg-deep-ink/40 p-10 min-h-[240px] flex flex-col justify-end overflow-hidden transition-all duration-500 cursor-pointer"
                        >
                            <div
                                className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                                style={{ background: "radial-gradient(circle, rgba(232,184,74,0.2) 0%, transparent 60%)" }}
                            />
                            <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-saffron/50 mb-2 relative z-10">Hover to activate</span>
                            <h4 className="font-serif text-2xl text-white relative z-10">Saffron Glow</h4>
                            <p className="font-sans text-sm text-white/40 mt-2 relative z-10">
                                border: white/6% → saffron/30% · background glow: saffron at 20% · blur: 100px
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Border States */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={stagger}
                        className="mt-12"
                    >
                        <motion.h4 variants={fadeUp} className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-6">
                            Border States
                        </motion.h4>
                        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="rounded-2xl border border-white/[0.06] bg-deep-ink/40 p-6 text-center">
                                <p className="font-sans text-xs text-white/30 mb-2">Default</p>
                                <p className="font-mono text-[11px] text-white/50">border-white/6%</p>
                            </div>
                            <div className="rounded-2xl border border-lavender/20 bg-deep-ink/40 p-6 text-center">
                                <p className="font-sans text-xs text-lavender/60 mb-2">Hover</p>
                                <p className="font-mono text-[11px] text-white/50">border-lavender/20%</p>
                            </div>
                            <div className="rounded-2xl border border-lavender/40 bg-deep-ink/40 p-6 text-center shadow-[0_0_30px_rgba(184,169,232,0.1)]">
                                <p className="font-sans text-xs text-lavender mb-2">Active / Focus</p>
                                <p className="font-mono text-[11px] text-white/50">border-lavender/40% + glow</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </Container>
            </Section>

            <Divider />

            {/* ── Footer / Colophon ─────────────────────────────── */}
            <section className="py-24 px-4">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="text-center max-w-md mx-auto"
                >
                    <p className="font-serif italic text-2xl text-white/40 mb-6">
                        &ldquo;Presence, not personality.&rdquo;
                    </p>
                    <p className="font-sans text-xs text-white/20 uppercase tracking-[0.2em]">
                        Synarkia Visual Identity · Feb 2026
                    </p>
                </motion.div>
            </section>
        </main>
    );
}
