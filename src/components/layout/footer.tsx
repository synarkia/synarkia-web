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
                            Alliance ecosystem for conscious human flourishing.
                        </p>

                        <div className="mt-12 space-y-2">
                            <p className="type-caption text-sand">A field for those who remember the future</p>
                            <p className="type-caption text-sand">Together · Already</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:items-end md:text-right">
                        <div className="mb-12">
                            <p className="type-h3 text-stone mb-6 max-w-xs ml-auto">
                                If this calls you, you&apos;re already inside.
                            </p>
                            <Link href="/contact" className="type-cta text-saffron hover:text-saffron-warm transition-colors inline-flex items-center gap-2">
                                Share your gift <span className="text-xl leading-none">→</span>
                            </Link>
                        </div>

                        <ul className="flex gap-6 type-nav text-stone mb-12">
                            <li><Link href="/#vision" className="hover:text-lavender transition-colors">Vision</Link></li>
                            <li><Link href="/#values" className="hover:text-lavender transition-colors">Values</Link></li>
                            <li><Link href="/#vie-pure" className="hover:text-saffron transition-colors">Vie Pure</Link></li>
                            <li><Link href="/#network" className="hover:text-lavender transition-colors">Network</Link></li>
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
