"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, BookOpen, Sparkles, X } from "lucide-react";

const FALLBACK = "/mentors/_fallback.png";

interface Mentor {
  name: string;
  role: string;
  description: string;
  image: string;
  books: string[];
  concepts: string[];
  links: { label: string; url: string }[];
}

const MENTORS: Mentor[] = [
  {
    name: "Sevan Bomar",
    role: "Mystic & Metaphysician",
    description:
      "Decoding the holographic nature of reality through etymology, occult mastery, and symbolic intelligence. Founder of Secret Energy.",
    image: "/mentors/sevan-bomar.jpg",
    books: ["The Code to the Matrix", "The Real Path of the Adept"],
    concepts: ["Linguistic Decoding", "Kundalini Activation", "Sovereign Integral", "Projection Technology"],
    links: [
      { label: "Secret Energy", url: "https://secretenergy.com" },
      { label: "Adept Lexicon", url: "https://adeptlexicon.com/Home" },
    ],
  },
  {
    name: "Zak Stein",
    role: "Educational Philosopher",
    description:
      "Architecting a new civilization through the transformation of education and justice. Navigating the 'Time Between Worlds'.",
    image: "/mentors/zak-stein.jpg",
    books: ["Education in a Time Between Worlds", "Social Justice and Educational Measurement"],
    concepts: ["The Meta-Crisis", "Educational Justice", "Intergenerational Stewardship", "Metaphysics of Eros"],
    links: [{ label: "ZakStein.org", url: "https://www.zakstein.org" }],
  },
  {
    name: "Ken Wilber",
    role: "Integral Philosopher",
    description:
      "The Einstein of consciousness studies. Creator of Integral Theory, mapping the spectrum of human development.",
    image: "/mentors/ken-wilber.jpg",
    books: ["A Theory of Everything", "Sex, Ecology, Spirituality", "Integral Spirituality"],
    concepts: ["AQAL (All Quadrants All Levels)", "Grow Up, Wake Up, Clean Up, Show Up", "Holons", "Pre/Trans Fallacy"],
    links: [{ label: "Integral Life", url: "https://integrallife.com" }],
  },
  {
    name: "Marc Gafni",
    role: "Visionary Mystic",
    description:
      "Evolving the narrative of identity from Separate Self to Unique Self. Proposing 'CosmoErotic Humanism' as a new operating system.",
    image: "/mentors/marc-gafni.jpg",
    books: ["Your Unique Self", "A Return to Eros", "Radical Kabbalah"],
    concepts: ["Unique Self Theory", "CosmoErotic Humanism", "Outrageous Love", "Evolutionary Intimacy"],
    links: [{ label: "Center for Integral Wisdom", url: "https://centerforintegralwisdom.org" }],
  },
  {
    name: "Clinton Callahan",
    role: "Possibility Manager",
    description:
      "Originator of Possibility Management. Training modern adults to leave the 'box' of cultural conditioning and enter true adulthood.",
    image: "/mentors/clinton-callahan.png",
    books: ["Radiant Joy Brilliant Love", "Directing the Power of Conscious Feelings"],
    concepts: ["Thoughtware Upgrade", "4 Feelings vs Emotions", "Gremlin Work", "Next Culture"],
    links: [{ label: "Possibility Management", url: "https://possibilitymanagement.org" }],
  },
  {
    name: "Bill Plotkin",
    role: "Depth Psychologist",
    description:
      "Guiding the descent to soul. Reconnecting human development with the wild rhythms of nature and the anima mundi.",
    image: "/mentors/bill-plotkin.png",
    books: ["Soulcraft", "Nature and the Human Soul", "The Journey of Soul Initiation"],
    concepts: ["Eco-centric Development", "The Descent to Soul", "Cultural Therapy", "Wild Mind"],
    links: [{ label: "Animas Valley Institute", url: "https://animas.org" }],
  },
  {
    name: "Omraam Mikhaël Aïvanhov",
    role: "Solar Master",
    description:
      "A master of the Universal White Brotherhood. Teaching the spiritual science of light and the perfection of the human being.",
    image: "/mentors/omraam-aivanhov.jpg",
    books: ["The Powers of Thought", "The Yoga of the Sun", "Golden Rules for Everyday Life"],
    concepts: ["Solar Yoga", "Spiritual Galvanoplasty", "Universal Brotherhood", "Sublimation"],
    links: [{ label: "Prosveta", url: "https://www.prosveta.com" }],
  },
  {
    name: "Stephen Wolfram",
    role: "Computational Pioneer",
    description:
      "Exploring the computational universe. Proposing that simple rules generate the infinite complexity of reality.",
    image: "/mentors/stephen-wolfram.jpg",
    books: ["A New Kind of Science", "The Mathematica Book"],
    concepts: ["Computational Irreducibility", "The Ruliad", "Cellular Automata", "Principle of Computational Equivalence"],
    links: [{ label: "Wolfram Physics", url: "https://wolframphysics.org" }],
  },
  {
    name: "Daniel Schmachtenberger",
    role: "Civilizational Designer",
    description:
      "Analyzing the generator functions of existential risk. Seeking a 'Third Attractor' that avoids both chaos and totalitarianism.",
    image: "/mentors/daniel-schmachtenberger.jpg",
    books: ["The Consilience Project (Essays)"],
    concepts: ["The Meta-Crisis", "Generator Functions", "Rivalrous Dynamics", "Sensemaking"],
    links: [{ label: "Civilization Emerging", url: "https://civilizationemerging.com" }],
  },
  {
    name: "Richard Rudd",
    role: "Teacher & Mystic",
    description:
      "Channel of the Gene Keys. A synthesis of the I Ching and astrology to unlock the higher purpose hidden in human DNA.",
    image: "/mentors/richard-rudd.png",
    books: ["The Gene Keys", "The Art of Contemplation", "The Seven Sacred Seals"],
    concepts: ["The Golden Path", "Shadow to Siddhi", "Contemplation", "Hologenetic Profile"],
    links: [{ label: "Gene Keys", url: "https://genekeys.com" }],
  },
  {
    name: "Jamie Wheal",
    role: "Flow Architect",
    description:
      "Decoding the neurophysiology of peak states. Designing culture and practices for 'stealing fire' responsibly.",
    image: "/mentors/jamie-wheal.jpg",
    books: ["Stealing Fire", "Recapture the Rapture"],
    concepts: ["Flow States", "Hedonic Engineering", "Group Flow", "Altered States Economy"],
    links: [{ label: "Flow Genome Project", url: "https://www.flowgenomeproject.com" }],
  },
  {
    name: "John Vervaeke",
    role: "Cognitive Scientist",
    description:
      "Awakening from the meaning crisis. Bridging cognitive science and ancient wisdom to cultivate relevance realization.",
    image: "/mentors/john-vervaeke.png",
    books: ["Awakening from the Meaning Crisis (Series)"],
    concepts: ["Relevance Realization", "The Meaning Crisis", "Ecology of Practices", "Dialogos"],
    links: [{ label: "Meaning Crisis Site", url: "https://johnvervaeke.com" }],
  },
  {
    name: "Rufus Pollock",
    role: "Open Activist",
    description:
      "Advocate for the Open Information Age. Building systems for a wise society through digital democracy and open knowledge.",
    image: "/mentors/rufus-pollock.jpg",
    books: ["The Open Revolution"],
    concepts: ["Open Knowledge", "Digital Democracy", "Information Justice", "Wise Society"],
    links: [{ label: "RufusPollock.com", url: "https://rufuspollock.com" }],
  },
  {
    name: "Zach Bush",
    role: "Regenerative Physician",
    description:
      "Bridging human health and soil health. Revealing the microbiome as the foundation of planetary wellbeing.",
    image: "/mentors/zach-bush.jpg",
    books: ["Farmer's Footprint (Film)"],
    concepts: ["Microbiome", "Regenerative Agriculture", "Soil Health = Human Health", "Glyphosate Awareness"],
    links: [{ label: "ZachBushMD.com", url: "https://zachbushmd.com" }],
  },
  {
    name: "Terence McKenna",
    role: "Ethnobotanist & Speaker",
    description:
      "Cartographer of the psychedelic frontier. Explorer of plant consciousness, time, and the transcendent imagination at the edge of history.",
    image: "/mentors/terence-mckenna.jpg",
    books: ["Food of the Gods", "The Archaic Revival", "True Hallucinations"],
    concepts: ["The Timewave", "Novelty Theory", "The Stoned Ape Hypothesis", "Machine Elves"],
    links: [{ label: "Psychedelic Salon", url: "https://psychedelicsalon.com" }],
  },
  {
    name: "Jakob Wagner",
    role: "Systems Designer",
    description:
      "Intuitive systems thinker. Mapping the invisible architectures that govern flow, connection, and emergence.",
    image: FALLBACK,
    books: ["Essays on Meta-Design"],
    concepts: ["Systems Intuition", "Meta-Design", "Flow Architectures", "Emergent Strategy"],
    links: [{ label: "Work", url: "#" }],
  },
];

export function MentorsGrid() {
  const [selected, setSelected] = useState<Mentor | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MENTORS.map((mentor, i) => (
          <motion.button
            key={mentor.name}
            type="button"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: (i % 3) * 0.05 }}
            onClick={() => setSelected(mentor)}
            className="group relative text-left p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-saffron/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-saffron/10 via-transparent to-lavender/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex items-start gap-4">
              <img
                src={mentor.image}
                alt={mentor.name}
                className="w-12 h-12 rounded-full object-cover border border-white/10 group-hover:border-saffron/50 transition-colors"
              />
              <div>
                <h3 className="type-h3 text-lg text-cream mb-1 group-hover:text-saffron transition-colors">
                  {mentor.name}
                </h3>
                <div className="text-xs text-lavender/80 mb-2 uppercase tracking-wider font-medium">
                  {mentor.role}
                </div>
              </div>
            </div>

            <p className="relative z-10 mt-3 text-sm text-stone leading-relaxed group-hover:text-cream transition-colors line-clamp-3">
              {mentor.description}
            </p>

            <div className="relative z-10 mt-4 flex items-center text-xs text-sand group-hover:text-saffron transition-colors">
              <span className="mr-2">Explore lineage</span>
              <ExternalLink size={12} />
            </div>
          </motion.button>
        ))}
      </div>

      <DetailModal selected={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function DetailModal({ selected, onClose }: { selected: Mentor | null; onClose: () => void }) {
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
              <div className="w-full md:w-1/3 bg-black/20 relative min-h-[200px] md:min-h-[460px]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-deep-ink/90 z-10 md:hidden" />
                <img
                  src={selected.image}
                  alt={selected.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-saffron/15 to-lavender/15 mix-blend-overlay" />
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
                      Core concepts
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
                      <BookOpen size={14} className="text-saffron" />
                      Key works
                    </h4>
                    <ul className="grid gap-2">
                      {selected.books.map((book) => (
                        <li key={book} className="text-sm text-stone pl-3 border-l border-white/10">
                          {book}
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
                        Visit {link.label}
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
