'use client';

import { useState, FormEvent } from 'react';
import { FaPhone, FaEnvelope, FaWhatsapp, FaPaperPlane, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { notifyTelegram } from '@/lib/telegram';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Nome é obrigatório';
    else if (form.name.trim().length < 4) errs.name = 'Nome deve ter pelo menos 4 caracteres';
    if (!form.email.trim()) errs.email = 'Email é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Email inválido';
    if (!form.phone.trim()) errs.phone = 'Telefone é obrigatório';
    else if (form.phone.replace(/\D/g, '').length < 10) errs.phone = 'Telefone deve ter pelo menos 10 dígitos';
    if (!form.message.trim()) errs.message = 'Mensagem é obrigatória';
    else if (form.message.trim().length < 10) errs.message = 'Mensagem deve ter pelo menos 10 caracteres';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits.replace(/(\d{0,2})/, '($1');
    if (digits.length <= 7) return digits.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    notifyTelegram('[HOME] 🚀 Clique em : ENVIAR MENSAGEM');

    try {
      const emailjs = (await import('@emailjs/browser')).default;
      await emailjs.send('service_8h2no1d', 'template_bhs4c57', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      }, 'dhB3bhOrW8iqajEc0');

      setSuccess(true);
      setForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Erro ao enviar:', err);
      alert('Ocorreu um erro ao enviar sua mensagem. Tente novamente em instantes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-header">
          <h2>Entre em Contato</h2>
          <p>Pronto para transformar seu negócio? Vamos conversar!</p>
        </div>
        <div className="contact-content">
          <div className="contact-info">
            <h3>Fale Conosco</h3>
            <div className="contact-item">
              <div className="contact-icon"><FaPhone color="#fff" /></div>
              <div className="contact-details">
                <h4>Telefone</h4>
                <p>
                  <a href="tel:+5562991845391" onClick={() => { window.fbq?.('trackCustom', 'BotaoTelefone'); notifyTelegram('[HOME] 🚀 Clique em : BOTÃO TELEFONE'); }}>
                    (62) 99184-5391
                  </a>
                </p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><FaEnvelope color="#fff" /></div>
              <div className="contact-details">
                <h4>Email</h4>
                <p>
                  <a href="mailto:tiago@tsasolucoes.com" onClick={() => { window.fbq?.('trackCustom', 'BotaoEmail'); notifyTelegram('[HOME] 🚀 Clique em : BOTÃO EMAIL'); }}>
                    tiago@tsasolucoes.com
                  </a>
                </p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><FaInstagram color="#fff" /></div>
              <div className="contact-details">
                <h4>Instagram</h4>
                <p>
                  <a href="https://instagram.com/tsasolucoes" target="_blank" rel="noopener noreferrer" onClick={() => { window.fbq?.('trackCustom', 'BotaoInstagram'); notifyTelegram('[HOME] 🚀 Clique em : BOTÃO INSTAGRAM'); }}>
                    @tsasolucoes
                  </a>
                </p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon"><FaWhatsapp color="#fff" /></div>
              <div className="contact-details">
                <h4>WhatsApp</h4>
                <p>
                  <a href="https://wa.me/5562991845391?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20serviços%20da%20TSA%20Soluções." target="_blank" rel="noopener noreferrer" onClick={() => notifyTelegram('[HOME] 🚀 Clique em : BOTÃO WHATSAPP')}>
                    (62) 99184-5391
                  </a>
                </p>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nome *</label>
              <input type="text" id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              {errors.name && <span className="error-message show">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input type="email" id="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {errors.email && <span className="error-message show">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Telefone *</label>
              <input type="tel" id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })} />
              {errors.phone && <span className="error-message show">{errors.phone}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="message">Mensagem *</label>
              <textarea id="message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              {errors.message && <span className="error-message show">{errors.message}</span>}
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><FaSpinner className="animate-spin" /> Enviando...</> : <><FaPaperPlane /> Enviar Mensagem</>}
            </button>
            {success && (
              <div className="success-message show">
                <FaCheckCircle /> Mensagem enviada com sucesso! Entraremos em contato em breve.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
