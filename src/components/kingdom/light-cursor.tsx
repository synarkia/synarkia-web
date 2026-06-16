"use client";

import { useEffect, useRef } from "react";

/** A soft light you carry through the kingdom. Follows the pointer. */
export function LightCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tx = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const cur = { ...tx };

    const onMove = (e: PointerEvent) => {
      tx.x = e.clientX;
      tx.y = e.clientY;
    };

    const loop = () => {
      cur.x += (tx.x - cur.x) * 0.12;
      cur.y += (tx.y - cur.y) * 0.12;
      if (ref.current) {
        ref.current.style.transform = `translate(${cur.x}px, ${cur.y}px)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="kl-cursor-light" aria-hidden />;
}
