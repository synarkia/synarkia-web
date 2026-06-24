"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { name: "Equilibrium", href: "#equilibrium" },
  { name: "Ecosystem", href: "#ecosystem" },
  { name: "Psychotechnologies", href: "/psychotechnologies" },
  { name: "Mentors", href: "/mentors" },
  { name: "Ventures", href: "#ventures" },
];

export function KLNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 inset-x-0 z-40 transition-all duration-700"
      style={{
        backgroundColor: scrolled ? "rgba(6,6,8,0.72)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(244,241,233,0.07)" : "1px solid transparent",
      }}
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link href="#top" className="kl-wordmark text-light text-[15px] hover:opacity-70 transition-opacity">
          SYNARKIA
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="kl-link">
              {l.name}
            </Link>
          ))}
        </nav>

        <Link href="#invitation" className="kl-link border border-[rgba(244,241,233,0.2)] rounded-full px-5 py-2.5 hover:bg-light hover:text-ink transition-colors">
          Enter
        </Link>
      </div>
    </header>
  );
}
