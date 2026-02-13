import React from 'react';
import { Composition } from 'remotion';
import { VoidLoop } from './VoidLoop';
import { GridLoop } from './GridLoop';
import { TesseractLoop } from './TesseractLoop';
import './style.css';

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="VoidLoop"
                component={VoidLoop}
                durationInFrames={300} // 10 seconds at 30fps
                fps={30}
                width={1920}
                height={1080}
            />
            <Composition
                id="GridLoop"
                component={GridLoop}
                durationInFrames={300} // 10 seconds at 30fps
                fps={30}
                width={1920}
                height={1080}
            />
            <Composition
                id="TesseractLoop"
                component={TesseractLoop}
                durationInFrames={300}
                fps={30}
                width={1920}
                height={1080}
            />
        </>
    );
};
