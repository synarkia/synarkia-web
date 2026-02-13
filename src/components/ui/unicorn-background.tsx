"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const UnicornScene = dynamic(() => import("unicornstudio-react/next").then((mod) => mod.default), {
    ssr: false,
});

export function UnicornBackground() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 w-full h-full z-0">
            <UnicornScene
                projectId="5B0e0rj49iRrPD000TpY"
                sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.5/dist/unicornStudio.umd.js"
                width="100%"
                height="100%"
                scale={1}
                dpi={1.5}
                fps={60}
                lazyLoad={false}
                production={true}
            />
            {/* Overlay to ensure text readability if needed, though Scene might handle it */}
            <div className="absolute inset-0 bg-void/20 pointer-events-none" />
        </div>
    );
}
