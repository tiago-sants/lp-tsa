'use client';

import { useEffect } from 'react';
import { wakeUpServer, trackAccess } from '@/lib/telegram';
import MetaPixel from '@/components/MetaPixel';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Results from '@/components/Results';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import WhatsappButton from '@/components/WhatsappButton';

export default function Home() {
  useEffect(() => {
    wakeUpServer();
    trackAccess('home');

    // Scroll animations
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

    const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    elements.forEach((el) => observer.observe(el));

    // Add animation classes to section elements
    const sections = document.querySelectorAll('section:not(.hero)');
    sections.forEach((section) => {
      const items = section.querySelectorAll(
        '.section-header, .service-card, .result-card, .testimonial-card, .mvv-item, .contact-info, .contact-form'
      );
      items.forEach((el, index) => {
        el.classList.add('fade-in');
        (el as HTMLElement).style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
      });
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <MetaPixel />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Results />
      <Testimonials />
      <CTA />
      <Contact />
      <Footer />
      <WhatsappButton />
    </>
  );
}
