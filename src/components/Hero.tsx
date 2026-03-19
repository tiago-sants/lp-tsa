import Link from 'next/link';

export default function Hero() {
  return (
    <section id="home" className="hero-brutalist">
      <div className="hero-top">
        <span className="section-label">TSASOLUCOES.COM</span>
        <Link href="/login" className="section-label-light" style={{ textDecoration: 'none' }}>
          ÁREA DO CLIENTE ↗
        </Link>
      </div>

      <div className="hero-name-block">
        <span className="title-hero" style={{ color: 'var(--foreground)', display: 'block' }}>
          TSA
        </span>
        <span className="title-hero" style={{ color: 'var(--primary)', display: 'block' }}>
          SOLUÇÕES
        </span>
      </div>

      {/* <div>
        <div className="hero-signal-line" />
        <div className="hero-bottom">
          <span className="text-body">p. 001</span>
          <span className="text-body" style={{ textTransform: 'uppercase', letterSpacing: '1.8px' }}>
            / MARKETING DIGITAL
          </span>
        </div>
      </div> */}

      <div className="hero-scroll-hint">↓ SCROLL TO TUNE IN</div>
    </section>
  );
}
