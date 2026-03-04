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
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
