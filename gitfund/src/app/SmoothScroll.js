// components/SmoothScroll.js
'use client'

import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.8,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: true,
            touchMultiplier: 2,
        })

        function raf(time) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        // 🧠 Connect Lenis with ScrollTrigger
        ScrollTrigger.scrollerProxy(document.body, {
            scrollTop(value) {
                return arguments.length
                    ? lenis.scrollTo(value)
                    : lenis.scroll.instance.scroll.y
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                }
            },
            pinType: document.body.style.transform ? 'transform' : 'fixed',
        })

        lenis.on('scroll', ScrollTrigger.update)
        ScrollTrigger.defaults({ scroller: document.body })
        ScrollTrigger.refresh()

        return () => {
            lenis.destroy()
            ScrollTrigger.kill() // optional but clean
        }
    }, [])

    return children
}
