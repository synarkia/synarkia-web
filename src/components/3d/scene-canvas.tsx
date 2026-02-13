"use client";

import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { Suspense } from "react";

interface SceneCanvasProps {
  children: React.ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
  fov?: number;
}

export default function SceneCanvas({
  children,
  className,
  cameraPosition = [0, 0, 5],
  fov = 50,
}: SceneCanvasProps) {
  return (
    <div className={`w-full h-full ${className || ""}`}>
      <Canvas
        className="w-full h-full"
        camera={{ position: cameraPosition, fov }}
        dpr={[1, 1.5]} // Optimize for high-DPI screens
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
