"use client";

/**
 * The passage between the two animations.
 *
 * The globe has finished and cleared; nothing is moving. The sentence arrives
 * one word at a time as you scroll, holds, and then the page carries on into
 * the second animation. Scrolling back takes the words away in the same order.
 */

import { useEffect, useRef } from "react";
import { useLang } from "@/i18n/language-provider";

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease = (x: number) => x * x * (3 - 2 * x);

export function SignalWords() {
  const { t } = useLang();
  const h = t.home;
  const host = useRef<HTMLDivElement>(null);
  const eyebrow = useRef<HTMLSpanElement>(null);
  const words = useRef<(HTMLSpanElement | null)[]>([]);
  const tail = useRef<HTMLParagraphElement>(null);

  const list = h.signal.h.split(" ");

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = host.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const span = rect.height - window.innerHeight;
        const p = span > 0 ? clamp01(-rect.top / span) : 0;

        if (eyebrow.current) eyebrow.current.style.opacity = String(ease(clamp01(p / 0.06)));

        // each word takes its turn across the first two thirds of the passage
        const n = words.current.length;
        const start = 0.07;
        const end = 0.66;
        words.current.forEach((w, i) => {
          if (!w) return;
          const at = start + (i / Math.max(1, n)) * (end - start);
          const f = ease(clamp01((p - at) / 0.055));
          w.style.opacity = String(0.06 + f * 0.94);
          w.style.transform = `translateY(${(1 - f) * 0.22}em)`;
        });

        if (tail.current) {
          const f = ease(clamp01((p - 0.72) / 0.1));
          tail.current.style.opacity = String(f);
          tail.current.style.transform = `translateY(${(1 - f) * 0.5}rem)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [list.length]);

  return (
    <div ref={host} className="relative h-[260vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center px-5">
        <div className="mx-auto w-full max-w-[1040px] text-center">
          <span ref={eyebrow} className="kl-eyebrow block" style={{ opacity: 0 }}>
            {h.signal.eyebrow}
          </span>
          <p className="kl-statement mt-10 mb-9 max-w-[19ch] sm:max-w-[26ch] mx-auto">
            {list.map((w, i) => (
              <span
                key={`${w}-${i}`}
                ref={(el) => { words.current[i] = el; }}
                className="inline-block will-change-transform"
                style={{ opacity: 0.06 }}
              >
                {w}
                {i < list.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
          <p ref={tail} className="kl-statement-sub max-w-[46ch] mx-auto" style={{ opacity: 0 }}>
            {h.signal.body}
          </p>
        </div>
      </div>
    </div>
  );
}
