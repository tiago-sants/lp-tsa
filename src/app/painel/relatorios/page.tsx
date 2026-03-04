'use client';

import { useAuth } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { FaEye, FaPlus } from 'react-icons/fa';

interface Report {
  id: number;
  client_name: string;
  client_id: number;
  title: string;
  performance_score: number;
  status: string;
  created_at: string;
}

export default function RelatoriosPage() {
  const { user, token } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !user) return;
    const url = user.role === 'admin' ? '/reports' : `/reports/client/${user.id}`;
    api<{ reports: Report[] }>(url, { token })
      .then((data) => setReports(data.reports || []))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, [token, user]);

  const getScoreClass = (score: number) => {
    if (score >= 80) return 'badge-success';
    if (score >= 50) return 'badge-warning';
    return 'badge-danger';
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      draft: 'Rascunho',
      approved: 'Aprovado',
      archived: 'Arquivado',
    };
    return map[status] || status;
  };

  if (!user) return null;

  return (
    <>
      <div className="page-header">
        <h1>Relatórios</h1>
        {user.role === 'admin' && (
          <Link href="/painel/relatorios/novo" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.9rem', textDecoration: 'none' }}>
            <FaPlus /> Novo Relatório
          </Link>
        )}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</p>
      ) : reports.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <p>Nenhum relatório encontrado.</p>
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                {user.role === 'admin' && <th>Cliente</th>}
                <th>Título</th>
                <th>Score</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  {user.role === 'admin' && <td>{report.client_name}</td>}
                  <td>{report.title}</td>
                  <td>
                    <span className={`badge ${getScoreClass(report.performance_score)}`}>
                      {report.performance_score}/100
                    </span>
                  </td>
                  <td>{getStatusLabel(report.status)}</td>
                  <td>{new Date(report.created_at).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <Link href={`/painel/relatorios/${report.id}`} style={{ color: 'var(--accent-color)' }}>
                      <FaEye />
                    </Link>
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
