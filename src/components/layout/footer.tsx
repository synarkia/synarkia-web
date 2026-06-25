import Link from "next/link";
import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="relative border-t border-[rgba(244,241,233,0.08)] bg-ink overflow-hidden">
      {/* faint horizon glow */}
      <div className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] kl-glow opacity-40" />

      <Container size="xl" className="py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 lg:gap-32">
          <div>
            <Link href="/" className="kl-wordmark text-xl text-light block mb-5 hover:text-ash transition-colors">
              SYNDAO
            </Link>
            <p className="kl-body max-w-sm">
              Venture lab &amp; studio. Building at the equilibrium of art, science, and metaphysics —
              strategy, systems, and intelligent execution.
            </p>

            <div className="mt-10 space-y-2">
              <p className="kl-eyebrow">Berlin · Zurich · Lyon · Lisbon</p>
              <p className="kl-eyebrow">EN · FR · PT · DE</p>
            </div>
          </div>

          <div className="flex flex-col md:items-end md:text-right">
            <div className="mb-10">
              <p className="kl-h3 text-ash mb-5 max-w-xs ml-auto">
                If the quality of your work exceeds the quality of your systems —
              </p>
              <Link href="/#contact" className="kl-link inline-flex items-center gap-2">
                Let&apos;s talk <span className="text-base leading-none">→</span>
              </Link>
            </div>

            <ul className="flex flex-wrap gap-6 kl-mono mb-10 md:justify-end">
              <li><Link href="/#services" className="hover:text-light transition-colors">Services</Link></li>
              <li><Link href="/studio" className="hover:text-light transition-colors">Studio</Link></li>
              <li><Link href="/labs" className="hover:text-light transition-colors">Lab</Link></li>
              <li><Link href="/#method" className="hover:text-light transition-colors">Method</Link></li>
              <li><Link href="/#contact" className="hover:text-light transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[rgba(244,241,233,0.08)] flex flex-col md:flex-row justify-between items-center gap-4 kl-body-sm">
          <p>© {new Date().getFullYear()} Syndao — Venture Lab &amp; Studio</p>
          <div className="flex gap-6">
            <a href="mailto:connect@synarkia.com" className="hover:text-light transition-colors">connect@synarkia.com</a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-light transition-colors">LinkedIn</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
