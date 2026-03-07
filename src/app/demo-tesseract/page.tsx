'use client';

import { Canvas } from '@react-three/fiber';
import { PixelatedTesseract } from '@/components/3d/PixelatedTesseract';
import { OrbitControls } from '@react-three/drei';

export default function DemoTesseractPage() {
    return (
        <div className="w-full h-screen bg-[#020202] flex flex-col items-center justify-center overflow-hidden">
            <div className="w-full h-full absolute inset-0">
                <Canvas camera={{ position: [0, 0, 7], fov: 60 }}>
                    <color attach="background" args={['#000000']} />
                    <ambientLight intensity={0.5} />
                    <PixelatedTesseract pixelSize={3} size={4.0} />
                    <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                </Canvas>
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-xs font-mono tracking-[0.3em] uppercase z-10 pointer-events-none">
                Tesseract / Hyperspace Demo
            </div>
        </div>
    );
}
