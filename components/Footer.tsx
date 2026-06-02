'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPublicSettings } from '@/app/actions';
import staticSettings from '@/data/settings.json';

export default function Footer() {
  const [settings, setSettings] = useState<any>(staticSettings);

  useEffect(() => {
    getPublicSettings().then(data => {
      if (data) {
        setSettings((prev: any) => ({ ...prev, ...data }));
      }
    });
  }, []);

  const siteName = settings.siteName || 'Mi Blog';
  const siteDescription = settings.siteDescription || 'Un blog profesional sobre tecnología, programación y sistemas.';

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: `https://${settings.domain || 'tudominio.com'}`,
    description: siteDescription,
  };

  const linkStyle: React.CSSProperties = {
    color: 'var(--foreground-secondary)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.2s ease',
  };

  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '80px 0',
      backgroundColor: 'var(--background)'
    }}>
      {/* JSON-LD WebSite Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '4rem'
      }}>
        {/* LOGO DINÁMICO */}
        <div style={{ maxWidth: '300px' }}>
          <h3 style={{ 
            fontFamily: 'Space Grotesk', 
            fontSize: '1.5rem', 
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase'
          }}>
            {siteName}
          </h3>
          {/* DESCRIPCIÓN DINÁMICA */}
          <p style={{ 
            color: 'var(--foreground-secondary)', 
            fontSize: '0.9rem',
            lineHeight: '1.6'
          }}>
            {siteDescription}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'white', marginBottom: '0.5rem' }}>Social</span>
            {settings.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer" style={linkStyle}>Instagram</a>}
            {settings.tiktok && <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" style={linkStyle}>TikTok</a>}
            {settings.youtube && <a href={settings.youtube} target="_blank" rel="noopener noreferrer" style={linkStyle}>YouTube</a>}
            {settings.linkedin && <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" style={linkStyle}>LinkedIn</a>}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'white', marginBottom: '0.5rem' }}>Contacto</span>
            <a href={`mailto:${settings.contactEmail || 'contacto@tudominio.com'}`} style={linkStyle}>
              {settings.contactEmail || 'contacto@tudominio.com'}
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'white', marginBottom: '0.5rem' }}>Navegación</span>
            <Link href="/" style={linkStyle}>Inicio</Link>
            <Link href="/blog" style={linkStyle}>Blog</Link>
            <Link href="/comunidad" style={linkStyle}>Comunidad</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'white', marginBottom: '0.5rem' }}>Legal</span>
            <Link href="/privacidad" style={linkStyle}>Política de Privacidad</Link>
            <Link href="/terminos" style={linkStyle}>Términos y Condiciones</Link>
            <Link href="/cookies" style={linkStyle}>Política de Cookies</Link>
          </div>
        </div>
      </div>
      
      <div className="container" style={{ 
        marginTop: '80px', 
        paddingTop: '40px', 
        borderTop: '1px solid #111',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <p style={{ color: '#444', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
          © {new Date().getFullYear()} {siteName.toUpperCase()}. TODOS LOS DERECHOS RESERVADOS.
        </p>
        <p style={{ color: '#444', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
          CONSTRUIDO CON NEXT.JS + SUPABASE
        </p>
      </div>
    </footer>
  );
}
