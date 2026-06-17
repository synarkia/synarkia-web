// SYNARKIA, Kingdom of Lights
// Distilled from SYNARKIA.Ref: Brand Strategy, Founder Profile, Vision & Manifesto.
// "Together, Ascending.", ARKIA: the radiant, that which soars.

export const ETYMOLOGY = [
  { root: "SYN", lang: "Ancient Greek", gloss: "together · union", note: "the root of synergy, the whole greater than its parts" },
  { root: "ARKHE", lang: "Ancient Greek", gloss: "origin · to rule", note: "the beginning, the first place, the command" },
  { root: "ARKIA", lang: "Sanskrit · Hebrew", gloss: "the radiant · I will soar", note: "linked to Arka, the sun, to shine, to ascend the expanse" },
] as const;

// The central spine: Art · Science · Religion in equilibrium.
export const EQUILIBRIUM = [
  { id: "art", label: "ART", pursuit: "Beauty", glyph: "🜔", body: "The making of form, aesthetics, narrative, myth. The language the soul speaks before the mind translates it." },
  { id: "science", label: "SCIENCE", pursuit: "Truth", glyph: "🜁", body: "The discipline of seeing clearly, systems, evidence, technology. The map drawn honestly enough to be trusted." },
  { id: "religion", label: "RELIGION", pursuit: "Goodness", glyph: "🜂", body: "Re-ligare, to bind back together, the sacred, reverence, belonging. The remembering of the Whole we never left." },
] as const;

export const VISION_TRIAD = [
  "A civilization that can feel.",
  "A network that can heal.",
  "An economy that remembers life.",
] as const;

// The 10 Frequencies (core values).
export const FREQUENCIES = [
  { n: "I", name: "Synergy", keyword: "Coordination", desc: "Collaborative over competitive." },
  { n: "II", name: "Harmony", keyword: "Balance", desc: "The win-win approach." },
  { n: "III", name: "Essence", keyword: "Usefulness", desc: "Usage value, quality over quantity." },
  { n: "IV", name: "Mastery", keyword: "Excellence", desc: "Virtuosity and creativity." },
  { n: "V", name: "Soulfire", keyword: "Truth", desc: "Authenticity and passion with integrity." },
  { n: "VI", name: "Evolve", keyword: "Growth", desc: "Self-development and transformation." },
  { n: "VII", name: "Flourishing", keyword: "Empowerment", desc: "Human development over profit." },
  { n: "VIII", name: "Vitality", keyword: "Scalability", desc: "Organic network over hierarchy." },
  { n: "IX", name: "Wholeness", keyword: "Integration", desc: "Holistic systemic thinking." },
  { n: "X", name: "Root", keyword: "Generative", desc: "Causes rather than symptoms." },
] as const;

// Three sacred instruments. (△ ascend · ▽ descend · ◇ crystallise)
export const PILLARS = [
  { glyph: "△", title: "Psychotechnologies", body: "Maps, models, and filters for soul evolution and system coherence, new thoughtware to see differently." },
  { glyph: "▽", title: "Collective Rituals", body: "Practices for truth-telling, decision-making, and resourcing, coherence enacted, not merely declared." },
  { glyph: "◇", title: "Sacred Agreements", body: "Covenants that restore trust, value, and goodness, for trust is the basis of all value exchange." },
] as const;

// Who are the Synarks, the four archetypes (lights of the kingdom).
export const SYNARKS = [
  { glyph: "✶", title: "Architects of possibility", note: "They build the one to come." },
  { glyph: "✦", title: "Designers of coherence", note: "They find the signal in the noise." },
  { glyph: "✷", title: "Weavers of myth & economy", note: "They braid story with structure." },
  { glyph: "✧", title: "Stewards of sovereignty", note: "Of soul, of structure, of the Whole." },
] as const;

// The 5-Star Filter, the Pure Player.
export const PURE_PLAYER = [
  "Wide abstract empathy",
  "A deep sense of integrity",
  "Complex systems thinking",
  "Excellent collaboration",
  "Honest emotional expression",
] as const;

// The Synarkic Constellation, organizational circles.
export const CONSTELLATION = [
  { glyph: "✦", name: "Wisdom Council", role: "Guidance · coherence · vision" },
  { glyph: "✶", name: "Operations Ring", role: "Execution · logistics · finance" },
  { glyph: "❖", name: "Tech Guild", role: "Architecture · digital design" },
  { glyph: "✷", name: "Hermes Flow", role: "Communication · events · energy" },
  { glyph: "✧", name: "Creative Guild", role: "Design · narrative · aesthetics" },
  { glyph: "◈", name: "Elixir Circle", role: "Product · sensory · wellness" },
] as const;

// Ancient futures, the ventures.
export const VENTURES = [
  { tag: "Alchemy", name: "Vie Pure", line: "Nature, Perfected", body: "Handcrafted spagyric tinctures for vitality and consciousness, the first public work under the Synarkia umbrella." },
  { tag: "Decentralized intelligence", name: "SynDAO · TAO", line: "An economy that remembers life", body: "Ethical investment in regenerative technology, anchored in Bittensor, intelligence as a commons, owned by no one." },
  { tag: "Foresight", name: "Hermes Flow", line: "Composing the new world", body: "Inner-alchemy and strategic foresight for visionary leaders, systemic design where soul meets structure." },
] as const;

// Desires · Needs · Gifts portal.
export const PORTAL = [
  { word: "Desires", def: "Dream projects, visions, future seeds.", q: "What you came to create." },
  { word: "Needs", def: "Skills, resources, allies you seek.", q: "What you are looking for." },
  { word: "Gifts", def: "Talents, capital, creations you offer.", q: "What only you can give." },
] as const;
