"use client";

import {
  useRef,
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SceneCanvas } from "./scene-canvas";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollContextValue {
  /** Scroll progress from 0 to 1 */
  progress: number;
  /** Normalized scroll velocity */
  velocity: number;
  /** Scroll direction: 1 = down, -1 = up */
  direction: 1 | -1;
  /** Whether the trigger zone is active */
  isActive: boolean;
}

const ScrollSceneContext = createContext<ScrollContextValue>({
  progress: 0,
  velocity: 0,
  direction: 1,
  isActive: false,
});

/** Access scroll progress/velocity/direction from within a ScrollScene's R3F children */
export function useScrollScene(): ScrollContextValue {
  return useContext(ScrollSceneContext);
}

export interface ScrollSceneProps {
  children: ReactNode;
  className?: string;
  /** Height of the scroll area — defaults to "300vh" */
  scrollHeight?: string;
  /** ScrollTrigger start — defaults to "top top" */
  start?: string;
  /** ScrollTrigger end — defaults to "bottom bottom" */
  end?: string;
  /** Pin the canvas while scrolling — defaults to true */
  pin?: boolean;
  /** Scrub smoothing (true for instant, number for delay) — defaults to 1 */
  scrub?: boolean | number;
  fov?: number;
  cameraPosition?: [number, number, number];
}

export function ScrollScene({
  children,
  className = "",
  scrollHeight = "300vh",
  start = "top top",
  end = "bottom bottom",
  pin = true,
  scrub = 1,
  fov = 50,
  cameraPosition = [0, 0, 5],
}: ScrollSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState<ScrollContextValue>({
    progress: 0,
    velocity: 0,
    direction: 1,
    isActive: false,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start,
        end,
        pin: pin ? canvasWrapperRef.current : false,
        scrub: scrub,
        onUpdate: (self) => {
          setScrollState({
            progress: self.progress,
            velocity: self.getVelocity() / 1000,
            direction: self.direction as 1 | -1,
            isActive: self.isActive,
          });
        },
      });
    },
    { scope: containerRef, dependencies: [start, end, pin, scrub] }
  );

  return (
    <ScrollSceneContext.Provider value={scrollState}>
      <div
        ref={containerRef}
        className={className}
        style={{ height: scrollHeight }}
      >
        <div
          ref={canvasWrapperRef}
          className="w-full"
          style={{ height: "100vh" }}
        >
          {mounted && (
            <SceneCanvas
              className="w-full h-full"
              fov={fov}
              cameraPosition={cameraPosition}
            >
              {children}
            </SceneCanvas>
          )}
        </div>
      </div>
    </ScrollSceneContext.Provider>
  );
}
