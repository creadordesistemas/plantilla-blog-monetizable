'use client';

import { motion } from 'framer-motion';

const features = [
  {
    icon: '🏠',
    tag: '// HOME & HERO',
    title: 'Tu escaparate digital',
    description:
      'La home del blog está diseñada para convertir. Hero impactante, sección "Sobre mí" con Bento Grid, artículos recientes, FAQ con rich snippets para Google y formulario de newsletter. Todo en una sola página lista para publicar.',
    benefit: 'Primera impresión que convierte visitantes en lectores',
  },
  {
    icon: '📝',
    tag: '// BLOG & ADMIN',
    title: 'Publica sin tocar código',
    description:
      'Panel de administración completo protegido con JWT. Crea, edita y publica artículos con Markdown enriquecido, imágenes desde Supabase Storage, categorías y artículos exclusivos para miembros. Todo desde el navegador.',
    benefit: 'Control total del contenido sin escribir una línea de código',
  },
  {
    icon: '💰',
    tag: '// MONETIZACIÓN DUAL',
    title: 'Dos fuentes de ingresos',
    description:
      'Google AdSense ya integrado: añade tu Publisher ID y empieza a monetizar el tráfico de tu blog con publicidad. Más membresías de pago con Stripe: configura tu precio, conecta un Payment Link y activa el área privada para miembros.',
    benefit: 'Ingresos pasivos por publicidad + ingresos recurrentes por membresía',
  },
  {
    icon: '🔍',
    tag: '// SEO TÉCNICO',
    title: 'Google te encontrará',
    description:
      'Sitemap.xml generado automáticamente, robots.txt optimizado, metadatos Open Graph para redes sociales, JSON-LD para rich snippets en resultados de búsqueda y cabeceras de seguridad configuradas. Sin tocar nada.',
    benefit: 'Posicionamiento orgánico desde el primer artículo publicado',
  },
  {
    icon: '⚡',
    tag: '// DEPLOY & HOSTING',
    title: 'Online en minutos, gratis',
    description:
      'Vercel y Supabase tienen planes gratuitos más que suficientes para empezar. Un botón en el README clona el repo, configura Vercel y te guía para añadir las variables de entorno. Tu blog en producción en menos de 30 minutos.',
    benefit: 'Cero coste inicial — hosting, base de datos y CDN global incluidos',
  },
  {
    icon: '🌙',
    tag: '// UX & DISEÑO',
    title: 'Diseño profesional incluido',
    description:
      'Dark mode / Light mode con transiciones suaves, hero animado con globe 3D, tipografía Space Grotesk, Bento Grid, microanimaciones con Framer Motion y diseño totalmente responsive. Una interfaz que impresiona desde el primer segundo.',
    benefit: 'Aspecto premium que transmite confianza y profesionalidad',
  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function FeatureShowcase() {
  return (
    <section
      id="funcionalidades"
      style={{
        padding: '6rem 0',
        backgroundColor: 'var(--background)',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow de fondo sutil */}
      <div style={{
        position: 'absolute',
        top: '-200px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '600px',
        background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ marginBottom: '5px' }}
        >
          <div style={{ marginBottom: '60px', borderLeft: '4px solid var(--primary)', paddingLeft: '24px' }}>
            <div style={{
              fontSize: '0.65rem',
              fontWeight: '700',
              letterSpacing: '0.3em',
              color: 'var(--foreground-secondary)',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}>
              PLANTILLA // FUNCIONALIDADES CLAVE
            </div>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              fontFamily: 'Space Grotesk',
              margin: 0,
              color: 'var(--foreground)'
            }}>
              TODO LO QUE NECESITAS, <span style={{ color: 'var(--foreground-secondary)' }}>LISTO PARA USAR</span>
            </h2>
          </div>
        </motion.div>

        {/* Grid de features */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2px',
          background: 'var(--border)',
          border: '1px solid var(--border)',
        }}>
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
              style={{
                background: 'var(--background)',
                padding: '2.5rem',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'default',
                transition: 'background 0.3s ease',
              }}
              whileHover={{ background: 'rgba(99,102,241,0.02)' } as any}
            >
              {/* Icono */}
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{feature.icon}</div>

              {/* Tag */}
              <span style={{
                fontSize: '0.65rem',
                fontWeight: '700',
                letterSpacing: '0.2em',
                color: 'var(--primary)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.5rem',
              }}>
                {feature.tag}
              </span>

              {/* Título */}
              <h3 style={{
                fontSize: '1.1rem',
                fontFamily: 'Space Grotesk',
                fontWeight: '700',
                color: 'var(--foreground)',
                marginBottom: '0.75rem',
                lineHeight: '1.3',
              }}>
                {feature.title}
              </h3>

              {/* Descripción */}
              <p style={{
                fontSize: '0.875rem',
                color: 'var(--foreground-secondary)',
                lineHeight: '1.75',
                marginBottom: '1.5rem',
              }}>
                {feature.description}
              </p>

              {/* Beneficio destacado */}
              <div style={{
                borderTop: '1px solid var(--border)',
                paddingTop: '1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
              }}>
                <span style={{ color: 'var(--primary)', fontSize: '0.75rem', flexShrink: 0, marginTop: '1px' }}>▶</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--foreground)', fontWeight: '600', lineHeight: '1.4' }}>
                  {feature.benefit}
                </span>
              </div>

              {/* Glow de hover sutil */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 30% 50%, rgba(99,102,241,0.02) 0%, transparent 60%)',
                pointerEvents: 'none',
              }} />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          style={{ textAlign: 'center', marginTop: '4rem' }}
        >
          <a
            href="https://github.com/creadordesistemas/plantilla-blog-monetizable"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1.1rem 2.5rem',
              textDecoration: 'none',
              fontWeight: '800',
              fontSize: '0.8rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            ⭐ USAR ESTA PLANTILLA — GRATIS EN GITHUB
          </a>
          <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.8rem', marginTop: '1rem', fontFamily: 'monospace' }}>
            [ Open source · Licencia MIT · Sin costes ocultos ]
          </p>
        </motion.div>
      </div>
    </section>
  );
}
