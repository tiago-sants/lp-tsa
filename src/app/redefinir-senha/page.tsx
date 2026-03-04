'use client';

import { useState, FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Suspense } from 'react';

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Senha deve ter pelo menos 6 caracteres'); return; }
    if (password !== confirm) { setError('Senhas não conferem'); return; }
    setLoading(true);
    try {
      await api('/auth/reset-password', { method: 'POST', body: { token, password } });
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Redefinir Senha</h1>

        {done ? (
          <>
            <p className="subtitle">Senha redefinida com sucesso! Você já pode fazer login.</p>
            <div className="auth-link">
              <Link href="/login">Ir para Login</Link>
            </div>
          </>
        ) : (
          <>
            <p className="subtitle">Crie uma nova senha para sua conta</p>
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', padding: '0.75rem', borderRadius: 10, marginBottom: '1rem', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="password">Nova Senha</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
              <div className="form-group">
                <label htmlFor="confirm">Confirmar Senha</label>
                <input type="password" id="confirm" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Redefinindo...' : 'Redefinir Senha'}
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

export default function RedefinirSenhaPage() {
  return (
    <Suspense fallback={<div className="auth-container"><div className="auth-card"><p className="subtitle">Carregando...</p></div></div>}>
      <ResetForm />
    </Suspense>
  );
}
