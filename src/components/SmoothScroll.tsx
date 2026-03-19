'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenisRef.current = lenis;

    // Integrate Lenis with GSAP ScrollTrigger
    const initScrollTrigger = async () => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const { gsap } = await import('gsap');
      gsap.registerPlugin(ScrollTrigger);

      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    };

    initScrollTrigger();

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
