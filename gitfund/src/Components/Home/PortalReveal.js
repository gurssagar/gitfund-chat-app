'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Page1 from './GradientSemiCircle'; // Your front page

gsap.registerPlugin(ScrollTrigger);

const MaskedPage = () => {
    const circleRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: '+=1000', // adjust based on how much scroll you want
                scrub: true,
                pin: true,
            },
        });

        tl.to(circleRef.current, {
            attr: { r: 2000 }, // enough to cover full viewport
            ease: 'none',
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div className="relative w-full h-[200vh] overflow-hidden">
            {/* Page2 - BELOW */}
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-black to-purple-900 flex items-center justify-center">
                <h1 className="text-white text-6xl font-bold">This is Page 2 (Behind)</h1>
            </div>

            {/* SVG Mask */}
            <svg className="fixed inset-0 w-full h-full z-30 pointer-events-none">
                <defs>
                    <mask id="revealMask">
                        <rect width="100%" height="100%" fill="white" />
                        <circle ref={circleRef} cx="50%" cy="50%" r="0" fill="black" />
                    </mask>
                </defs>
                <rect width="100%" height="100%" fill="white" mask="url(#revealMask)" />
            </svg>

            {/* Page1 - FRONT (masked) */}
            <div
                ref={containerRef}
                className="relative w-full h-screen z-20"
                style={{
                    maskImage: 'url(#revealMask)',
                    WebkitMaskImage: 'url(#revealMask)',
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                }}
            >
                <Page1 />
            </div>
        </div>
    );
};

export default MaskedPage;
