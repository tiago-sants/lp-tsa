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
