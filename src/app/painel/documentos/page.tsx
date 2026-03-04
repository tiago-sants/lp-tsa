'use client';

import { useAuth } from '@/lib/auth';
import { useEffect, useState, useRef } from 'react';
import { api, apiUpload } from '@/lib/api';
import { FaUpload, FaDownload, FaTrash, FaFileAlt, FaFilePdf, FaFileImage, FaFileExcel } from 'react-icons/fa';

interface Document {
  id: number;
  client_id: number;
  client_name?: string;
  file_name: string;
  file_type: string;
  file_size: number;
  category: string;
  description: string;
  s3_key: string;
  created_at: string;
}

export default function DocumentosPage() {
  const { user, token } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = () => {
    if (!token || !user) return;
    const url = user.role === 'admin' ? '/documents' : `/documents?clientId=${user.clientId}`;
    api<{ documents: Document[] }>(url, { token })
      .then((data) => setDocuments(data.documents || []))
      .catch(() => setDocuments([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file || !token || !user) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', description);
      formData.append('category', category);
      if (user.clientId) {
        formData.append('clientId', String(user.clientId));
      }
      await apiUpload('/documents', formData, { token });
      setDescription('');
      setCategory('general');
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchDocuments();
    } catch (err) {
      alert('Erro ao enviar documento: ' + (err instanceof Error ? err.message : 'Erro desconhecido'));
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc: Document) => {
    if (!token) return;
    try {
      const data = await api<{ url: string }>(`/documents/${doc.id}/download`, { token });
      window.open(data.url, '_blank');
    } catch {
      alert('Erro ao baixar documento');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este documento?')) return;
    if (!token) return;
    try {
      await api(`/documents/${id}`, { token, method: 'DELETE' });
      fetchDocuments();
    } catch {
      alert('Erro ao excluir documento');
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FaFilePdf color="#ef4444" />;
    if (type.includes('image')) return <FaFileImage color="#3b82f6" />;
    if (type.includes('sheet') || type.includes('excel') || type.includes('csv')) return <FaFileExcel color="#22c55e" />;
    return <FaFileAlt color="var(--text-secondary)" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getCategoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      general: 'Geral',
      contract: 'Contrato',
      report: 'Relatório',
      invoice: 'Nota Fiscal',
      creative: 'Criativo',
      other: 'Outro',
    };
    return map[cat] || cat;
  };

  if (!user) return null;

  return (
    <>
      <div className="page-header">
        <h1>Documentos</h1>
      </div>

      {/* Upload Form */}
      <div className="stat-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Enviar Documento</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Arquivo</label>
            <input type="file" ref={fileInputRef} style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Categoria</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}>
              <option value="general">Geral</option>
              <option value="contract">Contrato</option>
              <option value="report">Relatório</option>
              <option value="invoice">Nota Fiscal</option>
              <option value="creative">Criativo</option>
              <option value="other">Outro</option>
            </select>
          </div>
          <button onClick={handleUpload} disabled={uploading} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem' }}>
            <FaUpload /> {uploading ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
        <div style={{ marginTop: '0.75rem' }}>
          <input type="text" placeholder="Descrição (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }} />
        </div>
      </div>

      {/* Documents List */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</p>
      ) : documents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <p>Nenhum documento encontrado.</p>
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th></th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Tamanho</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>{getFileIcon(doc.file_type)}</td>
                  <td>
                    <div>{doc.file_name}</div>
                    {doc.description && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{doc.description}</div>}
                  </td>
                  <td>{getCategoryLabel(doc.category)}</td>
                  <td>{formatSize(doc.file_size)}</td>
                  <td>{new Date(doc.created_at).toLocaleDateString('pt-BR')}</td>
                  <td style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => handleDownload(doc)} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer' }} title="Baixar">
                      <FaDownload />
                    </button>
                    {user.role === 'admin' && (
                      <button onClick={() => handleDelete(doc.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Excluir">
                        <FaTrash />
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
