'use client';

import Link from 'next/link';
import { FaRocket, FaCheck } from 'react-icons/fa';
import { notifyTelegram } from '@/lib/telegram';

export default function CTA() {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content">
          <h2>🚀 Vamos decolar o seu negócio?</h2>
          <p>
            Pare de depender apenas de indicações. Tenha uma fonte constante de leads qualificados
            todos os dias com campanhas estratégicas e mensuráveis.
          </p>
          <div className="cta-benefits">
            <div className="benefit">
              <FaCheck />
              <span>Campanhas que eliminam a incerteza do boca a boca</span>
            </div>
            <div className="benefit">
              <FaCheck />
              <span>Relatórios claros e gestão com foco em previsibilidade</span>
            </div>
            <div className="benefit">
              <FaCheck />
              <span>Investimento com ROI comprovado</span>
            </div>
          </div>
          <Link
            href="/formulario"
            className="btn btn-primary btn-large"
            onClick={() => notifyTelegram('[HOME] 🚀 Clique em : QUERO CLIENTES AGORA')}
          >
            <FaRocket />
            QUERO CLIENTES AGORA
          </Link>
        </div>
      </div>
    </section>
  );
}
