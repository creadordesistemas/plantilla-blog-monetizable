'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatCardProps {
  number: string;
  title: string;
  description: string;
  icon?: ReactNode;
}

export default function StatCard({ number, title, description, icon }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ backgroundColor: 'var(--card-bg)' }}
      style={{
        padding: '4rem 3rem',
        backgroundColor: 'var(--background)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Fondo de cuadrícula técnica */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        opacity: 0.1,
        pointerEvents: 'none'
      }} />

      {/* Número con gradiente */}
      <div style={{
        color: 'var(--foreground-secondary)',
        fontSize: '0.7rem',
        fontWeight: '700',
        marginBottom: '2rem',
        letterSpacing: '0.4em',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <span style={{ 
          color: 'var(--foreground)', 
          fontSize: '1.2rem', 
          fontFamily: 'Space Grotesk',
          background: 'linear-gradient(180deg, var(--foreground) 0%, var(--foreground-secondary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>{number}</span>
        <span style={{ color: 'var(--foreground-secondary)', fontSize: '0.6rem', letterSpacing: '0.3em' }}>PROTOCOL</span>
      </div>

      <h3 style={{ 
        fontFamily: 'Space Grotesk', 
        fontSize: '1.8rem', 
        marginBottom: '1.5rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '-0.02em'
      }}>
        {title}
      </h3>

      <p className="text-secondary" style={{ 
        lineHeight: '1.7', 
        fontSize: '1rem',
        color: 'var(--foreground-secondary)'
      }}>
        {description}
      </p>

      {/* Brillo en la esquina al hacer hover */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.1 }}
        style={{
          position: 'absolute',
          bottom: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, var(--foreground) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />
    </motion.div>
  );
}
