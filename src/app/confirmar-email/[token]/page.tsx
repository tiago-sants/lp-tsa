'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function ConfirmarEmailPage() {
  const params = useParams();
  const token = params.token as string;
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;
    api<{ message: string }>(`/auth/confirm-email/${token}`)
      .then((data) => { setStatus('success'); setMessage(data.message); })
      .catch((err) => { setStatus('error'); setMessage(err.message); });
  }, [token]);

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        {status === 'loading' && (
          <>
            <h1>Confirmando...</h1>
            <p className="subtitle">Verificando seu email...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</h1>
            <h1>Email Confirmado!</h1>
            <p className="subtitle">{message}</p>
            <div className="auth-link">
              <Link href="/login">Ir para Login</Link>
            </div>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</h1>
            <h1>Erro</h1>
            <p className="subtitle">{message}</p>
            <div className="auth-link">
              <Link href="/login">Ir para Login</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
