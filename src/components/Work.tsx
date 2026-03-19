'use client';

import { useEffect, useRef } from 'react';
import { notifyTelegram } from '@/lib/telegram';

const services = [
  {
    num: '01',
    title: 'TRÁFEGO PAGO',
    subtitle: 'Campanhas que convertem de verdade',
    subtitleColor: '#a78bfa',
    description: 'Campanhas otimizadas no Google Ads e Facebook Ads para gerar leads e vendas todos os dias.',
    tags: ['GOOGLE ADS', 'META ADS', 'YOUTUBE ADS'],
    bg: '/images/results/client1.png',
  },
  {
    num: '02',
    title: 'SOCIAL MEDIA',
    subtitle: 'Conteúdo que engaja e posiciona',
    subtitleColor: '#2dd4bf',
    description: 'Gestão completa das suas redes sociais com conteúdo relevante e estratégico.',
    tags: ['CRIAÇÃO DE CONTEÚDO', 'GESTÃO DE POSTS', 'ENGAJAMENTO'],
    bg: '/images/results/client4.png',
  },
  {
    num: '03',
    title: 'LANDING PAGES',
    subtitle: 'Páginas que convertem visitantes em clientes',
    subtitleColor: '#a78bfa',
    description: 'Páginas otimizadas para conversão que transformam visitantes em clientes.',
    tags: ['DESIGN RESPONSIVO', 'OTIMIZAÇÃO CRO', 'INTEGRAÇÃO'],
    bg: '/images/results/client3.png',
  },
  {
    num: '04',
    title: 'COMBO COMPLETO',
    subtitle: 'Tráfego + Social para resultados máximos',
    subtitleColor: '#2dd4bf',
    description: 'Tráfego Pago + Social Media para resultados ainda mais potentes.',
    tags: ['TRÁFEGO PAGO', 'SOCIAL MEDIA', 'RELATÓRIOS'],
    bg: '/images/results/client2.png',
  },
  {
    num: '05',
    title: 'SOFTWARE',
    subtitle: 'Soluções digitais sob medida',
    subtitleColor: '#a78bfa',
    description: 'Desenvolvimento de aplicações web e mobile personalizadas para o seu negócio.',
    tags: ['WEB', 'MOBILE', 'SISTEMAS', 'INTEGRAÇÃO'],
    bg: undefined,
  },
];

const total = String(services.length).padStart(2, '0');

export default function Work() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: ReturnType<typeof import('gsap')['gsap']['context']> | undefined;

    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current || !containerRef.current) return;

      const slides = containerRef.current;
      const totalWidth = slides.scrollWidth - window.innerWidth;

      ctx = gsap.context(() => {
        gsap.to(slides, {
          x: -totalWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${totalWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      }, sectionRef.current);
    };

    init();

    return () => {
      ctx?.revert();
    };
  }, []);

  const handleCTA = (serviceName: string) => {
    notifyTelegram(`[HOME] Clique em: QUERO SABER MAIS (${serviceName})`);
    window.open(
      'https://wa.me/5562991845391?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20serviços%20da%20TSA%20Soluções.',
      '_blank'
    );
  };

  return (
    <section ref={sectionRef} id="services" className="work-section">
      <div ref={containerRef} className="work-slides-container">
        {services.map((service) => (
          <div key={service.num} className="work-card">
            <div className="work-card-bg">
              {service.bg && (
                <div
                  className="work-card-bg-img"
                  style={{ backgroundImage: `url(${service.bg})` }}
                />
              )}
              <div className="work-card-bg-overlay" />
            </div>

            <div className="work-card-content">
              <div className="work-card-top">
                <span className="section-label">/ NOSSOS SERVIÇOS / p. 004</span>
                <span className="section-label" style={{ letterSpacing: '3px' }}>
                  {service.num} / {total}
                </span>
              </div>

              <div className="work-card-center">
                <h2 className="title-work" style={{ color: 'var(--foreground)' }}>
                  {service.title}
                </h2>
                <p className="subtitle-accent" style={{ color: service.subtitleColor, marginTop: '16px' }}>
                  {service.subtitle}
                </p>
              </div>

              <div className="work-card-bottom">
                <p className="text-body">{service.description}</p>
                <div className="work-card-tags">
                  {service.tags.map((tag) => (
                    <span key={tag} className="tech-tag">{tag}</span>
                  ))}
                </div>
                <button
                  className="action-link"
                  onClick={() => handleCTA(service.title)}
                  style={{ alignSelf: 'flex-start', marginTop: '8px' }}
                >
                  QUERO SABER MAIS →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
