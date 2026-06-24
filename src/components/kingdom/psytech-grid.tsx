"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Sparkles, Activity, X } from "lucide-react";

const GLYPH = "/psytech/_glyph.png";

interface PsyTech {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
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
    image: GLYPH,
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
    image: GLYPH,
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
    image: GLYPH,
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
    image: GLYPH,
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
    image: GLYPH,
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
    image: GLYPH,
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
    image: GLYPH,
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
    image: GLYPH,
    practices: ["Surya Yoga", "Panic Meditation", "Spiritual Galvanoplasty", "Light Nutrition"],
    concepts: ["Solar Consciousness", "Fraternity", "High Ideal", "Etheric Body"],
    links: [{ label: "Prosveta", url: "https://www.prosveta.com/" }],
  },
  {
    id: "inner-noticing",
    name: "Inner Noticing & Self-Coherence",
    role: "Somatic Technology",
    description:
      "Fine-tuned attention to internal somatic and energetic states. Developing a coherent self-structure that can maintain stability amidst chaos.",
    image: GLYPH,
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
    image: GLYPH,
    practices: ["Birthday Circle", "Organic Circle", "Surrendered Leadership", "Noticing Aloud"],
    concepts: ["We-Space", "Intersubjectivity", "Authentic Relating", "Present Moment"],
    links: [{ label: "Circling Europe", url: "https://circling-europe.com/" }],
  },
  {
    id: "meta-learning",
    name: "Meta-Learning & Epistemics",
    role: "Cognitive Technology",
    description:
      "Learning how to learn. Examining the very structures of how we know what we know, and upgrading our operating systems for knowledge acquisition.",
    image: GLYPH,
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
    image: GLYPH,
    practices: ["Dream Analysis", "Active Imagination", "Myth Enactment", "Shadow Work"],
    concepts: ["Collective Unconscious", "Hero's Journey", "Archetypes", "Anima/Animus"],
    links: [{ label: "Pacifica Graduate Institute", url: "https://www.pacifica.edu/" }],
  },
];

export function PsytechGrid() {
  const [selected, setSelected] = useState<PsyTech | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PSY_TECHS.map((tech, i) => (
          <motion.button
            key={tech.id}
            type="button"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: (i % 3) * 0.05 }}
            onClick={() => setSelected(tech)}
            className="group relative text-left p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-lavender/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-lavender/10 via-transparent to-saffron/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex items-start gap-4">
              <img
                src={tech.image}
                alt=""
                className="w-12 h-12 rounded-full object-cover border border-white/10 group-hover:border-lavender/50 transition-colors"
              />
              <div>
                <h3 className="type-h3 text-lg text-cream mb-1 group-hover:text-lavender transition-colors">
                  {tech.name}
                </h3>
                <div className="text-xs text-lavender/80 mb-2 uppercase tracking-wider font-medium">
                  {tech.role}
                </div>
              </div>
            </div>

            <p className="relative z-10 mt-3 text-sm text-stone leading-relaxed group-hover:text-cream transition-colors line-clamp-3">
              {tech.description}
            </p>

            <div className="relative z-10 mt-4 flex items-center text-xs text-sand group-hover:text-lavender transition-colors">
              <span className="mr-2">Explore technology</span>
              <ExternalLink size={12} />
            </div>
          </motion.button>
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
          <div className="absolute inset-0 bg-void/80 backdrop-blur-xl" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-auto rounded-2xl bg-deep-ink/95 border border-white/10 shadow-2xl shadow-void/60"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-stone hover:text-cream transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 bg-black/20 relative min-h-[160px] md:min-h-[420px]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-deep-ink/90 z-10 md:hidden" />
                <img
                  src={selected.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-lavender/20 to-saffron/20 mix-blend-overlay" />
              </div>

              <div className="flex-1 p-6 md:p-8">
                <div className="text-xs font-medium text-lavender uppercase tracking-widest mb-2">
                  {selected.role}
                </div>
                <h2 className="type-h2 text-2xl md:text-3xl text-cream mb-3">{selected.name}</h2>
                <p className="text-stone text-base leading-relaxed mb-6">{selected.description}</p>

                <div className="space-y-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-medium text-cream mb-3">
                      <Sparkles size={14} className="text-lavender" />
                      Core principles
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selected.concepts.map((concept) => (
                        <span
                          key={concept}
                          className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-stone"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-medium text-cream mb-3">
                      <Activity size={14} className="text-saffron" />
                      Key practices
                    </h4>
                    <ul className="grid gap-2">
                      {selected.practices.map((practice) => (
                        <li key={practice} className="text-sm text-stone pl-3 border-l border-white/10">
                          {practice}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex flex-wrap gap-3">
                    {selected.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-cream border border-white/5 transition-colors"
                      >
                        <ExternalLink size={14} />
                        Explore {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
