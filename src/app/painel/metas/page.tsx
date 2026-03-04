'use client';

import { useAuth } from '@/lib/auth';
import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { FaPlus, FaBullseye, FaCheck, FaTrash, FaEdit } from 'react-icons/fa';

interface Goal {
  id: number;
  client_id: number;
  client_name?: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  unit: string;
  deadline: string;
  status: string;
  created_at: string;
}

export default function MetasPage() {
  const { user, token } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [clients, setClients] = useState<{ id: number; company_name: string }[]>([]);
  const [form, setForm] = useState({
    client_id: '', title: '', description: '', target_value: 0, current_value: 0, unit: 'leads', deadline: '',
  });

  const fetchData = useCallback(() => {
    if (!token) return;
    Promise.all([
      api<{ goals: Goal[] }>('/goals', { token }),
      api<{ clients: { id: number; company_name: string }[] }>('/clients', { token }),
    ])
      .then(([g, c]) => {
        setGoals(g.goals || []);
        setClients(c.clients || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const resetForm = () => {
    setForm({ client_id: '', title: '', description: '', target_value: 0, current_value: 0, unit: 'leads', deadline: '' });
    setEditId(null);
  };

  const handleSubmit = async () => {
    if (!token || !form.title || !form.client_id) return;
    try {
      if (editId) {
        await api(`/goals/${editId}`, { token, method: 'PUT', body: form });
      } else {
        await api('/goals', { token, method: 'POST', body: { ...form, client_id: Number(form.client_id) } });
      }
      setShowForm(false);
      resetForm();
      fetchData();
    } catch (err) {
      alert('Erro: ' + (err instanceof Error ? err.message : 'Erro'));
    }
  };

  const handleEdit = (goal: Goal) => {
    setForm({
      client_id: String(goal.client_id), title: goal.title, description: goal.description,
      target_value: goal.target_value, current_value: goal.current_value, unit: goal.unit,
      deadline: goal.deadline ? goal.deadline.split('T')[0] : '',
    });
    setEditId(goal.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir esta meta?')) return;
    if (!token) return;
    try {
      await api(`/goals/${id}`, { token, method: 'DELETE' });
      fetchData();
    } catch {
      alert('Erro ao excluir');
    }
  };

  const handleComplete = async (id: number) => {
    if (!token) return;
    try {
      await api(`/goals/${id}`, { token, method: 'PUT', body: { status: 'completed' } });
      fetchData();
    } catch {
      alert('Erro ao completar');
    }
  };

  if (!user || user.role !== 'admin') return null;

  const inputStyle = { width: '100%', padding: '0.5rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' };

  return (
    <>
      <div className="page-header">
        <h1>Metas</h1>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
          <FaPlus /> Nova Meta
        </button>
      </div>

      {showForm && (
        <div className="stat-card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>{editId ? 'Editar Meta' : 'Nova Meta'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Cliente *</label>
              <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} style={inputStyle}>
                <option value="">Selecione</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Título *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Meta (valor)</label>
              <input type="number" value={form.target_value} onChange={(e) => setForm({ ...form, target_value: Number(e.target.value) })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Atual</label>
              <input type="number" value={form.current_value} onChange={(e) => setForm({ ...form, current_value: Number(e.target.value) })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Unidade</label>
              <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} style={inputStyle}>
                <option value="leads">Leads</option>
                <option value="vendas">Vendas</option>
                <option value="faturamento">Faturamento (R$)</option>
                <option value="conversao">Conversão (%)</option>
                <option value="cpl">CPL (R$)</option>
                <option value="roas">ROAS</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Prazo</label>
              <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} style={inputStyle} />
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Descrição</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleSubmit} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>{editId ? 'Salvar' : 'Criar'}</button>
            <button onClick={() => { setShowForm(false); resetForm(); }} style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Goals Grid */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</p>
      ) : goals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <p>Nenhuma meta cadastrada.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {goals.map((goal) => {
            const progress = goal.target_value > 0 ? Math.min((goal.current_value / goal.target_value) * 100, 100) : 0;
            const isCompleted = goal.status === 'completed';
            const isOverdue = goal.deadline && new Date(goal.deadline) < new Date() && !isCompleted;
            return (
              <div key={goal.id} className="stat-card" style={{ opacity: isCompleted ? 0.7 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <FaBullseye color={isCompleted ? '#22c55e' : isOverdue ? '#ef4444' : 'var(--accent-color)'} />
                      <strong>{goal.title}</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{goal.client_name}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {!isCompleted && <button onClick={() => handleComplete(goal.id)} style={{ background: 'none', border: 'none', color: '#22c55e', cursor: 'pointer' }} title="Completar"><FaCheck /></button>}
                    <button onClick={() => handleEdit(goal)} style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer' }}><FaEdit /></button>
                    <button onClick={() => handleDelete(goal.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><FaTrash /></button>
                  </div>
                </div>

                {goal.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{goal.description}</p>}

                {/* Progress Bar */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                    <span>{goal.current_value} / {goal.target_value} {goal.unit}</span>
                    <span style={{ color: progress >= 100 ? '#22c55e' : 'var(--text-secondary)' }}>{progress.toFixed(0)}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: progress >= 100 ? '#22c55e' : progress >= 60 ? 'var(--accent-color)' : '#f59e0b', borderRadius: '4px', transition: 'width 0.3s' }} />
                  </div>
                </div>

                {goal.deadline && (
                  <div style={{ fontSize: '0.8rem', color: isOverdue ? '#ef4444' : 'var(--text-secondary)' }}>
                    Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                    {isOverdue && ' ⚠️ Atrasada'}
                    {isCompleted && ' ✅ Concluída'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
