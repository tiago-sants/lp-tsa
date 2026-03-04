'use client';

import { useAuth } from '@/lib/auth';
import { useEffect, useState, useRef, useCallback } from 'react';
import { api } from '@/lib/api';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FaArrowLeft, FaCheckCircle, FaFilePdf, FaEye, FaTimes } from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

interface ReportMonth {
  id: string;
  month: string;
  metricas: Record<string, number | null>;
  metricas_calculadas: Record<string, number | null>;
}

interface ReportComparison {
  id: string;
  month_a: string;
  month_b: string;
  variacoes: Record<string, number | null>;
}

interface ReportDetail {
  id: string;
  client_name: string;
  title: string;
  performance_score: number;
  ai_analysis: string;
  status: string;
  objective: string;
  created_at: string;
  generated_at: string;
  approved_at: string;
}

const OBJECTIVE_LABELS: Record<string, string> = {
  mensagens: 'Mensagens',
  visualizacoes_video: 'Visualizações de Vídeo',
  visitas_perfil: 'Visitas no Perfil',
  seguidores: 'Seguidores',
  acesso_site: 'Acesso ao Site',
  cliques: 'Cliques',
  outro: 'Outro',
};

// Mapeamento de nomes técnicos para labels amigáveis ao cliente
const FRIENDLY_LABELS: Record<string, string> = {
  investimento: 'Investimento',
  mensagensRecebidas: 'Mensagens Recebidas',
  custoPorMensagem: 'Custo por Mensagem',
  custoPorMensagemCalculado: 'Custo por Mensagem',
  visualizacoes: 'Visualizações',
  visualizacoesVideo: 'Visualizações de Vídeo',
  thruPlays: 'Visualizações Completas',
  custoPorVisualizacao: 'Custo por Visualização',
  custoPorVisualizacaoCalculado: 'Custo por Visualização',
  visitasPerfil: 'Visitas no Perfil',
  custoPorVisita: 'Custo por Visita',
  custoPorVisitaCalculado: 'Custo por Visita',
  novosSeguidores: 'Novos Seguidores',
  custoPorSeguidor: 'Custo por Seguidor',
  custoPorSeguidorCalculado: 'Custo por Seguidor',
  alcance: 'Alcance',
  impressoes: 'Impressões',
  cliquesNoLink: 'Cliques no Link',
  cliques: 'Cliques',
  custoPorClique: 'Custo por Clique',
  cpcCalculado: 'Custo por Clique',
  ctr: 'Taxa de Cliques',
  ctrCalculado: 'Taxa de Cliques',
  mensagensPorMilVisualizacoes: 'Mensagens a cada 1.000 Visualizações',
};

// Formata o nome da chave para label legível
const formatKeyLabel = (key: string): string => {
  if (FRIENDLY_LABELS[key]) return FRIENDLY_LABELS[key];
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
};

// Mapa de métricas manuais -> calculadas (a calculada sempre tem prioridade)
const CALC_OVERRIDES: Record<string, string> = {
  custoPorMensagem: 'custoPorMensagemCalculado',
  custoPorVisualizacao: 'custoPorVisualizacaoCalculado',
  custoPorVisita: 'custoPorVisitaCalculado',
  custoPorSeguidor: 'custoPorSeguidorCalculado',
  custoPorClique: 'cpcCalculado',
  ctr: 'ctrCalculado',
};

// Merge inteligente: remove métricas manuais de custo quando existe a versão calculada
const smartMergeMetrics = (
  metricas: Record<string, number | null>,
  calculadas: Record<string, number | null>,
): [string, number | null][] => {
  const merged: Record<string, number | null> = {};

  for (const [key, value] of Object.entries(metricas)) {
    const calcKey = CALC_OVERRIDES[key];
    if (calcKey && calculadas[calcKey] !== undefined && calculadas[calcKey] !== null) {
      // Usa o valor calculado com o nome original (sem "Calculado")
      merged[key] = calculadas[calcKey];
    } else {
      merged[key] = value;
    }
  }

  // Adiciona métricas calculadas que NÃO substituem nenhuma manual
  const overriddenCalcKeys = new Set(Object.values(CALC_OVERRIDES));
  for (const [key, value] of Object.entries(calculadas)) {
    if (!overriddenCalcKeys.has(key) && !(key in merged)) {
      merged[key] = value;
    }
  }

  return Object.entries(merged);
};

// Remove variações duplicadas (manual + calculada com mesmo label)
const CALC_KEYS_TO_REMOVE = new Set(Object.values(CALC_OVERRIDES));
const dedupeVariations = (variacoes: Record<string, unknown>) => {
  const entries = Object.entries(variacoes)
    .filter(([, v]) => v !== null && !isNaN(Number(v)));

  // Se existem ambas (manual e calculada), preferir a calculada e remover a manual
  const result: { key: string; label: string; value: number }[] = [];
  const seenLabels = new Set<string>();

  // Primeiro passo: adicionar calculadas (têm prioridade)
  for (const [key, value] of entries) {
    if (CALC_KEYS_TO_REMOVE.has(key)) {
      // Encontra a chave manual correspondente
      const manualKey = Object.entries(CALC_OVERRIDES).find(([, v]) => v === key)?.[0];
      const label = formatKeyLabel(manualKey || key);
      if (!seenLabels.has(label)) {
        seenLabels.add(label);
        result.push({ key, label, value: Number(value) });
      }
    }
  }

  // Segundo passo: adicionar as demais (exceto manuais já substituídas)
  for (const [key, value] of entries) {
    if (CALC_KEYS_TO_REMOVE.has(key)) continue; // já processada
    const label = formatKeyLabel(key);
    if (CALC_OVERRIDES[key] && seenLabels.has(label)) continue; // manual substituída
    if (!seenLabels.has(label)) {
      seenLabels.add(label);
      result.push({ key, label, value: Number(value) });
    }
  }

  return result;
};

// Formata valor numérico
const formatMetricValue = (key: string, value: number | null): string => {
  if (value === null || value === undefined) return '—';
  const num = Number(value);
  if (isNaN(num)) return '—';
  const isCurrency = key.toLowerCase().includes('investimento') || key.toLowerCase().includes('custo') || key.toLowerCase().includes('cpc');
  const isPercent = key.toLowerCase().includes('ctr');
  if (isCurrency) return `R$ ${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (isPercent) return `${num.toFixed(2)}%`;
  return num.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
};

export default function ReportDetailPage() {
  const { user, token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [months, setMonths] = useState<ReportMonth[]>([]);
  const [comparisons, setComparisons] = useState<ReportComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const autoDownload = searchParams.get('download') === 'true';
  const downloadTriggered = useRef(false);

  useEffect(() => {
    if (!token || !params.id) return;
    api<{ report: ReportDetail; months: ReportMonth[]; comparisons: ReportComparison[] }>(`/reports/${params.id}`, { token })
      .then((data) => {
        setReport(data.report);
        setMonths(data.months || []);
        setComparisons(data.comparisons || []);
      })
      .catch(() => router.push('/painel/relatorios'))
      .finally(() => setLoading(false));
  }, [token, params.id, router]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const handleDownloadPdf = useCallback(async () => {
    if (!pdfRef.current || !report) return;
    setGeneratingPdf(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: `${report.title.replace(/[^a-zA-Z0-9À-ÿ ]/g, '')}_${report.client_name}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#0f1117' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };
      await html2pdf().set(opt).from(pdfRef.current).save();
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      alert('Erro ao gerar PDF');
    } finally {
      setGeneratingPdf(false);
    }
  }, [report]);

  // Auto-download quando vem da lista de relatórios com ?download=true
  useEffect(() => {
    if (autoDownload && report && !loading && !downloadTriggered.current) {
      downloadTriggered.current = true;
      // Pequeno delay para garantir que o componente PDF renderizou
      const timer = setTimeout(() => handleDownloadPdf(), 500);
      return () => clearTimeout(timer);
    }
  }, [autoDownload, report, loading, handleDownloadPdf]);

  // Componente de relatório renderizável (usado para PDF e preview do cliente)
  const ReportPrintView = ({ forPdf }: { forPdf?: boolean }) => {
    if (!report) return null;
    const containerStyle: React.CSSProperties = {
      background: '#0f1117',
      color: '#e2e8f0',
      padding: forPdf ? '20px' : '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: forPdf ? 'none' : '900px',
      margin: forPdf ? 0 : '0 auto',
    };

    // Dados para gráficos
    const chartData = months.map((m) => {
      const metricas = typeof m.metricas === 'string' ? JSON.parse(m.metricas) : (m.metricas || {});
      const calculadas = typeof m.metricas_calculadas === 'string' ? JSON.parse(m.metricas_calculadas) : (m.metricas_calculadas || {});
      return { name: m.month, ...metricas, ...calculadas };
    });

    // Identificar métricas para os gráficos
    const allMetricKeys = months.length > 0 ? Object.keys(
      typeof months[0].metricas === 'string' ? JSON.parse(months[0].metricas) : (months[0].metricas || {})
    ) : [];
    const investKey = allMetricKeys.find(k => k.toLowerCase().includes('investimento'));
    const resultKeys = allMetricKeys.filter(k => !k.toLowerCase().includes('investimento'));
    const mainResultKey = resultKeys[0];

    const CHART_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#06b6d4', '#ef4444'];

    return (
      <div style={containerStyle}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid #3b82f6', paddingBottom: '1.5rem' }}>
          <h1 style={{ fontSize: forPdf ? '1.3rem' : '1.6rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>{report.title}</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{report.client_name}</p>
          <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            Objetivo: {OBJECTIVE_LABELS[report.objective] || report.objective} • {new Date(report.generated_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Score + KPIs resumidos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            width: 100, height: 100, borderRadius: '50%',
            border: `4px solid ${getScoreColor(report.performance_score)}`,
            background: 'rgba(0,0,0,0.3)', flexShrink: 0,
          }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 700, color: getScoreColor(report.performance_score) }}>{report.performance_score}</span>
            <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>de 100</span>
          </div>

          {/* KPIs do último mês */}
          {months.length > 0 && (() => {
            const lastMonth = months[months.length - 1];
            const metricas = typeof lastMonth.metricas === 'string' ? JSON.parse(lastMonth.metricas) : (lastMonth.metricas || {});
            const calculadas = typeof lastMonth.metricas_calculadas === 'string' ? JSON.parse(lastMonth.metricas_calculadas) : (lastMonth.metricas_calculadas || {});
            const topMetrics = smartMergeMetrics(metricas, calculadas).slice(0, 4);
            return (
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flex: 1, justifyContent: 'center' }}>
                {topMetrics.map(([key, value]) => (
                  <div key={key} style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '10px', padding: '0.75rem 1rem', minWidth: '120px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{formatKeyLabel(key)}</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#e2e8f0' }}>{formatMetricValue(key, value as number | null)}</div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Gráfico de barras — evolução por mês (se 2+ meses) */}
        {chartData.length >= 2 && investKey && mainResultKey && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#94a3b8', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Evolução por Mês</h2>
            <div style={{ display: 'grid', gridTemplateColumns: forPdf ? '1fr' : '1fr 1fr', gap: '1.5rem' }}>
              {/* Investimento */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem' }}>
                <h3 style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>{formatKeyLabel(investKey)}</h3>
                {forPdf ? (
                  <BarChart width={500} height={180} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Bar dataKey={investKey} fill="#3b82f6" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                  </BarChart>
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }} />
                      <Bar dataKey={investKey} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
              {/* Resultado principal */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem' }}>
                <h3 style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>{formatKeyLabel(mainResultKey)}</h3>
                {forPdf ? (
                  <BarChart width={500} height={180} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Bar dataKey={mainResultKey} fill="#22c55e" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                  </BarChart>
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }} />
                      <Bar dataKey={mainResultKey} fill="#22c55e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Gráfico Pizza — distribuição do último mês (se 1 mês) */}
        {chartData.length === 1 && resultKeys.length >= 2 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#94a3b8', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Distribuição das Métricas</h2>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem', display: 'flex', justifyContent: 'center' }}>
              {forPdf ? (
                <PieChart width={500} height={220}>
                  <Pie
                    data={resultKeys.filter(k => chartData[0][k] != null && Number(chartData[0][k]) > 0).map((k, i) => ({ name: formatKeyLabel(k), value: Number(chartData[0][k]), fill: CHART_COLORS[i % CHART_COLORS.length] }))}
                    cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    isAnimationActive={false}
                  >
                    {resultKeys.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '0.75rem' }} />
                </PieChart>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={resultKeys.filter(k => chartData[0][k] != null && Number(chartData[0][k]) > 0).map((k, i) => ({ name: formatKeyLabel(k), value: Number(chartData[0][k]), fill: CHART_COLORS[i % CHART_COLORS.length] }))}
                      cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {resultKeys.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }} />
                    <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '0.75rem' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}

        {/* Variações — barras horizontais coloridas */}
        {comparisons.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#94a3b8', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Variação entre Meses</h2>
            {comparisons.map((c) => {
              const variacoes = typeof c.variacoes === 'string' ? JSON.parse(c.variacoes) : (c.variacoes || {});
              const items = dedupeVariations(variacoes);
              return (
                <div key={c.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1e293b', borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.75rem' }}>{c.month_a} → {c.month_b}</h3>
                  <div style={{ display: 'grid', gap: '0.4rem' }}>
                    {items.map((item) => {
                      const isPositive = item.value >= 0;
                      const barWidth = Math.min(Math.abs(item.value), 100);
                      return (
                        <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', width: '140px', textAlign: 'right', flexShrink: 0 }}>{item.label}</span>
                          <div style={{ flex: 1, height: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{
                              height: '100%', width: `${barWidth}%`, borderRadius: '4px',
                              background: isPositive ? 'linear-gradient(90deg, #22c55e, #16a34a)' : 'linear-gradient(90deg, #ef4444, #dc2626)',
                              transition: 'width 0.5s ease',
                            }} />
                          </div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isPositive ? '#22c55e' : '#ef4444', width: '60px', flexShrink: 0 }}>
                            {isPositive ? '+' : ''}{item.value.toFixed(1)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Análise IA — resumida */}
        {report.ai_analysis && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#3b82f6', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Análise e Recomendações
            </h2>
            <div style={{
              whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#cbd5e1', fontSize: forPdf ? '0.78rem' : '0.88rem',
              background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '10px', padding: '1.25rem',
            }}>
              {report.ai_analysis}
            </div>
          </div>
        )}

        {/* Tabela de dados completa — compacta */}
        {months.length > 0 && (() => {
          // Merge inteligente para cada mês
          const monthsMerged = months.map((m) => {
            const metricas = typeof m.metricas === 'string' ? JSON.parse(m.metricas) : (m.metricas || {});
            const calculadas = typeof m.metricas_calculadas === 'string' ? JSON.parse(m.metricas_calculadas) : (m.metricas_calculadas || {});
            return { id: m.id, month: m.month, entries: smartMergeMetrics(metricas, calculadas) };
          });
          const tableKeys = monthsMerged.length > 0 ? monthsMerged[0].entries.map(([k]) => k) : [];
          return (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#94a3b8', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dados Completos</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: forPdf ? '0.7rem' : '0.8rem' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid #334155', color: '#94a3b8', fontWeight: 600 }}>Métrica</th>
                    {monthsMerged.map((m) => (
                      <th key={m.id} style={{ textAlign: 'right', padding: '0.5rem', borderBottom: '2px solid #334155', color: '#94a3b8', fontWeight: 600 }}>{m.month}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableKeys.map((key) => (
                    <tr key={key}>
                      <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>{formatKeyLabel(key)}</td>
                      {monthsMerged.map((m) => {
                        const entry = m.entries.find(([k]) => k === key);
                        return (
                          <td key={m.id} style={{ textAlign: 'right', padding: '0.4rem 0.5rem', borderBottom: '1px solid #1e293b', color: '#e2e8f0', fontWeight: 500 }}>
                            {formatMetricValue(key, entry ? entry[1] : null)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          );
        })()}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #1e293b', color: '#64748b', fontSize: '0.75rem' }}>
          <p>Relatório gerado por TSA Soluções • {new Date(report.generated_at).toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
    );
  };

  if (!user) return null;

  if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando relatório...</p>;
  if (!report) return <p style={{ textAlign: 'center', padding: '2rem' }}>Relatório não encontrado.</p>;

  return (
    <>
      <div className="page-header">
        <div>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <FaArrowLeft /> Voltar
          </button>
          <h1>{report.title} — {report.client_name}</h1>
          <span className="breadcrumb">
            Objetivo: {OBJECTIVE_LABELS[report.objective] || report.objective} • Score: {report.performance_score}/100 • {report.status === 'draft' ? 'Rascunho' : report.status === 'approved' ? 'Aprovado' : 'Arquivado'}
          </span>
        </div>
        {user.role === 'admin' && report.status === 'draft' && (
          <button
            onClick={async () => {
              setPublishing(true);
              try {
                await api(`/reports/${report.id}/approve`, { token: token!, method: 'PUT' });
                setReport({ ...report, status: 'approved' });
              } catch { alert('Erro ao aprovar'); }
              finally { setPublishing(false); }
            }}
            disabled={publishing}
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
          >
            <FaCheckCircle /> {publishing ? 'Aprovando...' : 'Aprovar e Publicar'}
          </button>
        )}
        {user.role === 'admin' && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: report.status === 'draft' ? '0.5rem' : 0 }}>
            <button
              onClick={handleDownloadPdf}
              disabled={generatingPdf}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: '#dc2626', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              <FaFilePdf /> {generatingPdf ? 'Gerando...' : 'Baixar PDF'}
            </button>
            <button
              onClick={() => setShowPreview(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              <FaEye /> Preview Cliente
            </button>
          </div>
        )}
        {user.role === 'client' && (
          <button
            onClick={handleDownloadPdf}
            disabled={generatingPdf}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: '#dc2626', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            <FaFilePdf /> {generatingPdf ? 'Gerando...' : 'Baixar PDF'}
          </button>
        )}
      </div>

      {/* Score + KPIs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ width: 140, height: 140, borderRadius: '50%', border: `5px solid ${getScoreColor(report.performance_score)}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', flexShrink: 0 }}>
          <span style={{ fontSize: '2.2rem', fontWeight: 700, color: getScoreColor(report.performance_score) }}>{report.performance_score}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>de 100</span>
        </div>
        {months.length > 0 && (() => {
          const lastMonth = months[months.length - 1];
          const metricas = typeof lastMonth.metricas === 'string' ? JSON.parse(lastMonth.metricas) : (lastMonth.metricas || {});
          const calculadas = typeof lastMonth.metricas_calculadas === 'string' ? JSON.parse(lastMonth.metricas_calculadas) : (lastMonth.metricas_calculadas || {});
          const topMetrics = smartMergeMetrics(metricas, calculadas).slice(0, 4);
          return (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flex: 1, justifyContent: 'center' }}>
              {topMetrics.map(([key, value]) => (
                <div key={key} className="stat-card" style={{ minWidth: '140px', textAlign: 'center', padding: '1rem' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{formatKeyLabel(key)}</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{formatMetricValue(key, value as number | null)}</div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* Gráficos de evolução (2+ meses) */}
      {(() => {
        const chartData = months.map((m) => {
          const metricas = typeof m.metricas === 'string' ? JSON.parse(m.metricas) : (m.metricas || {});
          const calculadas = typeof m.metricas_calculadas === 'string' ? JSON.parse(m.metricas_calculadas) : (m.metricas_calculadas || {});
          return { name: m.month, ...metricas, ...calculadas };
        });
        const allKeys = months.length > 0 ? Object.keys(typeof months[0].metricas === 'string' ? JSON.parse(months[0].metricas) : (months[0].metricas || {})) : [];
        const investKey = allKeys.find(k => k.toLowerCase().includes('investimento'));
        const resultKeys = allKeys.filter(k => !k.toLowerCase().includes('investimento'));
        const mainResultKey = resultKeys[0];
        const CHART_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#06b6d4', '#ef4444'];

        return (
          <>
            {chartData.length >= 2 && investKey && mainResultKey && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1rem' }}>Evolução por Mês</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="stat-card">
                    <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{formatKeyLabel(investKey)}</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }} />
                        <Bar dataKey={investKey} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="stat-card">
                    <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{formatKeyLabel(mainResultKey)}</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }} />
                        <Bar dataKey={mainResultKey} fill="#22c55e" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Pizza (1 mês) */}
            {chartData.length === 1 && resultKeys.length >= 2 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1rem' }}>Distribuição das Métricas</h3>
                <div className="stat-card" style={{ display: 'flex', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={resultKeys.filter(k => chartData[0][k] != null && Number(chartData[0][k]) > 0).map((k, i) => ({ name: formatKeyLabel(k), value: Number(chartData[0][k]), fill: CHART_COLORS[i % CHART_COLORS.length] }))}
                        cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {resultKeys.map((_, i) => (
                          <Cell key={`cell-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }} />
                      <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '0.75rem' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Variações entre meses */}
            {comparisons.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1rem' }}>Variação entre Meses</h3>
                {comparisons.map((c) => {
                  const variacoes = typeof c.variacoes === 'string' ? JSON.parse(c.variacoes) : (c.variacoes || {});
                  const items = dedupeVariations(variacoes);
                  return (
                    <div key={c.id} className="stat-card" style={{ marginBottom: '0.75rem' }}>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>{c.month_a} → {c.month_b}</h4>
                      <div style={{ display: 'grid', gap: '0.4rem' }}>
                        {items.map((item) => {
                          const isPositive = item.value >= 0;
                          const barWidth = Math.min(Math.abs(item.value), 100);
                          return (
                            <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', width: '140px', textAlign: 'right', flexShrink: 0 }}>{item.label}</span>
                              <div style={{ flex: 1, height: '22px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                                <div style={{
                                  height: '100%', width: `${barWidth}%`, borderRadius: '4px',
                                  background: isPositive ? 'linear-gradient(90deg, #22c55e, #16a34a)' : 'linear-gradient(90deg, #ef4444, #dc2626)',
                                  transition: 'width 0.5s ease',
                                }} />
                              </div>
                              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isPositive ? '#22c55e' : '#ef4444', width: '60px', flexShrink: 0 }}>
                                {isPositive ? '+' : ''}{item.value.toFixed(1)}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        );
      })()}

      {/* Análise IA */}
      {report.ai_analysis && (
        <div className="stat-card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>Análise e Recomendações</h3>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {report.ai_analysis}
          </div>
        </div>
      )}

      {/* Div oculto para geração de PDF */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '210mm' }}>
        <div ref={pdfRef}>
          <ReportPrintView forPdf />
        </div>
      </div>

      {/* Modal de Preview do Cliente */}
      {showPreview && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#1e293b', borderBottom: '1px solid #334155' }}>
            <div>
              <span style={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.9rem' }}>Preview — Visão do Cliente</span>
              <span style={{ color: '#64748b', fontSize: '0.8rem', marginLeft: '1rem' }}>Assim o cliente verá o relatório</span>
            </div>
            <button onClick={() => setShowPreview(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem', padding: '0.5rem' }}>
              <FaTimes />
            </button>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', background: '#0f1117', borderRadius: '12px', border: '1px solid #1e293b', overflow: 'hidden' }}>
              <ReportPrintView />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
