"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const UnicornScene = dynamic(() => import("unicornstudio-react/next").then((mod) => mod.default), {
    ssr: false,
});

interface UnicornEmbedProps {
    projectId: string;
    width?: string;
    height?: string;
    className?: string;
}

export function UnicornEmbed({ projectId, width = "100%", height = "100%", className }: UnicornEmbedProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className={className} style={{ width, height }}>
            <UnicornScene
                projectId={projectId}
                sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.5/dist/unicornStudio.umd.js"
                width="100%"
                height="100%"
                scale={1}
                dpi={1.5}
                fps={60}
                lazyLoad={true}
                production={true}
            />
        </div>
    );
}
