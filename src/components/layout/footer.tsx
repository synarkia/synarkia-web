"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { useLang } from "@/i18n/language-provider";
import { EMAIL, LINKEDIN_URL } from "@/lib/links";

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative border-t border-[rgba(244,241,233,0.08)] bg-ink overflow-hidden">
      <div className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] kl-glow opacity-40" />

      <Container size="xl" className="py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 lg:gap-32">
          <div>
            <Link href="/" className="kl-wordmark text-xl text-light block mb-5 hover:text-ash transition-colors">
              SYNDAO
            </Link>
            <p className="kl-body max-w-sm">{t.footer.tagline}</p>

            <div className="mt-10 space-y-2">
              <p className="kl-eyebrow">{t.footer.locations}</p>
              <p className="kl-eyebrow">{t.footer.langs}</p>
            </div>
          </div>

          <div className="flex flex-col md:items-end md:text-right">
            <div className="mb-10">
              <p className="kl-h3 text-ash mb-5 max-w-xs ml-auto">{t.footer.ctaLine}</p>
              <Link href="/#contact" className="kl-link inline-flex items-center gap-2">
                {t.footer.cta} <span className="text-base leading-none">→</span>
              </Link>
            </div>

            <ul className="flex flex-wrap gap-x-6 gap-y-1 kl-mono mb-10 md:justify-end">
              <li><Link href="/#services" className="inline-block py-2 hover:text-light transition-colors">{t.footer.services}</Link></li>
              <li><Link href="/studio" className="inline-block py-2 hover:text-light transition-colors">{t.footer.studio}</Link></li>
              <li><Link href="/labs" className="inline-block py-2 hover:text-light transition-colors">{t.footer.lab}</Link></li>
              <li><Link href="/#method" className="inline-block py-2 hover:text-light transition-colors">{t.footer.method}</Link></li>
              <li><Link href="/#contact" className="inline-block py-2 hover:text-light transition-colors">{t.footer.contact}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[rgba(244,241,233,0.08)] flex flex-col md:flex-row justify-between items-center gap-4 kl-body-sm">
          <p>© {new Date().getFullYear()} Syndao — {t.footer.rights}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 md:justify-end">
            <Link href="/legal" className="inline-block py-1 hover:text-light transition-colors">{t.footer.legal}</Link>
            <Link href="/privacy" className="inline-block py-1 hover:text-light transition-colors">{t.footer.privacy}</Link>
            <a href={`mailto:${EMAIL}`} className="inline-block py-1 hover:text-light transition-colors">{EMAIL}</a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:text-light transition-colors">LinkedIn</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
