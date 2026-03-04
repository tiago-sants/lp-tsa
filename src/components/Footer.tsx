'use client';

import Link from 'next/link';
import { FaInstagram, FaFacebook, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { notifyTelegram } from '@/lib/telegram';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>TSA Soluções</h3>
            <p>Criando Envolvimento, Gerando Resultados</p>
          </div>
          <div className="footer-details">
            <div className="footer-links">
              <h4>Links Rápidos</h4>
              <ul>
                <li><a href="#home">Início</a></li>
                <li><a href="#about">Sobre</a></li>
                <li><a href="#services">Serviços</a></li>
                <li><a href="#contact">Contato</a></li>
                <li><Link href="/login">Área do Cliente</Link></li>
              </ul>
            </div>
            <div className="footer-services">
              <h4>Serviços</h4>
              <ul>
                <li>Tráfego Pago</li>
                <li>Social Media</li>
                <li>Landing Pages</li>
                <li>Consultoria</li>
              </ul>
            </div>
          </div>
          <div className="footer-social">
            <h4>Redes Sociais</h4>
            <div className="social-links">
              <a
                href="https://instagram.com/tsasolucoes"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  window.fbq?.('trackCustom', 'BotaoInstagramFooter');
                  notifyTelegram('[HOME] 🚀 Clique em : BOTÃO INSTAGRAM FOOTER');
                }}
              >
                <FaInstagram />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
              <a href="#" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
              <a
                href="https://wa.me/5562991845391?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20serviços%20da%20TSA%20Soluções."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => notifyTelegram('[HOME] 🚀 Clique em : BOTÃO WHATSAPP FOOTER')}
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} TSA Soluções. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
