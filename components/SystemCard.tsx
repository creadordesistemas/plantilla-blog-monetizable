'use client';

import { motion } from 'framer-motion';

interface SystemCardProps {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  stripeLink?: string;
  type?: 'tool' | 'generic';
  onInterested?: () => void;
}

export default function SystemCard({ name, description, price, imageUrl, stripeLink, type = 'tool', onInterested }: SystemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card"
      style={{
        padding: '0',
        backgroundColor: 'var(--background)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'border-color 0.3s'
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      {/* Banner / Imagen */}
      <div style={{
        width: '100%',
        height: '200px',
        backgroundColor: '#111',
        backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.7rem',
        color: '#333',
        letterSpacing: '0.2em'
      }}>
        {!imageUrl && 'NO_IMAGE_PROTOCOL'}
      </div>

      <div style={{ padding: '2.5rem' }}>
        <div style={{ 
          color: 'var(--foreground-secondary)', 
          fontSize: '0.65rem', 
          fontWeight: '700', 
          marginBottom: '1rem', 
          letterSpacing: '0.3em',
          textTransform: 'uppercase'
        }}>
          SISTEMA // PROTOCOLO_ACTIVO
        </div>
        
        <h3 style={{ 
          fontFamily: 'Space Grotesk', 
          fontSize: '1.5rem', 
          fontWeight: '700', 
          marginBottom: '1rem',
          textTransform: 'uppercase'
        }}>
          {name}
        </h3>

        <p className="text-secondary" style={{ 
          fontSize: '0.95rem', 
          lineHeight: '1.6', 
          marginBottom: '2.5rem',
          minHeight: '80px'
        }}>
          {description}
        </p>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: 'auto',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'Space Grotesk' }}>
            {price > 0 ? `${price}€` : 'A consultar'}
          </div>
          
          {type === 'generic' ? (
            <button 
              onClick={onInterested}
              className="btn-primary" 
              style={{ 
                padding: '10px 25px', 
                fontSize: '0.75rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              ME INTERESA
            </button>
          ) : (
            <a 
              href={stripeLink || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary" 
              style={{ 
                padding: '10px 25px', 
                fontSize: '0.75rem',
                textDecoration: 'none'
              }}
            >
              ADQUIRIR SISTEMA
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
