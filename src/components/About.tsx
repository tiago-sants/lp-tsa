import { FaBullseye, FaEye, FaHeart } from 'react-icons/fa';

export default function About() {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-header">
          <h2>Quem Somos</h2>
          <p>Transformando negócios através de estratégias profissionais de marketing digital</p>
        </div>
        <div className="about-content">
          <div className="about-text">
            <h3>Desde 2020 ajudando empresas a crescerem</h3>
            <p>
              A TSA Soluções ajuda empresas a alcançarem mais resultados por meio de estratégias
              profissionais de tráfego pago. Atuamos com foco em conversão, entregando oportunidades
              reais todos os dias através de campanhas otimizadas e direcionadas.
            </p>
            <p>
              Nosso objetivo é simples: gerar crescimento constante para negócios que querem vender
              mais e aparecer para as pessoas certas.
            </p>
            <div className="mission-vision-values">
              <div className="mvv-item">
                <div className="mvv-icon">
                  <FaBullseye size={24} color="#fff" />
                </div>
                <h4>Missão</h4>
                <p>
                  Ajudar empresas a crescerem com estratégias de marketing digital eficientes,
                  conectando negócios locais às pessoas certas, no momento certo.
                </p>
              </div>
              <div className="mvv-item">
                <div className="mvv-icon">
                  <FaEye size={24} color="#fff" />
                </div>
                <h4>Visão</h4>
                <p>
                  Ser referência nacional em performance para negócios locais, entregando resultados
                  reais e consistentes através do marketing digital.
                </p>
              </div>
              <div className="mvv-item">
                <div className="mvv-icon">
                  <FaHeart size={24} color="#fff" />
                </div>
                <h4>Valores</h4>
                <p>
                  Transparência, foco em resultado, comprometimento com o cliente, evolução contínua
                  e ética em cada ação.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
