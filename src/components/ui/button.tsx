/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";

// Utility for merging classes
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
    size?: "sm" | "md" | "lg";
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", asChild = false, whileHover, whileTap, ...props }, ref) => {
        // If asChild is true, we render the Slot and pass props.
        // However, Motion props might not be compatible with Slot's children directly in TS.
        // Making this simple: if asChild, we just render Slot without motion props for now to fix build.
        // Or we cast properly.

        const variants = {
            primary: "bg-lavender text-void hover:bg-lavender-soft shadow-[0_0_15px_rgba(184,169,232,0.3)] border border-transparent",
            secondary: "bg-deep-ink text-cream border border-lavender/20 hover:border-lavender/50 hover:bg-twilight",
            outline: "bg-transparent border border-lavender/30 text-lavender hover:bg-lavender/10 hover:border-lavender/60",
            ghost: "bg-transparent text-cream hover:bg-white/5 hover:text-lavender",
            link: "bg-transparent text-lavender underline-offset-4 hover:underline p-0 h-auto",
        };

        const sizes = {
            sm: "h-9 px-4 text-xs uppercase tracking-wider font-semibold",
            md: "h-11 px-6 text-sm uppercase tracking-wider font-semibold",
            lg: "h-14 px-8 text-base uppercase tracking-wider font-semibold",
        };

        // Combine classes
        const classes = cn(
            "inline-flex items-center justify-center rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lavender disabled:pointer-events-none disabled:opacity-50 font-sans",
            variants[variant],
            sizes[size],
            className
        );

        if (asChild) {
            return (
                <Slot
                    ref={ref}
                    className={classes}
                    {...props as any}
                />
            );
        }

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02, ...(typeof whileHover === 'object' ? whileHover : {}) }}
                whileTap={{ scale: 0.98, ...(typeof whileTap === 'object' ? whileTap : {}) }}
                className={classes}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
