'use client';

import { useAuth } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { FaGlobe, FaMapMarkerAlt, FaClock, FaDesktop } from 'react-icons/fa';

interface AccessLog {
  id: number;
  page: string;
  ip: string;
  country: string;
  city: string;
  region: string;
  user_agent: string;
  referrer: string;
  created_at: string;
}

export default function AcessosPage() {
  const { user, token } = useAuth();
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 50;

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api<{ logs: AccessLog[]; total: number }>(`/access-logs?page=${page}&limit=${perPage}`, { token })
      .then((data) => {
        setLogs(data.logs || []);
        setTotal(data.total || 0);
      })
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, [token, page]);

  if (!user || user.role !== 'admin') return null;

  const totalPages = Math.ceil(total / perPage);

  const getDeviceIcon = (ua: string) => {
    if (!ua) return '❓';
    if (/mobile|android|iphone/i.test(ua)) return '📱';
    if (/tablet|ipad/i.test(ua)) return '📱';
    return '💻';
  };

  return (
    <>
      <div className="page-header">
        <h1>Acessos da LP</h1>
        <span className="breadcrumb">{total} acessos registrados</span>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="stat-card">
          <FaGlobe size={20} color="var(--accent-color)" />
          <div className="stat-label">Total de Acessos</div>
          <div className="stat-value">{total}</div>
        </div>
        <div className="stat-card">
          <FaMapMarkerAlt size={20} color="var(--accent-secondary)" />
          <div className="stat-label">Países Únicos</div>
          <div className="stat-value">{new Set(logs.map((l) => l.country).filter(Boolean)).size}</div>
        </div>
        <div className="stat-card">
          <FaClock size={20} color="#f59e0b" />
          <div className="stat-label">Últimas 24h</div>
          <div className="stat-value">
            {logs.filter((l) => new Date(l.created_at) > new Date(Date.now() - 86400000)).length}
          </div>
        </div>
        <div className="stat-card">
          <FaDesktop size={20} color="#06b6d4" />
          <div className="stat-label">Páginas</div>
          <div className="stat-value">{new Set(logs.map((l) => l.page)).size}</div>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</p>
      ) : logs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <p>Nenhum acesso registrado.</p>
        </div>
      ) : (
        <>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Página</th>
                  <th>IP</th>
                  <th>Localização</th>
                  <th>Referrer</th>
                  <th>Data/Hora</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{getDeviceIcon(log.user_agent)}</td>
                    <td><span className="badge badge-info">{log.page || '/'}</span></td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{log.ip}</td>
                    <td>
                      {log.city || log.region || log.country ? (
                        <span style={{ fontSize: '0.85rem' }}>
                          {[log.city, log.region, log.country].filter(Boolean).join(', ')}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)' }}>—</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.8rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.referrer || '—'}
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {new Date(log.created_at).toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} style={{ padding: '0.4rem 0.8rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-secondary)', cursor: page === 1 ? 'default' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>
                Anterior
              </button>
              <span style={{ padding: '0.4rem 0.8rem', color: 'var(--text-secondary)' }}>
                {page} de {totalPages}
              </span>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} style={{ padding: '0.4rem 0.8rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-secondary)', cursor: page === totalPages ? 'default' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}>
                Próximo
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
