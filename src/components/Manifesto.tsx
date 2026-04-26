'use client';

import { useEffect, useRef } from 'react';

const lines: { en: string; pt: string }[] = [
  { en: 'TECH.', pt: 'TECNOLOGIA.' },
  { en: 'STRATEGY.', pt: 'ESTRATÉGIA.' },
  { en: 'ACCELERATION.', pt: 'ACELERAÇÃO.' },
];

const TAGLINE = 'CRIANDO ENVOLVIMENTO, GERANDO RESULTADOS';

export default function Manifesto() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const enRefs = useRef<HTMLSpanElement[]>([]);
  const ptRefs = useRef<HTMLSpanElement[]>([]);
  const taglineRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    let ctx: ReturnType<typeof import('gsap')['gsap']['context']> | undefined;

    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      const ens = enRefs.current.filter(Boolean);
      const pts = ptRefs.current.filter(Boolean);
      const tagChars = taglineRefs.current.filter(Boolean);
      if (ens.length === 0 || pts.length === 0) return;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            pin: false,
          },
        });

        ens.forEach((en, i) => {
          const at = i * 0.5;
          tl.to(en, { opacity: 0, y: '-0.4em', duration: 0.5 }, at);
          tl.to(pts[i], { opacity: 1, y: '0em', duration: 0.5 }, at);
        });

        if (tagChars.length) {
          tl.fromTo(
            tagChars,
            { color: '#1a1a1a' },
            { color: '#f0ebe0', duration: 1, stagger: 0.02 },
            ens.length * 0.5,
          );
        }
      }, sectionRef.current);
    };

    init();

    return () => {
      ctx?.revert();
    };
  }, []);

  let tagIdx = 0;

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
          {lines.map((pair, i) => (
            <div
              key={i}
              className="title-manifesto manifesto-line"
              style={{ marginBottom: '0.5vw' }}
            >
              <span
                ref={(el) => { if (el) enRefs.current[i] = el; }}
                className="manifesto-lang"
                style={{ color: '#f0ebe0' }}
              >
                {pair.en}
              </span>
              <span
                ref={(el) => { if (el) ptRefs.current[i] = el; }}
                className="manifesto-lang"
                style={{ color: '#f0ebe0', opacity: 0, transform: 'translateY(0.4em)' }}
              >
                {pair.pt}
              </span>
            </div>
          ))}
          <div className="manifesto-tagline" style={{ color: '#1a1a1a' }}>
            {TAGLINE.split('').map((char, ci) => {
              if (char === ' ') return <span key={`t-${ci}`}>&nbsp;</span>;
              const idx = tagIdx++;
              return (
                <span
                  key={ci}
                  ref={(el) => { if (el) taglineRefs.current[idx] = el; }}
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
