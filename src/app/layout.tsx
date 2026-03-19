import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'TSA Soluções | Marketing Digital em Goiânia',
  description:
    'Agência de marketing digital especializada em tráfego pago, social media e landing pages. Geramos leads e vendas todos os dias para o seu negócio.',
  keywords: 'marketing digital, tráfego pago, google ads, meta ads, social media, goiânia, leads',
  openGraph: {
    title: 'TSA Soluções | Marketing Digital',
    description: 'Criando Envolvimento, Gerando Resultados',
    url: 'https://tsasolucoes.com',
    siteName: 'TSA Soluções',
    locale: 'pt_BR',
    type: 'website',
  },
  icons: { icon: '/favicon-32x32.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ cursor: 'none' }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
