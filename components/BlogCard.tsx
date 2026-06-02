'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface BlogCardProps {
  titulo: string;
  extracto: string;
  categoria: string;
  slug: string;
  fecha?: string;
  exclusive?: boolean;
}

export default function BlogCard({ titulo, extracto, categoria, slug, fecha, exclusive }: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`} style={{ textDecoration: 'none' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ borderColor: 'var(--foreground)' }}
        style={{
          padding: '2.5rem',
          backgroundColor: 'var(--background)',
          border: '1px solid var(--border)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Badge de protocolo restringido */}
        {exclusive && (
          <div style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            fontSize: '0.55rem',
            fontWeight: '800',
            padding: '3px 8px',
            background: 'rgba(255, 215, 0, 0.06)',
            border: '1px solid rgba(255, 215, 0, 0.25)',
            color: '#b8962e',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            🔒 PROTOCOLO RESTRINGIDO
          </div>
        )}

        <div style={{
          fontSize: '0.65rem',
          fontWeight: '700',
          color: 'var(--foreground-secondary)',
          marginBottom: '1.5rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          paddingRight: exclusive ? '140px' : '0',
        }}>
          {categoria} {"//"} {fecha || 'RECENT_DEPLOY'}
        </div>

        <h3 style={{
          fontFamily: 'Space Grotesk',
          fontSize: '1.6rem',
          fontWeight: '700',
          marginBottom: '1.5rem',
          lineHeight: '1.3',
          color: 'var(--foreground)'
        }}>
          {titulo}
        </h3>

        <p className="text-secondary" style={{
          fontSize: '0.95rem',
          lineHeight: '1.7',
          marginBottom: '2rem',
          color: 'var(--foreground-secondary)'
        }}>
          {extracto}
        </p>

        <div style={{
          marginTop: 'auto',
          fontSize: '0.7rem',
          fontWeight: '700',
          letterSpacing: '0.1em',
          color: exclusive ? '#b8962e' : 'var(--foreground)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {exclusive ? '🔒 ACCESO MIEMBROS →' : 'LEER PROTOCOLO →'}
        </div>
      </motion.div>
    </Link>
  );
}
