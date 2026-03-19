# TSA Solucoes — Brutalist Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the TSA Solucoes landing page from its current cyan/purple tech aesthetic to an editorial brutalist design inspired by zarcerog.com, keeping all existing content and integrations.

**Architecture:** Replace all 10 current landing page sections with 6 full-viewport brutalist sections (Hero, Manifesto, Duality, Work, RightNow, Contact). Add smooth scroll (Lenis), scroll-driven animations (GSAP/ScrollTrigger), preloader, and custom cursor. Preserve EmailJS, Telegram, and Meta Pixel integrations.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, GSAP + ScrollTrigger, Lenis, Bebas Neue + Space Mono fonts.

**Spec:** `docs/superpowers/specs/2026-03-19-landing-page-brutalist-redesign.md`

---

## File Structure

### New files to create
- `src/components/Preloader.tsx` — Overlay counter 0→100
- `src/components/CustomCursor.tsx` — Dot cursor with mix-blend-mode
- `src/components/SmoothScroll.tsx` — Lenis provider + GSAP integration
- `src/components/Manifesto.tsx` — Scroll-reveal manifesto section
- `src/components/Duality.tsx` — Two-column "who we are" section
- `src/components/Work.tsx` — Full-screen horizontal service slides
- `src/components/RightNow.tsx` — Agency metrics grid

### Files to rewrite
- `src/app/globals.css` — Complete design system replacement
- `src/app/layout.tsx` — Font swap to Bebas Neue + Space Mono
- `src/app/page.tsx` — New section composition + GSAP setup
- `src/components/Hero.tsx` — Brutalist hero layout
- `src/components/Contact.tsx` — Brutalist contact + testimonials
- `src/components/WhatsappButton.tsx` — SVG icon, brutalist style

### Files to delete (after new components are working)
- `src/components/Navbar.tsx`
- `src/components/About.tsx`
- `src/components/Services.tsx`
- `src/components/Results.tsx`
- `src/components/Testimonials.tsx`
- `src/components/CTA.tsx`
- `src/components/Footer.tsx`
- `src/components/Particles.tsx`

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install lenis and gsap**

```bash
cd "c:/Projetos Tiago/tsa-solucoes/lp-tsa" && npm install lenis gsap
```

- [ ] **Step 2: Verify install**

```bash
cd "c:/Projetos Tiago/tsa-solucoes/lp-tsa" && node -e "require('lenis'); require('gsap'); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
cd "c:/Projetos Tiago/tsa-solucoes/lp-tsa" && git add package.json package-lock.json && git commit -m "chore: add lenis and gsap dependencies"
```

---

## Task 2: Rewrite globals.css with brutalist design system

**Files:**
- Rewrite: `src/app/globals.css`

**Important:** The globals.css contains styles for BOTH the landing page AND the dashboard/auth pages (`.auth-container`, `.dashboard-layout`, `.sidebar`, `.stat-card`, `.data-table`, `.badge-*`, `.whatsapp-page`, `.form-container`, `.option-button`, etc.). These dashboard/auth/form styles MUST be preserved at the bottom of the file. Only the landing page styles are replaced.

- [ ] **Step 1: Rewrite globals.css**

Replace the entire file. The new file keeps the Tailwind import and dashboard styles, but replaces all landing page CSS with the brutalist design system.

```css
@import "tailwindcss";

/* ===== BRUTALIST DESIGN SYSTEM ===== */
:root {
  --primary: #ff2d00;
  --foreground: #f0ebe0;
  --background: #060606;
  --muted: #1a1a1a;
  --accent-purple: #a78bfa;
  --accent-teal: #2dd4bf;
  --overlay-start: #0a0a14;
  --overlay-mid: #12101e;
  --overlay-end: #060606;

  --font-display: 'Bebas Neue', Impact, sans-serif;
  --font-mono: 'Space Mono', 'Courier New', monospace;
}

/* ===== RESET ===== */
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: var(--font-mono);
  line-height: 1.6;
  color: var(--foreground);
  background: var(--background);
  overflow-x: hidden;
}

/* ===== SECTION LABEL ===== */
.section-label {
  font-family: var(--font-mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--primary);
}

.section-label-light {
  font-family: var(--font-mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--foreground);
}

/* ===== DISPLAY TITLES ===== */
.title-hero {
  font-family: var(--font-display);
  font-size: 22vw;
  line-height: 0.85;
  letter-spacing: normal;
}

.title-section {
  font-family: var(--font-display);
  font-size: 7vw;
  line-height: 0.85;
}

.title-manifesto {
  font-family: var(--font-display);
  font-size: 9vw;
  line-height: 0.85;
  letter-spacing: -0.01em;
}

.title-work {
  font-family: var(--font-display);
  font-size: 26vw;
  line-height: 0.82;
}

.title-rightnow {
  font-family: var(--font-display);
  font-size: 16vw;
  line-height: 0.85;
}

.title-contact-email {
  font-family: var(--font-display);
  font-size: 5vw;
  line-height: 0.85;
  color: var(--foreground);
  text-decoration: none;
  transition: color 0.3s ease;
}

.title-contact-email:hover {
  color: var(--primary);
}

/* ===== BODY TEXT ===== */
.text-body {
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.6;
  color: var(--foreground);
}

.text-value {
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--foreground);
}

.text-micro {
  font-family: var(--font-mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.text-micro-italic {
  font-family: var(--font-mono);
  font-size: 10px;
  font-style: italic;
  color: var(--foreground);
  opacity: 0.5;
}

/* ===== ITEM KEY (duality/rightnow labels) ===== */
.item-key {
  font-family: var(--font-mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--primary);
  width: 96px;
  flex-shrink: 0;
}

/* ===== SUBTITLE (work section) ===== */
.subtitle-accent {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 32px;
  line-height: 1.2;
}

/* ===== TECH TAGS ===== */
.tech-tag {
  font-family: var(--font-mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 4px 8px;
  background: var(--foreground);
  color: var(--background);
}

/* ===== ACTION LINK ===== */
.action-link {
  font-family: var(--font-mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--primary);
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--primary);
  padding-bottom: 2px;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.action-link:hover {
  opacity: 0.7;
}

/* ===== SOCIAL LINK ===== */
.social-link {
  font-family: var(--font-mono);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.8px;
  color: var(--foreground);
  text-decoration: none;
  transition: color 0.3s ease;
}

.social-link:hover {
  color: var(--primary);
}

/* ===== HERO ===== */
.hero-brutalist {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  background: var(--background);
  padding: 0 4vw 4vw;
}

.hero-top {
  position: absolute;
  top: 2vw;
  left: 4vw;
  right: 4vw;
  display: flex;
  justify-content: space-between;
}

.hero-name-block {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  padding: 0 4vw;
}

.hero-signal-line {
  width: 100%;
  height: 1px;
  background: var(--primary);
  margin-bottom: 16px;
}

.hero-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.hero-scroll-hint {
  font-family: var(--font-mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  color: var(--primary);
  position: absolute;
  bottom: 2vw;
  left: 50%;
  transform: translateX(-50%);
}

/* ===== MANIFESTO ===== */
.manifesto-section {
  height: 100vh;
  background: var(--background);
  position: relative;
  display: flex;
  flex-direction: column;
}

.manifesto-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 6vw;
}

.manifesto-word {
  display: inline-block;
  transition: color 0.3s ease;
}

.manifesto-tagline {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: clamp(14px, 2vw, 24px);
  line-height: 1.2;
  color: var(--foreground);
  opacity: 0.6;
  margin-top: 2vw;
}

/* ===== DUALITY ===== */
.duality-section {
  min-height: 100vh;
  background: var(--background);
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
}

.duality-column {
  display: flex;
  flex-direction: column;
  padding: 8vw 5vw;
}

.duality-divider {
  background: var(--primary);
}

.duality-item {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--muted);
}

/* ===== WORK ===== */
.work-section {
  position: relative;
  overflow: hidden;
}

.work-slides-container {
  display: flex;
  width: max-content;
}

.work-card {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  flex-shrink: 0;
}

.work-card-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.work-card-bg-img {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}

.work-card-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, var(--overlay-start) 0%, var(--overlay-mid) 40%, var(--overlay-end) 100%);
  opacity: 0.7;
}

.work-card-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 4vw 6vw;
}

.work-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.work-card-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.work-card-bottom {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.work-card-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* ===== RIGHT NOW ===== */
.rightnow-section {
  min-height: 100vh;
  background: var(--background);
  padding: 10vw 6vw;
}

.rightnow-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  margin-top: 6vw;
}

.rightnow-item {
  display: grid;
  grid-template-columns: 6px 1fr;
  gap: 24px;
  padding: 32px 16px;
  border-bottom: 1px solid var(--muted);
}

.rightnow-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--foreground);
  margin-top: 4px;
}

/* ===== CONTACT ===== */
.contact-brutalist {
  min-height: 100vh;
  background: var(--background);
  padding: 8vw 6vw;
}

.contact-form-brutalist {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 4vw;
  max-width: 800px;
}

.contact-form-brutalist .form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-form-brutalist .form-field.full-width {
  grid-column: 1 / -1;
}

.contact-form-brutalist label {
  font-family: var(--font-mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--primary);
}

.contact-form-brutalist input,
.contact-form-brutalist textarea {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--muted);
  color: var(--foreground);
  font-family: var(--font-mono);
  font-size: 14px;
  padding: 12px 0;
  outline: none;
  transition: border-color 0.3s ease;
  width: 100%;
  border-radius: 0;
}

.contact-form-brutalist input:focus,
.contact-form-brutalist textarea:focus {
  border-color: var(--primary);
}

.contact-form-brutalist textarea {
  resize: vertical;
  min-height: 80px;
}

.contact-form-brutalist .submit-btn {
  grid-column: 1 / -1;
}

.contact-error {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--primary);
  margin-top: 4px;
}

.contact-success {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--accent-teal);
  margin-top: 16px;
}

.contact-social-row {
  display: flex;
  gap: 32px;
  margin-top: 4vw;
  padding-top: 2vw;
  border-top: 1px solid var(--muted);
}

.contact-testimonials {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-top: 4vw;
  padding-top: 2vw;
  border-top: 1px solid var(--muted);
}

.contact-testimonial {
  font-family: var(--font-mono);
}

.contact-testimonial blockquote {
  font-size: 12px;
  font-style: italic;
  color: var(--foreground);
  line-height: 1.6;
  margin-bottom: 12px;
}

.contact-testimonial cite {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--primary);
  font-style: normal;
}

.contact-testimonial .testimonial-result {
  font-size: 10px;
  color: var(--foreground);
  opacity: 0.7;
  margin-left: 8px;
}

.contact-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4vw;
  padding-top: 2vw;
  border-top: 1px solid var(--muted);
}

/* ===== PRELOADER ===== */
.preloader {
  position: fixed;
  inset: 0;
  z-index: 8000;
  background: var(--background);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: opacity 0.5s ease;
}

.preloader.done {
  opacity: 0;
  pointer-events: none;
}

.preloader-counter {
  font-family: var(--font-mono);
  font-size: clamp(80px, 15vw, 160px);
  color: var(--foreground);
  line-height: 1;
}

.preloader-text {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--foreground);
  opacity: 0.5;
  margin-top: 16px;
  letter-spacing: 2px;
}

/* ===== CUSTOM CURSOR ===== */
.cursor-dot {
  position: fixed;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--foreground);
  mix-blend-mode: difference;
  pointer-events: none;
  z-index: 9999;
  transition: width 0.3s ease, height 0.3s ease, margin 0.3s ease;
  top: 0;
  left: 0;
}

.cursor-dot.expanded {
  width: 40px;
  height: 40px;
  margin: -17px 0 0 -17px;
}

/* ===== WHATSAPP BUTTON ===== */
.whatsapp-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background: var(--foreground);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--background);
  text-decoration: none;
  z-index: 1000;
  mix-blend-mode: difference;
  transition: transform 0.3s ease;
}

.whatsapp-btn:hover {
  transform: scale(1.1);
}

.whatsapp-btn svg {
  width: 24px;
  height: 24px;
}

/* ===== FADE-IN ANIMATION ===== */
.fade-in-section {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.fade-in-section.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ===== SCROLLBAR ===== */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--background); }
::-webkit-scrollbar-thumb { background: var(--muted); }
::-webkit-scrollbar-thumb:hover { background: var(--primary); }

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  body { cursor: auto !important; }
  .cursor-dot { display: none !important; }

  .title-hero { font-size: 18vw; }
  .title-work { font-size: 16vw; }
  .title-rightnow { font-size: 12vw; }
  .subtitle-accent { font-size: 20px; }

  .duality-section {
    grid-template-columns: 1fr;
    min-height: auto;
  }
  .duality-divider { display: none; }
  .duality-column { padding: 6vw 5vw; }

  .work-card { padding: 6vw; }

  .rightnow-grid { grid-template-columns: repeat(2, 1fr); }
  .rightnow-section { padding: 8vw 5vw; }

  .contact-form-brutalist { grid-template-columns: 1fr; }
  .contact-testimonials { grid-template-columns: 1fr; }
  .contact-brutalist { padding: 8vw 5vw; }
  .contact-social-row { flex-wrap: wrap; gap: 16px; }

  .hero-brutalist { padding: 0 5vw 5vw; }
  .hero-top { left: 5vw; right: 5vw; }
  .hero-name-block { padding: 0 5vw; }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .rightnow-grid { grid-template-columns: repeat(2, 1fr); }
  .rightnow-section { padding: 8vw 4vw; }
  .contact-brutalist { padding: 6vw 4vw; }
}

/* ============================================================
   DASHBOARD / AUTH / FORM STYLES (preserved from original)
   ============================================================ */

/* ===== FORM FUNNEL ===== */
.form-container { width: 100%; max-width: 800px; text-align: center; padding: 20px; box-sizing: border-box; display: block; margin: 0 auto; }
.form-container input[type="text"] { background-color: transparent; border: none; border-bottom: 2px solid #fff; color: #fff; font-size: 2.5em; padding: 10px 0; width: 100%; max-width: 600px; text-align: center; margin-top: 50px; outline: none; }
.form-container input[type="text"]::placeholder { color: #aaa; }
.screen-content { padding: 40px 20px; min-height: 60vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
.logo { margin-bottom: 50px; }
.logo img { max-width: 250px; height: auto; }
.option-button { background-color: #333; color: #fff; padding: 18px 25px; border: 2px solid #555; border-radius: 8px; font-size: 1.1em; font-weight: 400; cursor: pointer; width: 100%; max-width: 650px; text-align: left; margin-bottom: 15px; transition: background-color 0.2s ease, border-color 0.2s ease; display: flex; align-items: center; justify-content: flex-start; }
.option-button:hover { background-color: #444; border-color: #f77f00; }
.option-button.selected { background-color: #f77f00; border-color: #f77f00; }
.option-button span.letter { display: inline-block; background-color: #555; padding: 8px 12px; border-radius: 5px; margin-right: 15px; font-weight: 600; font-size: 0.9em; }
.option-button.selected span.letter { background-color: #fff; color: #f77f00; }
.form-btn { background-color: #f77f00; color: #fff; padding: 15px 40px; border: none; border-radius: 5px; font-size: 1.2em; font-weight: 600; cursor: pointer; transition: background-color 0.3s ease; margin-top: 30px; text-decoration: none; display: inline-block; }
.form-btn:hover { background-color: #e07400; }
.question-number { font-size: 1.5em; font-weight: 600; margin-bottom: 40px; align-self: flex-start; padding-left: 0; color: #ffffff; }
.small-text { font-size: 0.9em; color: #aaa; margin-top: 30px; }
.info-box { background-color: #1a1a1a; padding: 30px; border-radius: 10px; margin-top: 40px; text-align: left; width: 100%; max-width: 700px; }
.info-box ul { list-style: none; padding: 0; margin: 0; }
.info-box ul li { margin-bottom: 15px; display: flex; align-items: flex-start; font-size: 1.1em; line-height: 1.5; color: #cccccc; }
.info-box ul li .check-icon { color: #4CAF50; font-size: 1.3em; margin-right: 10px; flex-shrink: 0; }
.other-input-container { margin-top: 20px; padding: 15px; background-color: #2a2a2a; border-radius: 8px; display: none; }
.other-input-container.show { display: block; }
.other-input-container label { display: block; margin-bottom: 10px; color: #fff; font-size: 1.1em; }
.other-input-container textarea { width: 100%; padding: 15px; box-sizing: border-box; border: 1px solid #555; border-radius: 5px; background-color: #333; color: #fff; font-size: 1.2em; outline: none; resize: vertical; min-height: 100px; }

/* ===== WHATSAPP PAGE ===== */
.whatsapp-page { height: 100vh; overflow: hidden; display: flex; justify-content: center; align-items: center; background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d2d2d 100%); position: relative; }
.whatsapp-page .cta-text { position: absolute; top: 30%; text-align: center; font-size: 1.4rem; font-weight: 600; letter-spacing: 1px; color: #00d4ff; text-shadow: 0 0 5px rgba(0, 212, 255, 0.4), 0 0 10px rgba(0, 212, 255, 0.3); animation: neon-fade 3s ease-in-out infinite alternate; z-index: 100; }
@keyframes neon-fade { 0% { opacity: 0.8; text-shadow: 0 0 8px rgba(0, 212, 255, 0.5); } 100% { opacity: 1; text-shadow: 0 0 15px rgba(0, 212, 255, 0.8); } }
.whatsapp-page .whatsapp-btn-center { position: relative; width: 80px; height: 80px; background: #25D366; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 2.5rem; text-decoration: none; z-index: 1000; border: 3px solid rgba(255, 255, 255, 0.2); animation: whatsapp-pulse 2s infinite, neon-pulse 1.0s infinite alternate; }
@keyframes whatsapp-pulse { 0% { box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4); } 50% { box-shadow: 0 4px 25px rgba(37, 211, 102, 0.6); } 100% { box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4); } }
@keyframes neon-pulse { 0% { border-color: rgba(255, 255, 255, 0.2); box-shadow: 0 0 5px rgba(37, 211, 102, 0.4); } 50% { border-color: rgba(255, 255, 255, 0.5); box-shadow: 0 0 20px rgba(37, 211, 102, 0.8); } 100% { border-color: rgba(255, 255, 255, 0.2); box-shadow: 0 0 5px rgba(37, 211, 102, 0.4); } }

/* ===== AUTH PAGES ===== */
.auth-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d2d2d 100%); padding: 2rem; }
.auth-card { background: #1a1a1a; border-radius: 20px; padding: 3rem; max-width: 450px; width: 100%; border: 1px solid rgba(0, 212, 255, 0.2); box-shadow: 0 8px 30px rgba(0, 212, 255, 0.15); }
.auth-card h1 { text-align: center; margin-bottom: 0.5rem; font-weight: 600; }
.auth-card .subtitle { text-align: center; color: #808080; margin-bottom: 2rem; }
.auth-card .form-group { margin-bottom: 1.5rem; }
.auth-card .form-group label { display: block; margin-bottom: 0.5rem; color: #ffffff; font-weight: 500; }
.auth-card .form-group input { width: 100%; padding: 12px 16px; border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 10px; font-size: 1rem; font-family: inherit; background: #2d2d2d; color: #ffffff; transition: all 0.3s ease; }
.auth-card .form-group input:focus { outline: none; border-color: #00d4ff; box-shadow: 0 0 8px rgba(0, 212, 255, 0.4); }
.auth-card .btn { width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 12px 24px; border: none; border-radius: 50px; text-decoration: none; font-weight: 500; font-size: 1rem; cursor: pointer; transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 0.5px; background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%); color: #ffffff; box-shadow: 0 8px 30px rgba(0, 212, 255, 0.15); margin-top: 1rem; }
.auth-card .btn:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0, 212, 255, 0.2); }
.auth-card .auth-link { text-align: center; margin-top: 1.5rem; color: #808080; }
.auth-card .auth-link a { color: #00d4ff; text-decoration: none; }
.auth-card .auth-link a:hover { text-decoration: underline; }
.error-message { display: block; color: #dc3545; font-size: 0.85rem; margin-top: 0.3rem; opacity: 0; transition: opacity 0.3s ease; }
.error-message.show { opacity: 1; }
.success-message { background: #d4edda; color: #155724; padding: 1rem; border-radius: 10px; margin-top: 1rem; display: none; align-items: center; gap: 0.5rem; font-size: 0.95rem; }
.success-message.show { display: flex; }

/* ===== DASHBOARD LAYOUT ===== */
.dashboard-layout { display: flex; min-height: 100vh; background: #0f0f0f; }
.sidebar { width: 260px; background: #0a0a0a; border-right: 1px solid rgba(0, 212, 255, 0.1); padding: 1.5rem; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; }
.sidebar-brand { margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(0, 212, 255, 0.1); }
.sidebar-brand h2 { color: #ffffff; font-size: 1.4rem; margin: 0; }
.sidebar-brand span { color: #00d4ff; font-size: 0.8rem; }
.sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 0.25rem; }
.sidebar-link { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: 10px; color: #808080; text-decoration: none; transition: all 0.2s ease; font-size: 0.95rem; }
.sidebar-link:hover { background: rgba(0, 212, 255, 0.1); color: #ffffff; }
.sidebar-link.active { background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%); color: #ffffff; font-weight: 600; }
.sidebar-link i { font-size: 1.1rem; width: 20px; text-align: center; }
.main-content { flex: 1; margin-left: 260px; padding: 2rem; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.page-header h1 { color: #ffffff; font-size: 1.8rem; margin: 0; background: none; -webkit-text-fill-color: #ffffff; }
.page-header .breadcrumb { color: #808080; font-size: 0.9rem; }
.stat-card { background: #1a1a1a; border-radius: 15px; padding: 1.5rem; border: 1px solid rgba(0, 212, 255, 0.1); transition: all 0.3s ease; }
.stat-card:hover { border-color: #00d4ff; box-shadow: 0 4px 20px rgba(0, 212, 255, 0.1); }
.stat-card .stat-label { color: #808080; font-size: 0.85rem; margin-bottom: 0.5rem; }
.stat-card .stat-value { color: #ffffff; font-size: 1.8rem; font-weight: 700; }
.stat-card .stat-change { font-size: 0.8rem; margin-top: 0.5rem; }
.stat-card .stat-change.positive { color: #39ff14; }
.stat-card .stat-change.negative { color: #ef4444; }
.data-table { width: 100%; border-collapse: collapse; background: #1a1a1a; border-radius: 15px; overflow: hidden; }
.data-table th { background: #2d2d2d; color: #ffffff; padding: 1rem; text-align: left; font-weight: 600; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; }
.data-table td { padding: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #cccccc; font-size: 0.95rem; }
.data-table tr:hover td { background: rgba(0, 212, 255, 0.05); }
.badge { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
.badge-success { background: rgba(57, 255, 20, 0.2); color: #39ff14; }
.badge-warning { background: rgba(255, 193, 7, 0.2); color: #ffc107; }
.badge-danger { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
.badge-info { background: rgba(0, 212, 255, 0.2); color: #00d4ff; }
.badge-purple { background: rgba(124, 58, 237, 0.2); color: #7c3aed; }

@media (max-width: 768px) {
  .sidebar { transform: translateX(-100%); transition: transform 0.3s ease; }
  .sidebar.open { transform: translateX(0); }
  .main-content { margin-left: 0; }
}
```

- [ ] **Step 2: Verify build compiles**

```bash
cd "c:/Projetos Tiago/tsa-solucoes/lp-tsa" && npx next build 2>&1 | tail -5
```

Expected: Build succeeds (warnings OK, no errors)

- [ ] **Step 3: Commit**

```bash
cd "c:/Projetos Tiago/tsa-solucoes/lp-tsa" && git add src/app/globals.css && git commit -m "style: replace design system with brutalist theme"
```

---

## Task 3: Update layout.tsx with new fonts

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Rewrite layout.tsx**

Replace the font links and add cursor:none to body:

```tsx
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
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ cursor: 'none' }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd "c:/Projetos Tiago/tsa-solucoes/lp-tsa" && git add src/app/layout.tsx && git commit -m "style: swap fonts to Bebas Neue + Space Mono"
```

---

## Task 4: Create Preloader component

**Files:**
- Create: `src/components/Preloader.tsx`

- [ ] **Step 1: Create Preloader.tsx**

```tsx
'use client';

import { useState, useEffect } from 'react';

export default function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const duration = 2500;
    const steps = 100;
    const interval = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += 1;
      setCount(current);
      if (current >= steps) {
        clearInterval(timer);
        setTimeout(() => setDone(true), 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  if (done) return null;

  return (
    <div className={`preloader ${count >= 100 ? 'done' : ''}`}>
      <div className="preloader-counter">{String(count).padStart(3, '0')}</div>
      <div className="preloader-text">tsasolucoes.com / inicializando sinal</div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd "c:/Projetos Tiago/tsa-solucoes/lp-tsa" && git add src/components/Preloader.tsx && git commit -m "feat: add preloader component with 0-100 counter"
```

---

## Task 5: Create CustomCursor component

**Files:**
- Create: `src/components/CustomCursor.tsx`

- [ ] **Step 1: Create CustomCursor.tsx**

```tsx
'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    // Skip on touch devices
    if ('ontouchstart' in window) {
      dot.style.display = 'none';
      document.body.style.cursor = 'auto';
      return;
    }

    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      requestAnimationFrame(animate);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, textarea, .action-link')) {
        dot.classList.add('expanded');
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, textarea, .action-link')) {
        dot.classList.remove('expanded');
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  return <div ref={dotRef} className="cursor-dot" />;
}
```

- [ ] **Step 2: Commit**

```bash
cd "c:/Projetos Tiago/tsa-solucoes/lp-tsa" && git add src/components/CustomCursor.tsx && git commit -m "feat: add custom cursor with hover expand"
```

---

## Task 6: Create SmoothScroll component

**Files:**
- Create: `src/components/SmoothScroll.tsx`

- [ ] **Step 1: Create SmoothScroll.tsx**

```tsx
'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenisRef.current = lenis;

    // Integrate Lenis with GSAP ScrollTrigger
    const initScrollTrigger = async () => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const { gsap } = await import('gsap');
      gsap.registerPlugin(ScrollTrigger);

      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    };

    initScrollTrigger();

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 2: Commit**

```bash
cd "c:/Projetos Tiago/tsa-solucoes/lp-tsa" && git add src/components/SmoothScroll.tsx && git commit -m "feat: add Lenis smooth scroll provider"
```

---

## Task 7: Rewrite Hero component

**Files:**
- Rewrite: `src/components/Hero.tsx`

- [ ] **Step 1: Rewrite Hero.tsx**

```tsx
export default function Hero() {
  return (
    <section id="home" className="hero-brutalist">
      <div className="hero-top">
        <span className="section-label">TSASOLUCOES.COM</span>
        <span className="section-label-light">Vol. 1 / 2026</span>
      </div>

      <div className="hero-name-block">
        <span className="title-hero" style={{ color: 'var(--foreground)', display: 'block' }}>
          TSA
        </span>
        <span className="title-hero" style={{ color: 'var(--primary)', display: 'block' }}>
          SOLUÇÕES
        </span>
      </div>

      <div>
        <div className="hero-signal-line" />
        <div className="hero-bottom">
          <span className="text-body">p. 001</span>
          <span className="text-body" style={{ textTransform: 'uppercase', letterSpacing: '1.8px' }}>
            / MARKETING DIGITAL
          </span>
        </div>
      </div>

      <div className="hero-scroll-hint">↓ SCROLL TO TUNE IN</div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd "c:/Projetos Tiago/tsa-solucoes/lp-tsa" && git add src/components/Hero.tsx && git commit -m "feat: rewrite Hero with brutalist layout"
```

---

## Task 8: Create Manifesto component

**Files:**
- Create: `src/components/Manifesto.tsx`

- [ ] **Step 1: Create Manifesto.tsx**

```tsx
'use client';

import { useEffect, useRef } from 'react';

const lines = ['TRANSFORMAÇÃO.', 'SOLUÇÕES.', 'ALCANCE.'];

export default function Manifesto() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    let ctx: ReturnType<typeof import('gsap')['gsap']['context']> | undefined;

    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      ctx = gsap.context(() => {
        wordsRef.current.forEach((word) => {
          if (!word) return;
          gsap.fromTo(
            word,
            { color: '#1a1a1a' },
            {
              color: '#f0ebe0',
              scrollTrigger: {
                trigger: word,
                start: 'top 80%',
                end: 'top 50%',
                scrub: true,
              },
            }
          );
        });
      }, sectionRef.current);
    };

    init();

    return () => {
      ctx?.revert();
    };
  }, []);

  let wordIndex = 0;

  return (
    <section ref={sectionRef} className="manifesto-section">
      <div style={{ padding: '2vw 6vw 0' }}>
        <span className="section-label">/ MANIFESTO / p. 002</span>
      </div>

      <div className="manifesto-inner">
        {lines.map((line, i) => (
          <div key={i} className="title-manifesto" style={{ marginBottom: '0.5vw' }}>
            {line.split(' ').map((word) => {
              const idx = wordIndex++;
              return (
                <span
                  key={idx}
                  ref={(el) => { if (el) wordsRef.current[idx] = el; }}
                  className="manifesto-word"
                  style={{ color: '#1a1a1a', marginRight: '0.3em' }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        ))}
        <div
          className="manifesto-tagline"
          ref={(el) => { if (el) wordsRef.current[wordIndex] = el; }}
          style={{ color: '#1a1a1a' }}
        >
          CRIANDO ENVOLVIMENTO, GERANDO RESULTADOS
        </div>
      </div>

      <div style={{ padding: '0 6vw 2vw', opacity: 0.3 }}>
        <span className="text-micro" style={{ color: 'var(--foreground)' }}>
          tsasolucoes / 2026
        </span>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd "c:/Projetos Tiago/tsa-solucoes/lp-tsa" && git add src/components/Manifesto.tsx && git commit -m "feat: add Manifesto section with GSAP scroll-reveal"
```

---

## Task 9: Create Duality component

**Files:**
- Create: `src/components/Duality.tsx`

- [ ] **Step 1: Create Duality.tsx**

```tsx
const leftItems = [
  { key: 'TRÁFEGO', value: 'Google Ads, Meta Ads, YouTube Ads' },
  { key: 'SOCIAL', value: 'Criação de conteúdo, gestão de posts' },
  { key: 'LANDING', value: 'Páginas otimizadas para conversão' },
  { key: 'COMBO', value: 'Tráfego + Social Media completo' },
  { key: 'SOFTWARE', value: 'Desenvolvimento de aplicações web e mobile' },
];

const rightItems = [
  { key: 'MISSÃO', value: 'Crescimento com estratégias eficientes' },
  { key: 'VISÃO', value: 'Referência nacional em performance local' },
  { key: 'VALORES', value: 'Transparência, resultados, comprometimento, ética' },
  { key: 'DESDE', value: '2020' },
  { key: 'META', value: 'Evolução contínua' },
];

export default function Duality() {
  return (
    <section id="about" className="duality-section fade-in-section">
      <div className="duality-column">
        <span className="section-label" style={{ marginBottom: '2vw', letterSpacing: '2.5px' }}>
          O QUE FAZEMOS
        </span>
        <h2 className="title-section" style={{ color: 'var(--foreground)', marginBottom: '3vw' }}>
          NOSSOS SERVIÇOS
        </h2>
        {leftItems.map((item) => (
          <div key={item.key} className="duality-item">
            <span className="item-key">{item.key}</span>
            <span className="text-value">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="duality-divider" />

      <div className="duality-column">
        <span className="section-label" style={{ marginBottom: '2vw', letterSpacing: '2.5px' }}>
          O QUE NOS MOVE
        </span>
        <h2 className="title-section" style={{ color: 'var(--foreground)', marginBottom: '3vw' }}>
          NOSSA ESSÊNCIA
        </h2>
        {rightItems.map((item) => (
          <div key={item.key} className="duality-item">
            <span className="item-key">{item.key}</span>
            <span className="text-value">{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd "c:/Projetos Tiago/tsa-solucoes/lp-tsa" && git add src/components/Duality.tsx && git commit -m "feat: add Duality section with two-column grid"
```

---

## Task 10: Create Work component

**Files:**
- Create: `src/components/Work.tsx`

- [ ] **Step 1: Create Work.tsx**

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { notifyTelegram } from '@/lib/telegram';

const services = [
  {
    num: '01',
    title: 'TRÁFEGO PAGO',
    subtitle: 'Campanhas que convertem de verdade',
    subtitleColor: '#a78bfa',
    description: 'Campanhas otimizadas no Google Ads e Facebook Ads para gerar leads e vendas todos os dias.',
    tags: ['GOOGLE ADS', 'META ADS', 'YOUTUBE ADS'],
    bg: '/images/results/client1.png',
  },
  {
    num: '02',
    title: 'SOCIAL MEDIA',
    subtitle: 'Conteúdo que engaja e posiciona',
    subtitleColor: '#2dd4bf',
    description: 'Gestão completa das suas redes sociais com conteúdo relevante e estratégico.',
    tags: ['CRIAÇÃO DE CONTEÚDO', 'GESTÃO DE POSTS', 'ENGAJAMENTO'],
    bg: '/images/results/client4.png',
  },
  {
    num: '03',
    title: 'LANDING PAGES',
    subtitle: 'Páginas que convertem visitantes em clientes',
    subtitleColor: '#a78bfa',
    description: 'Páginas otimizadas para conversão que transformam visitantes em clientes.',
    tags: ['DESIGN RESPONSIVO', 'OTIMIZAÇÃO CRO', 'INTEGRAÇÃO'],
    bg: '/images/results/client3.png',
  },
  {
    num: '04',
    title: 'COMBO COMPLETO',
    subtitle: 'Tráfego + Social para resultados máximos',
    subtitleColor: '#2dd4bf',
    description: 'Tráfego Pago + Social Media para resultados ainda mais potentes.',
    tags: ['TRÁFEGO PAGO', 'SOCIAL MEDIA', 'RELATÓRIOS'],
    bg: '/images/results/client2.png',
  },
  {
    num: '05',
    title: 'SOFTWARE',
    subtitle: 'Soluções digitais sob medida',
    subtitleColor: '#a78bfa',
    description: 'Desenvolvimento de aplicações web e mobile personalizadas para o seu negócio.',
    tags: ['WEB', 'MOBILE', 'SISTEMAS', 'INTEGRAÇÃO'],
    bg: undefined,
  },
];

const total = String(services.length).padStart(2, '0');

export default function Work() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: ReturnType<typeof import('gsap')['gsap']['context']> | undefined;

    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current || !containerRef.current) return;

      const slides = containerRef.current;
      const totalWidth = slides.scrollWidth - window.innerWidth;

      ctx = gsap.context(() => {
        gsap.to(slides, {
          x: -totalWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${totalWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      }, sectionRef.current);
    };

    init();

    return () => {
      ctx?.revert();
    };
  }, []);

  const handleCTA = (serviceName: string) => {
    notifyTelegram(`[HOME] Clique em: QUERO SABER MAIS (${serviceName})`);
    window.open(
      'https://wa.me/5562991845391?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20serviços%20da%20TSA%20Soluções.',
      '_blank'
    );
  };

  return (
    <section ref={sectionRef} id="services" className="work-section">
      <div ref={containerRef} className="work-slides-container">
        {services.map((service) => (
          <div key={service.num} className="work-card">
            <div className="work-card-bg">
              {service.bg && (
                <div
                  className="work-card-bg-img"
                  style={{ backgroundImage: `url(${service.bg})` }}
                />
              )}
              <div className="work-card-bg-overlay" />
            </div>

            <div className="work-card-content">
              <div className="work-card-top">
                <span className="section-label">/ NOSSOS SERVIÇOS / p. 004</span>
                <span className="section-label" style={{ letterSpacing: '3px' }}>
                  {service.num} / {total}
                </span>
              </div>

              <div className="work-card-center">
                <h2 className="title-work" style={{ color: 'var(--foreground)' }}>
                  {service.title}
                </h2>
                <p className="subtitle-accent" style={{ color: service.subtitleColor, marginTop: '16px' }}>
                  {service.subtitle}
                </p>
              </div>

              <div className="work-card-bottom">
                <p className="text-body">{service.description}</p>
                <div className="work-card-tags">
                  {service.tags.map((tag) => (
                    <span key={tag} className="tech-tag">{tag}</span>
                  ))}
                </div>
                <button
                  className="action-link"
                  onClick={() => handleCTA(service.title)}
                  style={{ alignSelf: 'flex-start', marginTop: '8px' }}
                >
                  QUERO SABER MAIS →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd "c:/Projetos Tiago/tsa-solucoes/lp-tsa" && git add src/components/Work.tsx && git commit -m "feat: add Work section with horizontal scroll slides"
```

---

## Task 11: Create RightNow component

**Files:**
- Create: `src/components/RightNow.tsx`

- [ ] **Step 1: Create RightNow.tsx**

```tsx
const metrics = [
  { label: 'CLIENTES', value: '+50 ativos', note: 'e contando' },
  { label: 'VENDAS', value: '+R$1M gerados', note: 'para nossos clientes' },
  { label: 'MERCADO', value: '5 anos', note: 'desde 2020' },
  { label: 'CAMPANHAS', value: '+30 ativas', note: 'rodando agora' },
];

export default function RightNow() {
  return (
    <section id="results" className="rightnow-section fade-in-section">
      <h2 className="title-rightnow">
        <span style={{ color: 'var(--foreground)' }}>RIGHT</span>
        <br />
        <span style={{ color: 'var(--primary)' }}>NOW</span>
      </h2>

      <div className="rightnow-grid">
        {metrics.map((m) => (
          <div key={m.label} className="rightnow-item">
            <div className="rightnow-dot" />
            <div>
              <p className="section-label" style={{ marginBottom: '8px' }}>{m.label}</p>
              <p className="text-value">{m.value}</p>
              <p className="text-micro-italic" style={{ marginTop: '4px' }}>{m.note}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd "c:/Projetos Tiago/tsa-solucoes/lp-tsa" && git add src/components/RightNow.tsx && git commit -m "feat: add RightNow section with agency metrics"
```

---

## Task 12: Rewrite Contact component

**Files:**
- Rewrite: `src/components/Contact.tsx`

- [ ] **Step 1: Rewrite Contact.tsx**

```tsx
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
        href="mailto:tiago@tsasolucoes.com"
        className="title-contact-email"
        style={{ display: 'block', marginTop: '2vw' }}
        onClick={() => {
          window.fbq?.('trackCustom', 'BotaoEmail');
          notifyTelegram('[HOME] Clique em: EMAIL');
        }}
      >
        tiago@tsasolucoes.com
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

      <div className="contact-testimonials">
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
          href="https://wa.me/5562991845391?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20serviços%20da%20TSA%20Soluções."
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
```

- [ ] **Step 2: Commit**

```bash
cd "c:/Projetos Tiago/tsa-solucoes/lp-tsa" && git add src/components/Contact.tsx && git commit -m "feat: rewrite Contact with brutalist layout + testimonials"
```

---

## Task 13: Rewrite WhatsappButton component

**Files:**
- Rewrite: `src/components/WhatsappButton.tsx`

- [ ] **Step 1: Rewrite WhatsappButton.tsx**

```tsx
'use client';

import { notifyTelegram } from '@/lib/telegram';

export default function WhatsappButton() {
  const handleClick = () => {
    notifyTelegram('[HOME] Clique em: BOTÃO WHATSAPP FIXO');
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
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd "c:/Projetos Tiago/tsa-solucoes/lp-tsa" && git add src/components/WhatsappButton.tsx && git commit -m "feat: rewrite WhatsappButton with inline SVG"
```

---

## Task 14: Rewrite page.tsx with new composition

**Files:**
- Rewrite: `src/app/page.tsx`

- [ ] **Step 1: Rewrite page.tsx**

```tsx
'use client';

import { useEffect } from 'react';
import { wakeUpServer, trackAccess } from '@/lib/telegram';
import MetaPixel from '@/components/MetaPixel';
import Preloader from '@/components/Preloader';
import CustomCursor from '@/components/CustomCursor';
import SmoothScroll from '@/components/SmoothScroll';
import Hero from '@/components/Hero';
import Manifesto from '@/components/Manifesto';
import Duality from '@/components/Duality';
import Work from '@/components/Work';
import RightNow from '@/components/RightNow';
import Contact from '@/components/Contact';
import WhatsappButton from '@/components/WhatsappButton';

export default function Home() {
  useEffect(() => {
    wakeUpServer();
    trackAccess('home');

    // Fade-in animation for sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.fade-in-section');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <MetaPixel />
      <Preloader />
      <CustomCursor />
      <SmoothScroll>
        <main>
          <Hero />
          <Manifesto />
          <Duality />
          <Work />
          <RightNow />
          <Contact />
        </main>
      </SmoothScroll>
      <WhatsappButton />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd "c:/Projetos Tiago/tsa-solucoes/lp-tsa" && git add src/app/page.tsx && git commit -m "feat: rewrite page.tsx with brutalist section composition"
```

---

## Task 15: Delete old components

**Files:**
- Delete: `src/components/Navbar.tsx`
- Delete: `src/components/About.tsx`
- Delete: `src/components/Services.tsx`
- Delete: `src/components/Results.tsx`
- Delete: `src/components/Testimonials.tsx`
- Delete: `src/components/CTA.tsx`
- Delete: `src/components/Footer.tsx`
- Delete: `src/components/Particles.tsx`

- [ ] **Step 1: Delete old component files**

```bash
cd "c:/Projetos Tiago/tsa-solucoes/lp-tsa" && rm src/components/Navbar.tsx src/components/About.tsx src/components/Services.tsx src/components/Results.tsx src/components/Testimonials.tsx src/components/CTA.tsx src/components/Footer.tsx src/components/Particles.tsx
```

- [ ] **Step 2: Verify no import errors**

```bash
cd "c:/Projetos Tiago/tsa-solucoes/lp-tsa" && npx next build 2>&1 | tail -10
```

Expected: Build succeeds with no "module not found" errors.

- [ ] **Step 3: Commit**

```bash
cd "c:/Projetos Tiago/tsa-solucoes/lp-tsa" && git add -u src/components/ && git commit -m "chore: remove old landing page components"
```

---

## Task 16: Final build verification and dev test

- [ ] **Step 1: Run full build**

```bash
cd "c:/Projetos Tiago/tsa-solucoes/lp-tsa" && npx next build
```

Expected: Build completes successfully.

- [ ] **Step 2: Start dev server for visual verification**

```bash
cd "c:/Projetos Tiago/tsa-solucoes/lp-tsa" && npm run dev
```

Open http://localhost:3000 and verify:
1. Preloader shows counter 0→100 then fades
2. Hero shows TSA / SOLUÇÕES in massive type
3. Custom cursor dot follows mouse
4. Smooth scroll works
5. Manifesto words reveal from dark to light on scroll
6. Duality shows 2-column grid with red divider
7. Work slides scroll horizontally
8. Right Now shows 4 metrics
9. Contact shows email, form, testimonials, social links
10. WhatsApp button visible in bottom-right
11. Dashboard pages (/login, /painel) still work with their original styles

- [ ] **Step 3: Final commit**

```bash
cd "c:/Projetos Tiago/tsa-solucoes/lp-tsa" && git add -A && git commit -m "feat: complete brutalist redesign of TSA landing page"
```
