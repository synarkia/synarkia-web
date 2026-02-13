"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Studio', href: '/studio' },
    { name: 'Labs', href: '/labs' },
    { name: 'Intelligence', href: '/intelligence' },
    { name: 'About', href: '/about' },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        if (isOpen) setIsOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    return (
        <>
            <motion.header
                className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className={cn(
                    "pointer-events-auto flex items-center gap-2 p-2 rounded-full transition-all duration-300",
                    "glass-panel bg-void/80", // Using global glass utility
                    scrolled ? "shadow-2xl shadow-void/50" : ""
                )}>
                    {/* Logo Pill */}
                    <Link href="/" className="flex items-center justify-center px-6 h-12 rounded-full bg-cream text-void hover:scale-105 transition-transform">
                        <span className="font-serif text-lg font-bold tracking-tight">Synarkia</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1 px-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors",
                                        isActive
                                            ? "text-void bg-white"
                                            : "text-white/70 hover:text-white hover:bg-white/10"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Contact Pill */}
                    <Link
                        href="/contact"
                        className="hidden md:flex items-center justify-center px-6 h-12 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-colors ml-2"
                    >
                        Book
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-void/95 backdrop-blur-xl flex flex-col items-center justify-center"
                    >
                        <nav className="flex flex-col items-center gap-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="font-serif text-4xl text-cream hover:text-lavender transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <Link
                                href="/contact"
                                className="mt-8 px-8 py-4 rounded-full bg-cream text-void font-bold text-lg uppercase tracking-wider"
                            >
                                Start Project
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
