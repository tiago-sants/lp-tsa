import { FaBullhorn, FaShareAlt, FaLaptopCode, FaChartLine } from 'react-icons/fa';

const services = [
  {
    icon: FaBullhorn,
    title: 'Tráfego Pago',
    description: 'Campanhas otimizadas no Google Ads e Facebook Ads para gerar leads e vendas todos os dias.',
    features: ['Google Ads', 'Meta Ads', 'YouTube Ads'],
    price: '~R$ 2.000/mês',
    investNote: 'Investimento com anúncios à partir de R$ 1.000/mês*',
  },
  {
    icon: FaShareAlt,
    title: 'Social Media',
    description: 'Gestão completa das suas redes sociais com conteúdo relevante e estratégico.',
    features: ['Criação de Conteúdo', 'Gestão de Posts', 'Engajamento'],
    price: 'R$ 1.500/mês',
  },
  {
    icon: FaLaptopCode,
    title: 'Landing Pages',
    description: 'Páginas otimizadas para conversão que transformam visitantes em clientes.',
    features: ['Design Responsivo', 'Otimização CRO', 'Integração'],
    price: 'À negociar',
  },
  {
    icon: FaChartLine,
    title: 'Combo Completo',
    description: 'Tráfego Pago + Social Media para resultados ainda mais potentes.',
    features: ['Tráfego Pago', 'Social Media', 'Relatórios'],
    price: '~R$ 3.000/mês',
  },
];

export default function Services() {
  return (
    <section id="services" className="services">
      <div className="container">
        <div className="section-header">
          <h2>Nossos Serviços</h2>
          <p>Soluções completas em marketing digital para fazer seu negócio decolar</p>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.title} className="service-card">
              <div className="service-icon neon-glow">
                <service.icon size={32} color="#fff" />
              </div>
              <h3 className="neon-text">{service.title}</h3>
              <p>{service.description}</p>
              <div className="service-features">
                {service.features.map((f) => (
                  <span key={f} className="feature">{f}</span>
                ))}
              </div>
              <div className="service-price">{service.price}</div>
              {service.investNote && <div className="invest-price">{service.investNote}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
