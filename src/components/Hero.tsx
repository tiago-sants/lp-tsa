'use client';

import Link from 'next/link';
import { notifyTelegramAndRedirect, notifyTelegram } from '@/lib/telegram';
import Particles from './Particles';

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <div className="hero-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
        <Particles count={50} />
      </div>

      <div className="container">
        <div className="hero-content">
          <div className="hero-text slide-in-left visible">
            <h1 className="hero-title glitch-text" data-text="Criando Envolvimento, Gerando Resultados">
              <span className="highlight">Criando Envolvimento,</span>
              <br />
              Gerando <span className="highlight">Resultados</span>
            </h1>
            <p className="hero-subtitle">
              Agência de marketing digital especializada em gerar oportunidades reais para o seu
              negócio crescer todos os dias.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">+50</span>
                <span className="stat-label">Clientes Atendidos</span>
              </div>
              <div className="stat">
                <span className="stat-number">+R$1M</span>
                <span className="stat-label">Em Vendas Geradas</span>
              </div>
              <div className="stat">
                <span className="stat-number">5 anos</span>
                <span className="stat-label">De Experiência</span>
              </div>
            </div>
            <div className="hero-cta">
              <Link
                href="/formulario"
                className="btn btn-primary btn-large"
                onClick={() => notifyTelegram('[HOME] 🚀 Clique em : QUERO CRESCER AGORA')}
              >
                <i className="fas fa-rocket" /> QUERO CRESCER AGORA
              </Link>
              <a
                href="#services"
                className="btn btn-secondary"
                onClick={(e) => {
                  e.preventDefault();
                  notifyTelegram('[HOME] 🚀 Clique em : VER SERVIÇOS');
                  document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Ver Serviços
              </a>
            </div>
          </div>

          <div className="hero-visual slide-in-right visible">
            <div className="dashboard-mockup">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span /><span /><span />
                </div>
                <div className="mockup-title">Dashboard TSA</div>
              </div>
              <div className="chart-container">
                <svg viewBox="0 0 300 150" className="growth-chart">
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#00d4ff" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                  <polyline
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    className="chart-line"
                    points="10,130 60,110 110,90 160,60 210,40 260,15"
                  />
                  <circle cx="10" cy="130" r="5" fill="#00d4ff" className="chart-point" />
                  <circle cx="60" cy="110" r="5" fill="#00d4ff" className="chart-point" />
                  <circle cx="110" cy="90" r="5" fill="#00d4ff" className="chart-point" />
                  <circle cx="160" cy="60" r="5" fill="#7c3aed" className="chart-point" />
                  <circle cx="210" cy="40" r="5" fill="#7c3aed" className="chart-point" />
                  <circle cx="260" cy="15" r="5" fill="#7c3aed" className="chart-point" />
                </svg>
                <div className="chart-labels">
                  <span className="label">Jan</span>
                  <span className="label">Fev</span>
                  <span className="label">Mar</span>
                  <span className="label">Abr</span>
                  <span className="label">Mai</span>
                  <span className="label">Jun</span>
                </div>
              </div>
              <div className="metrics-row">
                <div className="metric">
                  <div className="metric-value">+247%</div>
                  <div className="metric-label">Crescimento</div>
                </div>
                <div className="metric">
                  <div className="metric-value">1.2k</div>
                  <div className="metric-label">Leads/mês</div>
                </div>
                <div className="metric">
                  <div className="metric-value">4.8x</div>
                  <div className="metric-label">ROAS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
