'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface HeroProps {
  settings: {
    siteName?: string;
    tagline?: string;
    siteDescription?: string;
  };
}

export default function HeroTypographic({ settings }: HeroProps) {
  const siteName = settings.siteName || 'Mi Blog';
  const tagline = settings.tagline || 'Contenido que importa.';
  const description = settings.siteDescription || 'Un blog sobre tecnología, programación y sistemas.';

  return (
    <section className="hero-typo-section" style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--background)',
      position: 'relative',
      overflow: 'hidden',
      padding: '120px 24px 80px 24px'
    }}>
      <div className="container" style={{
        maxWidth: '1000px',
        margin: '0 auto',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 10
      }}>
        {/* Label de la marca */}
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            color: 'var(--foreground-secondary)',
            marginBottom: '2rem',
            display: 'inline-block',
            border: '1px solid var(--border)',
            padding: '6px 16px',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.01)'
          }}
        >
          {siteName} {"//"} DEMO EN VIVO · PLANTILLA OPEN SOURCE
        </motion.span>

        {/* Tagline Oversized */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: 'Space Grotesk',
            fontSize: 'clamp(2.5rem, 7vw, 6rem)',
            lineHeight: 1.05,
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'var(--foreground)',
            marginBottom: '2rem',
            maxWidth: '900px'
          }}
        >
          {tagline.toUpperCase()}
        </motion.h1>

        {/* Descripción */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            color: 'var(--foreground-secondary)',
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            lineHeight: 1.7,
            maxWidth: '650px',
            marginBottom: '3.5rem'
          }}
        >
          {description}
        </motion.p>

        {/* Botones de acción */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex',
            gap: '1.5rem',
            justifyContent: 'center',
            width: '100%',
            flexWrap: 'wrap'
          }}
        >
          <Link href="/blog" className="btn-primary" style={{
            padding: '1.1rem 2.8rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '2px',
            transition: 'transform 0.2s ease, opacity 0.2s ease'
          }}>
            LEER LA GUÍA
          </Link>
          <Link href="/comunidad" className="btn-outline" style={{
            padding: '1.1rem 2.8rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '2px',
            transition: 'transform 0.2s ease, opacity 0.2s ease'
          }}>
            VER LA COMUNIDAD
          </Link>
          <a
            href="https://github.com/creadordesistemas/plantilla-blog-monetizable"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '1.1rem 2.8rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              borderRadius: '2px',
              border: '1px solid rgba(99,102,241,0.5)',
              color: '#a78bfa',
              background: 'rgba(99,102,241,0.06)',
              transition: 'all 0.2s ease'
            }}
          >
            ★ USAR GRATIS → GITHUB
          </a>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hero-typo-section {
          position: relative;
        }
        @media (max-width: 600px) {
          .hero-typo-section {
            min-height: 90vh !important;
            padding-top: 140px !important;
          }
          .hero-typo-section Link {
            width: 100% !important;
            max-width: 320px;
          }
        }
      ` }} />
    </section>
  );
}
