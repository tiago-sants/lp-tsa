'use client';

import { useAuth } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { FaFileAlt, FaFolder, FaHeadset, FaStream } from 'react-icons/fa';

interface DashboardStats {
  reports: number;
  documents: number;
  openTickets: number;
  timelineEvents: number;
}

interface AdminStats {
  totalClients: number;
  activeClients: number;
  totalReports: number;
  mrr: number;
  openTickets: number;
  crmProspects: number;
}

export default function PainelPage() {
  const { user, token } = useAuth();
  const [clientStats, setClientStats] = useState<DashboardStats | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    if (!token || !user) return;

    if (user.role === 'client') {
      Promise.all([
        api<{ reports: Array<unknown> }>(`/reports/client/${user.id}`, { token }).catch(() => ({ reports: [] })),
        api<{ documents: Array<unknown> }>(`/documents?clientId=${user.id}`, { token }).catch(() => ({ documents: [] })),
        api<{ tickets: Array<unknown> }>('/tickets/my', { token }).catch(() => ({ tickets: [] })),
        api<{ events: Array<unknown> }>(`/timeline/client/${user.id}`, { token }).catch(() => ({ events: [] })),
      ]).then(([r, d, t, e]) => {
        setClientStats({
          reports: (r as { reports: Array<unknown> }).reports?.length || 0,
          documents: (d as { documents: Array<unknown> }).documents?.length || 0,
          openTickets: (t as { tickets: Array<{ status: string }> }).tickets?.filter((tk: { status: string }) => tk.status !== 'closed').length || 0,
          timelineEvents: (e as { events: Array<unknown> }).events?.length || 0,
        });
      });
    }

    if (user.role === 'admin') {
      Promise.all([
        api<{ clients: Array<unknown> }>('/clients', { token }).catch(() => ({ clients: [] })),
        api<{ mrr: number }>('/financial/dashboard', { token }).catch(() => ({ mrr: 0 })),
        api<{ tickets: Array<unknown> }>('/tickets', { token }).catch(() => ({ tickets: [] })),
        api<{ total: number }>('/crm/stats', { token }).catch(() => ({ total: 0 })),
        api<{ reports: Array<unknown> }>('/reports', { token }).catch(() => ({ reports: [] })),
      ]).then(([c, f, t, crm, r]) => {
        const clients = (c as { clients: Array<{ status: string }> }).clients || [];
        setAdminStats({
          totalClients: clients.length,
          activeClients: clients.filter((cl: { status: string }) => cl.status === 'active').length,
          totalReports: (r as { reports: Array<unknown> }).reports?.length || 0,
          mrr: (f as { mrr: number }).mrr || 0,
          openTickets: (t as { tickets: Array<{ status: string }> }).tickets?.filter((tk: { status: string }) => tk.status !== 'closed').length || 0,
          crmProspects: (crm as { total: number }).total || 0,
        });
      });
    }
  }, [token, user]);

  if (!user) return null;

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <span className="breadcrumb">Olá, {user.name}!</span>
      </div>

      {user.role === 'client' && clientStats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="stat-card">
            <FaFileAlt size={24} color="var(--accent-color)" />
            <div className="stat-label">Relatórios</div>
            <div className="stat-value">{clientStats.reports}</div>
          </div>
          <div className="stat-card">
            <FaFolder size={24} color="var(--accent-secondary)" />
            <div className="stat-label">Documentos</div>
            <div className="stat-value">{clientStats.documents}</div>
          </div>
          <div className="stat-card">
            <FaHeadset size={24} color="var(--accent-neon)" />
            <div className="stat-label">Tickets Abertos</div>
            <div className="stat-value">{clientStats.openTickets}</div>
          </div>
          <div className="stat-card">
            <FaStream size={24} color="#ffc107" />
            <div className="stat-label">Eventos na Timeline</div>
            <div className="stat-value">{clientStats.timelineEvents}</div>
          </div>
        </div>
      )}

      {user.role === 'admin' && adminStats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-label">Clientes Ativos</div>
            <div className="stat-value">{adminStats.activeClients}/{adminStats.totalClients}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Relatórios</div>
            <div className="stat-value">{adminStats.totalReports}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">MRR</div>
            <div className="stat-value">R$ {adminStats.mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Tickets Abertos</div>
            <div className="stat-value">{adminStats.openTickets}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Prospects CRM</div>
            <div className="stat-value">{adminStats.crmProspects}</div>
          </div>
        </div>
      )}
    </>
  );
}
