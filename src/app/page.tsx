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
import Testimonials from '@/components/Testimonials';
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
          <Testimonials />
          <Contact />
        </main>
      </SmoothScroll>
      <WhatsappButton />
    </>
  );
}
