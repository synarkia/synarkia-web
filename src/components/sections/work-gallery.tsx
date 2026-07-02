"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { useLang } from "@/i18n/language-provider";

const IMAGES: Record<string, string[]> = {
  encadrepro: ["/work/encadrepro-1.jpg", "/work/encadrepro-2.jpg"],
  lux: ["/work/lux-1.jpg", "/work/lux-2.jpg"],
  cityzen: ["/work/cityzen-1.jpg"],
  eauxchaotiques: ["/work/eauxchaotiques-1.jpg"],
};

type Project = {
  key: string;
  name: string;
  tag: string;
  desc: string;
  meta: string;
  href?: string;
  quote?: string;
  author?: string;
};

function Carousel({ images, alt }: { images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  const n = images.length;
  const go = (d: number) => setI((p) => (p + d + n) % n);

  return (
    <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-[linear-gradient(160deg,#131317,#0b0b0e)] border border-[rgba(244,241,233,0.08)] group">
      {images.map((src, idx) => (
        <Image
          key={src}
          src={src}
          alt={`${alt} — ${idx + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 560px"
          className={`object-contain p-3 transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"}`}
          priority={idx === 0}
        />
      ))}

      {n > 1 && (
        <>
          <button
            aria-label="Previous"
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-[rgba(6,6,8,0.6)] border border-[rgba(244,241,233,0.14)] text-light opacity-0 group-hover:opacity-100 hover:bg-[rgba(6,6,8,0.85)] transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            aria-label="Next"
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-[rgba(6,6,8,0.6)] border border-[rgba(244,241,233,0.14)] text-light opacity-0 group-hover:opacity-100 hover:bg-[rgba(6,6,8,0.85)] transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Slide ${idx + 1}`}
                onClick={() => setI(idx)}
                className={`h-1.5 rounded-full transition-all ${idx === i ? "w-5 bg-light" : "w-1.5 bg-[rgba(244,241,233,0.3)]"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function WorkGallery() {
  const { t } = useLang();
  const w = t.home.work;
  const projects = w.projects as unknown as Project[];

  return (
    <section id="work" className="py-24 md:py-32 border-t border-[rgba(244,241,233,0.07)]">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <Reveal className="max-w-2xl mb-14 md:mb-20">
          <span className="kl-eyebrow">{w.eyebrow}</span>
          <h2 className="kl-h1 mt-6">{w.h}</h2>
        </Reveal>

        <div className="space-y-6 lg:space-y-8">
          {projects.map((p, idx) => (
            <Reveal key={p.key} delay={(idx % 2) * 0.08}>
              <div className="kl-card p-5 md:p-7 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
                <div className={idx % 2 === 1 ? "lg:order-2" : ""}>
                  <Carousel images={IMAGES[p.key] ?? []} alt={p.name} />
                </div>
                <div className={idx % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="kl-h2 text-light">{p.name}</h3>
                    <span className="kl-mono text-smoke">· {p.meta}</span>
                  </div>
                  <p className="kl-eyebrow mb-5">{p.tag}</p>
                  <p className="kl-body mb-6">{p.desc}</p>

                  {p.quote && (
                    <blockquote className="border-l border-[rgba(244,241,233,0.2)] pl-5 mb-6">
                      <p className="kl-lead not-italic text-[1.15rem] mb-2">&ldquo;{p.quote}&rdquo;</p>
                      <footer className="kl-eyebrow">{p.author}</footer>
                    </blockquote>
                  )}

                  {p.href ? (
                    <a href={p.href} target="_blank" rel="noopener noreferrer" className="kl-link inline-flex items-center gap-2">
                      {p.href.replace(/^https?:\/\//, "")} <ArrowUpRight className="w-4 h-4" />
                    </a>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 text-center">
          <Link href="#contact" className="kl-link inline-flex items-center gap-2">
            {w.cta} <ArrowUpRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
