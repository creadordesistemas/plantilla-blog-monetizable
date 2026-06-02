'use client';

import { useEffect } from 'react';

interface BlogViewTrackerProps {
  slug: string;
}

export default function BlogViewTracker({ slug }: BlogViewTrackerProps) {
  useEffect(() => {
    if (!slug) return;
    
    // Ejecutar llamada silenciosa de tracking
    fetch('/api/blog/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug })
    }).catch(err => {
      // Ignorar errores silenciosamente para no interrumpir la experiencia de lectura
    });
  }, [slug]);

  return null;
}
