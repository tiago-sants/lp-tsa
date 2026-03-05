'use client';

import { useAuth } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { FaPlus, FaCommentDots } from 'react-icons/fa';

interface Ticket {
  id: number;
  client_id: number;
  client_name?: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  messages?: TicketMessage[];
}

interface TicketMessage {
  id: number;
  sender_name: string;
  sender_role: string;
  message: string;
  created_at: string;
}

export default function SuportePage() {
  const { user, token } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: '', description: '', priority: 'medium' });
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [reply, setReply] = useState('');

  const fetchTickets = () => {
    if (!token || !user) return;
    const url = user.role === 'admin' ? '/tickets' : '/tickets/my';
    api<{ tickets: Ticket[] }>(url, { token })
      .then((data) => setTickets(data.tickets || []))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  const handleCreate = async () => {
    if (!token || !form.subject) return;
    try {
      await api('/tickets', { token, method: 'POST', body: form });
      setShowForm(false);
      setForm({ subject: '', description: '', priority: 'medium' });
      fetchTickets();
    } catch {
      alert('Erro ao criar ticket');
    }
  };

  const openTicketDetail = async (ticket: Ticket) => {
    if (!token) return;
    try {
      const data = await api<{ ticket: Ticket }>(`/tickets/${ticket.id}`, { token });
      setSelectedTicket(data.ticket);
    } catch {
      alert('Erro ao carregar ticket');
    }
  };

  const handleReply = async () => {
    if (!token || !selectedTicket || !reply.trim()) return;
    try {
      const data = await api<{ ticketMessage?: TicketMessage }>(`/tickets/${selectedTicket.id}/messages`, { token, method: 'POST', body: { message: reply } });
      setReply('');
      // Adicionar mensagem localmente para feedback instantâneo
      if (data.ticketMessage) {
        setSelectedTicket({
          ...selectedTicket,
          messages: [...(selectedTicket.messages || []), data.ticketMessage],
        });
      } else {
        openTicketDetail(selectedTicket);
      }
    } catch {
      alert('Erro ao enviar resposta');
    }
  };

  const handleStatusChange = async (ticketId: number, status: string) => {
    if (!token) return;
    try {
      await api(`/tickets/${ticketId}`, { token, method: 'PUT', body: { status } });
      fetchTickets();
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status });
      }
    } catch {
      alert('Erro ao atualizar status');
    }
  };

  const statusLabels: Record<string, { label: string; class: string }> = {
    open: { label: 'Aberto', class: 'badge-warning' },
    in_progress: { label: 'Em Andamento', class: 'badge-info' },
    waiting_client: { label: 'Aguardando Cliente', class: 'badge-warning' },
    closed: { label: 'Fechado', class: 'badge-success' },
  };

  const priorityLabels: Record<string, { label: string; color: string }> = {
    low: { label: 'Baixa', color: '#22c55e' },
    medium: { label: 'Média', color: '#f59e0b' },
    high: { label: 'Alta', color: '#ef4444' },
    urgent: { label: 'Urgente', color: '#dc2626' },
  };

  if (!user) return null;

  // Detail view
  if (selectedTicket) {
    const st = statusLabels[selectedTicket.status] || statusLabels.open;
    const pr = priorityLabels[selectedTicket.priority] || priorityLabels.medium;
    return (
      <>
        <div className="page-header">
          <div>
            <button onClick={() => setSelectedTicket(null)} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              ← Voltar
            </button>
            <h1>{selectedTicket.subject}</h1>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <span className={`badge ${st.class}`}>{st.label}</span>
              <span className="badge" style={{ color: pr.color, borderColor: pr.color + '44' }}>{pr.label}</span>
            </div>
          </div>
          {user.role === 'admin' && selectedTicket.status !== 'closed' && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)} value={selectedTicket.status} style={{ padding: '0.4rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                <option value="open">Aberto</option>
                <option value="in_progress">Em Andamento</option>
                <option value="waiting_client">Aguardando Cliente</option>
                <option value="closed">Fechado</option>
              </select>
            </div>
          )}
        </div>

        {/* Messages */}
        <h3 style={{ marginBottom: '1rem' }}>Mensagens</h3>
        <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {selectedTicket.messages?.map((msg) => (
            <div key={msg.id} style={{ padding: '1rem', borderRadius: '8px', background: msg.sender_role === 'admin' ? 'rgba(139,92,246,0.1)' : 'rgba(59,130,246,0.1)', borderLeft: `3px solid ${msg.sender_role === 'admin' ? '#8b5cf6' : '#3b82f6'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '0.85rem' }}>{msg.sender_name} ({msg.sender_role === 'admin' ? 'Suporte' : 'Você'})</strong>
                <small style={{ color: 'var(--text-secondary)' }}>{new Date(msg.created_at).toLocaleString('pt-BR')}</small>
              </div>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>{msg.message}</p>
            </div>
          ))}
          {(!selectedTicket.messages || selectedTicket.messages.length === 0) && (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Nenhuma mensagem ainda.</p>
          )}
        </div>

        {selectedTicket.status !== 'closed' && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Escreva sua resposta..." rows={3} style={{ flex: 1, padding: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', resize: 'vertical' }} />
            <button onClick={handleReply} className="btn-primary" style={{ alignSelf: 'flex-end', padding: '0.6rem 1.2rem' }}>
              Enviar
            </button>
          </div>
        )}
      </>
    );
  }

  // List view
  return (
    <>
      <div className="page-header">
        <h1>Suporte</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
          <FaPlus /> Novo Ticket
        </button>
      </div>

      {showForm && (
        <div className="stat-card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Novo Ticket</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Assunto</label>
              <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Prioridade</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}>
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Descrição</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleCreate} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Criar Ticket</button>
              <button onClick={() => setShowForm(false)} style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</p>
      ) : tickets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <p>Nenhum ticket encontrado.</p>
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                {user.role === 'admin' && <th>Cliente</th>}
                <th>Assunto</th>
                <th>Prioridade</th>
                <th>Status</th>
                <th>Data</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => {
                const st = statusLabels[ticket.status] || statusLabels.open;
                const pr = priorityLabels[ticket.priority] || priorityLabels.medium;
                return (
                  <tr key={ticket.id}>
                    <td>{ticket.id}</td>
                    {user.role === 'admin' && <td>{ticket.client_name}</td>}
                    <td>{ticket.subject}</td>
                    <td><span style={{ color: pr.color }}>{pr.label}</span></td>
                    <td><span className={`badge ${st.class}`}>{st.label}</span></td>
                    <td>{new Date(ticket.created_at).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <button onClick={() => openTicketDetail(ticket)} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer' }} title="Ver detalhes">
                        <FaCommentDots />
                      </button>
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
