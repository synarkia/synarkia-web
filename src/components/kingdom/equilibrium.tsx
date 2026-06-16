"use client";

/**
 * The Equilibrium — Art · Science · Religion as three interwoven rings,
 * none above the others, Synarkia held at their intersection.
 * Beauty · Truth · Meaning, made one again.
 */
export function Equilibrium({ className = "" }: { className?: string }) {
  const cx = 300;
  const cy = 270;
  const d = 78; // spread of the three centres
  const r = 132; // ring radius

  const centres = [
    { x: cx, y: cy - d, label: "ART", pursuit: "Beauty", lx: cx, ly: cy - d - r - 18, anchor: "middle" as const },
    { x: cx - d * 0.92, y: cy + d * 0.6, label: "SCIENCE", pursuit: "Truth", lx: cx - d - r * 0.78, ly: cy + d + r * 0.62, anchor: "middle" as const },
    { x: cx + d * 0.92, y: cy + d * 0.6, label: "RELIGION", pursuit: "Meaning", lx: cx + d + r * 0.78, ly: cy + d + r * 0.62, anchor: "middle" as const },
  ];

  return (
    <svg viewBox="0 0 600 560" className={className} fill="none" aria-hidden>
      <g className="kl-breathe">
        {centres.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={r}
            stroke="rgba(244,241,233,0.28)"
            strokeWidth="1"
            pathLength={1}
            style={{
              strokeDasharray: 1,
              strokeDashoffset: 1,
              animation: `kl-draw 2.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.35}s forwards`,
            }}
          />
        ))}
      </g>

      {/* the held centre */}
      <circle cx={cx} cy={cy} r="3.5" fill="#F4F1E9" />
      <circle cx={cx} cy={cy} r="26" stroke="rgba(244,241,233,0.18)" strokeWidth="0.75" className="kl-breathe" />

      {centres.map((c, i) => (
        <g key={i}>
          <text
            x={c.lx}
            y={c.ly}
            textAnchor={c.anchor}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.32em",
              fill: "#F4F1E9",
            }}
          >
            {c.label}
          </text>
          <text
            x={c.lx}
            y={c.ly + 20}
            textAnchor={c.anchor}
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontSize: 18,
              fill: "#74726D",
            }}
          >
            {c.pursuit}
          </text>
        </g>
      ))}
    </svg>
  );
}
