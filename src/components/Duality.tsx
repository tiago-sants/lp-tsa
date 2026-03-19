const leftItems = [
  { key: 'TRÁFEGO', value: 'Google Ads, Meta Ads, YouTube Ads' },
  { key: 'SOCIAL', value: 'Criação de conteúdo, gestão de posts' },
  { key: 'LANDING', value: 'Páginas otimizadas para conversão' },
  { key: 'COMBO', value: 'Tráfego + Social Media completo' },
  { key: 'SOFTWARE', value: 'Desenvolvimento de aplicações web e mobile' },
];

const rightItems = [
  { key: 'MISSÃO', value: 'Crescimento com estratégias eficientes' },
  { key: 'VISÃO', value: 'Referência nacional em performance local' },
  { key: 'VALORES', value: 'Transparência, resultados, comprometimento, ética' },
  { key: 'DESDE', value: '2020' },
  { key: 'META', value: 'Evolução contínua' },
];

export default function Duality() {
  return (
    <section id="about" className="duality-section fade-in-section">
      <div className="duality-column">
        <span className="section-label" style={{ marginBottom: '2vw', letterSpacing: '2.5px' }}>
          O QUE FAZEMOS
        </span>
        <h2 className="title-section" style={{ color: 'var(--foreground)', marginBottom: '3vw' }}>
          NOSSOS SERVIÇOS
        </h2>
        {leftItems.map((item) => (
          <div key={item.key} className="duality-item">
            <span className="item-key">{item.key}</span>
            <span className="text-value">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="duality-divider" />

      <div className="duality-column">
        <span className="section-label" style={{ marginBottom: '2vw', letterSpacing: '2.5px' }}>
          O QUE NOS MOVE
        </span>
        <h2 className="title-section" style={{ color: 'var(--foreground)', marginBottom: '3vw' }}>
          NOSSA ESSÊNCIA
        </h2>
        {rightItems.map((item) => (
          <div key={item.key} className="duality-item">
            <span className="item-key">{item.key}</span>
            <span className="text-value">{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
