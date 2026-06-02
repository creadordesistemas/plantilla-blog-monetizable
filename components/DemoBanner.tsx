'use client';

import { useState } from 'react';

export default function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <>
      <div
        id="demo-banner"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #6366f1 100%)',
          backgroundSize: '200% 100%',
          animation: 'bannerShimmer 4s linear infinite',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          fontSize: '0.8rem',
          fontFamily: 'Inter, sans-serif',
          fontWeight: '500',
          color: '#ffffff',
          letterSpacing: '0.02em',
          boxShadow: '0 2px 20px rgba(99, 102, 241, 0.4)',
        }}
      >
        {/* Left spacer for centering */}
        <div style={{ flex: 1 }} />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <span style={{ opacity: 0.9 }}>🎬</span>
          <span>
            <strong>Modo Demo</strong> — Los datos son de ejemplo. Explora todas las secciones libremente.
          </span>
          <span style={{ opacity: 0.4 }}>·</span>
          <a
            href="https://github.com/creadordesistemas/plantilla-blog-monetizable"
            target="_blank"
            rel="noopener noreferrer"
            id="demo-banner-cta"
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: '#ffffff',
              padding: '4px 14px',
              borderRadius: '20px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              border: '1px solid rgba(255,255,255,0.3)',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.25)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.6)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.15)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.3)';
            }}
          >
            ⭐ Usar esta plantilla →
          </a>
        </div>

        {/* Close button */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            id="demo-banner-close"
            onClick={() => setDismissed(true)}
            aria-label="Cerrar banner de demo"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              fontSize: '1.1rem',
              lineHeight: 1,
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#fff';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.15)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)';
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Spacer to push content down */}
      <div style={{ height: '41px' }} />

      <style>{`
        @keyframes bannerShimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </>
  );
}
