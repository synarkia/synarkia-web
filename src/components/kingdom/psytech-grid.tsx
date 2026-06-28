"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";

interface PsyTech {
  id: string;
  name: string;
  role: string;
  description: string;
  practices: string[];
  concepts: string[];
  links: { label: string; url: string }[];
}

const PSY_TECHS: PsyTech[] = [
  {
    id: "systems-thinking",
    name: "Systems Thinking",
    role: "Cognitive Technology",
    description:
      "Viewing the world as interconnected wholes rather than isolated parts. Understanding feedback loops, emergence, and non-linear dynamics to navigate complexity effectively.",
    practices: ["Causal Loop Diagramming", "Stock & Flow Mapping", "Iceberg Model Analysis", "Leverage Point Identification"],
    concepts: ["Emergence", "Feedback Loops", "Interconnectedness", "Non-linearity"],
    links: [{ label: "The Systems Thinker", url: "https://thesystemsthinker.com/" }],
  },
  {
    id: "parallel-thinking",
    name: "Parallel / Multidimensional Thinking",
    role: "Cognitive Technology",
    description:
      "Holding multiple contradictory perspectives simultaneously without collapsing into binary choices. Expanding cognitive capacity to process complexity and nuance.",
    practices: ["Dialectical Inquiry", "Polarity Management", "Six Thinking Hats", "Integral Perspective Taking"],
    concepts: ["Both/And Logic", "Cognitive Complexity", "Meta-Perspectives", "Omni-consideration"],
    links: [{ label: "Edward de Bono", url: "https://www.debono.com/" }],
  },
  {
    id: "possibility-management",
    name: "Possibility Management",
    role: "Emotional Intelligence",
    description:
      "Navigating the territory of feelings and emotions to unlock authentic power. Distinguishing between responsible creation and victim patterns.",
    practices: ["Rage Club", "Emotional Hygiene", "Gremlin Work", "Possibility Teams"],
    concepts: ["Radical Responsibility", "5 Bodies", "Low Drama vs High Drama", "Thoughtware"],
    links: [{ label: "Possibility Management", url: "https://possibilitymanagement.org/" }],
  },
  {
    id: "initiatory-practices",
    name: "Initiatory Practices",
    role: "Ritual Technology",
    description:
      "Rites of passage designed to facilitate the transition from one stage of development to another, integrating shadow aspects and claiming maturity.",
    practices: ["Vision Quest", "Sweat Lodge", "Burial/Death Meditation", "Ordeal Rituals"],
    concepts: ["Liminality", "Ego Death", "Elderhood", "Soul Descent"],
    links: [{ label: "School of Lost Borders", url: "https://schooloflostborders.org/" }],
  },
  {
    id: "plant-medicine",
    name: "Plant Medicine",
    role: "Consciousness Technology",
    description:
      "Sacred use of entheogens within ceremonial contexts to access expanded states of consciousness, heal trauma, and receive direct gnosis from nature.",
    practices: ["Ayahuasca Ceremony", "Psilocybin Therapy", "Microdosing Protocols", "Integration Circles"],
    concepts: ["Neuroplasticity", "Ego Dissolution", "Nature Intelligence", "Ancestral Healing"],
    links: [{ label: "MAPS", url: "https://maps.org/" }],
  },
  {
    id: "ceremonies",
    name: "Ceremonies & Ritual Design",
    role: "Ritual Technology",
    description:
      "Crafting intentional spaces and sequences of symbolic action to anchor meaning, honor transitions, and connect with the sacred dimensions of life.",
    practices: ["Ritual Architecture", "Altar Building", "Invocation", "Sacred Space Holding"],
    concepts: ["Symbolic Action", "Morphogenetic Fields", "Sacred Time", "Communitas"],
    links: [{ label: "Ritual Design", url: "#" }],
  },
  {
    id: "mysticism",
    name: "Mysticism & Esoteric Traditions",
    role: "Spiritual Technology",
    description:
      "Study and practice of perennial wisdom lineages (Kabbalah, Sufism, Gnosticism) to cultivate direct experience of the Divine and understanding of universal laws.",
    practices: ["Contemplation", "Sacred Geometry", "Tree of Life Work", "Mantra/Zikr"],
    concepts: ["Non-duality", "The Absolute", "Divine Emanation", "Gnosis"],
    links: [{ label: "Esoteric Online", url: "#" }],
  },
  {
    id: "aivanhov",
    name: "Universal White Brotherhood",
    role: "Solar Technology",
    description:
      "Teachings on solar yoga, spiritual galvanoplasty, and the brotherhood of all beings. Focusing on light as a transformative principle.",
    practices: ["Surya Yoga", "Laser Meditation", "Spiritual Galvanoplasty", "Light Nutrition"],
    concepts: ["Solar Consciousness", "Fraternity", "High Ideal", "Etheric Body"],
    links: [{ label: "Prosveta", url: "https://www.prosveta.com/" }],
  },
  {
    id: "inner-noticing",
    name: "Inner Noticing & Self-Coherence",
    role: "Somatic Technology",
    description:
      "Fine-tuned attention to internal somatic and energetic states. Developing a coherent self-structure that can maintain stability amidst chaos.",
    practices: ["Focusing", "Somatic Experiencing", "Internal Family Systems", "Vagal Toning"],
    concepts: ["Felt Sense", "Self-Regulation", "Co-regulation", "Trauma Integration"],
    links: [{ label: "Focusing Institute", url: "https://focusing.org/" }],
  },
  {
    id: "circling",
    name: "Circling & Relational Presence",
    role: "Relational Technology",
    description:
      "A practice of 'we-space' meditation. Revealing what is arising in the present moment of connection to deepen intimacy and uncover relational blind spots.",
    practices: ["Noticing", "Feeling", "Imagining", "De-Armoring"],
    concepts: ["We-Space", "Intersubjectivity", "Authentic Relating", "Present Moment"],
    links: [{ label: "Circling Europe", url: "https://circling-europe.com/" }],
  },
  {
    id: "meta-learning",
    name: "Meta-Learning & Epistemics",
    role: "Cognitive Technology",
    description:
      "Learning how to learn. Examining the very structures of how we know what we know, and upgrading our operating systems for knowledge acquisition.",
    practices: ["Double-Loop Learning", "Epistemic Hygiene", "Socratic Method", "Mental Models"],
    concepts: ["Epistemology", "Cognitive Bias", "Heuristics", "Learning Agility"],
    links: [{ label: "Farnam Street", url: "https://fs.blog/" }],
  },
  {
    id: "archetypal",
    name: "Archetypal & Mythopoetic Work",
    role: "Depth Psychology",
    description:
      "Engaging with the deep stories and symbols that shape the human psyche. Working with myths to understand and transform life narratives.",
    practices: ["Dream Analysis", "Active Imagination", "Myth Enactment", "Shadow Work"],
    concepts: ["Collective Unconscious", "Hero's Journey", "Archetypes", "Anima/Animus"],
    links: [{ label: "Pacifica Graduate Institute", url: "https://www.pacifica.edu/" }],
  },
];

// Small sacred-geometry seal drawn per card — a hexagram of light on the void.
function Seal({ className = "" }: { className?: string }) {
  const cx = 30;
  const cy = 30;
  const R = 18;
  const ring = (r: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 180) * (i * 60 - 90);
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(" ");
  return (
    <svg viewBox="0 0 60 60" className={className} fill="none" aria-hidden>
      <circle cx={cx} cy={cy} r={R + 4} stroke="rgba(244,241,233,0.12)" strokeWidth="0.6" />
      <polygon points={ring(R)} stroke="rgba(244,241,233,0.28)" strokeWidth="0.6" />
      <polygon points={ring(R)} transform={`rotate(60 ${cx} ${cy})`} stroke="rgba(244,241,233,0.28)" strokeWidth="0.6" />
      <circle cx={cx} cy={cy} r="2" fill="rgba(244,241,233,0.85)" />
    </svg>
  );
}

export function PsytechGrid() {
  const [selected, setSelected] = useState<PsyTech | null>(null);

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px kl-border-t">
        {PSY_TECHS.map((tech, i) => (
          <Reveal key={tech.id} delay={(i % 3) * 0.06}>
            <button
              type="button"
              onClick={() => setSelected(tech)}
              className="group relative w-full h-full text-left p-8 transition-colors duration-500 hover:bg-graphite cursor-pointer"
            >
              <Seal className="w-12 h-12 mb-6 kl-breathe opacity-80 group-hover:opacity-100 transition-opacity" />
              <p className="kl-mono text-smoke mb-3">{tech.role}</p>
              <h3 className="kl-h2 text-light mb-3" style={{ fontSize: "1.6rem" }}>
                {tech.name}
              </h3>
              <p className="kl-body-sm line-clamp-3">{tech.description}</p>
              <span className="kl-link mt-6 inline-block group-hover:text-light">Explore →</span>
            </button>
          </Reveal>
        ))}
      </div>

      <DetailModal selected={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function DetailModal({ selected, onClose }: { selected: PsyTech | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {selected && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-ink/85 backdrop-blur-xl" />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-2xl max-h-[88vh] overflow-auto bg-obsidian kl-border"
          >
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] kl-glow pointer-events-none" />
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 z-20 kl-link hover:text-light"
              aria-label="Close"
            >
              Close ✕
            </button>

            <div className="relative z-10 p-8 md:p-12">
              <div className="flex items-center gap-5 mb-8">
                <Seal className="w-14 h-14 shrink-0 kl-breathe" />
                <div>
                  <p className="kl-mono text-smoke mb-2">{selected.role}</p>
                  <h2 className="kl-h1 text-light" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
                    {selected.name}
                  </h2>
                </div>
              </div>

              <p className="kl-lead text-ash not-italic mb-10" style={{ fontStyle: "normal", fontSize: "1.25rem" }}>
                {selected.description}
              </p>

              <div className="grid sm:grid-cols-2 gap-10">
                <div>
                  <p className="kl-eyebrow mb-5">Core Principles</p>
                  <ul className="space-y-3">
                    {selected.concepts.map((c) => (
                      <li key={c} className="kl-body text-ash flex items-baseline gap-3">
                        <span className="text-smoke">◇</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="kl-eyebrow mb-5">Key Practices</p>
                  <ul className="space-y-3">
                    {selected.practices.map((p) => (
                      <li key={p} className="kl-body text-ash flex items-baseline gap-3">
                        <span className="text-smoke">·</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-12 pt-8 kl-border-t flex flex-wrap gap-4">
                {selected.links.map((link) => (
                  <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="kl-cta">
                    Explore {link.label} →
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
