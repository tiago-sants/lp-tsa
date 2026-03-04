'use client';

import { useEffect, useRef } from 'react';

export default function Particles({ count = 50 }: { count?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      const left = Math.random() * 100;
      const delay = Math.random() * 20;
      const duration = 15 + Math.random() * 10;
      particle.style.left = `${left}%`;
      particle.style.bottom = '-2px';
      particle.style.animationDelay = `${delay}s`;
      particle.style.animationDuration = `${duration}s`;
      container.appendChild(particle);
    }

    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [count]);

  return <div ref={containerRef} className="particles" />;
}
