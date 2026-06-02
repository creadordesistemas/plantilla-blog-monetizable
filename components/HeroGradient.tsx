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

export default function HeroGradient({ settings }: HeroProps) {
  const siteName = settings.siteName || 'Mi Blog';
  const tagline = settings.tagline || 'Contenido que importa.';
  const description = settings.siteDescription || 'Un blog sobre tecnología, programación y sistemas.';

  return (
    <section className="hero-grad-section" style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000000',
      position: 'relative',
      overflow: 'hidden',
      padding: '120px 24px 80px 24px'
    }}>
      {/* Orbes de Gradiente Animados */}
      <div className="gradient-orb orb-1" style={{
        position: 'absolute',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
        top: '-10%',
        left: '10%',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      <div className="gradient-orb orb-2" style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(147, 51, 234, 0.06) 0%, transparent 70%)',
        bottom: '-10%',
        right: '10%',
        filter: 'blur(70px)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

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
          initial={{ opacity: 0, y: 10 }}
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
            borderRadius: '2px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)'
          }}
        >
          {siteName} {"//"} SISTEMA DE DESPLIEGUE v1.0
        </motion.span>

        {/* Tagline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: 'Space Grotesk',
            fontSize: 'clamp(2.5rem, 6.5vw, 5rem)',
            lineHeight: 1.1,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: '#ffffff',
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
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            lineHeight: 1.7,
            maxWidth: '650px',
            marginBottom: '3.5rem'
          }}
        >
          {description}
        </motion.p>

        {/* Botones */}
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
            borderRadius: '2px'
          }}>
            LEER EL BLOG
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
            borderRadius: '2px'
          }}>
            ACCESO MIEMBROS
          </Link>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hero-grad-section {
          position: relative;
        }

        .orb-1 {
          animation: floatOrb1 15s ease-in-out infinite alternate;
        }

        .orb-2 {
          animation: floatOrb2 20s ease-in-out infinite alternate;
        }

        @keyframes floatOrb1 {
          0% { transform: translateY(0px) scale(1); }
          100% { transform: translateY(40px) scale(1.1); }
        }

        @keyframes floatOrb2 {
          0% { transform: translateY(0px) scale(1); }
          100% { transform: translateY(-40px) scale(0.9); }
        }

        @media (max-width: 600px) {
          .hero-grad-section {
            min-height: 90vh !important;
            padding-top: 140px !important;
          }
          .hero-grad-section Link {
            width: 100% !important;
            max-width: 320px;
          }
        }
      ` }} />
    </section>
  );
}
