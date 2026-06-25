"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { dictionaries, type Lang, type Dict } from "./dictionary";

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: Dict;
}

const LanguageContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "syndao-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // hydrate preferred language after mount (avoids SSR mismatch)
  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) as Lang | null;
    if (stored === "en" || stored === "fr") {
      setLangState(stored);
    } else if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("fr")) {
      setLangState("fr");
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
      document.documentElement.lang = l;
    } catch {}
  }, []);

  const toggle = useCallback(() => setLang(lang === "en" ? "fr" : "en"), [lang, setLang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t: dictionaries[lang] as Dict }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
