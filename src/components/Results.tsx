import Image from 'next/image';

const results = [
  {
    image: '/images/results/client1.png',
    alt: 'Cliente 1',
    investment: 'R$ 24.000 investidos',
    leads: '+3.500 leads',
    description: 'Salão de Beleza de Alto Padrão',
  },
  {
    image: '/images/results/client4.png',
    alt: 'Cliente 4',
    investment: 'R$ 7.000 investido',
    leads: '+1.000 leads',
    description: 'Clínica de Estética Orofacial',
  },
  {
    image: '/images/results/client3.png',
    alt: 'Cliente 3',
    investment: 'R$ 7.000 investidos',
    leads: '+2.000 leads',
    description: 'Moda Feminina',
  },
  {
    image: '/images/results/client2.png',
    alt: 'Cliente 2',
    investment: 'R$ 6.000 investidos',
    leads: '+400 leads diretos',
    extras: ['+4.500 visitas perfil', '+400k pessoas alcançadas'],
    description: 'Especialista em Mega Hair',
  },
];

export default function Results() {
  return (
    <section id="results" className="results">
      <div className="container">
        <div className="section-header">
          <h2>Resultados Comprovados</h2>
          <p>Números reais de clientes reais</p>
        </div>
        <div className="results-grid">
          {results.map((r) => (
            <div key={r.alt} className="result-card">
              <div className="client-image">
                <Image src={r.image} alt={r.alt} width={400} height={150} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
              </div>
              <div className="result-stats">
                <div className="result-investment">{r.investment}</div>
                <div className="result-leads">{r.leads}</div>
                {r.extras?.map((extra) => (
                  <div key={extra} className="result-extra">{extra}</div>
                ))}
              </div>
              <div className="result-description">
                <p>{r.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
