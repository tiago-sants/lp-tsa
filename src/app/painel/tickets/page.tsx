'use client';

import { useAuth } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { FaCommentDots } from 'react-icons/fa';

interface Ticket {
  id: number;
  client_id: number;
  client_name?: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
}

export default function AdminTicketsPage() {
  const { user, token } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!token) return;
    api<{ tickets: Ticket[] }>('/tickets', { token })
      .then((data) => setTickets(data.tickets || []))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, [token]);

  if (!user || user.role !== 'admin') return null;

  const filtered = filter === 'all' ? tickets : tickets.filter((t) => t.status === filter);

  const statusLabels: Record<string, { label: string; class: string }> = {
    open: { label: 'Aberto', class: 'badge-warning' },
    in_progress: { label: 'Em Andamento', class: 'badge-info' },
    waiting_client: { label: 'Aguardando', class: 'badge-warning' },
    closed: { label: 'Fechado', class: 'badge-success' },
  };

  const priorityColors: Record<string, string> = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444', urgent: '#dc2626' };

  const counts = {
    all: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    in_progress: tickets.filter((t) => t.status === 'in_progress').length,
    waiting_client: tickets.filter((t) => t.status === 'waiting_client').length,
    closed: tickets.filter((t) => t.status === 'closed').length,
  };

  return (
    <>
      <div className="page-header">
        <h1>Todos os Tickets</h1>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[{ key: 'all', label: 'Todos' }, { key: 'open', label: 'Abertos' }, { key: 'in_progress', label: 'Em Andamento' }, { key: 'waiting_client', label: 'Aguardando' }, { key: 'closed', label: 'Fechados' }].map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid var(--border-color)', cursor: 'pointer', fontSize: '0.85rem',
            background: filter === f.key ? 'var(--accent-color)' : 'var(--bg-tertiary)', color: filter === f.key ? '#fff' : 'var(--text-secondary)',
          }}>
            {f.label} ({counts[f.key as keyof typeof counts]})
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <p>Nenhum ticket encontrado.</p>
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Assunto</th>
                <th>Prioridade</th>
                <th>Status</th>
                <th>Data</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ticket) => {
                const st = statusLabels[ticket.status] || statusLabels.open;
                return (
                  <tr key={ticket.id}>
                    <td>{ticket.id}</td>
                    <td>{ticket.client_name}</td>
                    <td>{ticket.subject}</td>
                    <td><span style={{ color: priorityColors[ticket.priority] || '#f59e0b' }}>{ticket.priority}</span></td>
                    <td><span className={`badge ${st.class}`}>{st.label}</span></td>
                    <td>{new Date(ticket.created_at).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <a href={`/painel/suporte?ticket=${ticket.id}`} style={{ color: 'var(--accent-color)' }}>
                        <FaCommentDots />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
