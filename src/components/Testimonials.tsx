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

export default function Testimonials() {
  return (
    <section className="contact-brutalist fade-in-section" style={{ minHeight: 'auto', paddingTop: '4vw', paddingBottom: '4vw' }}>
      <span className="section-label">/ DEPOIMENTOS / p. 005</span>

      <div className="contact-testimonials" style={{ marginTop: '2vw' }}>
        {testimonials.map((t) => (
          <div key={t.name} className="contact-testimonial">
            <blockquote>&ldquo;{t.text}&rdquo;</blockquote>
            <div>
              <cite>{t.name}</cite>
              <span className="testimonial-result">— {t.result}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
