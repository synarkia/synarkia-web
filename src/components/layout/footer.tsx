import Link from "next/link";
import { Container } from "@/components/ui/container";

export function Footer() {
    return (
        <footer className="border-t border-white/5 bg-deep-ink">
            <Container className="py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="font-serif text-2xl tracking-wide text-white block mb-6">
                            SYNARKIA
                        </Link>
                        <p className="text-stone max-w-sm text-sm leading-relaxed">
                            Venture execution alliance. We turn complex vision into operational reality through strategy, assets, and intelligence.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-white/40 mb-6">Divisions</h4>
                        <ul className="space-y-3">
                            <li><Link href="/studio" className="text-stone hover:text-lavender text-sm transition-colors">Studio</Link></li>
                            <li><Link href="/labs" className="text-stone hover:text-lavender text-sm transition-colors">Labs</Link></li>
                            <li><Link href="/allies" className="text-stone hover:text-lavender text-sm transition-colors">Allies</Link></li>
                            <li><Link href="/intelligence" className="text-stone hover:text-lavender text-sm transition-colors">Intelligence</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-white/40 mb-6">Connect</h4>
                        <ul className="space-y-3">
                            <li><Link href="/contact" className="text-stone hover:text-lavender text-sm transition-colors">Contact</Link></li>
                            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-stone hover:text-lavender text-sm transition-colors">Twitter</a></li>
                            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-stone hover:text-lavender text-sm transition-colors">LinkedIn</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
                    <p>© {new Date().getFullYear()} Synarkia. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white/60 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
