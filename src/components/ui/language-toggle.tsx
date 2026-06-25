"use client";

import { useLang } from "@/i18n/language-provider";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div
      className={cn(
        "flex items-center rounded-full border border-[rgba(244,241,233,0.10)] p-0.5 font-mono text-[11px] uppercase tracking-[0.14em]",
        className
      )}
    >
      {(["en", "fr"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn(
            "px-2.5 py-1.5 rounded-full transition-colors",
            lang === l ? "bg-light text-ink" : "text-smoke hover:text-light"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
