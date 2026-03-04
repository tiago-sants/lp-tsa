'use client';

import { useAuth } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { FaSave } from 'react-icons/fa';

interface Profile {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  client?: {
    id: number;
    company_name: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
  };
}

export default function PerfilPage() {
  const { user, token, refreshUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwMessage, setPwMessage] = useState('');

  useEffect(() => {
    if (!token) return;
    api<{ user: Profile }>('/auth/me', { token })
      .then((data) => setProfile(data.user))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const handleSave = async () => {
    if (!profile || !token) return;
    setSaving(true);
    setMessage('');
    try {
      await api('/auth/me', {
        token,
        method: 'PUT',
        body: { name: profile.name, phone: profile.phone },
      });
      setMessage('Perfil atualizado com sucesso!');
      refreshUser();
    } catch (err) {
      setMessage('Erro: ' + (err instanceof Error ? err.message : 'Erro desconhecido'));
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPwMessage('');
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPwMessage('As senhas não coincidem.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPwMessage('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (!token) return;
    try {
      await api('/auth/change-password', {
        token,
        method: 'POST',
        body: { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword },
      });
      setPwMessage('Senha alterada com sucesso!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwMessage('Erro: ' + (err instanceof Error ? err.message : 'Senha atual incorreta'));
    }
  };

  if (!user) return null;
  if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</p>;

  const inputStyle = { width: '100%', padding: '0.6rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' };

  return (
    <>
      <div className="page-header">
        <h1>Meu Perfil</h1>
      </div>

      <div style={{ display: 'grid', gap: '2rem', maxWidth: '600px' }}>
        {/* Profile Info */}
        <div className="stat-card">
          <h3 style={{ marginBottom: '1.5rem' }}>Informações Pessoais</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nome</label>
              <input type="text" value={profile?.name || ''} onChange={(e) => profile && setProfile({ ...profile, name: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>E-mail</label>
              <input type="email" value={profile?.email || ''} disabled style={{ ...inputStyle, opacity: 0.6 }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Telefone</label>
              <input type="text" value={profile?.phone || ''} onChange={(e) => profile && setProfile({ ...profile, phone: e.target.value })} style={inputStyle} />
            </div>
            <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', justifySelf: 'start' }}>
              <FaSave /> {saving ? 'Salvando...' : 'Salvar'}
            </button>
            {message && <p style={{ color: message.startsWith('Erro') ? '#ef4444' : '#22c55e', fontSize: '0.9rem' }}>{message}</p>}
          </div>
        </div>

        {/* Client Info (if client) */}
        {profile?.client && (
          <div className="stat-card">
            <h3 style={{ marginBottom: '1rem' }}>Dados da Empresa</h3>
            <div style={{ display: 'grid', gap: '0.75rem', color: 'var(--text-secondary)' }}>
              <div><strong>Empresa:</strong> {profile.client.company_name}</div>
              <div><strong>Contato:</strong> {profile.client.contact_name}</div>
              <div><strong>E-mail:</strong> {profile.client.contact_email}</div>
              <div><strong>Telefone:</strong> {profile.client.contact_phone}</div>
            </div>
          </div>
        )}

        {/* Change Password */}
        <div className="stat-card">
          <h3 style={{ marginBottom: '1.5rem' }}>Alterar Senha</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Senha Atual</label>
              <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nova Senha</label>
              <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Confirmar Nova Senha</label>
              <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} style={inputStyle} />
            </div>
            <button onClick={handlePasswordChange} className="btn-primary" style={{ padding: '0.6rem 1.2rem', justifySelf: 'start' }}>
              Alterar Senha
            </button>
            {pwMessage && <p style={{ color: pwMessage.startsWith('Erro') ? '#ef4444' : '#22c55e', fontSize: '0.9rem' }}>{pwMessage}</p>}
          </div>
        </div>
      </div>
    </>
  );
}
