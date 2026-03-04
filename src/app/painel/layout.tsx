'use client';

import { useAuth } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import Link from 'next/link';
import {
  FaHome, FaFileAlt, FaFolder, FaStream, FaHeadset, FaCalendarAlt, FaUser,
  FaUsers, FaPlusCircle, FaColumns, FaDollarSign, FaBullseye, FaCog, FaChartBar,
  FaSignOutAlt, FaEye
} from 'react-icons/fa';

const clientLinks = [
  { href: '/painel', label: 'Dashboard', icon: FaHome },
  { href: '/painel/relatorios', label: 'Relatórios', icon: FaFileAlt },
  { href: '/painel/documentos', label: 'Documentos', icon: FaFolder },
  { href: '/painel/timeline', label: 'Timeline', icon: FaStream },
  { href: '/painel/suporte', label: 'Suporte', icon: FaHeadset },
  { href: '/painel/agendamento', label: 'Agendamento', icon: FaCalendarAlt },
  { href: '/painel/perfil', label: 'Meu Perfil', icon: FaUser },
];

const adminLinks = [
  { href: '/painel', label: 'Dashboard', icon: FaHome },
  { href: '/painel/clientes', label: 'Clientes', icon: FaUsers },
  { href: '/painel/relatorios', label: 'Relatórios', icon: FaFileAlt },
  { href: '/painel/relatorios/novo', label: 'Novo Relatório', icon: FaPlusCircle },
  { href: '/painel/crm', label: 'CRM', icon: FaColumns },
  { href: '/painel/financeiro', label: 'Financeiro', icon: FaDollarSign },
  { href: '/painel/metas', label: 'Metas', icon: FaBullseye },
  { href: '/painel/tickets', label: 'Tickets', icon: FaHeadset },
  { href: '/painel/acessos', label: 'Acessos LP', icon: FaEye },
  { href: '/painel/configuracoes', label: 'Configurações', icon: FaCog },
];

export default function PainelLayout({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dark-bg)', color: 'var(--white)' }}>
        Carregando...
      </div>
    );
  }

  if (!user) return null;

  const links = user.role === 'admin' ? adminLinks : clientLinks;

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Link href="/painel" style={{ textDecoration: 'none' }}>
            <h2>TSA Soluções</h2>
          </Link>
          <span>{user.role === 'admin' ? 'Administrador' : 'Cliente'}</span>
        </div>
        <nav className="sidebar-nav">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`sidebar-link ${pathname === link.href ? 'active' : ''}`}
            >
              <link.icon />
              {link.label}
            </Link>
          ))}
        </nav>
        <div style={{ borderTop: '1px solid rgba(0,212,255,0.1)', paddingTop: '1rem', marginTop: 'auto' }}>
          <div style={{ color: 'var(--gray-medium)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            {user.name}
          </div>
          <button
            onClick={() => { logout(); router.push('/login'); }}
            className="sidebar-link"
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
          >
            <FaSignOutAlt />
            Sair
          </button>
        </div>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
