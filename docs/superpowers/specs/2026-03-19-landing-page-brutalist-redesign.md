# TSA Solucoes — Landing Page Brutalist Redesign

## Overview

Redesign completo da landing page da TSA Solucoes no estilo "editorial brutalist", inspirado no site zarcerog.com. O conteudo e contexto da agencia de marketing digital sao mantidos integralmente, mas a estrutura visual, tipografia, paleta e animacoes sao substituidos pelo design system brutalist.

## Design System

### Paleta de Cores

```css
:root {
  --primary: #ff2d00;        /* Vermelho vibrante — acento principal */
  --foreground: #f0ebe0;     /* Off-white quente — textos claros */
  --background: #060606;     /* Preto profundo — fundo principal */
  --muted: #1a1a1a;          /* Cinza ultra-escuro — bordas, divisores */
  --accent-purple: #a78bfa;  /* Lilas — subtitulos accent */
  --accent-teal: #2dd4bf;    /* Verde-teal — subtitulos alternados */
  --overlay-start: #0a0a14;
  --overlay-mid: #12101e;
  --overlay-end: #060606;
}
```

### Tipografia

- **Bebas Neue** (Google Fonts, weight 400) — Todos os titulos display massivos
- **Space Mono** (Google Fonts, weights 400/700, normal/italic) — Body, labels, navigation, meta-info

Escala tipografica:
- Hero Title: Bebas Neue, ~22vw, line-height 0.85
- Service Slide Title: Bebas Neue, ~26vw, line-height 0.82
- Section Title (RIGHT NOW): Bebas Neue, ~16vw, line-height 0.85
- Manifesto Lines: Bebas Neue, ~9vw, line-height 0.85, letter-spacing -0.01em
- Manifesto Tagline: Space Mono 700, ~2vw, line-height 1.2
- Contact Email: Bebas Neue, ~5vw, line-height 0.85
- Subtitulos de servico: Space Mono 700, 32px, cor accent
- Body text: Space Mono 400, 12px, line-height 1.6
- Value text (duality, rightnow): Space Mono 400, 14px
- Labels: Space Mono 400, 10px, uppercase, letter-spacing 2-3px, cor primary
- Item keys: Space Mono 400, 10px, uppercase, letter-spacing 1.5px, cor primary

### Fontes a remover

- Poppins (Google Fonts) — substituida por Space Mono
- Montserrat (Google Fonts) — substituida por Bebas Neue
- Font Awesome CDN — substituido por caracteres Unicode e SVGs inline

### Dependencias a adicionar

- `lenis` — smooth scroll
- `gsap` — animacoes
- `gsap/ScrollTrigger` — scroll-driven animations

### Dependencias a remover

- `react-icons` — substituido por caracteres/SVGs inline (apenas nos componentes da landing page; se outros modulos como /painel usam, manter no package.json)
- `recharts` — manter no package.json pois e usado pelo /painel, apenas nao sera mais importado pela landing page

## Estrutura de Secoes

A landing page passa de 10 secoes para 6 secoes full-viewport (100vh), sem navbar fixa tradicional.

### Secao 01 — Hero

**Viewport:** 100vh, display flex, column, justify-content flex-end, position relative.

**Layout:**
- Fundo preto puro #060606
- Topo esquerdo: "TSASOLUCOES.COM" como label vermelho (Space Mono 10px, uppercase, letter-spacing 2px)
- Topo direito: "Vol. 1 / 2026" em foreground (Space Mono 10px)
- Centro: bloco do nome com padding ~4vw horizontal
  - "TSA" em Bebas Neue ~22vw, cor foreground #f0ebe0
  - "SOLUCOES" em Bebas Neue ~22vw, cor primary #ff2d00
- Abaixo do nome: linha horizontal vermelha de 1px (background #ff2d00)
- Rodape do hero:
  - Esquerda: "p. 001" (Space Mono 12px)
  - Direita: "/ MARKETING DIGITAL" (Space Mono 12px, uppercase)
  - Centro-baixo: "SCROLL TO TUNE IN" (Space Mono 10px, vermelho, letter-spacing 2.5px, com seta para baixo)

**Componentes removidos:** Particles, dashboard mockup, stats, CTAs, shapes animadas.

**Funcionalidades mantidas:** notifyTelegram no trackAccess, MetaPixel.

### Secao 02 — Manifesto

**Viewport:** 100vh, fundo #060606.

**Layout:**
- Label topo esquerdo: "/ MANIFESTO / p. 002" (vermelho, 10px)
- Container centralizado com padding 0 ~6vw, flex centralizado verticalmente
- 3 frases em Bebas Neue ~9vw:
  1. "TRANSFORMACAO."
  2. "SOLUCOES."
  3. "ALCANCE."
- Abaixo das 3 palavras, tagline de assinatura:
  - "CRIANDO ENVOLVIMENTO, GERANDO RESULTADOS" em Space Mono 700, tamanho menor (~2vw ou 24px), cor foreground com opacidade reduzida
- Texto sutil no rodape: "tsasolucoes / 2026"

**Animacao:** Cada frase comeca em cor #1a1a1a (invisivel contra fundo preto). Via GSAP ScrollTrigger, cada palavra revela-se para #f0ebe0 conforme o usuario faz scroll. A tagline tambem revela ao final.

### Secao 03 — Duality ("QUEM SOMOS")

**Viewport:** 100vh (min-height), fundo #060606.

**Layout:** Grid de 2 colunas com divisor central vermelho:
```css
grid-template-columns: 1fr 1px 1fr;
```

**Coluna Esquerda — "O QUE FAZEMOS":**
- Label topo: "O QUE FAZEMOS" (vermelho, 10px, uppercase, letter-spacing 2.5px)
- H2: "NOSSOS SERVICOS" (Bebas Neue ~7vw)
- Lista de items (.duality-item):
  - TRAFEGO → Google Ads, Meta Ads, YouTube Ads
  - SOCIAL → Criacao de conteudo, gestao de posts
  - LANDING → Paginas otimizadas para conversao
  - COMBO → Trafego + Social Media completo
  - SOFTWARE → Desenvolvimento de aplicacoes web e mobile
- Cada item: flex, padding 12px 0, border-bottom 1px solid #1a1a1a
  - Key (Space Mono 10px vermelho, uppercase, largura ~96px)
  - Value (Space Mono 14px off-white)

**Divisor central:** div 1px, background #ff2d00.

**Coluna Direita — "O QUE NOS MOVE":**
- Label topo: "O QUE NOS MOVE" (vermelho, 10px, uppercase, letter-spacing 2.5px)
- H2: "NOSSA ESSENCIA" (Bebas Neue ~7vw)
- Lista de items:
  - MISSAO → Crescimento com estrategias eficientes
  - VISAO → Referencia nacional em performance local
  - VALORES → Transparencia, resultados, comprometimento, etica
  - DESDE → 2020
  - META → Evolucao continua

### Secao 04 — Work ("NOSSOS SERVICOS" — slides full-screen)

**Viewport:** Cada slide ocupa 100vw x 100vh, com scroll horizontal controlado por GSAP.

**5 slides, um por servico:**

**Slide 1 — TRAFEGO PAGO:**
- Background: imagem de fundo (pode ser mantida das imagens de results ou abstrata) + overlay gradient diagonal (linear-gradient 160deg, #0a0a14 0%, #12101e 40%, #060606 100%) com opacity 0.7
- Label topo esquerdo: "/ NOSSOS SERVICOS / p. 004"
- Numeracao topo direito: "01 / 05" (vermelho, letter-spacing 3px)
- Titulo: "TRAFEGO PAGO" (Bebas Neue ~26vw, off-white)
- Subtitulo: "Campanhas que convertem de verdade" (Space Mono 700, 32px, cor #a78bfa)
- Descricao: "Campanhas otimizadas no Google Ads e Facebook Ads para gerar leads e vendas todos os dias." (Space Mono 400, 12px)
- Tags: GOOGLE ADS, META ADS, YOUTUBE ADS (Space Mono 10px, bg off-white, cor preta, sem border-radius)
- CTA: "QUERO SABER MAIS →" (Space Mono 10px, vermelho, uppercase, letter-spacing 2px, link para #contact ou WhatsApp)

**Slide 2 — SOCIAL MEDIA:**
- Numeracao: "02 / 05"
- Titulo: "SOCIAL MEDIA"
- Subtitulo: "Conteudo que engaja e posiciona" (cor #2dd4bf)
- Descricao: "Gestao completa das suas redes sociais com conteudo relevante e estrategico."
- Tags: CRIACAO DE CONTEUDO, GESTAO DE POSTS, ENGAJAMENTO

**Slide 3 — LANDING PAGES:**
- Numeracao: "03 / 05"
- Titulo: "LANDING PAGES"
- Subtitulo: "Paginas que convertem visitantes em clientes" (cor #a78bfa)
- Descricao: "Paginas otimizadas para conversao que transformam visitantes em clientes."
- Tags: DESIGN RESPONSIVO, OTIMIZACAO CRO, INTEGRACAO

**Slide 4 — COMBO COMPLETO:**
- Numeracao: "04 / 05"
- Titulo: "COMBO COMPLETO"
- Subtitulo: "Trafego + Social para resultados maximos" (cor #2dd4bf)
- Descricao: "Trafego Pago + Social Media para resultados ainda mais potentes."
- Tags: TRAFEGO PAGO, SOCIAL MEDIA, RELATORIOS

**Slide 5 — DESENVOLVIMENTO DE SOFTWARE:**
- Numeracao: "05 / 05"
- Titulo: "SOFTWARE"
- Subtitulo: "Solucoes digitais sob medida" (cor #a78bfa)
- Descricao: "Desenvolvimento de aplicacoes web e mobile personalizadas para o seu negocio."
- Tags: WEB, MOBILE, SISTEMAS, INTEGRACAO

**Todos os slides:**
- CTA link: "QUERO SABER MAIS →" abre WhatsApp ou scroll para contact
- Notifica Telegram ao clicar no CTA

### Secao 05 — Right Now ("METRICAS DA AGENCIA")

**Viewport:** min-height 100vh, fundo #060606.

**Layout:**
- Padding ~10vw vertical, ~6vw horizontal
- Titulo H2 em Bebas Neue ~16vw: "RIGHT" em off-white, "NOW" em vermelho #ff2d00
- Grid de 4 colunas:

```css
grid-template-columns: repeat(4, 1fr);
```

**4 items de metrica:**

1. **CLIENTES** → "+50 ativos" (nota italic: "e contando")
2. **VENDAS** → "+R$1M gerados" (nota italic: "para nossos clientes")
3. **MERCADO** → "5 anos" (nota italic: "desde 2020")
4. **CAMPANHAS** → "+30 ativas" (nota italic: "rodando agora")

Cada item:
- Grid 2 colunas (6px + auto), gap 24px, padding 32px vertical, border-bottom 1px solid #1a1a1a
- Dot: 6px x 6px, border-radius 50%, background off-white
- Label: vermelho 10px uppercase (CLIENTES, VENDAS...)
- Valor: Space Mono 14px off-white
- Nota: Space Mono 10px italic off-white, opacidade reduzida

### Secao 06 — Contact ("CANAL ABERTO")

**Layout:**
- Padding ~8vw vertical, ~6vw horizontal
- Label topo: "/ CANAL ABERTO / p. 006" (vermelho)
- Subtitulo: "VAMOS FAZER SEU NEGOCIO DECOLAR." (Space Mono 10px, vermelho, letter-spacing 3px)

**Email destaque:**
- "tiago@tsasolucoes.com" como link em Bebas Neue ~5vw, cor off-white, hover vermelho

**Formulario minimalista:**
- 4 campos em estilo brutalist (sem bordas arredondadas, background transparente, border-bottom 1px solid #1a1a1a)
- Nome, Email, Telefone, Mensagem
- Botao submit: Space Mono 10px, uppercase, tracking 2px, vermelho, border-bottom vermelho
- Manter validacao existente e integracao EmailJS
- Manter notificacao Telegram

**Linha divisoria:** 1px solid #1a1a1a

**Links sociais:**
- Row horizontal: INSTAGRAM, WHATSAPP, LINKEDIN (Space Mono 12px, off-white, uppercase, letter-spacing 1.8px, hover vermelho)
- Cada link notifica Telegram ao clicar

**Footer inline:**
- "tsasolucoes.com / 2026" (Space Mono 10px, off-white, opacidade reduzida)
- Link "Area do Cliente" para /login

**Funcionalidades mantidas:**
- EmailJS (service_8h2no1d, template_bhs4c57, key dhB3bhOrW8iqajEc0)
- Formatacao de telefone
- Validacao de formulario
- Meta Pixel tracking (fbq)
- Notificacao Telegram em todos os cliques

## Efeitos e Animacoes

### Preloader

- Overlay fixo, z-index 8000, fundo #060606
- Contador numerico: Space Mono 160px, off-white, anima de 0 a 100
- Texto abaixo: "tsasolucoes.com / inicializando sinal" (Space Mono 12px, off-white opacidade reduzida)
- Ao chegar em 100, o overlay faz fade-out e revela o site
- Duracao total: ~2.5 segundos

### Smooth Scroll (Lenis)

- Inicializar Lenis no layout/page principal
- Smooth scroll suave em toda a pagina
- Integrar com GSAP ScrollTrigger via lenis.on('scroll', ScrollTrigger.update)

### GSAP / ScrollTrigger

- **Manifesto:** Cada palavra de cada frase animada individualmente de #1a1a1a para #f0ebe0 conforme scroll progress
- **Work slides:** Scroll horizontal — o usuario faz scroll vertical e os slides movem horizontalmente (pin da secao + translateX)
- **Fade-in geral:** Elementos das secoes Duality, Right Now e Contact fazem fade-in suave ao entrar na viewport

### Custom Cursor

- Desativar cursor padrao: `cursor: none` no body
- Dot fixo: 6px x 6px, border-radius 50%, background #f0ebe0, mix-blend-mode: difference, pointer-events: none, z-index 9999
- Ao hover em elementos interativos (links, botoes): dot expande para ~40px com transicao suave
- Atualizar posicao via mousemove com requestAnimationFrame

## Componentes — Mapeamento

### Componentes novos a criar

| Componente | Descricao |
|---|---|
| `Preloader.tsx` | Overlay com contador 0→100 |
| `CustomCursor.tsx` | Dot cursor com mix-blend-mode |
| `SmoothScroll.tsx` | Provider Lenis + integracao GSAP |
| `Manifesto.tsx` | Secao manifesto com scroll-reveal |
| `Duality.tsx` | Grid 2 colunas "O que fazemos / O que nos move" |
| `Work.tsx` | Slides full-screen horizontais dos servicos |
| `RightNow.tsx` | Grid 4 colunas com metricas da agencia |

### Componentes a reescrever

| Componente | Mudancas |
|---|---|
| `Hero.tsx` | Reescrita total — layout brutalist, sem particles/mockup/stats |
| `Contact.tsx` | Reescrita visual — manter logica EmailJS/validacao/Telegram. Incluir bloco de depoimentos abaixo do formulario |
| `WhatsappButton.tsx` | Reescrever icone (SVG inline em vez de react-icons) e ajustar estilo para paleta brutalist |
| `page.tsx` | Nova composicao de secoes + GSAP setup |
| `layout.tsx` | Trocar fontes para Bebas Neue + Space Mono |
| `globals.css` | Reescrita total do design system |

### Componentes a remover

| Componente | Motivo |
|---|---|
| `Navbar.tsx` | Substituido por labels integrados em cada secao |
| `About.tsx` | Conteudo migrado para Duality.tsx |
| `Services.tsx` | Conteudo migrado para Work.tsx |
| `Results.tsx` | Conteudo migrado para RightNow.tsx (metricas) |
| `Testimonials.tsx` | Conteudo pode ser integrado na secao Contact ou removido |
| `CTA.tsx` | CTAs integrados em cada slide de Work e na secao Contact |
| `Footer.tsx` | Footer integrado na secao Contact |
| `Particles.tsx` | Efeito removido do design |

### Componentes mantidos sem alteracao

| Componente | Motivo |
|---|---|
| `MetaPixel.tsx` | Tracking essencial |

### Nota sobre WhatsappButton.tsx

`WhatsappButton.tsx` deve ser **reescrito** (movido da tabela "mantidos" para "reescrever") porque importa `FaWhatsapp` de `react-icons`, que sera removido. Substituir o icone por SVG inline do WhatsApp e ajustar o estilo visual para combinar com o novo design brutalist (sem neon glow, cores alinhadas com a nova paleta).

## Integracao e Tracking

Todas as integracoes existentes sao mantidas:
- **EmailJS:** Envio de formulario de contato
- **Telegram:** Notificacoes de clique e acesso
- **Meta Pixel:** Tracking de conversao (pixel 770576805400900)
- **Server wake-up:** wakeUpServer() no carregamento

Os eventos de Telegram devem ser adaptados para os novos CTAs:
- `[HOME] Clique em: QUERO SABER MAIS (Trafego Pago)` etc.
- `[HOME] Clique em: EMAIL`
- `[HOME] Clique em: WHATSAPP`
- `[HOME] Clique em: INSTAGRAM`

## Responsividade

- Todas as secoes usam unidades viewport-relative (vw) para escalar fluidamente
- Breakpoints:
  - **< 768px (mobile):**
    - Duality: stack vertical (1 coluna) em vez de 2 colunas
    - Right Now: grid 2 colunas em vez de 4
    - Work slides: manter full-screen mas ajustar tamanho do titulo (~40vw)
    - Contact: formulario ocupa largura total
    - Custom cursor: desativar em touch devices
  - **768px - 1024px (tablet):**
    - Right Now: grid 2 colunas
    - Ajustes de padding (~4vw em vez de ~6vw)
  - **> 1024px (desktop):**
    - Layout completo conforme especificado

## Depoimentos

Os depoimentos de Kaio Zaga e Leandro Favarete serao integrados na secao Contact (Secao 06), abaixo do formulario, como bloco de social proof no estilo editorial:
- Cada depoimento: aspas em Space Mono 12px italic off-white, nome em Space Mono 10px vermelho uppercase, resultado em Space Mono 10px off-white
- Layout: 2 colunas lado a lado em desktop, stack em mobile
- Sem fotos, sem estrelas — apenas texto editorial minimalista

## Arquivos de assets

- `/public/images/logo-tsa.png` — manter para favicon/meta
- `/public/images/results/` — podem ser usadas como background dos slides Work
- `/public/images/testimonials/` — manter para depoimentos integrados
