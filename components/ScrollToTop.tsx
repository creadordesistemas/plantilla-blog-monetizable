'use client';

import { useEffect } from 'react';

export default function ScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
    // Timeout de seguridad para manejar posibles desfases en el renderizado del router de Next.js
    const t = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    return () => clearTimeout(t);
  }, []);

  return null;
}
