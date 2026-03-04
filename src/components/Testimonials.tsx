import Image from 'next/image';
import { FaStar } from 'react-icons/fa';

const testimonials = [
  {
    photo: '/images/testimonials/kaio.png',
    name: 'Kaio Zaga',
    badge: '+1M em vendas',
    text: 'Depois que comecei com a TSA, meu faturamento simplesmente virou outro. O tráfego tá muito bem feito, tudo otimizado... finalmente senti que meu dinheiro tava trabalhando de verdade.',
  },
  {
    photo: '/images/testimonials/leandro.png',
    name: 'Leandro Favarete',
    badge: '+500k em vendas',
    text: 'Eu já tinha tentado anunciar antes, mas nunca tive resultado de verdade. Com a TSA foi diferente. Em menos de 1 mês já começou a entrar lead todo dia no WhatsApp.',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="testimonials">
      <div className="container testimonials-section">
        <div className="section-header">
          <h2>O que nossos clientes dizem</h2>
          <p>Depoimentos reais de quem confia no nosso trabalho</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div key={t.name} className="testimonial-card">
              <div className="author-photo">
                <Image src={t.photo} alt={t.name} width={90} height={90} style={{ objectFit: 'cover' }} />
              </div>
              <div className="testimonial-content">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} color="#ffc107" size={18} />
                  ))}
                </div>
                <p>&ldquo;{t.text}&rdquo;</p>
              </div>
              <div className="testimonial-author">
                <h4>{t.name}</h4>
                <span>{t.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
