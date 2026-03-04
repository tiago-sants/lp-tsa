'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { notifyTelegram } from '@/lib/telegram';
import { FaBullhorn, FaShareAlt, FaLaptopCode, FaChartLine } from 'react-icons/fa';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    Calendly?: { initPopupWidget: (opts: unknown) => void };
  }
}

const STEPS = 9;

const needsOptions = [
  { letter: 'A', value: 'Vender todos os dias de forma previsível e com alta margem de lucro.' },
  { letter: 'B', value: 'Captação constante de novos clientes.' },
  { letter: 'C', value: 'Retenção de clientes e recompra.' },
  { letter: 'D', value: 'Acelerar meus resultados.' },
  { letter: 'E', value: 'Aumento de seguidores no instagram.' },
  { letter: 'F', value: 'Mais engajamento no instagram.' },
  { letter: 'G', value: 'Fortalecimento de nome/marca.' },
  { letter: 'H', value: 'Outros.' },
];

export default function FormularioPage() {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [otherText, setOtherText] = useState('');
  const [emailError, setEmailError] = useState('');
  const [whatsappError, setWhatsappError] = useState('');

  // Restore from sessionStorage
  useEffect(() => {
    setUserName(sessionStorage.getItem('userName') || '');
    setEmail(sessionStorage.getItem('email') || '');
    setWhatsapp(sessionStorage.getItem('whatsapp') || '');
    const opts = sessionStorage.getItem('selectedOptions');
    if (opts) setSelectedOptions(JSON.parse(opts));
  }, []);

  // Meta Pixel tracking per step
  useEffect(() => {
    const pixelEvents: Record<number, string> = {
      1: 'FormInicial-1',
      2: 'FormNome-2',
      3: 'FormEmail-3',
      4: 'FormWhatsapp-4',
      5: 'FormNecessidades-5',
      6: 'FormInfoTrafego-6',
      7: 'FormInfoServico-7',
      8: 'FormServicosValores-8',
      9: 'FormAgendamento-9',
    };
    window.fbq?.('trackCustom', pixelEvents[step], { etapa: pixelEvents[step], page_type: 'form' });
  }, [step]);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits.replace(/(\d{0,2})/, '($1');
    if (digits.length <= 7) return digits.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  };

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const isValidPhone = (p: string) => { const d = p.replace(/\D/g, ''); return d.length >= 10 && d.length <= 11; };

  const goNext = useCallback(() => {
    if (step < STEPS) setStep(step + 1);
  }, [step]);

  // Enter key navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (step === 9 && (e.metaKey || e.ctrlKey)) {
          handleSchedule();
        } else if (step === 2) {
          handleNameNext();
        } else if (step === 3) {
          handleEmailNext();
        } else if (step === 4) {
          handleWhatsappNext();
        } else if (step === 5) {
          handleNeedsNext();
        } else if ([1, 6, 7, 8].includes(step)) {
          goNext();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const handleNameNext = () => {
    if (!userName.trim()) { alert('Por favor, digite seu nome.'); return; }
    sessionStorage.setItem('userName', userName);
    goNext();
  };

  const handleEmailNext = () => {
    if (!isValidEmail(email)) {
      setEmailError('Por favor, digite um e-mail válido para continuar.');
      return;
    }
    setEmailError('');
    sessionStorage.setItem('email', email);
    goNext();
  };

  const handleWhatsappNext = () => {
    if (!isValidPhone(whatsapp)) {
      setWhatsappError('Por favor, digite um número de WhatsApp válido.');
      return;
    }
    setWhatsappError('');
    sessionStorage.setItem('whatsapp', whatsapp.replace(/\D/g, ''));
    goNext();
  };

  const handleNeedsNext = () => {
    if (selectedOptions.length === 0) { alert('Selecione pelo menos uma opção.'); return; }
    const opts = selectedOptions.includes('Outros.') && otherText.trim()
      ? [...selectedOptions.filter(o => o !== 'Outros.'), `Outros: ${otherText.trim()}`]
      : selectedOptions;
    sessionStorage.setItem('selectedOptions', JSON.stringify(opts));
    goNext();
  };

  const toggleOption = (value: string) => {
    setSelectedOptions(prev =>
      prev.includes(value) ? prev.filter(o => o !== value) : [...prev, value]
    );
  };

  const handleSchedule = async () => {
    notifyTelegram('[FORM] 🚀 Clique em : AGENDAR REUNIÃO');
    window.fbq?.('track', 'CompleteRegistration');

    try {
      const emailjs = (await import('@emailjs/browser')).default;
      const allOpts = JSON.parse(sessionStorage.getItem('selectedOptions') || '[]');
      await emailjs.send('service_8h2no1d', 'template_6fprcip', {
        userName,
        email,
        whatsapp: whatsapp.replace(/\D/g, ''),
        selectedOptions: allOpts.join('; '),
      }, 'dhB3bhOrW8iqajEc0');
    } catch (err) {
      console.error('Erro ao enviar email:', err);
    }

    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/tsasolucoes-tiago/reuniao',
        prefill: {
          name: userName,
          email,
          customAnswers: {
            a1: '+55' + whatsapp.replace(/\D/g, ''),
            a2: `Necessidades: ${selectedOptions.join('; ')}`,
          },
        },
      });
    }
  };

  // Send telegram on step 9 load
  useEffect(() => {
    if (step === 9) {
      const allOpts = JSON.parse(sessionStorage.getItem('selectedOptions') || '[]');
      notifyTelegram(
        `📥 *Novo Formulário Enviado:*\n👤 Nome: ${userName}\n📧 Email: ${email}\n📱 Telefone: ${whatsapp}\n📝 Descrição: ${allOpts.join('; ')}`
      );
    }
  }, [step]);

  // Load Calendly script on step 9
  useEffect(() => {
    if (step === 9) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, [step]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark-bg)', color: 'var(--white)', fontFamily: "'Montserrat', 'Poppins', sans-serif" }}>
      <div className="form-container">
        <div className="screen-content">
          {/* Step 1 — Intro */}
          {step === 1 && (
            <>
              <div className="logo">
                <Image src="/images/logo-tsa.png" alt="TSA Soluções Logo" width={250} height={80} style={{ height: 'auto' }} />
              </div>
              <h1 style={{ fontSize: '1.8em', lineHeight: 1.2, marginBottom: 30, background: 'none', WebkitTextFillColor: 'var(--white)' }}>
                A SUA EMPRESA COM MAIS CLIENTES, MAIS LUCRO, MAIS RESULTADO E EM MENOS TEMPO
              </h1>
              <p style={{ fontSize: '1.2em', maxWidth: 700, lineHeight: 1.6 }}>
                Somos especialistas em captação constante de novos clientes. Nosso objetivo é acelerar os
                resultados do seu negócio de uma forma 100% segura e sem te vender nenhum curso!
              </p>
              <div className="small-text"><span>👥</span> preenchido por 4979 pessoas</div>
              <button className="form-btn" onClick={goNext}>SABER MAIS AGORA</button>
              <div className="small-text">carrega em Enter ↩</div>
            </>
          )}

          {/* Step 2 — Name */}
          {step === 2 && (
            <>
              <div className="question-number">1 ➔ Qual o seu nome?*</div>
              <input
                type="text"
                placeholder="Seu nome"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                autoFocus
                style={{ background: 'transparent', border: 'none', borderBottom: '2px solid #fff', color: '#fff', fontSize: '2.5em', padding: '10px 0', width: '100%', maxWidth: 600, textAlign: 'center', marginTop: 50, outline: 'none' }}
              />
              <button className="form-btn" onClick={handleNameNext}>OK</button>
              <div className="small-text">carrega em Enter ↩</div>
            </>
          )}

          {/* Step 3 — Email */}
          {step === 3 && (
            <>
              <div className="question-number">2 ➔ Qual o seu melhor e-mail?*</div>
              <input
                type="text"
                placeholder="Seu email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                autoFocus
                style={{ background: 'transparent', border: 'none', borderBottom: `2px solid ${emailError ? '#dc3545' : '#fff'}`, color: '#fff', fontSize: '2.5em', padding: '10px 0', width: '100%', maxWidth: 600, textAlign: 'center', marginTop: 50, outline: 'none' }}
              />
              {emailError && <div style={{ color: '#dc3545', marginTop: 10 }}>{emailError}</div>}
              <button className="form-btn" onClick={handleEmailNext}>OK</button>
              <div className="small-text">carrega em Enter ↩</div>
            </>
          )}

          {/* Step 4 — WhatsApp */}
          {step === 4 && (
            <>
              <div className="question-number">3 ➔ Qual o seu número do WhatsApp?*</div>
              <input
                type="text"
                placeholder="Seu whatsapp"
                value={whatsapp}
                onChange={(e) => { setWhatsapp(formatPhone(e.target.value)); setWhatsappError(''); }}
                inputMode="numeric"
                autoFocus
                style={{ background: 'transparent', border: 'none', borderBottom: `2px solid ${whatsappError ? '#dc3545' : '#fff'}`, color: '#fff', fontSize: '2.5em', padding: '10px 0', width: '100%', maxWidth: 600, textAlign: 'center', marginTop: 50, outline: 'none' }}
              />
              {whatsappError && <div style={{ color: '#dc3545', marginTop: 10 }}>{whatsappError}</div>}
              <button className="form-btn" onClick={handleWhatsappNext}>OK</button>
              <div className="small-text">carrega em Enter ↩</div>
            </>
          )}

          {/* Step 5 — Needs */}
          {step === 5 && (
            <>
              <div className="question-number">4 ➔ O que o seu negócio mais precisa nesse momento?*</div>
              <p className="small-text" style={{ fontSize: '1em', marginBottom: 30, marginTop: 0 }}>
                Podes selecionar várias opções
              </p>
              {needsOptions.map((opt) => (
                <div
                  key={opt.letter}
                  className={`option-button ${selectedOptions.includes(opt.value) ? 'selected' : ''}`}
                  onClick={() => toggleOption(opt.value)}
                >
                  <span className="letter">{opt.letter}</span>
                  {opt.value}
                </div>
              ))}
              {selectedOptions.includes('Outros.') && (
                <div className="other-input-container show">
                  <label>Por favor, especifique:</label>
                  <textarea
                    placeholder="Ex: Preciso de um novo site..."
                    rows={4}
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value)}
                  />
                </div>
              )}
              <button className="form-btn" onClick={handleNeedsNext}>OK</button>
              <div className="small-text">carrega em Enter ↩</div>
            </>
          )}

          {/* Step 6 — Info Tráfego */}
          {step === 6 && (
            <>
              <p style={{ fontSize: '1.2em', lineHeight: 1.6, maxWidth: 700 }}>
                Imagine a sua empresa todos os dias recebendo novos clientes, lucrando mais, batendo as
                metas e crescendo todos os meses, <strong style={{ color: '#f77f00' }}>tudo no automático</strong>...
              </p>
              <p style={{ fontSize: '1.2em', lineHeight: 1.6, maxWidth: 700 }}>
                Parece um sonho? Pode ser a sua nova realidade a partir de agora...
              </p>
              <p style={{ fontSize: '1.2em', lineHeight: 1.6, maxWidth: 700 }}>
                A verdade é que milhões de empresas já estão usando a ferramenta mais poderosa da atualidade...
              </p>
              <p style={{ fontSize: '1.3em', fontWeight: 600, maxWidth: 700 }}>
                👉 O nome dessa ferramenta é: <strong style={{ color: '#f77f00' }}>Tráfego Pago!</strong>
              </p>
              <button className="form-btn" onClick={goNext}>ENTENDI TUDO ✅</button>
              <div className="small-text">carrega em Enter ↩</div>
            </>
          )}

          {/* Step 7 — Benefícios */}
          {step === 7 && (
            <>
              <h2 style={{ fontSize: '2em', marginBottom: 30, color: 'var(--white)' }}>
                Veja o que a sua empresa terá contratando nosso Tráfego Pago:
              </h2>
              <div className="info-box">
                <ul>
                  <li><span className="check-icon">✔</span> Plano de Ação completo e personalizado para o seu negócio;</li>
                  <li><span className="check-icon">✔</span> 1 vez por semana relatórios completos com os resultados;</li>
                  <li><span className="check-icon">✔</span> Estrutura de anúncios com foco em <strong style={{ color: '#f77f00' }}>captação constante de novos clientes</strong>;</li>
                  <li><span className="check-icon">✔</span> Estrutura de anúncios de resgate e fidelização de clientes;</li>
                  <li><span className="check-icon">✔</span> Grupo de whatsapp com especialistas em tráfego;</li>
                  <li><span className="check-icon">✔</span> Consultoria completa de instagram.</li>
                </ul>
              </div>
              <button className="form-btn" onClick={goNext}>VER VALORES</button>
              <div className="small-text">carrega em Enter ↩</div>
            </>
          )}

          {/* Step 8 — Valores */}
          {step === 8 && (
            <>
              <h2 style={{ textAlign: 'center', fontSize: '2em', color: 'var(--white)' }}>
                💰 VALORES - LEIA COM ATENÇÃO
              </h2>
              <p style={{ textAlign: 'center', fontSize: '1.1em', maxWidth: 700 }}>
                Para transformar e acelerar os resultados da sua empresa...
              </p>
              <div style={{ maxWidth: 900, margin: '2rem auto' }}>
                <div className="section-header">
                  <h2>Nossos Serviços</h2>
                  <p>Soluções completas em marketing digital para fazer seu negócio decolar</p>
                </div>
                <div className="services-grid">
                  {[
                    { icon: FaBullhorn, title: 'Tráfego Pago', desc: 'Campanhas otimizadas no Google Ads e Facebook Ads para gerar leads e vendas todos os dias.', features: ['Google Ads', 'Meta Ads', 'YouTube Ads'], price: '~R$ 2.000/mês', invest: 'Investimento com anúncios à partir de R$ 1.000/mês*' },
                    { icon: FaShareAlt, title: 'Social Media', desc: 'Gestão completa das suas redes sociais com conteúdo relevante e estratégico.', features: ['Criação de Conteúdo', 'Gestão de Posts', 'Engajamento'], price: 'R$ 1.500/mês' },
                    { icon: FaLaptopCode, title: 'Landing Pages', desc: 'Páginas otimizadas para conversão que transformam visitantes em clientes.', features: ['Design Responsivo', 'Otimização CRO', 'Integração'], price: 'À negociar' },
                    { icon: FaChartLine, title: 'Combo Completo', desc: 'Tráfego Pago + Social Media para resultados ainda mais potentes.', features: ['Tráfego Pago', 'Social Media', 'Relatórios'], price: '~R$ 3.000/mês' },
                  ].map((s) => (
                    <div key={s.title} className="service-card">
                      <div className="service-icon neon-glow"><s.icon size={32} color="#fff" /></div>
                      <h3 className="neon-text">{s.title}</h3>
                      <p>{s.desc}</p>
                      <div className="service-features">
                        {s.features.map(f => <span key={f} className="feature">{f}</span>)}
                      </div>
                      <div className="service-price">{s.price}</div>
                      {s.invest && <div className="invest-price">{s.invest}</div>}
                    </div>
                  ))}
                </div>
              </div>
              <button className="form-btn" onClick={goNext}>CONCORDO COM VALORES</button>
              <div className="small-text">carrega em Enter ↩</div>
            </>
          )}

          {/* Step 9 — Agendamento */}
          {step === 9 && (
            <>
              <h2 style={{ textAlign: 'center', fontSize: '2em', color: 'var(--white)' }}>
                🎉 PARABÉNS! Já enviamos para a nossa equipe...
              </h2>
              <p style={{ marginTop: 40, fontSize: '1.2em', maxWidth: 700 }}>
                O nosso próximo passo é te mostrar exatamente o que iremos implementar na sua empresa para gerar resultados...
              </p>
              <p style={{ marginTop: 30, fontSize: '1.2em', maxWidth: 700 }}>
                Você irá se surpreender... clique agora no botão abaixo para reservar o seu horário:
              </p>
              <button className="form-btn" onClick={handleSchedule}>AGENDAR REUNIÃO</button>
              <div className="small-text">
                carrega em Cmd ⌘ + Enter ↩
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
