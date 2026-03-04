'use client';

import { useAuth } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaFileAlt, FaClock, FaMoneyBill } from 'react-icons/fa';
import Link from 'next/link';

interface ClientDetail {
  id: number;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  status: string;
  plan: string;
  monthly_value: number;
  notes: string;
  created_at: string;
  services: string[];
}

interface ReportSummary {
  id: number;
  month_ref: string;
  overall_score: number;
  status: string;
  created_at: string;
}

interface TimelineEvent {
  id: number;
  event_type: string;
  title: string;
  event_date: string;
}

export default function ClienteDetailPage() {
  const { user, token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !params.id) return;
    Promise.all([
      api<{ client: ClientDetail }>(`/clients/${params.id}`, { token }),
      api<{ reports: ReportSummary[] }>(`/reports?clientId=${params.id}`, { token }).catch(() => ({ reports: [] })),
      api<{ events: TimelineEvent[] }>(`/timeline/${params.id}`, { token }).catch(() => ({ events: [] })),
    ])
      .then(([c, r, t]) => {
        setClient(c.client);
        setReports(r.reports || []);
        setTimeline(t.events || []);
      })
      .catch(() => router.push('/painel/clientes'))
      .finally(() => setLoading(false));
  }, [token, params.id, router]);

  if (!user || user.role !== 'admin') return null;
  if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</p>;
  if (!client) return <p style={{ textAlign: 'center', padding: '2rem' }}>Cliente não encontrado.</p>;

  const statusColors: Record<string, string> = { active: '#22c55e', inactive: '#ef4444', prospect: '#f59e0b', churned: '#6b7280' };

  return (
    <>
      <div className="page-header">
        <div>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <FaArrowLeft /> Voltar
          </button>
          <h1>{client.company_name}</h1>
          <span className="badge" style={{ color: statusColors[client.status] || '#fff' }}>
            {client.status === 'active' ? 'Ativo' : client.status === 'inactive' ? 'Inativo' : client.status === 'prospect' ? 'Prospect' : 'Cancelado'}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="stat-card">
          <h3 style={{ marginBottom: '1rem' }}>Informações</h3>
          <div style={{ display: 'grid', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <p><strong>Contato:</strong> {client.contact_name}</p>
            <p><strong>E-mail:</strong> {client.contact_email}</p>
            <p><strong>Telefone:</strong> {client.contact_phone}</p>
            <p><strong>Plano:</strong> {client.plan}</p>
            <p><strong>Valor:</strong> R$ {client.monthly_value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p><strong>Cliente desde:</strong> {new Date(client.created_at).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        <div className="stat-card">
          <h3 style={{ marginBottom: '1rem' }}>Serviços Contratados</h3>
          {client.services?.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {client.services.map((s, i) => (
                <span key={i} className="badge badge-info">{s}</span>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Nenhum serviço registrado.</p>
          )}
          {client.notes && (
            <div style={{ marginTop: '1rem' }}>
              <strong style={{ fontSize: '0.85rem' }}>Notas:</strong>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{client.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="stat-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaFileAlt color="var(--accent-color)" /> Relatórios Recentes</h3>
          <Link href={`/painel/relatorios/novo?clientId=${client.id}`} className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', textDecoration: 'none' }}>
            + Novo Relatório
          </Link>
        </div>
        {reports.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>Nenhum relatório.</p>
        ) : (
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {reports.slice(0, 5).map((r) => (
              <Link key={r.id} href={`/painel/relatorios/${r.id}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', textDecoration: 'none', color: 'inherit' }}>
                <span>{r.month_ref}</span>
                <span className={`badge ${r.overall_score >= 80 ? 'badge-success' : r.overall_score >= 50 ? 'badge-warning' : 'badge-danger'}`}>
                  {r.overall_score}/100
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Timeline */}
      <div className="stat-card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><FaClock color="var(--accent-secondary)" /> Timeline Recente</h3>
        {timeline.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>Nenhum evento.</p>
        ) : (
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {timeline.slice(0, 5).map((e) => (
              <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.9rem' }}>{e.title}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {new Date(e.event_date).toLocaleDateString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Financial Quick Info */}
      <div className="stat-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><FaMoneyBill color="#22c55e" /> Financeiro</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(34,197,94,0.1)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Mensalidade</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#22c55e' }}>
              R$ {client.monthly_value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(139,92,246,0.1)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Plano</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#8b5cf6' }}>
              {client.plan === 'basic' ? 'Básico' : client.plan === 'intermediate' ? 'Intermediário' : client.plan === 'premium' ? 'Premium' : 'Personalizado'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
