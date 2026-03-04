'use client';

import { FaWhatsapp } from 'react-icons/fa';
import { notifyTelegram } from '@/lib/telegram';

export default function WhatsappButton() {
  const handleClick = () => {
    notifyTelegram('[HOME] 🚀 Clique em : BOTÃO WHATSAPP FIXO');
  };

  return (
    <a
      href="https://wa.me/5562991845391?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20serviços%20da%20TSA%20Soluções."
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn"
      aria-label="Contato via WhatsApp"
      onClick={handleClick}
    >
      <FaWhatsapp />
    </a>
  );
}
