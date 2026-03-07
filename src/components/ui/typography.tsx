import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    className?: string;
    as?: React.ElementType<any>;
}

export function H1({ children, className, as: Component = "h1", ...props }: TypographyProps) {
    return (
        <Component
            className={cn("type-hero text-cream", className)}
            {...props}
        >
            {children}
        </Component>
    );
}

export function H2({ children, className, as: Component = "h2", ...props }: TypographyProps) {
    return (
        <Component
            className={cn("type-h2 text-cream mb-8", className)}
            {...props}
        >
            {children}
        </Component>
    );
}

export function H3({ children, className, as: Component = "h3", ...props }: TypographyProps) {
    return (
        <Component
            className={cn("type-h3 text-cream mb-4", className)}
            {...props}
        >
            {children}
        </Component>
    );
}

export function Text({ children, className, as: Component = "p", ...props }: TypographyProps) {
    return (
        <Component
            className={cn("type-body mb-6", className)}
            {...props}
        >
            {children}
        </Component>
    );
}

export function Label({ children, className, as: Component = "span", ...props }: TypographyProps) {
    return (
        <Component
            className={cn("type-caption block mb-4", className)}
            {...props}
        >
            {children}
        </Component>
    );
}
