'use client';

import { useAuth } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { FaEdit, FaTrash, FaKey, FaUserShield, FaUser, FaSearch } from 'react-icons/fa';

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  confirmed: boolean;
  status: string;
  whatsapp: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export default function UsuariosPage() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');

  // Modal de edição
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: 'client', confirmed: true });

  // Modal de reset de senha
  const [resetUser, setResetUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const fetchUsers = () => {
    if (!token) return;
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (filterRole) params.set('role', filterRole);
    params.set('limit', '100');

    api<{ users: User[] }>(`/users?${params.toString()}`, { token })
      .then((data) => setUsers(data.users || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, filterRole]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const openEdit = (u: User) => {
    setEditUser(u);
    setEditForm({ name: u.name, email: u.email, role: u.role, confirmed: u.confirmed });
  };

  const handleSaveEdit = async () => {
    if (!token || !editUser) return;
    try {
      await api(`/users/${editUser.id}`, { token, method: 'PUT', body: editForm });
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      alert('Erro: ' + (err instanceof Error ? err.message : 'Erro desconhecido'));
    }
  };

  const handleResetPassword = async () => {
    if (!token || !resetUser || !newPassword) return;
    try {
      await api(`/users/${resetUser.id}/reset-password`, { token, method: 'PUT', body: { password: newPassword } });
      alert('Senha redefinida com sucesso!');
      setResetUser(null);
      setNewPassword('');
    } catch (err) {
      alert('Erro: ' + (err instanceof Error ? err.message : 'Erro desconhecido'));
    }
  };

  const handleDelete = async (u: User) => {
    if (u.id === user?.id) {
      alert('Você não pode excluir seu próprio usuário.');
      return;
    }
    if (!confirm(`Tem certeza que deseja excluir o usuário "${u.name}" (${u.email})? Esta ação é irreversível.`)) return;
    if (!token) return;
    try {
      await api(`/users/${u.id}`, { token, method: 'DELETE' });
      fetchUsers();
    } catch (err) {
      alert('Erro: ' + (err instanceof Error ? err.message : 'Erro desconhecido'));
    }
  };

  if (!user || user.role !== 'admin') return null;

  const inputStyle = { width: '100%', padding: '0.5rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' };

  return (
    <>
      <div className="page-header">
        <h1>Usuários</h1>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {users.length} usuário{users.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div className="stat-card" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <FaSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '0.85rem' }} />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ ...inputStyle, paddingLeft: '2rem' }}
            />
          </div>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: '140px' }}>
            <option value="">Todos os perfis</option>
            <option value="admin">Admin</option>
            <option value="client">Cliente</option>
          </select>
          <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}>Buscar</button>
        </form>
      </div>

      {/* Tabela */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</p>
      ) : users.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <p>Nenhum usuário encontrado.</p>
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Perfil</th>
                <th>Status</th>
                <th>Criado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td><strong>{u.name}</strong></td>
                  <td style={{ fontSize: '0.85rem' }}>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge-warning' : 'badge-info'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      {u.role === 'admin' ? <><FaUserShield /> Admin</> : <><FaUser /> Cliente</>}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.confirmed ? 'badge-success' : 'badge-danger'}`}>
                      {u.confirmed ? 'Confirmado' : 'Pendente'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {new Date(u.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openEdit(u)} style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer' }} title="Editar"><FaEdit /></button>
                      <button onClick={() => { setResetUser(u); setNewPassword(''); }} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer' }} title="Resetar Senha"><FaKey /></button>
                      {u.id !== user.id && (
                        <button onClick={() => handleDelete(u)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Excluir"><FaTrash /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Editar */}
      {editUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setEditUser(null)}>
          <div className="stat-card" style={{ width: '100%', maxWidth: '480px', margin: '1rem' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '1rem' }}>Editar Usuário</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nome</label>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email</label>
                <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Perfil</label>
                <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} style={inputStyle}>
                  <option value="admin">Admin</option>
                  <option value="client">Cliente</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={editForm.confirmed} onChange={(e) => setEditForm({ ...editForm, confirmed: e.target.checked })} />
                  Email confirmado
                </label>
              </div>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setEditUser(null)} style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleSaveEdit} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Resetar Senha */}
      {resetUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setResetUser(null)}>
          <div className="stat-card" style={{ width: '100%', maxWidth: '400px', margin: '1rem' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '0.5rem' }}>Resetar Senha</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Definindo nova senha para <strong>{resetUser.name}</strong> ({resetUser.email})
            </p>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nova Senha (mín. 6 caracteres)</label>
              <input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Digite a nova senha" style={inputStyle} />
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setResetUser(null)} style={{ padding: '0.5rem 1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleResetPassword} className="btn-primary" style={{ padding: '0.5rem 1rem' }} disabled={newPassword.length < 6}>Redefinir</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
