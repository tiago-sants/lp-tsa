'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api('/auth/forgot-password', { method: 'POST', body: { email } });
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Recuperar Senha</h1>

        {sent ? (
          <>
            <p className="subtitle">Email enviado! Verifique sua caixa de entrada para redefinir sua senha.</p>
            <div className="auth-link">
              <Link href="/login">← Voltar ao login</Link>
            </div>
          </>
        ) : (
          <>
            <p className="subtitle">Informe seu email para receber o link de redefinição</p>
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', padding: '0.75rem', borderRadius: 10, marginBottom: '1rem', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Link'}
              </button>
            </form>
            <div className="auth-link">
              <Link href="/login">← Voltar ao login</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
