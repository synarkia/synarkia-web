import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    className?: string;
    id?: string;
}

export function Section({ children, className, id, ...props }: SectionProps) {
    return (
        <section
            id={id}
            className={cn(
                "relative py-16 md:py-24 lg:py-32 overflow-hidden",
                className
            )}
            {...props}
        >
            {children}
        </section>
    );
}

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Container({ children, className, size = "lg", ...props }: ContainerProps) {
    const sizes = {
        sm: "max-w-screen-sm", // 640px
        md: "max-w-screen-md", // 768px
        lg: "max-w-[960px]",   // Custom 960px
        xl: "max-w-[1200px]",  // Custom 1200px
        full: "max-w-full",
    };

    return (
        <div
            className={cn(
                "mx-auto w-full px-4 sm:px-6 lg:px-8",
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
