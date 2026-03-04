'use client';

import { useAuth } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { FaCircle, FaPlus } from 'react-icons/fa';

interface TimelineEvent {
  id: number;
  client_id: number;
  client_name?: string;
  type: string;
  description: string;
  event_date: string;
  created_by_name?: string;
}

const eventTypeLabels: Record<string, { label: string; color: string }> = {
  onboarding: { label: 'Onboarding', color: '#3b82f6' },
  campaign_start: { label: 'Início de Campanha', color: '#22c55e' },
  campaign_end: { label: 'Fim de Campanha', color: '#ef4444' },
  report_released: { label: 'Relatório Liberado', color: '#a855f7' },
};

export default function TimelinePage() {
  const { user, token } = useAuth();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ description: '', type: 'note', event_date: new Date().toISOString().split('T')[0] });
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const fetchEvents = () => {
    if (!token || !user) return;
    const clientId = user.role === 'client' ? user.id : selectedClient;
    if (!clientId) {
      setEvents([]);
      setLoading(false);
      return;
    }
    api<{ events: TimelineEvent[] }>(`/timeline/client/${clientId}`, { token })
      .then((data) => setEvents(data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!token || !user) return;
    if (user.role === 'admin') {
      api<{ clients: { id: string; name: string }[] }>('/clients', { token })
        .then((data) => setClients(data.clients || []))
        .catch(() => setClients([]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user, selectedClient]);

  const handleSubmit = async () => {
    if (!token || !form.description) return;
    const clientId = user?.role === 'client' ? user.id : selectedClient;
    if (!clientId) return alert('Selecione um cliente');
    try {
      await api('/timeline', {
        token,
        method: 'POST',
        body: { client_id: clientId, type: form.type, description: form.description, event_date: form.event_date },
      });
      setShowForm(false);
      setForm({ description: '', type: 'note', event_date: new Date().toISOString().split('T')[0] });
      fetchEvents();
    } catch {
      alert('Erro ao criar evento');
    }
  };

  if (!user) return null;

  return (
    <>
      <div className="page-header">
        <h1>Timeline</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user.role === 'admin' && (
            <select value={selectedClient || ''} onChange={(e) => setSelectedClient(e.target.value || null)} style={{ padding: '0.5rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}>
              <option value="">Selecione um cliente</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
          {user.role === 'admin' && (
            <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
              <FaPlus /> Novo Evento
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="stat-card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Novo Evento</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tipo</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}>
                {Object.entries(eventTypeLabels).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Data</label>
              <input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Descrição</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', resize: 'vertical' }} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleSubmit} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Salvar</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Timeline */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</p>
      ) : events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <p>{user.role === 'admin' && !selectedClient ? 'Selecione um cliente para ver a timeline.' : 'Nenhum evento na timeline.'}</p>
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: '2rem' }}>
          <div style={{ position: 'absolute', left: '0.6rem', top: 0, bottom: 0, width: '2px', background: 'var(--border-color)' }} />
          {events.map((event) => {
            const typeInfo = eventTypeLabels[event.type] || eventTypeLabels.other;
            return (
              <div key={event.id} style={{ position: 'relative', marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
                <div style={{ position: 'absolute', left: '-1.45rem', top: '0.3rem' }}>
                  <FaCircle size={10} color={typeInfo.color} />
                </div>
                <div className="stat-card" style={{ margin: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge" style={{ background: typeInfo.color + '22', color: typeInfo.color, border: `1px solid ${typeInfo.color}44` }}>
                        {typeInfo.label}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {new Date(event.event_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  {event.description && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>{event.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
