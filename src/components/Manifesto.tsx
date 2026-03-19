'use client';

import { useEffect, useRef } from 'react';

const lines = ['TRANSFORMAÇÃO.', 'SOLUÇÕES.', 'ALCANCE.'];

export default function Manifesto() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    let ctx: ReturnType<typeof import('gsap')['gsap']['context']> | undefined;

    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      const words = wordsRef.current.filter(Boolean);
      if (words.length === 0) return;

      ctx = gsap.context(() => {
        // Create a single timeline pinned to the section scroll progress
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            pin: false,
          },
        });

        // Each word reveals sequentially across the full scroll of the section
        words.forEach((word, i) => {
          tl.fromTo(
            word,
            { color: '#1a1a1a' },
            { color: '#f0ebe0', duration: 1 },
            i * 0.5 // stagger: each word starts slightly after the previous
          );
        });
      }, sectionRef.current);
    };

    init();

    return () => {
      ctx?.revert();
    };
  }, []);

  let wordIndex = 0;

  return (
    <section
      ref={sectionRef}
      className="manifesto-section"
      style={{ height: '300vh', position: 'relative' }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '2vw 6vw 0' }}>
          <span className="section-label">/ MANIFESTO / p. 002</span>
        </div>

        <div className="manifesto-inner">
          {lines.map((line, i) => (
            <div key={i} className="title-manifesto" style={{ marginBottom: '0.5vw' }}>
              {line.split('').map((char, ci) => {
                if (char === ' ') return <span key={`s-${ci}`}>&nbsp;</span>;
                const idx = wordIndex++;
                return (
                  <span
                    key={idx}
                    ref={(el) => { if (el) wordsRef.current[idx] = el; }}
                    className="manifesto-word"
                    style={{ color: '#1a1a1a' }}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          ))}
          <div className="manifesto-tagline" style={{ color: '#1a1a1a' }}>
            {'CRIANDO ENVOLVIMENTO, GERANDO RESULTADOS'.split('').map((char, ci) => {
              if (char === ' ') return <span key={`t-${ci}`}>&nbsp;</span>;
              const idx = wordIndex++;
              return (
                <span
                  key={idx}
                  ref={(el) => { if (el) wordsRef.current[idx] = el; }}
                  className="manifesto-word"
                  style={{ color: '#1a1a1a' }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        </div>

        <div style={{ padding: '0 6vw 2vw', opacity: 0.3, marginTop: 'auto' }}>
          <span className="text-micro" style={{ color: 'var(--foreground)' }}>
            tsasolucoes / 2026
          </span>
        </div>
      </div>
    </section>
  );
}
