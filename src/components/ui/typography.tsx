
import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    className?: string;
    as?: React.ElementType;
}

export function H1({ children, className, as: Component = "h1", ...props }: TypographyProps) {
    return (
        <Component
            className={cn(
                "font-serif text-6xl md:text-8xl lg:text-9xl tracking-tighter leading-[0.9] text-white",
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
}

export function H2({ children, className, as: Component = "h2", ...props }: TypographyProps) {
    return (
        <Component
            className={cn(
                "font-serif text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1] text-white mb-8",
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
}

export function H3({ children, className, as: Component = "h3", ...props }: TypographyProps) {
    return (
        <Component
            className={cn(
                "font-serif text-3xl md:text-4xl tracking-tight text-white mb-4",
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
}

export function Text({ children, className, as: Component = "p", ...props }: TypographyProps) {
    return (
        <Component
            className={cn(
                "font-sans text-lg md:text-xl text-white/70 leading-relaxed font-light",
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
}

export function Label({ children, className, as: Component = "span", ...props }: TypographyProps) {
    return (
        <Component
            className={cn(
                "font-sans text-xs font-bold uppercase tracking-[0.2em] text-white/50 block mb-4",
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
}

