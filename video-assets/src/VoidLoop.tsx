import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import React from 'react';

const Orb: React.FC<{
    color: string;
    size: number;
    x: number;
    y: number;
    delay?: number;
}> = ({ color, size, x, y, delay = 0 }) => {
    const frame = useCurrentFrame();
    const opacity = interpolate(
        Math.sin((frame - delay) * 0.02),
        [-1, 1],
        [0.1, 0.3]
    );

    const moveX = interpolate(
        Math.sin((frame - delay) * 0.01),
        [-1, 1],
        [-50, 50]
    );

    const moveY = interpolate(
        Math.cos((frame - delay) * 0.015),
        [-1, 1],
        [-30, 30]
    );

    return (
        <div
            className="absolute rounded-full blur-[100px]"
            style={{
                backgroundColor: color,
                width: size,
                height: size,
                left: x,
                top: y,
                opacity,
                transform: `translate(${moveX}px, ${moveY}px)`,
            }}
        />
    );
};

export const VoidLoop: React.FC = () => {
    return (
        <AbsoluteFill className="bg-void overflow-hidden">
            {/* Deep Background noise/texture could be added here if we had an image asset */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Lavender Orb - Top Right */}
            <Orb
                color="#B8A9E8"
                size={600}
                x={1200}
                y={-100}
                delay={0}
            />

            {/* Saffron Orb - Bottom Left */}
            <Orb
                color="#E8B84A"
                size={500}
                x={-100}
                y={600}
                delay={100}
            />

            {/* Deep Ink Subtle Center */}
            <Orb
                color="#141020"
                size={800}
                x={600}
                y={300}
                delay={50}
            />
        </AbsoluteFill>
    );
};
