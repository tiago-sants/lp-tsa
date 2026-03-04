'use client';

import { useAuth } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { FaPlus, FaEye, FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';

interface Client {
  id: number;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  status: string;
  plan: string;
  monthly_value: number;
  created_at: string;
}

export default function ClientesPage() {
  const { user, token } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    company_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    plan: 'basic',
    monthly_value: 0,
    notes: '',
  });
  const [createUser, setCreateUser] = useState(true);
  const [userPassword, setUserPassword] = useState('');

  const fetchClients = () => {
    if (!token) return;
    api<{ clients: Client[] }>('/clients', { token })
      .then((data) => setClients(data.clients || []))
      .catch(() => setClients([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const resetForm = () => {
    setForm({ company_name: '', contact_name: '', contact_email: '', contact_phone: '', plan: 'basic', monthly_value: 0, notes: '' });
    setEditId(null);
    setCreateUser(true);
    setUserPassword('');
  };

  const handleSubmit = async () => {
    if (!token || !form.company_name) return;
    try {
      if (editId) {
        await api(`/clients/${editId}`, { token, method: 'PUT', body: form });
      } else {
        await api('/clients', { token, method: 'POST', body: { ...form, createUser, password: userPassword || undefined } });
      }
      setShowForm(false);
      resetForm();
      fetchClients();
    } catch (err) {
      alert('Erro: ' + (err instanceof Error ? err.message : 'Erro desconhecido'));
    }
  };

  const handleEdit = (client: Client) => {
    setForm({
      company_name: client.company_name,
      contact_name: client.contact_name,
      contact_email: client.contact_email,
      contact_phone: client.contact_phone,
      plan: client.plan,
      monthly_value: client.monthly_value,
      notes: '',
    });
    setEditId(client.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;
    if (!token) return;
    try {
      await api(`/clients/${id}`, { token, method: 'DELETE' });
      fetchClients();
    } catch {
      alert('Erro ao excluir cliente');
    }
  };

  const statusLabels: Record<string, { label: string; class: string }> = {
    active: { label: 'Ativo', class: 'badge-success' },
    inactive: { label: 'Inativo', class: 'badge-danger' },
    prospect: { label: 'Prospect', class: 'badge-warning' },
    churned: { label: 'Cancelado', class: 'badge-danger' },
  };

  const planLabels: Record<string, string> = {
    basic: 'Básico',
    intermediate: 'Intermediário',
    premium: 'Premium',
    custom: 'Personalizado',
  };

  if (!user || user.role !== 'admin') return null;

  const inputStyle = { width: '100%', padding: '0.5rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' };

  return (
    <>
      <div className="page-header">
        <h1>Clientes</h1>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
          <FaPlus /> Novo Cliente
        </button>
      </div>

      {showForm && (
        <div className="stat-card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>{editId ? 'Editar Cliente' : 'Novo Cliente'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nome da Empresa *</label>
              <input type="text" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nome do Contato</label>
              <input type="text" value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>E-mail do Contato</label>
              <input type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Telefone</label>
              <input type="text" value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Plano</label>
              <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })} style={inputStyle}>
                <option value="basic">Básico</option>
                <option value="intermediate">Intermediário</option>
                <option value="premium">Premium</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Valor Mensal (R$)</label>
              <input type="number" value={form.monthly_value} onChange={(e) => setForm({ ...form, monthly_value: Number(e.target.value) })} style={inputStyle} />
            </div>
          </div>

          {!editId && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(59,130,246,0.1)', borderRadius: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={createUser} onChange={(e) => setCreateUser(e.target.checked)} />
                <FaUserPlus /> Criar login para o cliente
              </label>
              {createUser && (
                <div style={{ marginTop: '0.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Senha inicial (deixe vazio para gerar automática)</label>
                  <input type="text" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} placeholder="Senha inicial" style={inputStyle} />
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleSubmit} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
              {editId ? 'Salvar Alterações' : 'Criar Cliente'}
            </button>
            <button onClick={() => { setShowForm(false); resetForm(); }} style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancelar</button>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</p>
      ) : clients.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <p>Nenhum cliente cadastrado.</p>
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Contato</th>
                <th>Plano</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => {
                const st = statusLabels[client.status] || statusLabels.active;
                return (
                  <tr key={client.id}>
                    <td>
                      <div><strong>{client.company_name}</strong></div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{client.contact_email}</div>
                    </td>
                    <td>{client.contact_name}</td>
                    <td>{planLabels[client.plan] || client.plan}</td>
                    <td>R$ {client.monthly_value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td><span className={`badge ${st.class}`}>{st.label}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link href={`/painel/clientes/${client.id}`} style={{ color: 'var(--accent-color)' }} title="Detalhes"><FaEye /></Link>
                        <button onClick={() => handleEdit(client)} style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer' }} title="Editar"><FaEdit /></button>
                        <button onClick={() => handleDelete(client.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Excluir"><FaTrash /></button>
                      </div>
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
