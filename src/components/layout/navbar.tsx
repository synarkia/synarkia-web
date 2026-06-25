"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/i18n/language-provider";
import { LanguageToggle } from "@/components/ui/language-toggle";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLang();

  const navItems = [
    { name: t.nav.studio, href: "/studio" },
    { name: t.nav.lab, href: "/labs" },
    { name: t.nav.method, href: "/#method" },
    { name: t.nav.work, href: "/#work" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className={cn(
            "pointer-events-auto flex items-center gap-1 p-1.5 rounded-full transition-all duration-500",
            "border border-[rgba(244,241,233,0.10)] bg-[rgba(6,6,8,0.6)] backdrop-blur-xl",
            scrolled ? "shadow-[0_8px_40px_rgba(0,0,0,0.6)] border-[rgba(244,241,233,0.16)]" : ""
          )}
        >
          <Link
            href="/"
            className="flex items-center px-5 h-11 rounded-full hover:bg-[rgba(244,241,233,0.06)] transition-colors"
          >
            <span className="kl-wordmark text-[13px] text-light">SYNDAO</span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5 px-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2.5 rounded-full kl-link hover:bg-[rgba(244,241,233,0.05)] transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <LanguageToggle className="hidden md:flex ml-1" />

          <Link
            href="/#contact"
            className="hidden md:flex items-center px-5 h-11 rounded-full bg-light text-ink hover:bg-[rgba(244,241,233,0.85)] transition-colors ml-1 font-mono text-[11px] uppercase tracking-[0.18em]"
          >
            {t.nav.contact}
          </Link>

          <button
            aria-label="Menu"
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-full bg-[rgba(244,241,233,0.06)] text-light"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-ink/97 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-7">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="kl-h1 text-light hover:text-ash transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <Link href="/#contact" onClick={() => setIsOpen(false)} className="mt-4 kl-cta-solid">
                {t.nav.contact}
              </Link>
              <LanguageToggle className="mt-2" />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
