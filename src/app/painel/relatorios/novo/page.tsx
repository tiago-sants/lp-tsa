'use client';

import { useAuth } from '@/lib/auth';
import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaRobot, FaPlus, FaTrash, FaSave, FaPaperPlane } from 'react-icons/fa';
import { Suspense } from 'react';

// Catálogo de métricas por objetivo (espelho do backend)
type CampaignObjective = 'mensagens' | 'visualizacoes_video' | 'visitas_perfil' | 'seguidores' | 'acesso_site' | 'cliques' | 'outro';

interface MetricDef { key: string; label: string; isCurrency?: boolean }

const METRIC_CATALOG: Record<CampaignObjective, MetricDef[]> = {
  mensagens: [
    { key: 'investimento', label: 'Investimento (R$)', isCurrency: true },
    { key: 'mensagensRecebidas', label: 'Mensagens Recebidas' },
    { key: 'custoPorMensagem', label: 'Custo por Mensagem (R$)', isCurrency: true },
    { key: 'visualizacoes', label: 'Visualizações' },
  ],
  visualizacoes_video: [
    { key: 'investimento', label: 'Investimento (R$)', isCurrency: true },
    { key: 'visualizacoesVideo', label: 'Visualizações de Vídeo' },
    { key: 'thruPlays', label: 'ThruPlays (completos)' },
    { key: 'custoPorVisualizacao', label: 'Custo por Visualização (R$)', isCurrency: true },
    { key: 'alcance', label: 'Alcance' },
  ],
  visitas_perfil: [
    { key: 'investimento', label: 'Investimento (R$)', isCurrency: true },
    { key: 'visitasPerfil', label: 'Visitas no Perfil' },
    { key: 'custoPorVisita', label: 'Custo por Visita (R$)', isCurrency: true },
    { key: 'alcance', label: 'Alcance' },
    { key: 'impressoes', label: 'Impressões' },
  ],
  seguidores: [
    { key: 'investimento', label: 'Investimento (R$)', isCurrency: true },
    { key: 'novosSeguidores', label: 'Novos Seguidores' },
    { key: 'custoPorSeguidor', label: 'Custo por Seguidor (R$)', isCurrency: true },
    { key: 'alcance', label: 'Alcance' },
    { key: 'impressoes', label: 'Impressões' },
  ],
  acesso_site: [
    { key: 'investimento', label: 'Investimento (R$)', isCurrency: true },
    { key: 'cliquesNoLink', label: 'Cliques no Link' },
    { key: 'custoPorClique', label: 'CPC (R$)', isCurrency: true },
    { key: 'impressoes', label: 'Impressões' },
    { key: 'ctr', label: 'CTR (%)' },
  ],
  cliques: [
    { key: 'investimento', label: 'Investimento (R$)', isCurrency: true },
    { key: 'cliques', label: 'Cliques' },
    { key: 'custoPorClique', label: 'CPC (R$)', isCurrency: true },
    { key: 'impressoes', label: 'Impressões' },
    { key: 'ctr', label: 'CTR (%)' },
  ],
  outro: [
    { key: 'investimento', label: 'Investimento (R$)', isCurrency: true },
  ],
};

const OBJECTIVE_LABELS: Record<CampaignObjective, string> = {
  mensagens: 'Mensagens',
  visualizacoes_video: 'Visualizações de Vídeo',
  visitas_perfil: 'Visitas no Perfil',
  seguidores: 'Seguidores',
  acesso_site: 'Acesso ao Site',
  cliques: 'Cliques',
  outro: 'Outro',
};

// Métricas auto-calculadas: costKey = investimento / resultKey
const AUTO_CALC_RULES: Record<CampaignObjective, { costKey: string; resultKey: string }[]> = {
  mensagens: [{ costKey: 'custoPorMensagem', resultKey: 'mensagensRecebidas' }],
  visualizacoes_video: [{ costKey: 'custoPorVisualizacao', resultKey: 'visualizacoesVideo' }],
  visitas_perfil: [{ costKey: 'custoPorVisita', resultKey: 'visitasPerfil' }],
  seguidores: [{ costKey: 'custoPorSeguidor', resultKey: 'novosSeguidores' }],
  acesso_site: [{ costKey: 'custoPorClique', resultKey: 'cliquesNoLink' }],
  cliques: [{ costKey: 'custoPorClique', resultKey: 'cliques' }],
  outro: [],
};

// Chaves que são auto-calculadas (readonly no form)
const getAutoCalcKeys = (obj: CampaignObjective): Set<string> => {
  return new Set(AUTO_CALC_RULES[obj].map(r => r.costKey));
};

interface MonthForm {
  mes: string;
  metricas: Record<string, string>;
}

function NovoRelatorioContent() {
  const { user, token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedClientId = searchParams.get('clientId');

  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    clientId: preselectedClientId || '',
    title: 'Relatório Estratégico Mensal',
    objective: 'mensagens' as CampaignObjective,
  });

  const currentMetrics = METRIC_CATALOG[form.objective];

  const createEmptyMonth = (): MonthForm => ({
    mes: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
    metricas: {},
  });

  const [months, setMonths] = useState<MonthForm[]>([createEmptyMonth()]);

  const [result, setResult] = useState<{
    reportId: string;
    aiAnalysis: string;
    performanceScore: number;
  } | null>(null);

  const fetchClients = useCallback(() => {
    if (!token) return;
    api<{ clients: { id: string; name: string }[] }>('/clients', { token })
      .then((data) => setClients(data.clients || []))
      .catch(() => setClients([]));
  }, [token]);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const addMonth = () => {
    setMonths([...months, { mes: '', metricas: {} }]);
  };

  const removeMonth = (idx: number) => {
    if (months.length <= 1) return;
    setMonths(months.filter((_, i) => i !== idx));
  };

  const updateMonthName = (idx: number, value: string) => {
    const updated = [...months];
    updated[idx] = { ...updated[idx], mes: value };
    setMonths(updated);
  };

  const updateMonthMetric = (idx: number, key: string, value: string) => {
    const updated = [...months];
    const newMetricas = { ...updated[idx].metricas, [key]: value };

    // Auto-calcular custos por resultado
    const rules = AUTO_CALC_RULES[form.objective];
    for (const rule of rules) {
      if (key === 'investimento' || key === rule.resultKey) {
        const inv = parseFloat(key === 'investimento' ? value : (newMetricas.investimento || ''));
        const res = parseFloat(key === rule.resultKey ? value : (newMetricas[rule.resultKey] || ''));
        if (inv > 0 && res > 0) {
          newMetricas[rule.costKey] = (inv / res).toFixed(2);
        } else {
          newMetricas[rule.costKey] = '';
        }
      }
    }

    // Auto-calcular CTR para acesso_site e cliques
    if (form.objective === 'acesso_site' || form.objective === 'cliques') {
      if (key === 'impressoes' || key === 'cliquesNoLink' || key === 'cliques') {
        const cliquesKey = form.objective === 'acesso_site' ? 'cliquesNoLink' : 'cliques';
        const cliquesVal = parseFloat(key === cliquesKey ? value : (newMetricas[cliquesKey] || ''));
        const impressoesVal = parseFloat(key === 'impressoes' ? value : (newMetricas.impressoes || ''));
        if (cliquesVal > 0 && impressoesVal > 0) {
          newMetricas.ctr = ((cliquesVal / impressoesVal) * 100).toFixed(2);
        } else {
          newMetricas.ctr = '';
        }
      }
    }

    updated[idx] = { ...updated[idx], metricas: newMetricas };
    setMonths(updated);
  };

  const handleGenerate = async () => {
    if (!token || !form.clientId) return;
    setGenerating(true);

    try {
      const meses = months.map((m) => {
        const metricas: Record<string, number | null> = {};
        for (const def of currentMetrics) {
          const raw = m.metricas[def.key];
          metricas[def.key] = raw ? Number(raw) : null;
        }
        return { mes: m.mes, metricas };
      });

      const data = await api<{
        report: {
          id: string;
          ai_analysis: string;
          performance_score: number;
        };
      }>('/reports', {
        token,
        method: 'POST',
        body: {
          clientId: form.clientId,
          title: form.title,
          objective: form.objective,
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
      await api(`/reports/${result.reportId}/approve`, {
        token,
        method: 'PUT',
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
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Objetivo da Campanha *</label>
              <select value={form.objective} onChange={(e) => {
                setForm({ ...form, objective: e.target.value as CampaignObjective });
                // Limpa métricas ao trocar objetivo
                setMonths(months.map(m => ({ ...m, metricas: {} })));
              }} style={inputStyle}>
                {Object.entries(OBJECTIVE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
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
          <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '3px solid var(--accent-color)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Objetivo: <strong style={{ color: 'var(--accent-color)' }}>{OBJECTIVE_LABELS[form.objective]}</strong>
            </span>
          </div>

          {months.map((month, monthIdx) => (
            <div key={monthIdx} className="stat-card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ flex: 1, marginRight: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Período (mês)</label>
                  <input type="text" value={month.mes} onChange={(e) => updateMonthName(monthIdx, e.target.value)} placeholder="Ex: Janeiro 2025" style={inputStyle} />
                </div>
                {months.length > 1 && (
                  <button onClick={() => removeMonth(monthIdx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }} title="Remover mês">
                    <FaTrash />
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {currentMetrics.map((def) => {
                  const autoCalcKeys = getAutoCalcKeys(form.objective);
                  const isAutoCalc = autoCalcKeys.has(def.key) || (def.key === 'ctr' && (form.objective === 'acesso_site' || form.objective === 'cliques'));
                  return (
                    <div key={def.key}>
                      <label style={{ display: 'block', marginBottom: '0.2rem', fontSize: '0.8rem', color: isAutoCalc ? 'var(--accent-color)' : 'var(--text-secondary)' }}>
                        {def.label} {isAutoCalc && <span style={{ fontSize: '0.7rem' }}>(auto)</span>}
                      </label>
                      <input
                        type="number"
                        step={def.isCurrency || def.key === 'ctr' ? '0.01' : '1'}
                        value={month.metricas[def.key] || ''}
                        onChange={(e) => updateMonthMetric(monthIdx, def.key, e.target.value)}
                        placeholder={def.isCurrency ? '0.00' : '0'}
                        readOnly={isAutoCalc}
                        style={{
                          ...inputStyle,
                          ...(isAutoCalc ? { background: 'var(--bg-secondary)', borderColor: 'var(--accent-color)', opacity: 0.85, cursor: 'default' } : {}),
                        }}
                      />
                    </div>
                  );
                })}
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
