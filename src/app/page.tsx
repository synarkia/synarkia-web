import { Reveal } from "@/components/ui/reveal";
import { LightCursor } from "@/components/kingdom/light-cursor";
import { LightsCanvas } from "@/components/kingdom/lights-canvas";
import { Metatron } from "@/components/kingdom/metatron";
import { Equilibrium } from "@/components/kingdom/equilibrium";
import { KLNav } from "@/components/kingdom/nav";
import { KLFooter } from "@/components/kingdom/footer";
import {
  ETYMOLOGY,
  EQUILIBRIUM,
  VISION_TRIAD,
  FREQUENCIES,
  PILLARS,
  SYNARKS,
  PURE_PLAYER,
  PORTAL,
} from "@/lib/kingdom-data";

const SECTION = "mx-auto max-w-[1280px] px-6 lg:px-10";

export default function Home() {
  return (
    <div className="kl min-h-screen relative" id="top">
      <LightCursor />
      <KLNav />

      {/* ───────────────── HERO · KINGDOM OF LIGHTS ───────────────── */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <LightsCanvas />
        </div>
        <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none">
          <Metatron className="w-[clamp(340px,80vw,820px)] h-[clamp(340px,80vw,820px)] opacity-70" />
        </div>
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-ink/30 via-transparent to-ink pointer-events-none" />

        <div className={`${SECTION} relative z-10 text-center pt-24`}>
          <Reveal y={10}>
            <p className="kl-eyebrow mb-8">Alliance Ecosystem · Conscious Human Flourishing</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="kl-display text-light kl-text-glow">
              Together,
              <br />
              <span style={{ fontStyle: "italic" }}>Ascending.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.28}>
            <p className="kl-lead max-w-2xl mx-auto mt-10">
              You were never meant to fit inside the world as it is:
              because you came to help build the one to come.
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-x-10 gap-y-3">
              {ETYMOLOGY.map((e) => (
                <div key={e.root} className="flex items-baseline gap-2">
                  <span className="kl-mono text-light tracking-[0.2em]">{e.root}</span>
                  <span className="kl-mono text-smoke">· {e.gloss}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.5}>
            <div className="mt-14">
              <a href="https://synarkia-field.vercel.app/enter" className="kl-cta">Enter the kingdom →</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── THE EQUILIBRIUM ───────────────── */}
      <section id="equilibrium" className="relative py-28 md:py-40 kl-border-t">
        <div className={SECTION}>
          <Reveal>
            <p className="kl-eyebrow mb-6">I · The Equilibrium</p>
            <h2 className="kl-h1 text-light max-w-3xl">
              Art, science, and religion:
              <br />
              <span style={{ fontStyle: "italic" }}>made one again.</span>
            </h2>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-16 items-center mt-16">
            <Reveal>
              <div className="relative">
                <div className="absolute inset-0 kl-glow scale-90" />
                <Equilibrium className="relative w-full max-w-[560px] mx-auto" />
              </div>
            </Reveal>

            <div className="space-y-10">
              <Reveal>
                <p className="kl-body text-ash max-w-md">
                  The primacy of beauty, the centrality of goodness, and the
                  ultimacy of truth.
                </p>
              </Reveal>
              <div className="space-y-px">
                {EQUILIBRIUM.map((e, i) => (
                  <Reveal key={e.id} delay={i * 0.08}>
                    <div className="kl-border-t py-6 group">
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="kl-mono text-light tracking-[0.28em]">{e.label}</span>
                        <span className="kl-lead text-smoke text-base">{e.pursuit}</span>
                      </div>
                      <p className="kl-body-sm max-w-md">{e.body}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── THE ECOSYSTEM ───────────────── */}
      <section id="ecosystem" className="relative py-28 md:py-40 bg-obsidian kl-border-t">
        <div className={SECTION}>
          <Reveal>
            <p className="kl-eyebrow mb-12">II · The Ecosystem</p>
          </Reveal>
          <div className="max-w-4xl space-y-7">
            <Reveal>
              <p className="kl-h2 text-light kl-text-glow">
                This is an alliance ecosystem based on a fundamental pattern of reality re-emerging through us.
              </p>
            </Reveal>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px mt-20 kl-border-t">
            {[
              [
                "Sense making",
                "Psychotechnologies, metamodern metaphysics, books, mentors, reference material, Wisdom Council, and collective intelligence practices."
              ],
              [
                "Health making",
                "Natural technologies to heal humans and the planet. Includes Vie Pure, our first showcase company to provide the best instruments and elements for health and wellness."
              ],
              [
                "Wealth making",
                "Abundance-driven systems and mechanisms for mutually beneficial exchanges with a common vision. Protocols, contracts, affiliations, partnerships, and a dedicated venture studio."
              ],
            ].map(([t, d], i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="py-8 pr-6 h-full">
                  <p className="kl-mono text-light mb-3">{`0${i + 1}`}</p>
                  <p className="kl-lead text-light not-italic mb-2" style={{ fontStyle: "normal", fontSize: "1.35rem" }}>{t}</p>
                  <p className="kl-body-sm">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mt-24 items-end">
            <Reveal>
              <div>
                <p className="kl-eyebrow mb-5">The Mission</p>
                <p className="kl-h2 text-light max-w-md">
                  To solve coordination failure by aligning incentives across all
                  dimensions.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="space-y-3 lg:text-right">
                <p className="kl-eyebrow mb-5">The Vision</p>
                {VISION_TRIAD.map((v) => (
                  <p key={v} className="kl-lead text-ash">{v}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────────── THE TEN FREQUENCIES ───────────────── */}
      <section id="frequencies" className="relative py-28 md:py-40 kl-border-t">
        <div className={SECTION}>
          <Reveal>
            <p className="kl-eyebrow mb-6">III · The Ten Frequencies</p>
            <h2 className="kl-h1 text-light max-w-2xl mb-4">The values we are tuned to.</h2>
            <p className="kl-body max-w-md">Trust is the basis of value exchange. These are the frequencies it travels on.</p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px mt-16 kl-border-t">
            {FREQUENCIES.map((f, i) => (
              <Reveal key={f.n} delay={(i % 5) * 0.05}>
                <div className="py-8 pr-5 h-full group transition-colors duration-500 hover:bg-graphite">
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="kl-mono text-smoke w-8">{f.n}</span>
                    <span className="kl-mono text-smoke">{f.keyword}</span>
                  </div>
                  <p className="kl-lead text-light not-italic" style={{ fontStyle: "normal", fontSize: "1.6rem" }}>
                    {f.name}
                  </p>
                  <p className="kl-body-sm mt-2">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── THREE SACRED INSTRUMENTS ───────────────── */}
      <section className="relative py-28 md:py-40 bg-obsidian kl-border-t">
        <div className={SECTION}>
          <Reveal>
            <p className="kl-eyebrow mb-6">IV · Three Sacred Instruments</p>
            <h2 className="kl-h1 text-light max-w-2xl">How the kingdom works.</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-px mt-16 kl-border-t">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <div className="py-10 md:px-8 first:md:pl-0 h-full">
                  <div className="text-light text-4xl mb-8 kl-breathe" style={{ fontFamily: "var(--font-cormorant)" }}>
                    {p.glyph}
                  </div>
                  <h3 className="kl-h2 text-light mb-4" style={{ fontSize: "1.7rem" }}>{p.title}</h3>
                  <p className="kl-body max-w-xs">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── WHO ARE THE SYNARKS ───────────────── */}
      <section className="relative py-28 md:py-40 kl-border-t">
        <div className={SECTION}>
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="kl-eyebrow mb-6">V · The Synarks</p>
                <h2 className="kl-h1 text-light mb-8">
                  They are not recruited.
                  <br />
                  <span style={{ fontStyle: "italic" }}>They are remembered.</span>
                </h2>
                <p className="kl-body max-w-sm mb-10">
                  They feel the code before they speak it. They sense the signal in
                  the noise. They do not only ask <em>what is true</em>, they ask
                  what aligns the Whole.
                </p>
                <p className="kl-eyebrow mb-5">The Pure-Player Filter</p>
                <ul className="space-y-3">
                  {PURE_PLAYER.map((p, i) => (
                    <Reveal key={p} delay={i * 0.06}>
                      <li className="flex items-center gap-4 kl-body text-ash">
                        <span className="kl-mono text-smoke">{`0${i + 1}`}</span>
                        {p}
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-px self-start kl-border-t">
              {SYNARKS.map((s, i) => (
                <Reveal key={s.title} delay={(i % 2) * 0.1}>
                  <div className="p-8 h-full kl-border-t sm:border-t-0 group hover:bg-graphite transition-colors duration-500">
                    <div className="text-light text-3xl mb-6 kl-breathe">{s.glyph}</div>
                    <h3 className="kl-h2 text-light mb-2" style={{ fontSize: "1.5rem" }}>{s.title}</h3>
                    <p className="kl-body-sm">{s.note}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── FOUNDER ───────────────── */}
      <section id="founder" className="relative py-28 md:py-40 bg-obsidian kl-border-t">
        <div className={`${SECTION} max-w-[900px]`}>
          <Reveal>
            <p className="kl-eyebrow mb-8">VI · The Architect</p>
            <p className="kl-lead text-ash mb-8">
              &ldquo;How do we make the best decisions, for ourselves, for our
              networks, for life?&rdquo;
            </p>
            <h2 className="kl-h1 text-light mb-2">Leï Zagato</h2>
            <p className="kl-mono text-smoke mb-10">Meta-Systemic Architect · Founder of Synarkia</p>
            <p className="kl-body max-w-2xl mb-6">
              Rooted in <em className="text-light not-italic">Inter-Being</em>, Ayni, right
              relationship, and <em className="text-light not-italic">Cosmo-Erotic
              Humanism</em>, I weave a cosmogony of radical aliveness, sacred
              connection, and unifying wholeness. The answer to the question
              revealed itself as an alliance of individuals, collectives, and ideas
              in service to conscious human flourishing.
            </p>
            <a href="mailto:leizagato@gmail.com" className="kl-link">leizagato@gmail.com ↗</a>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── THE INVITATION ───────────────── */}
      <section id="invitation" className="relative py-32 md:py-48 kl-border-t overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] kl-glow pointer-events-none" />
        <div className={`${SECTION} relative z-10`}>
          <Reveal>
            <p className="kl-eyebrow text-center mb-10">VII · The Invitation</p>
            <h2 className="kl-display text-light text-center kl-text-glow mb-12" style={{ fontSize: "clamp(2.6rem,7vw,6rem)" }}>
              Compose the
              <br />
              <span style={{ fontStyle: "italic" }}>new world.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="kl-lead text-ash text-center max-w-2xl mx-auto mb-20">
              This is your invitation to the metagame, to become not a player of
              the old world, but a composer of the one to come. Synarkia thrives
              when each being shares their gift.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-px kl-border-t max-w-4xl mx-auto">
            {PORTAL.map((p, i) => (
              <Reveal key={p.word} delay={i * 0.1}>
                <div className="py-10 md:px-8 text-center md:text-left">
                  <p className="kl-h2 text-light mb-3" style={{ fontStyle: "italic", fontSize: "1.8rem" }}>{p.word}</p>
                  <p className="kl-body-sm mb-2">{p.def}</p>
                  <p className="kl-mono text-smoke">{p.q}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="text-center mt-20">
              <a href="https://synarkia-field.vercel.app/enter" className="kl-cta">
                Enter the kingdom →
              </a>
              <p className="kl-lead text-smoke mt-12">
                If this calls you, you&rsquo;re already inside. Welcome to Synarkia.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <KLFooter />
    </div>
  );
}
