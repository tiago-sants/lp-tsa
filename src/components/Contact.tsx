'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { notifyTelegram } from '@/lib/telegram';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const testimonials = [
  {
    text: 'Depois que comecei com a TSA, meu faturamento simplesmente virou outro. O tráfego tá muito bem feito, tudo otimizado... finalmente senti que meu dinheiro tava trabalhando de verdade.',
    name: 'Kaio Zaga',
    result: '+1M em vendas',
  },
  {
    text: 'Eu já tinha tentado anunciar antes, mas nunca tive resultado de verdade. Com a TSA foi diferente. Em menos de 1 mês já começou a entrar lead todo dia no WhatsApp.',
    name: 'Leandro Favarete',
    result: '+500k em vendas',
  },
];

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
    notifyTelegram('[HOME] Clique em: ENVIAR MENSAGEM');

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
    <section id="contact" className="contact-brutalist fade-in-section">
      <span className="section-label">/ CANAL ABERTO / p. 006</span>

      <p className="text-micro" style={{ color: 'var(--primary)', letterSpacing: '3px', marginTop: '2vw' }}>
        VAMOS FAZER SEU NEGÓCIO DECOLAR.
      </p>

      <a
        href="mailto:contato@tsasolucoes.com"
        className="title-contact-email"
        style={{ display: 'block', marginTop: '2vw' }}
        onClick={() => {
          window.fbq?.('trackCustom', 'BotaoEmail');
          notifyTelegram('[HOME] Clique em: EMAIL');
        }}
      >
        contato@tsasolucoes.com
      </a>

      <form className="contact-form-brutalist" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name">NOME</label>
          <input
            type="text"
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Seu nome"
          />
          {errors.name && <span className="contact-error">{errors.name}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="email">EMAIL</label>
          <input
            type="email"
            id="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="seu@email.com"
          />
          {errors.email && <span className="contact-error">{errors.email}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="phone">TELEFONE</label>
          <input
            type="tel"
            id="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })}
            placeholder="(00) 00000-0000"
          />
          {errors.phone && <span className="contact-error">{errors.phone}</span>}
        </div>
        <div className="form-field full-width">
          <label htmlFor="message">MENSAGEM</label>
          <textarea
            id="message"
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Como podemos ajudar?"
          />
          {errors.message && <span className="contact-error">{errors.message}</span>}
        </div>
        <div className="submit-btn">
          <button type="submit" className="action-link" disabled={loading}>
            {loading ? 'ENVIANDO...' : 'ENVIAR MENSAGEM →'}
          </button>
          {success && (
            <p className="contact-success">Mensagem enviada com sucesso! Entraremos em contato em breve.</p>
          )}
        </div>
      </form>

      <div className="contact-social-row">
        <a
          href="https://instagram.com/tsasolucoes"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          onClick={() => {
            window.fbq?.('trackCustom', 'BotaoInstagram');
            notifyTelegram('[HOME] Clique em: INSTAGRAM');
          }}
        >
          INSTAGRAM ↗
        </a>
        <a
          href="https://wa.me/5562982359902?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20serviços%20da%20TSA%20Soluções."
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          onClick={() => notifyTelegram('[HOME] Clique em: WHATSAPP')}
        >
          WHATSAPP ↗
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          onClick={() => notifyTelegram('[HOME] Clique em: LINKEDIN')}
        >
          LINKEDIN ↗
        </a>
      </div>

      <div className="contact-footer">
        <span className="text-micro-italic" style={{ fontStyle: 'normal' }}>
          tsasolucoes.com / 2026
        </span>
        <Link href="/login" className="social-link" style={{ fontSize: '10px' }}>
          ÁREA DO CLIENTE ↗
        </Link>
      </div>
    </section>
  );
}
