import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import React from 'react';

const GridLine: React.FC<{
    orientation: 'horizontal' | 'vertical';
    position: number;
    delay: number;
}> = ({ orientation, position, delay }) => {
    const frame = useCurrentFrame();


    const opacity = interpolate(
        Math.sin((frame - delay) * 0.05),
        [-1, 1],
        [0.05, 0.2]
    );

    return (
        <div
            className={`absolute bg-lavender/30 ${orientation === 'horizontal' ? 'w-full h-px' : 'h-full w-px'
                }`}
            style={{
                [orientation === 'horizontal' ? 'top' : 'left']: `${position}%`,
                opacity,
                transform: orientation === 'horizontal' ? `scaleX(${1})` : `scaleY(${1})`
            }}
        />
    );
};

export const GridLoop: React.FC = () => {
    const frame = useCurrentFrame();

    // Scanning line effect
    const scanPos = interpolate(frame % 300, [0, 300], [0, 100]);

    return (
        <AbsoluteFill className="bg-void overflow-hidden">
            {/* Base Grid */}
            {Array.from({ length: 12 }).map((_, i) => (
                <GridLine
                    key={`h-${i}`}
                    orientation="horizontal"
                    position={(i + 1) * 8.33}
                    delay={i * 10}
                />
            ))}
            {Array.from({ length: 20 }).map((_, i) => (
                <GridLine
                    key={`v-${i}`}
                    orientation="vertical"
                    position={(i + 1) * 5}
                    delay={i * 15}
                />
            ))}

            {/* Scanning Line */}
            <div
                className="absolute w-full h-[2px] bg-saffron/50 blur-[2px] shadow-[0_0_10px_rgba(232,184,74,0.5)]"
                style={{ top: `${scanPos}%` }}
            />
        </AbsoluteFill>
    );
};
