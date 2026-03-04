'use client';

export default function AgendamentoPage() {
  return (
    <>
      <div className="page-header">
        <h1>Agendamento</h1>
        <span className="breadcrumb">Agende uma reunião conosco</span>
      </div>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', overflow: 'hidden', minHeight: '700px' }}>
        <iframe
          src="https://calendly.com/tsasolucoes-tiago/reuniao"
          width="100%"
          height="700"
          frameBorder="0"
          style={{ border: 0, borderRadius: '12px' }}
          title="Calendly - Agendar Reunião"
        />
      </div>
    </>
  );
}
