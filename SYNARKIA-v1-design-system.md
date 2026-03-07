# SYNARKIA — Design System & Style Guide v1

The visual identity for synarkia.com — colors, typography, layout, motion, and atmosphere.

---

## Color Palette

### Backgrounds

Void — #0C0A12 — Primary background, the canvas
Deep Ink — #141020 — Cards, panels, elevated surfaces
Twilight — #1C1830 — Hover states, active backgrounds
Dusk — #2A2440 — Borders, subtle containers

### Accents (used sparingly, less than 10% of any layout)

Lavender — #B8A9E8 — Primary accent: links, emphasis, italic headings
Lavender Soft — #9B88D4 — Secondary lavender: labels, borders
Saffron — #E8B84A — Warm accent: section numbers, key highlights, CTAs
Saffron Warm — #D4A63C — Hover/active state of saffron

### Text

Cream — #E8E0D4 — Primary text, headings
Stone — #C8BFB0 — Body text, longer passages
Sand — #A89F90 — Captions, metadata, tertiary info
Haze — #9890A8 — Secondary body text, cool neutral bridge
Muted — #6A6278 — Disabled states, very low emphasis

### Borders

Default: rgba(184, 169, 232, 0.08)
Active/Hover: rgba(184, 169, 232, 0.20)

### Glow Effects

Lavender glow: rgba(184, 169, 232, 0.12) — radial gradients for atmospheric depth
Saffron glow: rgba(232, 184, 74, 0.10) — warm light bleeds

Glows are positioned asymmetrically across page sections, creating the sense of distant light sources in a dark space.

---

## Typography

The type system is the voice of the brand. Each font carries a specific role in the communication hierarchy — together they perform the service offering typographically.

### Font Stack

Logotype — Wix Madefor Display — 700, ALL CAPS, letter-spacing 0.35em
The brand. Identity.

Headings — Instrument Serif — 400, regular (italic for brand emphasis moments)
The strategist. Thinking.

Body — IBM Plex Sans — 300–400
The builder. Executing.

Code / Technical — IBM Plex Mono — 300–400
The engineer. Under the hood.

Accent / Data — Wix Madefor Display — 500–700
The system. Precision. CTAs. Pricing numbers.

### Website Type Scale

Navigation — IBM Plex Sans — 14px — 500 — Uppercase, letter-spacing 0.08em
Hero headline — Instrument Serif — 48–64px — 400 — Sentence case, letter-spacing -0.02em
Section headings — Instrument Serif — 28–36px — 400 — Sentence case
Subheadings — IBM Plex Sans — 18px — 600
Body text — IBM Plex Sans — 16px — 300–400 — Line-height 1.7–1.8
Captions / labels — IBM Plex Mono — 11–12px — 400 — Uppercase, letter-spacing 0.1em
Metrics / numbers — Wix Madefor Display — 36–48px — 700 — Pricing, stats, KPIs, step numbers
Code blocks — IBM Plex Mono — 14px — 400
Buttons / CTAs — IBM Plex Sans — 14px — 600 — Uppercase, letter-spacing 0.06em
Location line — IBM Plex Mono — 12px — 400 — Uppercase, tracked

### Font Sources (all free, Google Fonts)

Wix Madefor Display: fonts.google.com/specimen/Wix+Madefor+Display
Instrument Serif: fonts.google.com/specimen/Instrument+Serif
IBM Plex Sans: fonts.google.com/specimen/IBM+Plex+Sans
IBM Plex Mono: fonts.google.com/specimen/IBM+Plex+Mono

### The Typographic Experience

A prospect moves through four layers:
1. SYNARKIA (Wix Madefor Display) — "This is a serious operation"
2. Strategic headline (Instrument Serif) — "They think deeply about problems"
3. Execution detail (IBM Plex Sans) — "They build real things"
4. Technical spec (IBM Plex Mono) — "They understand the architecture"

By the time they reach pricing, the type system has already told them who we are.

---

## Layout & Composition

8px base grid for vertical rhythm
Max content width: 960px for text, 1200px for full-width sections
Left-aligned text throughout
Generous whitespace between sections — space signals confidence
Modular card system for offers, case studies, division panels
Thin line dividers with gradient fades: lavender → transparent, or saffron → transparent
Subtle radial glow effects behind key content areas
Tables: clean, minimal borders; convert to stacked cards on mobile
Asymmetric balance — interesting but stable

---

## Imagery & 3D Assets

All existing 3D animations from the current site (synarkia-web.vercel.app) are preserved:
- grid-loop.mp4 video from the homepage
- All Spline/WebGL/Three.js scenes
- Dark atmospheric canvas
- Radial glow effects and grain texture overlays

Additional visual elements:
- Minimal sacred geometry (very restrained — circles, torus, intersections)
- Thin line dividers and geometric forms
- Abstract system diagrams
- Abstract light and shadow

Human presence: rare, anonymous, presence rather than personality.

---

## Motion & Interaction

Fade-up animations on scroll — 0.6–0.8s, ease-out
Staggered entry for grid items — 50–100ms delays between items
Hover states on cards: border color shifts to lavender-active (rgba(184, 169, 232, 0.20))
CILTPC method steps: sequential fade-in as user scrolls
Smooth scroll navigation with minimal state changes
Existing 3D animations keep their original interaction behavior

Everything should feel like it was always there, just becoming visible.

---

## Atmosphere

Subtle CSS grain overlay across entire site — SVG filter, ~3% opacity (match existing site)
Background radial glows: lavender and saffron, positioned asymmetrically
Glows feel like distant light sources in a dark space

Overall mood: a private strategic intelligence atelier at night — warm light, quiet focus, everything in its place.

On mobile: the copy should feel like reading a well-set poem — short lines, breathing room.

---

## Brand Voice

Calm. Precise. Assertive. Unemotional but warm.

Say less — if it can be said in 5 words, use 5.
Create gaps — let the reader lean in.
Orient positively — show the door, name what they sense.
Be mysterious — let them recognize themselves rather than telling them.
Confidence through restraint — the shortest menus belong to the finest restaurants.
Pricing on the page — it's a filter, a signal of confidence.
Assertions over questions.
The reader is intelligent, busy, and has seen every pitch.

Preferred language: coherence, structure, execution, intelligence, alignment, precision, integrity, system, architecture, clarity, coordination, assets, momentum.

Brand posture: "Synarkia does not convince. Synarkia signals."

---

## CSS Custom Properties

```css
:root {
  --color-void: #0C0A12;
  --color-deep-ink: #141020;
  --color-twilight: #1C1830;
  --color-dusk: #2A2440;
  --color-lavender: #B8A9E8;
  --color-lavender-soft: #9B88D4;
  --color-saffron: #E8B84A;
  --color-saffron-warm: #D4A63C;
  --color-cream: #E8E0D4;
  --color-stone: #C8BFB0;
  --color-sand: #A89F90;
  --color-haze: #9890A8;
  --color-muted: #6A6278;
  --border-default: rgba(184, 169, 232, 0.08);
  --border-active: rgba(184, 169, 232, 0.20);
  --glow-lavender: rgba(184, 169, 232, 0.12);
  --glow-saffron: rgba(232, 184, 74, 0.10);
  --font-logotype: 'Wix Madefor Display', sans-serif;
  --font-heading: 'Instrument Serif', serif;
  --font-body: 'IBM Plex Sans', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
  --font-accent: 'Wix Madefor Display', sans-serif;
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 48px;
  --space-xl: 80px;
  --space-2xl: 120px;
  --max-width-text: 960px;
  --max-width-full: 1200px;
}
```

---

## Technical Reference

Platform: Framer (primary) or Next.js — deployed on Vercel
Font loading: font-display: swap
Target: under 2s first contentful paint
3D scenes load asynchronously
Desktop-first, flawless on mobile
Breakpoints: 1200px, 960px, 640px
Booking integration: Calendly or Cal.com
Contact form: Formspree, Tally, or native
Analytics: Plausible or Fathom (privacy-first)
SEO meta titles: "SYNARKIA — [Page tagline]"
OG images: dark background (#0C0A12), Instrument Serif headline, lavender/saffron accent

---

## AI Design Prompt (copy-paste ready)

```
Design for SYNARKIA, a strategic intelligence atelier (Berlin · Zurich · Lyon · Lisbon). Dark, immersive, architecturally precise. Void-black base (#0C0A12) with layered tones (#141020, #1C1830). Accent sparingly with lavender (#B8A9E8) and saffron (#E8B84A). Warm cream (#E8E0D4) and stone (#C8BFB0) for text. Instrument Serif for headings, IBM Plex Sans for body, IBM Plex Mono for captions, Wix Madefor Display for logotype and data. Strong vertical rhythm, generous negative space, modular structure. Subtle grain texture and radial glows. Mood: strategic intelligence atelier at night.
```

---

v1 · February 2026
