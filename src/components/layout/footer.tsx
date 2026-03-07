import Link from "next/link";
import { Container } from "@/components/ui/container";

export function Footer() {
    return (
        <footer className="border-t border-white/5 bg-void">
            <Container className="py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-32">
                    <div>
                        <Link href="/" className="type-logo text-2xl text-cream block mb-6 hover:text-lavender transition-colors">
                            SYNARKIA
                        </Link>
                        <p className="type-body text-stone max-w-sm">
                            Strategic intelligence atelier.
                        </p>

                        <div className="mt-12 space-y-2">
                            <p className="type-caption text-sand">Berlin · Zurich · Lyon · Lisbon</p>
                            <p className="type-caption text-sand">EN · FR · PT · DE</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:items-end md:text-right">
                        <div className="mb-12">
                            <p className="type-h3 text-stone mb-6 max-w-xs ml-auto">
                                If the quality of your work exceeds the quality of your systems —
                            </p>
                            <Link href="/contact" className="type-cta text-saffron hover:text-saffron-warm transition-colors inline-flex items-center gap-2">
                                Let's talk <span className="text-xl leading-none">→</span>
                            </Link>
                        </div>

                        <ul className="flex gap-6 type-nav text-stone mb-12">
                            <li><Link href="/studio" className="hover:text-lavender transition-colors">Studio</Link></li>
                            <li><Link href="/labs" className="hover:text-lavender transition-colors">Labs</Link></li>
                            <li><Link href="/work" className="type-nav text-stone hover:text-saffron transition-colors">Work</Link></li>
                            <li><Link href="/contact" className="hover:text-lavender transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 type-caption text-sand">
                    <p>© {new Date().getFullYear()} SYNARKIA</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-cream transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-cream transition-colors">Terms</Link>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
