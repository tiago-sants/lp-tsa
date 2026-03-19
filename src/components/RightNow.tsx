const metrics = [
  { label: 'CLIENTES', value: '+50 ativos', note: 'e contando' },
  { label: 'VENDAS', value: '+R$1M gerados', note: 'para nossos clientes' },
  { label: 'MERCADO', value: '5 anos', note: 'desde 2020' },
  { label: 'CAMPANHAS', value: '+30 ativas', note: 'rodando agora' },
];

export default function RightNow() {
  return (
    <section id="results" className="rightnow-section fade-in-section">
      <h2 className="title-rightnow">
        <span style={{ color: 'var(--foreground)' }}>RIGHT</span>
        <br />
        <span style={{ color: 'var(--primary)' }}>NOW</span>
      </h2>

      <div className="rightnow-grid">
        {metrics.map((m) => (
          <div key={m.label} className="rightnow-item">
            <div className="rightnow-dot" />
            <div>
              <p className="section-label" style={{ marginBottom: '8px' }}>{m.label}</p>
              <p className="text-value">{m.value}</p>
              <p className="text-micro-italic" style={{ marginTop: '4px' }}>{m.note}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
