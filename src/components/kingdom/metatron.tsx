"use client";

import { useMemo } from "react";

/**
 * Metatron's Cube — the seed-symbol of Synarkia (the Notion codex icon).
 * 13 nodes (centre + two concentric hexagons) with every node joined to
 * every other. Thin white lines on the void. Ancient geometry, future light.
 */
export function Metatron({ className = "" }: { className?: string }) {
  const { nodes, lines } = useMemo(() => {
    const cx = 300;
    const cy = 300;
    const R = 84;
    const pts: { x: number; y: number }[] = [{ x: cx, y: cy }];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 180) * (i * 60 - 90);
      pts.push({ x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) });
    }
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 180) * (i * 60 - 90);
      pts.push({ x: cx + 2 * R * Math.cos(a), y: cy + 2 * R * Math.sin(a) });
    }
    const ls: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        ls.push({ x1: pts[i].x, y1: pts[i].y, x2: pts[j].x, y2: pts[j].y });
      }
    }
    return { nodes: pts, lines: ls };
  }, []);

  return (
    <svg
      viewBox="0 0 600 600"
      className={className}
      fill="none"
      aria-hidden
      style={{ overflow: "visible" }}
    >
      <g className="kl-rotate" style={{ transformOrigin: "300px 300px" }}>
        <circle cx="300" cy="300" r="252" stroke="rgba(244,241,233,0.10)" strokeWidth="0.75" />
        <circle cx="300" cy="300" r="168" stroke="rgba(244,241,233,0.07)" strokeWidth="0.75" />
        {lines.map((l, i) => (
          <line
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="rgba(244,241,233,0.13)"
            strokeWidth="0.6"
          />
        ))}
        {nodes.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === 0 ? 3.4 : 2.4}
            fill="rgba(244,241,233,0.85)"
          />
        ))}
      </g>
    </svg>
  );
}
