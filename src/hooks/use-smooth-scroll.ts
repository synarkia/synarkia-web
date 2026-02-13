"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

let lenisInstance: Lenis | null = null;

/** Access the global Lenis instance from anywhere */
export function useSmoothScroll() {
  return lenisInstance;
}

/** Initialize Lenis smooth scrolling — call once in a root provider */
export function useLenisInit() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;
    lenisInstance = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with GSAP ScrollTrigger
    import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      import("gsap").then(({ gsap }) => {
        gsap.registerPlugin(ScrollTrigger);
        lenis.on("scroll", () => {
          ScrollTrigger.update();
        });
      });
    });

    return () => {
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return lenisRef;
}
