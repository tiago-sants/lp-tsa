'use client';

import { useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { notifyTelegram, wakeUpServer, trackAccess } from '@/lib/telegram';
import MetaPixel, { META_PIXEL_ID_WHATSAPP } from '@/components/MetaPixel';
import Particles from '@/components/Particles';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function WhatsappPage() {
  useEffect(() => {
    wakeUpServer();
    trackAccess('whatsapp');
  }, []);

  const handleClick = () => {
    window.fbq?.('track', 'Contact');
    notifyTelegram('[PAGINA-WHATSAPP] 🚀 Alguém clicou no botão do WhatsApp!');
  };

  return (
    <>
      <MetaPixel pixelId={META_PIXEL_ID_WHATSAPP} />
      <div className="whatsapp-page">
        <div className="hero-background">
          <div className="hero-shapes">
            <div className="shape shape-1" />
            <div className="shape shape-2" />
            <div className="shape shape-3" />
          </div>
        </div>
        <Particles count={100} />
        <div className="cta-text">
          Entrar em contato pelo <br /> WhatsApp
        </div>
        <a
          href="https://wa.me/5562991845391?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20serviços%20da%20TSA%20Soluções."
          className="whatsapp-btn-center"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
        >
          <FaWhatsapp />
        </a>
      </div>
    </>
  );
}
