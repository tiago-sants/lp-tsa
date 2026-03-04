'use client';

import { useAuth } from '@/lib/auth';
import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { FaPlus, FaArrowRight, FaTrash, FaEdit } from 'react-icons/fa';

interface Prospect {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  stage: string;
  notes: string;
  estimated_value: number;
  created_at: string;
}

const stages = [
  { key: 'lead', label: 'Lead', color: '#6b7280' },
  { key: 'contact', label: 'Contato', color: '#3b82f6' },
  { key: 'proposal', label: 'Proposta', color: '#f59e0b' },
  { key: 'negotiation', label: 'Negociação', color: '#a855f7' },
  { key: 'won', label: 'Ganho', color: '#22c55e' },
  { key: 'lost', label: 'Perdido', color: '#ef4444' },
];

export default function CRMPage() {
  const { user, token } = useAuth();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', source: 'website', stage: 'lead', notes: '', estimated_value: 0,
  });

  const fetchProspects = useCallback(() => {
    if (!token) return;
    api<{ prospects: Prospect[] }>('/crm', { token })
      .then((data) => setProspects(data.prospects || []))
      .catch(() => setProspects([]))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { fetchProspects(); }, [fetchProspects]);

  const resetForm = () => {
    setForm({ name: '', email: '', phone: '', company: '', source: 'website', stage: 'lead', notes: '', estimated_value: 0 });
    setEditId(null);
  };

  const handleSubmit = async () => {
    if (!token || !form.name) return;
    try {
      if (editId) {
        await api(`/crm/${editId}`, { token, method: 'PUT', body: form });
      } else {
        await api('/crm', { token, method: 'POST', body: form });
      }
      setShowForm(false);
      resetForm();
      fetchProspects();
    } catch (err) {
      alert('Erro: ' + (err instanceof Error ? err.message : 'Erro'));
    }
  };

  const handleStageChange = async (id: number, newStage: string) => {
    if (!token) return;
    try {
      await api(`/crm/${id}`, { token, method: 'PUT', body: { stage: newStage } });
      fetchProspects();
    } catch {
      alert('Erro ao mover prospect');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir este prospect?')) return;
    if (!token) return;
    try {
      await api(`/crm/${id}`, { token, method: 'DELETE' });
      fetchProspects();
    } catch {
      alert('Erro ao excluir');
    }
  };

  const handleEdit = (p: Prospect) => {
    setForm({
      name: p.name, email: p.email, phone: p.phone, company: p.company,
      source: p.source, stage: p.stage, notes: p.notes, estimated_value: p.estimated_value,
    });
    setEditId(p.id);
    setShowForm(true);
  };

  if (!user || user.role !== 'admin') return null;

  const inputStyle = { width: '100%', padding: '0.5rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' };

  return (
    <>
      <div className="page-header">
        <h1>CRM — Pipeline</h1>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
          <FaPlus /> Novo Prospect
        </button>
      </div>

      {showForm && (
        <div className="stat-card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>{editId ? 'Editar Prospect' : 'Novo Prospect'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nome *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Empresa</label>
              <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>E-mail</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Telefone</label>
              <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Origem</label>
              <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} style={inputStyle}>
                <option value="website">Website</option>
                <option value="referral">Indicação</option>
                <option value="social_media">Redes Sociais</option>
                <option value="ads">Anúncios</option>
                <option value="cold_call">Prospecção Ativa</option>
                <option value="other">Outro</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Valor Estimado (R$)</label>
              <input type="number" value={form.estimated_value} onChange={(e) => setForm({ ...form, estimated_value: Number(e.target.value) })} style={inputStyle} />
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Notas</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleSubmit} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>{editId ? 'Salvar' : 'Criar'}</button>
            <button onClick={() => { setShowForm(false); resetForm(); }} style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stages.length}, minmax(200px, 1fr))`, gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
          {stages.map((stage) => {
            const stageProspects = prospects.filter((p) => p.stage === stage.key);
            const stageTotal = stageProspects.reduce((sum, p) => sum + (p.estimated_value || 0), 0);
            return (
              <div key={stage.key} style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1rem', minHeight: '300px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: `2px solid ${stage.color}` }}>
                  <strong style={{ color: stage.color, fontSize: '0.9rem' }}>{stage.label}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{stageProspects.length}</span>
                </div>
                {stageTotal > 0 && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    R$ {stageTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                )}
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {stageProspects.map((p) => (
                    <div key={p.id} style={{ background: 'var(--bg-tertiary)', borderRadius: '6px', padding: '0.75rem', borderLeft: `3px solid ${stage.color}` }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem' }}>{p.name}</div>
                      {p.company && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{p.company}</div>}
                      {p.estimated_value > 0 && <div style={{ fontSize: '0.75rem', color: '#22c55e', marginTop: '0.25rem' }}>R$ {p.estimated_value.toLocaleString('pt-BR')}</div>}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleEdit(p)} style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer', fontSize: '0.7rem' }}><FaEdit /></button>
                          <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.7rem' }}><FaTrash /></button>
                        </div>
                        {stage.key !== 'won' && stage.key !== 'lost' && (
                          <button onClick={() => {
                            const idx = stages.findIndex((s) => s.key === stage.key);
                            if (idx < stages.length - 2) handleStageChange(p.id, stages[idx + 1].key);
                          }} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '0.7rem' }} title="Avançar">
                            <FaArrowRight />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
