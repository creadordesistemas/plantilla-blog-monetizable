'use client';

import { useEffect, useRef } from 'react';

interface AdSenseUnitProps {
  client: string;
  slot: string;
  format?: string;
  responsive?: string;
  style?: React.CSSProperties;
}

export default function AdSenseUnit({
  client,
  slot,
  format = 'auto',
  responsive = 'true',
  style = { display: 'block' }
}: AdSenseUnitProps) {
  const initialized = useRef(false);

  useEffect(() => {
    // Asegurarse de que se ejecuta solo en el cliente y una sola vez
    if (typeof window !== 'undefined') {
      try {
        // Ejecutar el push para indicarle a Google que renderice este bloque específico
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        initialized.current = true;
      } catch (err) {
        // AdSense a veces arroja errores si se recarga la página o se navega entre rutas SPA, los capturamos pacíficamente.
        console.warn('Google AdSense warning during push initialization:', err);
      }
    }
  }, []);

  return (
    <div 
      className="adsense-wrapper" 
      style={{ 
        margin: '3rem 0', 
        display: 'flex', 
        justifyContent: 'center', 
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
