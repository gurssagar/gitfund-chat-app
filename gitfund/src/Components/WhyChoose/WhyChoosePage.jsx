import React, { useEffect, useRef } from 'react'
import DotGrid from './DotGridBackground'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { anticipate, easeInOut } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const PurpleSphere = ({
    top = '50px',       // Default top position
    left = '50px',      // Default left position
    width = '200px',    // Default width
    height = '200px',   // Default height
    style = {},          // Allows for additional custom inline styles
    sphereRef
}) => {
    // Combine dynamic positioning/sizing with any custom styles
    const svgStyle = {
        position: 'absolute', // Essential for 'top' and 'left' to work
        top: top,
        left: left,
        width: width,
        height: height,
        ...style // Merge any additional styles passed via the 'style' prop
    };

    return (
        // Apply the dynamic style object to the SVG element
        <div className='z-40'>
            <svg ref={sphereRef} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={svgStyle}>
                <defs>
                    {/* Radial gradient for the sphere's main color and depth */}
                    <radialGradient id="purpleSphereGradient" cx="30%" cy="30%" r="70%" fx="30%" fy="30%">
                        <stop offset="0%" stopColor="#e0b0ff" /> {/* Lighter purple for highlight area */}
                        <stop offset="50%" stopColor="#8a2be2" /> {/* Medium purple */}
                        <stop offset="100%" stopColor="#5a0090" /> {/* Darker purple for edges */}
                    </radialGradient>

                    {/* Radial gradient for the specular highlight */}
                    <radialGradient id="sphereHighlight" cx="35%" cy="25%" r="30%" fx="35%" fy="25%">
                        <stop offset="0%" stopColor="rgba(255, 255, 255, 0.8)" />
                        <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                    </radialGradient>

                    {/* Filter for the shadow blur */}
                    <filter id="shadowBlur" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
                        <feOffset dx="0" dy="5" result="offsetblur" />
                        <feMerge>
                            <feMergeNode in="offsetblur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Shadow - a blurred ellipse positioned below the sphere */}
                <ellipse cx="100" cy="180" rx="60" ry="10" fill="rgba(0, 0, 0, 0.2)" filter="url(#shadowBlur)" />

                {/* Sphere body */}
                <circle cx="100" cy="100" r="80" fill="url(#purpleSphereGradient)" />

                {/* Specular Highlight */}
                <circle cx="90" cy="80" r="50" fill="url(#sphereHighlight)" />

                {/* Small, sharp highlight for extra shine */}
                <circle cx="75" cy="70" r="10" fill="rgba(255, 255, 255, 0.9)" />
            </svg>
        </div>
    );
};

const WhyChoosePage = () => {
    const Container = useRef(null)
    const Container2 = useRef(null)
    const Sphere = useRef(null)
    const Grid = useRef(null)
    const Grid2 = useRef(null)
    const Text = useRef(null)

    const GE1 = useRef(null)
    const GE2 = useRef(null)
    const GE3 = useRef(null)
    const GE4 = useRef(null)
    const GE5 = useRef(null)
    const GE6 = useRef(null)
    const GE7 = useRef(null)

    useEffect(() => {
        gsap.to(Sphere.current, {
            y: -500,
            ease: "expo.out",
            duration: 0.5,
            scrollTrigger: {
                trigger: Container.current,
                start: 'top 20%',
                end: '45% 50%',
                scrub: 1
            }
        })

        gsap.to(Grid.current, {
            y: -160,
            rotateX: 0,
            ease: "expo.out",
            duration: 0.5,
            scrollTrigger: {
                trigger: Container.current,
                start: 'top 20%',
                end: '45% 50%',
                scrub: 1
            }
        })

        gsap.to(Grid2.current, {
            y: -160,
            rotateX: 0,
            ease: "expo.out",
            duration: 0.5,
            scrollTrigger: {
                trigger: Container2.current,
                start: 'top 20%',
                end: '45% 50%',
                scrub: 1
            }
        })

        gsap.to(Text.current, {
            y: -100,
            duration: 0.1,
            ease: "power4.inOut",
            scrollTrigger: {
                trigger: Container.current,
                start: 'top 20%',
                end: '40% 50%',
                scrub: 1
            }
        })

        gsap.to(".grid-fade-wrapper", {
            opacity: 0,
            ease: "power4.inOut",
            scrollTrigger: {
                trigger: Container2.current,
                start: 'top 20%',
                end: 'bottom -140%',
                scrub: 1,
                pin: true
            }
        })

        gsap.to(".grid-fade-wrapper", {
            opacity: 0,
            ease: "power4.inOut",
            scrollTrigger: {
                trigger: Container.current,
                start: 'top 20%',
                end: 'bottom top',
                scrub: 1,
                pin: true
            }
        })

        ScrollTrigger.refresh();

    }, [])

    useEffect(() => {
        const isLargeScreen = window.matchMedia('(min-width: 768px)').matches;

        if (!isLargeScreen) return; // Skip animation for small screens (mobiles)

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: Container2.current,
                start: 'top 20%',
                end: '+=1800',
                scrub: 1,
                scroller: document.body
            },
        });

        ScrollTrigger.refresh();

        // Add all animations at the same time (0)
        tl.to(GE1.current, {
            x: "-208%",
            y: "315%",
            opacity: 1,
            ease: "power4.inOut"
        }, 0)

            .to(GE2.current, {
                x: "310%",
                y: "210%",
                opacity: 1,
                ease: "power4.inOut"
            }, 0)

            .to(GE3.current, {
                x: "-205%",
                y: "212%",
                opacity: 1,
                ease: "power4.inOut"
            }, 0)

            .to(GE4.current, {
                x: "0%",
                y: "3%",
                opacity: 1,
                ease: "power4.inOut"
            }, 0)

            .to(GE5.current, {
                x: "0%",
                y: "3%",
                opacity: 1,
                ease: "power4.inOut"
            }, 0)

            .to(GE6.current, {
                x: "-100%",
                y: "-100%",
                opacity: 1,
                ease: "power4.inOut"
            }, 0)

            .to(GE7.current, {
                x: "206%",
                y: "-100%",
                opacity: 1,
                ease: "power4.inOut"
            }, 0);

        tl.to(Grid2.current, {
            y: -240,
            scale: 1.75,
            ease: "power4.inOut",
            // duration: 0.08
        }, 0.3)

        tl.to(GE3.current, {
            y: 50,
            opacity: 0,
            ease: "power1.inOut",
            duration: 0.1
        }, 1)

        tl.to(GE5.current, {
            y: 50,
            opacity: 0,
            ease: "power1.inOut",
            duration: 0.1
        }, 1)

        tl.to(GE6.current, {
            y: 50,
            opacity: 0,
            ease: "power1.inOut",
            duration: 0.1
        }, 1)

        tl.to(GE7.current, {
            y: 50,
            opacity: 0,
            ease: "power1.inOut",
            duration: 0.1
        }, 1)

        tl.to(Grid2.current, {
            y: -390,
            scale: 2.3,
            ease: "power4.inOut",
            // duration: 0.08
        }, 1)

        tl.to(GE2.current, {
            y: 50,
            opacity: 0,
            ease: "power1.inOut",
            duration: 0.1
        }, 1.5)

        tl.to(GE4.current, {
            y: 50,
            opacity: 0,
            ease: "power1.inOut",
            duration: 0.1
        }, 1.5)

        tl.to(Grid2.current, {
            y: -530,
            scale: 3,
            scaleY: 3.5,
            ease: "power4.inOut",
            // duration: 0.08
        }, 2)

    }, [])

    return (
        <div className='w-full h-[400vh] relative items-center justify-center flex'>

            <PurpleSphere
                sphereRef={Sphere}
                top="150"
                left="550"
                width="400px"
                height="500px"
            />

            <div className='w-full h-full min-h-screen relative'>
                <DotGrid
                    dotSize={4}
                    gap={30}
                    baseColor="#ffffff50"
                    activeColor="#9D00FF"
                    proximity={150}
                    shockRadius={300}
                    shockStrength={6.6}
                    resistance={800}
                    returnDuration={1.5}
                />
            </div>

            <div ref={Text} className='absolute z-50 top-15'>
                <div className='flex flex-col gap-5'>
                    <div className='text-[#FFEE00] flex text-[2.5vw] md:text-xs justify-evenly w-screen items-center font-light'>
                        <p>ALL-IN-ONE TOOL</p>
                        <p>SINGLE PLATFORM</p>
                        <p>PERFECT ORGANISED</p>
                        <p>AUTOMATIC PROCESSES</p>
                    </div>

                    <div className='flex items-center justify-center w-full'>
                        <h1 className='text-center font-semibold text-[8vw] leading-10 md:leading-32 max-w-[50vw] text-[white] w-full'>Why choose GITFUND</h1>
                    </div>
                </div>
            </div>

            <div ref={Container} style={{ perspective: "1000px" }} className='absolute top-23 md:top-63'>
                <div style={{ perspective: "1000px" }} className="grid-fade-wrapper">
                    <div ref={Grid} className='bg-[#0F1013] h-[60vh] md:h-[110vh] w-[80vw] md:w-[58vw] border-2 border-[#bebebe27] rounded-xl grid gap-1.5 p-1 grid-cols-5 grid-rows-5 rotate-x-[55deg]'>

                        <div className='rounded-md border-2 border-[#bebebe27]'>

                        </div>

                        <div className='rounded-md border-2 border-[#bebebe27]'>

                        </div>

                        <div className='rounded-md border-2 border-[#bebebe27]'>

                        </div>

                        <div className='rounded-md border-2 border-[#bebebe27]'>

                        </div>

                        <div className='rounded-md'>

                        </div>

                        <div className='rounded-md'>

                        </div>

                        <div className='rounded-md border-2 border-[#bebebe27]'>

                        </div>

                        <div className='rounded-md'>

                        </div>

                        <div className='rounded-md border-2 border-[#bebebe27]'>

                        </div>

                        <div className='rounded-md border-2 border-[#bebebe27]'>

                        </div>

                        <div className='rounded-md border-2 border-[#bebebe27]'>

                        </div>

                        <div className='rounded-md border-2 border-[#bebebe27]'>

                        </div>

                        <div className='rounded-md border-2 border-[#bebebe27]'>

                        </div>

                        <div className='rounded-md border-2 border-[#bebebe27]'>

                        </div>

                        <div className='rounded-md border-2 border-[#bebebe27]'>

                        </div>

                        <div className='rounded-md border-2 border-[#bebebe27]'>

                        </div>

                        <div className='rounded-md'>

                        </div>

                        <div className='rounded-md border-2 border-[#bebebe27]'>

                        </div>

                        <div className='rounded-md border-2 border-[#bebebe27]'>

                        </div>

                        <div className='rounded-md'>

                        </div>

                        <div className='rounded-md'>

                        </div>

                        <div className='rounded-md border-2 border-[#bebebe27]'>

                        </div>

                        <div className='rounded-md border-2 border-[#bebebe27]'>

                        </div>

                        <div className='rounded-md'>

                        </div>

                        <div className='rounded-md border-2 border-[#bebebe27]'>

                        </div>
                    </div>
                </div>
            </div>

            <div ref={Container2} style={{ perspective: "1000px" }} className='absolute top-23 md:top-63'>
                <div style={{ perspective: "1000px" }} className="grid-fade-wrapper2">
                    <div ref={Grid2} className='bg-transparent h-[60vh] md:h-[110vh] w-[80vw] md:w-[58vw] rounded-xl grid gap-1.5 p-1 grid-cols-5 grid-rows-5 rotate-x-[55deg]'>

                        <div className=''></div>
                        <div className=''></div>
                        <div className=''></div>
                        <div className=''></div>

                        <div ref={GE1} className='rounded-md border-2 bg-[#bb1bfa]'>
                            1
                        </div>

                        <div ref={GE2} className='rounded-md border-2 bg-[#bb1bfa]'>
                            2
                        </div>

                        <div className=''></div>

                        <div ref={GE3} className='rounded-md border-2 bg-[#bb1bfa]'>
                            3
                        </div>

                        <div className=''></div>
                        <div className=''></div>
                        <div className=''></div>
                        <div className=''></div>
                        <div className=''></div>
                        <div className=''></div>
                        <div className=''></div>
                        <div className=''></div>

                        <div ref={GE4} className='rounded-md border-2 bg-[#bb1bfa]'>
                            4
                        </div>

                        <div className=''></div>
                        <div className=''></div>

                        <div ref={GE5} className='rounded-md border-2 bg-[#bb1bfa]'>
                            5
                        </div>

                        <div ref={GE6} className='rounded-md border-2 bg-[#bb1bfa]'>
                            6
                        </div>

                        <div className=''></div>
                        <div className=''></div>

                        <div ref={GE7} className='rounded-md border-2 bg-[#bb1bfa]'>
                            7
                        </div>

                        <div className=''></div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default WhyChoosePage
