'use client';

import { useAuth } from '@/lib/auth';
import { useState } from 'react';
import { FaSave, FaCog, FaBell, FaPalette } from 'react-icons/fa';

export default function ConfiguracoesPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    notifyNewTicket: true,
    notifyNewAccess: false,
    notifyPaymentDue: true,
    notifyReportReady: true,
    autoWelcomeEmail: true,
    defaultPlan: 'basic',
    companyName: 'TSA Soluções',
    companyEmail: 'contato@tsasolucoes.com',
  });

  const handleSave = () => {
    // Save to localStorage for now (could be API later)
    localStorage.setItem('tsa_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!user || user.role !== 'admin') return null;

  const inputStyle = { width: '100%', padding: '0.5rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' };

  return (
    <>
      <div className="page-header">
        <h1>Configurações</h1>
      </div>

      <div style={{ display: 'grid', gap: '2rem', maxWidth: '600px' }}>
        {/* General */}
        <div className="stat-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <FaCog color="var(--accent-color)" /> Geral
          </h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nome da Empresa</label>
              <input type="text" value={settings.companyName} onChange={(e) => setSettings({ ...settings, companyName: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>E-mail da Empresa</label>
              <input type="email" value={settings.companyEmail} onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Plano Padrão</label>
              <select value={settings.defaultPlan} onChange={(e) => setSettings({ ...settings, defaultPlan: e.target.value })} style={inputStyle}>
                <option value="basic">Básico</option>
                <option value="intermediate">Intermediário</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="stat-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <FaBell color="#f59e0b" /> Notificações
          </h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              { key: 'notifyNewTicket', label: 'Novo Ticket de Suporte' },
              { key: 'notifyNewAccess', label: 'Novos Acessos à LP' },
              { key: 'notifyPaymentDue', label: 'Pagamentos Pendentes' },
              { key: 'notifyReportReady', label: 'Relatório Pronto' },
              { key: 'autoWelcomeEmail', label: 'E-mail de Boas-vindas Automático' },
            ].map((opt) => (
              <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '6px', background: 'rgba(0,0,0,0.1)' }}>
                <input
                  type="checkbox"
                  checked={settings[opt.key as keyof typeof settings] as boolean}
                  onChange={(e) => setSettings({ ...settings, [opt.key]: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-color)' }}
                />
                <span style={{ color: 'var(--text-primary)' }}>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Theme Info */}
        <div className="stat-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <FaPalette color="var(--accent-secondary)" /> Tema
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            O tema segue a identidade visual da TSA Soluções. As cores e fontes são configuradas globalmente no CSS.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            {[
              { name: 'Primary', color: 'var(--accent-color)' },
              { name: 'Secondary', color: 'var(--accent-secondary)' },
              { name: 'Neon', color: 'var(--accent-neon)' },
              { name: 'Gradient', color: 'var(--accent-gradient)' },
            ].map((c) => (
              <div key={c.name} style={{ textAlign: 'center' }}>
                <div style={{ width: '100%', height: '40px', borderRadius: '6px', background: c.color, marginBottom: '0.25rem' }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Save button */}
        <button onClick={handleSave} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.5rem', justifySelf: 'start' }}>
          <FaSave /> {saved ? 'Salvo!' : 'Salvar Configurações'}
        </button>
      </div>
    </>
  );
}
