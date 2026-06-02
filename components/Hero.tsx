'use client';

import { useState, useEffect } from 'react';
import { getPublicSettings } from '@/app/actions';
import staticSettings from '@/data/settings.json';

import HeroTypographic from './HeroTypographic';
import HeroDotGrid from './HeroDotGrid';
import HeroGradient from './HeroGradient';
import Globe3D from './Globe3D';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<any>(staticSettings);

  useEffect(() => {
    setMounted(true);
    getPublicSettings().then(data => {
      if (data) {
        setSettings((prev: any) => ({ ...prev, ...data }));
      }
    });
  }, []);

  const heroStyle = settings.heroStyle || 'GLOBE';

  if (heroStyle === 'TYPOGRAPHIC') {
    return <HeroTypographic settings={settings} />;
  }

  if (heroStyle === 'DOTGRID') {
    return <HeroDotGrid settings={settings} />;
  }

  if (heroStyle === 'GRADIENT') {
    return <HeroGradient settings={settings} />;
  }

  // Fallback: render the original GLOBE 3D layout
  const siteName = settings.siteName || 'Mi Blog';
  const tagline = settings.tagline || 'COMPARTO IDEAS, APRENDIZAJES Y PROYECTOS';
  const description = settings.siteDescription || 'Bienvenido a mi espacio digital. Aquí encontrarás artículos detallados, guías prácticas y una comunidad activa diseñada para debatir en profundidad sobre las temáticas que nos apasionan.';

  return (
    <section className="section-padding hero-section" style={{
      minHeight: '100vh',
      backgroundColor: 'var(--background)',
      overflow: 'hidden'
    }}>
      <div className="container hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', alignItems: 'center', width: '100%', maxWidth: 'none' }}>
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span style={{
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '0.45em',
            color: 'var(--foreground-secondary)',
            display: 'block',
            marginBottom: '1.5rem',
            fontWeight: '700'
          }}>
            {siteName} {"//"} BLOG & COMUNIDAD
          </span>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            lineHeight: '1.1',
            fontWeight: '700',
            marginBottom: '2rem',
            fontFamily: 'Space Grotesk'
          }}>
            {tagline.toUpperCase()}
          </h1>
          <p className="text-secondary" style={{
            maxWidth: '600px',
            fontSize: '1.15rem',
            lineHeight: '1.8',
            marginBottom: '3.5rem'
          }}>
            {description}
          </p>
          <div className="hero-btn-container">
            <Link href="/blog" className="btn-primary hero-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              LEER BLOG
            </Link>
            <Link href="/comunidad" className="btn-outline hero-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              COMUNIDAD
            </Link>
          </div>
        </motion.div>

        <div className="hero-globe" style={{ height: '700px', width: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {mounted && (
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
              <Globe3D />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
          )}

          <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(circle at center, transparent 0%, var(--background) 100%)'
          }} />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hero-section {
          display: flex;
          align-items: center;
          position: relative;
        }
        .hero-grid {
          gap: 4rem;
        }
        .hero-text {
          padding-left: 5rem;
          position: relative;
          z-index: 10;
        }
        .hero-btn-container {
          display: flex;
          gap: 1.5rem;
          margin-left: 2rem;
          margin-top: 1rem;
        }
        .hero-btn {
          padding: 1.2rem 2.5rem !important;
          font-size: 0.95rem !important;
          letter-spacing: 0.1em;
        }
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .hero-section {
            min-height: 100vh !important;
            padding-top: 80px !important;
          }
          .hero-globe {
            display: none !important;
          }
          .hero-text {
            padding-left: 0 !important;
          }
          .hero-btn-container {
            margin-left: 0 !important;
            flex-direction: column !important;
            align-items: center !important;
            width: 100%;
          }
          .hero-btn {
            width: 100% !important;
            max-width: 320px !important;
          }
        }
      ` }} />
    </section>
  );
}
