'use client';

import { motion, type Variants } from 'framer-motion';

import { useState, useEffect } from 'react';
import { getPublicSettings } from '@/app/actions';
import staticSettings from '@/data/settings.json';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const bentoVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }
};

// ✏️ PERSONALIZAR: reemplaza estos elementos con tus propias habilidades, herramientas o áreas de expertise
const stack = [
  'Next.js 14 + TypeScript — Framework del blog',
  'Supabase (PostgreSQL) — Base de datos y storage',
  'Vercel — Hosting gratuito con deploy automático',
  'Google AdSense — Monetización por publicidad',
  'Stripe — Membresías y pagos recurrentes',
  'Brevo — Newsletter y email marketing',
];

export default function AboutMe() {
  const [settings, setSettings] = useState<any>(staticSettings);

  useEffect(() => {
    getPublicSettings().then(data => {
      if (data) {
        setSettings((prev: any) => ({ ...prev, ...data }));
      }
    });
  }, []);

  const authorName = settings.authorName || 'Serafín';
  const authorTitle = settings.authorTitle || 'Desarrollador Full-Stack & Experto SEO';
  const authorPhilosophy = settings.authorPhilosophy || 'Construyo sistemas, no simplemente páginas.';
  const authorBio = settings.authorBio || 'Llevo años construyendo e integrando infraestructura digital robusta, desde CRM hasta blogs de alto rendimiento.';

  return (
    <section id="historia" className="section-padding" style={{ backgroundColor: 'var(--background)' }}>
      <div className="container">

        {/* Encabezado de sección */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '3rem', borderLeft: '4px solid var(--primary)', paddingLeft: '2rem' }}
        >
          <h2 style={{ fontSize: '3rem', fontWeight: '700', fontFamily: 'Space Grotesk' }}>
            SOBRE <span style={{ color: 'var(--foreground-secondary)' }}>ESTA DEMO</span>
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={bentoVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="bento-grid"
        >
          {/* Tarjeta 1 — Historia (grande) */}
          <motion.div variants={cardVariant} className="bento-card bento-main">
            <span className="bento-label">{"// SOBRE LA PLANTILLA"}</span>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--foreground-secondary)', marginTop: '1rem' }}>
              Hola, soy{' '}
              <strong style={{ color: 'var(--foreground)' }}>{authorName}</strong>, y soy{' '}
              <strong style={{ color: 'var(--foreground)' }}>{authorTitle}</strong>.
            </p>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--foreground-secondary)', marginTop: '1.25rem' }}>
              {authorBio}
            </p>
          </motion.div>

          {/* Tarjeta 2 — Filosofía */}
          <motion.div variants={cardVariant} className="bento-card bento-philosophy">
            <span className="bento-label">{"// OPEN SOURCE"}</span>
            <p style={{ fontSize: '1.6rem', fontFamily: 'Space Grotesk', fontWeight: '700', lineHeight: '1.25', marginTop: '1rem' }}>
              {authorPhilosophy}
            </p>
            <p style={{ color: 'var(--foreground-secondary)', marginTop: '1rem', fontSize: '0.9rem', lineHeight: '1.7' }}>
              Código abierto bajo licencia MIT. Sin costes ocultos, sin suscripciones. Tuyo para siempre.
            </p>
          </motion.div>

          {/* Tarjeta 3 — Garantía */}
          <motion.div variants={cardVariant} className="bento-card bento-guarantee">
            <span className="bento-label">{"// BENEFICIO"}</span>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ fontSize: '3.5rem', fontFamily: 'Space Grotesk', fontWeight: '700', lineHeight: '1' }}>
                🚀
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', letterSpacing: '0.15em', marginTop: '0.75rem', color: 'var(--foreground)' }}>
                EN PRODUCCIÓN EN MINUTOS
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--foreground-secondary)', marginTop: '0.5rem', lineHeight: '1.6' }}>
                Deploy en un clic en Vercel. Sin configuración compleja. Tu blog funcionando desde el primer día.
              </div>
            </div>
          </motion.div>

          {/* Tarjeta 4 — Habilidades / Áreas de expertise */}
          <motion.div variants={cardVariant} className="bento-card bento-stack">
            {/* ✏️ PERSONALIZAR: puedes cambiar el título a lo que mejor represente tu área (skills, herramientas, materias...) */}
            <span className="bento-label">{"// TECNOLOGÍAS INCLUIDAS"}</span>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stack.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: 'easeOut' }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--foreground)', fontSize: '0.9rem' }}
                >
                  <span style={{ color: 'var(--foreground-secondary)', fontFamily: 'Space Grotesk', fontSize: '0.75rem', fontWeight: '700' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .bento-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 1px;
          background-color: var(--border);
          border: 1px solid var(--border);
        }

        .bento-card {
          background-color: var(--background);
          padding: 2.5rem;
          transition: background-color 0.25s ease, border-color 0.25s ease;
          position: relative;
          overflow: hidden;
        }

        .bento-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--card-bg);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .bento-card:hover::before {
          opacity: 1;
        }

        .bento-label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: var(--foreground-secondary);
          position: relative;
          z-index: 1;
        }

        .bento-card > *:not(.bento-label) {
          position: relative;
          z-index: 1;
        }

        /* Layout desktop: col-span */
        .bento-main {
          grid-column: span 2;
        }

        .bento-philosophy {
          grid-column: span 1;
        }

        .bento-guarantee {
          grid-column: span 1;
        }

        .bento-stack {
          grid-column: span 2;
        }

        /* Tablet */
        @media (max-width: 900px) {
          .bento-grid {
            grid-template-columns: 1fr 1fr;
          }
          .bento-main { grid-column: span 2; }
          .bento-philosophy { grid-column: span 1; }
          .bento-guarantee { grid-column: span 1; }
          .bento-stack { grid-column: span 2; }
        }

        /* Móvil */
        @media (max-width: 600px) {
          .bento-grid {
            grid-template-columns: 1fr;
            gap: 1px;
          }
          .bento-main,
          .bento-philosophy,
          .bento-guarantee,
          .bento-stack {
            grid-column: span 1;
          }
          .bento-card {
            padding: 2rem 1.5rem;
          }
        }
      ` }} />
    </section>
  );
}
