'use client';

import { useAuth } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaChartLine, FaCalendarAlt } from 'react-icons/fa';

interface ReportMonth {
  id: number;
  month: string;
  investment: number;
  messages: number;
  cost_per_message: number;
  views: number;
  computed_cpm: number;
  computed_msg_per_1k_views: number;
}

interface ReportComparison {
  id: number;
  month_a: string;
  month_b: string;
  investment_change: number;
  messages_change: number;
  cpm_change: number;
  views_change: number;
}

interface ReportDetail {
  id: number;
  client_name: string;
  title: string;
  performance_score: number;
  ai_analysis: string;
  status: string;
  created_at: string;
  generated_at: string;
  approved_at: string;
}

export default function ReportDetailPage() {
  const { user, token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [months, setMonths] = useState<ReportMonth[]>([]);
  const [comparisons, setComparisons] = useState<ReportComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'months' | 'comparisons'>('overview');

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
          <span className="breadcrumb">Score: {report.performance_score}/100 • {report.status === 'draft' ? 'Rascunho' : report.status === 'approved' ? 'Aprovado' : 'Arquivado'}</span>
        </div>
      </div>

      {/* Score Gauge */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
        <div style={{ width: 160, height: 160, borderRadius: '50%', border: `6px solid ${getScoreColor(report.performance_score)}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 700, color: getScoreColor(report.performance_score) }}>{report.performance_score}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>de 100</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        {(['overview', 'months', 'comparisons'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: 'none', border: 'none', color: activeTab === tab ? 'var(--accent-color)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem', fontWeight: activeTab === tab ? 600 : 400, padding: '0.5rem 1rem', borderBottom: activeTab === tab ? '2px solid var(--accent-color)' : 'none' }}>
            {tab === 'overview' ? 'Análise IA' : tab === 'months' ? `Meses (${months.length})` : `Comparações (${comparisons.length})`}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {report.ai_analysis && (
            <div className="stat-card">
              <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaChartLine color="var(--accent-color)" /> Análise Inteligente (Gemini AI)
              </h3>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                {report.ai_analysis}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'months' && (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {months.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Nenhum mês adicionado.</p>
          )}
          {months.map((m) => (
            <div key={m.id} className="stat-card">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <FaCalendarAlt color="var(--accent-secondary)" /> {m.month}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Investimento</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>R$ {m.investment?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Mensagens</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{m.messages}</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>CPM</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>R$ {m.computed_cpm?.toFixed(2)}</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Visualizações</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{m.views?.toLocaleString('pt-BR')}</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Custo/Msg</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>R$ {m.cost_per_message?.toFixed(2)}</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Msg/1k Views</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{m.computed_msg_per_1k_views?.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'comparisons' && (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {comparisons.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Nenhuma comparação disponível.</p>
          )}
          {comparisons.map((c) => {
            const formatChange = (val: number) => {
              if (val == null) return '—';
              const sign = val >= 0 ? '+' : '';
              const color = val >= 0 ? '#22c55e' : '#ef4444';
              return <span style={{ color, fontWeight: 600 }}>{sign}{val.toFixed(1)}%</span>;
            };
            return (
              <div key={c.id} className="stat-card">
                <h3 style={{ marginBottom: '1rem' }}>
                  {c.month_a} → {c.month_b}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Investimento</div>
                    <div style={{ fontSize: '1.1rem' }}>{formatChange(c.investment_change)}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Mensagens</div>
                    <div style={{ fontSize: '1.1rem' }}>{formatChange(c.messages_change)}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>CPM</div>
                    <div style={{ fontSize: '1.1rem' }}>{formatChange(c.cpm_change)}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Visualizações</div>
                    <div style={{ fontSize: '1.1rem' }}>{formatChange(c.views_change)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
