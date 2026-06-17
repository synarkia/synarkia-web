import Link from "next/link";

export function KLFooter() {
  return (
    <footer className="relative border-t border-[rgba(244,241,233,0.08)] bg-ink">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-20">
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          <div className="max-w-sm">
            <p className="kl-wordmark text-light text-lg mb-5">SYNARKIA</p>
            <p className="kl-body">
              An alliance ecosystem for conscious human flourishing. Where art,
              science, and religion remember they were always one.
            </p>
            <p className="kl-lead mt-6 not-italic" style={{ fontStyle: "italic" }}>
              Together, ascending.
            </p>
          </div>

          <div className="flex gap-16">
            <ul className="space-y-3">
              <li><Link href="#equilibrium" className="kl-link">Equilibrium</Link></li>
              <li><Link href="#ecosystem" className="kl-link">Ecosystem</Link></li>
              <li><Link href="#frequencies" className="kl-link">Frequencies</Link></li>
              <li><Link href="#constellation" className="kl-link">Constellation</Link></li>
            </ul>
            <ul className="space-y-3">
              <li><Link href="#ventures" className="kl-link">Ventures</Link></li>
              <li><Link href="#founder" className="kl-link">Founder</Link></li>
              <li><Link href="#invitation" className="kl-link">Join</Link></li>
              <li><a href="mailto:leizagato@gmail.com" className="kl-link">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="kl-rule my-12" />

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <p className="kl-mono text-smoke">◎ Kingdom of Lights · MMXXVI</p>
          <p className="kl-mono text-smoke">SYN · together, ARKHE · origin, ARKIA · the radiant</p>
        </div>
      </div>
    </footer>
  );
}
