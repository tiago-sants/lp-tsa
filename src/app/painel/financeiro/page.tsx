'use client';

import { useAuth } from '@/lib/auth';
import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { FaPlus, FaArrowUp, FaArrowDown, FaChartBar } from 'react-icons/fa';

interface FinancialEntry {
  id: number;
  client_id: number;
  client_name?: string;
  type: string;
  category: string;
  amount: number;
  description: string;
  reference_month: string;
  status: string;
  due_date: string;
  paid_date: string;
}

interface FinancialDashboard {
  mrr: number;
  totalReceived: number;
  totalPending: number;
  totalExpenses: number;
}

export default function FinanceiroPage() {
  const { user, token } = useAuth();
  const [entries, setEntries] = useState<FinancialEntry[]>([]);
  const [dashboard, setDashboard] = useState<FinancialDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({
    client_id: '', type: 'income', category: 'mensalidade', amount: 0, description: '', reference_month: new Date().toISOString().slice(0, 7), due_date: '', status: 'pending',
  });

  const fetchData = useCallback(() => {
    if (!token) return;
    Promise.all([
      api<{ entries: FinancialEntry[] }>('/financial', { token }),
      api<{ dashboard: FinancialDashboard }>('/financial/dashboard', { token }),
      api<{ clients: { id: string; name: string }[] }>('/clients', { token }),
    ])
      .then(([e, d, c]) => {
        setEntries(e.entries || []);
        setDashboard(d.dashboard);
        setClients(c.clients || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async () => {
    if (!token || !form.amount) return;
    try {
      await api('/financial', { token, method: 'POST', body: { ...form, client_id: form.client_id ? Number(form.client_id) : null } });
      setShowForm(false);
      setForm({ client_id: '', type: 'income', category: 'mensalidade', amount: 0, description: '', reference_month: new Date().toISOString().slice(0, 7), due_date: '', status: 'pending' });
      fetchData();
    } catch (err) {
      alert('Erro: ' + (err instanceof Error ? err.message : 'Erro'));
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    if (!token) return;
    try {
      await api(`/financial/${id}`, { token, method: 'PUT', body: { status, paid_date: status === 'paid' ? new Date().toISOString().split('T')[0] : null } });
      fetchData();
    } catch {
      alert('Erro ao atualizar');
    }
  };

  if (!user || user.role !== 'admin') return null;

  const inputStyle = { width: '100%', padding: '0.5rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' };

  return (
    <>
      <div className="page-header">
        <h1>Financeiro</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
          <FaPlus /> Nova Entrada
        </button>
      </div>

      {/* Dashboard Cards */}
      {dashboard && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="stat-card">
            <FaChartBar size={20} color="#8b5cf6" />
            <div className="stat-label">MRR</div>
            <div className="stat-value" style={{ color: '#8b5cf6' }}>R$ {dashboard.mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="stat-card">
            <FaArrowUp size={20} color="#22c55e" />
            <div className="stat-label">Total Recebido</div>
            <div className="stat-value" style={{ color: '#22c55e' }}>R$ {dashboard.totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="stat-card">
            <FaArrowDown size={20} color="#f59e0b" />
            <div className="stat-label">Pendente</div>
            <div className="stat-value" style={{ color: '#f59e0b' }}>R$ {dashboard.totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="stat-card">
            <FaArrowDown size={20} color="#ef4444" />
            <div className="stat-label">Despesas</div>
            <div className="stat-value" style={{ color: '#ef4444' }}>R$ {dashboard.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="stat-card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Nova Entrada Financeira</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tipo</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                <option value="income">Receita</option>
                <option value="expense">Despesa</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Categoria</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                <option value="mensalidade">Mensalidade</option>
                <option value="setup">Setup</option>
                <option value="ads">Investimento Ads</option>
                <option value="tools">Ferramentas</option>
                <option value="freelancer">Freelancer</option>
                <option value="other">Outro</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Cliente</label>
              <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} style={inputStyle}>
                <option value="">Sem vínculo</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Valor (R$)</label>
              <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Mês Ref.</label>
              <input type="month" value={form.reference_month} onChange={(e) => setForm({ ...form, reference_month: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Vencimento</label>
              <input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} style={inputStyle} />
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Descrição</label>
            <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={inputStyle} />
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleCreate} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Criar</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancelar</button>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</p>
      ) : entries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <p>Nenhum lançamento financeiro.</p>
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Categoria</th>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Mês</th>
                <th>Vencimento</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    {entry.type === 'income' ? (
                      <span style={{ color: '#22c55e' }}><FaArrowUp /> Receita</span>
                    ) : (
                      <span style={{ color: '#ef4444' }}><FaArrowDown /> Despesa</span>
                    )}
                  </td>
                  <td>{entry.category}</td>
                  <td>{entry.client_name || '—'}</td>
                  <td style={{ fontWeight: 600, color: entry.type === 'income' ? '#22c55e' : '#ef4444' }}>
                    R$ {entry.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td>{entry.reference_month}</td>
                  <td>{entry.due_date ? new Date(entry.due_date).toLocaleDateString('pt-BR') : '—'}</td>
                  <td>
                    <span className={`badge ${entry.status === 'paid' ? 'badge-success' : entry.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                      {entry.status === 'paid' ? 'Pago' : entry.status === 'pending' ? 'Pendente' : 'Cancelado'}
                    </span>
                  </td>
                  <td>
                    {entry.status === 'pending' && (
                      <button onClick={() => handleStatusChange(entry.id, 'paid')} style={{ background: 'none', border: 'none', color: '#22c55e', cursor: 'pointer', fontSize: '0.8rem' }}>
                        Marcar Pago
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
