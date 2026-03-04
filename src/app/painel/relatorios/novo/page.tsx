'use client';

import { useAuth } from '@/lib/auth';
import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaRobot, FaPlus, FaTrash, FaSave, FaPaperPlane } from 'react-icons/fa';
import { Suspense } from 'react';

interface MonthForm {
  mes: string;
  investimento: string;
  mensagensRecebidas: string;
  custoPorMensagem: string;
  visualizacoes: string;
}

function NovoRelatorioContent() {
  const { user, token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedClientId = searchParams.get('clientId');

  const [clients, setClients] = useState<{ id: number; company_name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    clientId: preselectedClientId || '',
    title: 'Relatório Estratégico Mensal',
  });

  const [months, setMonths] = useState<MonthForm[]>([{
    mes: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
    investimento: '',
    mensagensRecebidas: '',
    custoPorMensagem: '',
    visualizacoes: '',
  }]);

  const [result, setResult] = useState<{
    reportId: number;
    aiAnalysis: string;
    performanceScore: number;
  } | null>(null);

  const fetchClients = useCallback(() => {
    if (!token) return;
    api<{ clients: { id: number; company_name: string }[] }>('/clients', { token })
      .then((data) => setClients(data.clients || []))
      .catch(() => setClients([]));
  }, [token]);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const addMonth = () => {
    setMonths([...months, {
      mes: '',
      investimento: '',
      mensagensRecebidas: '',
      custoPorMensagem: '',
      visualizacoes: '',
    }]);
  };

  const removeMonth = (idx: number) => {
    if (months.length <= 1) return;
    setMonths(months.filter((_, i) => i !== idx));
  };

  const updateMonth = (idx: number, field: keyof MonthForm, value: string) => {
    const updated = [...months];
    updated[idx][field] = value;
    setMonths(updated);
  };

  const handleGenerate = async () => {
    if (!token || !form.clientId) return;
    setGenerating(true);

    try {
      const meses = months.map((m) => ({
        mes: m.mes,
        investimento: m.investimento ? Number(m.investimento) : null,
        mensagensRecebidas: m.mensagensRecebidas ? Number(m.mensagensRecebidas) : null,
        custoPorMensagem: m.custoPorMensagem ? Number(m.custoPorMensagem) : null,
        visualizacoes: m.visualizacoes ? Number(m.visualizacoes) : null,
      }));

      const data = await api<{
        report: {
          id: number;
          ai_analysis: string;
          performance_score: number;
        };
      }>('/reports', {
        token,
        method: 'POST',
        body: {
          clientId: Number(form.clientId),
          title: form.title,
          meses,
        },
      });

      setResult({
        reportId: data.report.id,
        aiAnalysis: data.report.ai_analysis,
        performanceScore: data.report.performance_score,
      });
      setStep(3);
    } catch (err) {
      alert('Erro ao gerar relatório: ' + (err instanceof Error ? err.message : 'Erro desconhecido'));
    } finally {
      setGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!token || !result) return;
    setLoading(true);
    try {
      await api(`/reports/${result.reportId}`, {
        token,
        method: 'PUT',
        body: { status: 'published' },
      });
      router.push(`/painel/relatorios/${result.reportId}`);
    } catch {
      alert('Erro ao publicar');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') return null;

  const inputStyle = { width: '100%', padding: '0.5rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' };

  return (
    <>
      <div className="page-header">
        <h1>Novo Relatório</h1>
        <span className="breadcrumb">Passo {step} de 3</span>
      </div>

      {/* Step Indicators */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        {['Configuração', 'Métricas', 'Resultado'].map((label, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: step > i + 1 ? '#22c55e' : step === i + 1 ? 'var(--accent-color)' : 'var(--bg-tertiary)',
              color: '#fff', fontWeight: 600, marginBottom: '0.25rem',
            }}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <div style={{ fontSize: '0.8rem', color: step === i + 1 ? 'var(--accent-color)' : 'var(--text-secondary)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Step 1: Configuration */}
      {step === 1 && (
        <div className="stat-card">
          <h3 style={{ marginBottom: '1.5rem' }}>Configuração do Relatório</h3>
          <div style={{ display: 'grid', gap: '1rem', maxWidth: '500px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Cliente *</label>
              <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} style={inputStyle}>
                <option value="">Selecione um cliente</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Título do Relatório</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} />
            </div>
            <button onClick={() => form.clientId && setStep(2)} disabled={!form.clientId} className="btn-primary" style={{ padding: '0.6rem 1.5rem', justifySelf: 'start' }}>
              Próximo →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Metrics */}
      {step === 2 && (
        <>
          {months.map((month, monthIdx) => (
            <div key={monthIdx} className="stat-card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ flex: 1, marginRight: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Período (mês)</label>
                  <input type="text" value={month.mes} onChange={(e) => updateMonth(monthIdx, 'mes', e.target.value)} placeholder="Ex: Janeiro 2025" style={inputStyle} />
                </div>
                {months.length > 1 && (
                  <button onClick={() => removeMonth(monthIdx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }} title="Remover mês">
                    <FaTrash />
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Investimento (R$)</label>
                  <input type="number" step="0.01" value={month.investimento} onChange={(e) => updateMonth(monthIdx, 'investimento', e.target.value)} placeholder="0.00" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Mensagens Recebidas</label>
                  <input type="number" value={month.mensagensRecebidas} onChange={(e) => updateMonth(monthIdx, 'mensagensRecebidas', e.target.value)} placeholder="0" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Custo por Mensagem (R$)</label>
                  <input type="number" step="0.01" value={month.custoPorMensagem} onChange={(e) => updateMonth(monthIdx, 'custoPorMensagem', e.target.value)} placeholder="0.00" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Visualizações</label>
                  <input type="number" value={month.visualizacoes} onChange={(e) => updateMonth(monthIdx, 'visualizacoes', e.target.value)} placeholder="0" style={inputStyle} />
                </div>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button onClick={addMonth} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <FaPlus /> Adicionar Mês
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setStep(1)} style={{ padding: '0.6rem 1.5rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              ← Voltar
            </button>
            <button onClick={handleGenerate} disabled={generating} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.5rem' }}>
              <FaRobot /> {generating ? 'Gerando com IA...' : 'Gerar Relatório com IA'}
            </button>
          </div>

          {generating && (
            <div style={{ textAlign: 'center', padding: '2rem', marginTop: '1rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem', animation: 'pulse 1.5s ease-in-out infinite' }}>🤖</div>
              <p style={{ color: 'var(--accent-color)' }}>A IA está analisando os dados e gerando o relatório...</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Isso pode levar alguns segundos.</p>
            </div>
          )}
        </>
      )}

      {/* Step 3: Result */}
      {step === 3 && result && (
        <>
          {/* Score Gauge */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
            <div style={{
              width: 140, height: 140, borderRadius: '50%',
              border: `5px solid ${result.performanceScore >= 80 ? '#22c55e' : result.performanceScore >= 50 ? '#f59e0b' : '#ef4444'}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)',
            }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 700, color: result.performanceScore >= 80 ? '#22c55e' : result.performanceScore >= 50 ? '#f59e0b' : '#ef4444' }}>
                {result.performanceScore}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>de 100</span>
            </div>
          </div>

          <div className="stat-card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>📊 Análise IA (Gemini)</h3>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
              {result.aiAnalysis}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => router.push(`/painel/relatorios/${result.reportId}`)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.5rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <FaSave /> Salvar como Rascunho
            </button>
            <button onClick={handlePublish} disabled={loading} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.5rem' }}>
              <FaPaperPlane /> {loading ? 'Publicando...' : 'Publicar e Notificar Cliente'}
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default function NovoRelatorioPage() {
  return (
    <Suspense fallback={<p style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</p>}>
      <NovoRelatorioContent />
    </Suspense>
  );
}
