'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Newsletter() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setEmail('');
        router.push('/gracias');
      } else {
        setStatus('error');
        setMessage(data.error || 'ERROR DE PROTOCOLO. REINTENTE.');
      }
    } catch {
      setStatus('error');
      setMessage('ERROR DE CONEXIÓN.');
    }
  };

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--background)' }}>
      <div className="container">
        <motion.div
          className="card newsletter-card"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            padding: '100px 40px',
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'var(--card-bg)',
          }}
        >
          <h3 style={{
            fontSize: '2.5rem',
            marginBottom: '1.5rem',
            fontFamily: 'Space Grotesk',
            fontWeight: '700'
          }}>
            NEWSLETTER <span style={{ color: 'var(--foreground-secondary)' }}>SEMANAL</span>
          </h3>
          <p style={{
            color: 'var(--foreground-secondary)',
            marginBottom: '3rem',
            maxWidth: '500px',
            lineHeight: '1.7',
          }}>
            Recibe el mejor contenido directamente en tu correo. Sin spam, sin algoritmos. Solo lo que merece tu atención.
          </p>

          <form onSubmit={handleSubmit} className="newsletter-form">
            <input
              type="email"
              placeholder="TU CORREO ELECTRÓNICO"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === 'loading' || status === 'success'}
              className="newsletter-input"
            />
            <button
              className="btn-primary newsletter-btn"
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              aria-label="Suscribirse al newsletter"
            >
              {status === 'loading' ? (
                <span className="newsletter-spinner" aria-hidden="true" />
              ) : (
                'SUSCRIBIRTE'
              )}
            </button>
          </form>

          <AnimatePresence mode="wait">
            {message && (
              <motion.p
                key={message}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className={`newsletter-message ${status}`}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .newsletter-form {
          display: flex;
          width: 100%;
          max-width: 500px;
          border: 1px solid var(--border);
        }
        .newsletter-input {
          flex: 1;
          min-width: 0;
          padding: 1.2rem 1.5rem;
          border: none;
          background: transparent;
          color: var(--foreground);
          font-family: Inter, sans-serif;
          font-size: 0.8rem;
          outline: none;
        }
        .newsletter-input::placeholder {
          color: var(--foreground-secondary);
          opacity: 0.7;
        }
        .newsletter-btn {
          flex-shrink: 0;
          padding: 0 1.5rem;
          border: none;
          border-left: 1px solid var(--border);
          white-space: nowrap;
          box-sizing: border-box;
          min-width: 130px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .newsletter-message {
          margin-top: 2rem;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
        }
        .newsletter-message.success {
          color: var(--foreground);
        }
        .newsletter-message.error {
          color: var(--foreground-secondary);
          border-left: 2px solid #cc0000;
          padding-left: 0.75rem;
        }

        /* Spinner */
        .newsletter-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid var(--secondary);
          border-top-color: transparent;
          border-radius: 50%;
          animation: nl-spin 0.7s linear infinite;
        }
        @keyframes nl-spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 600px) {
          .newsletter-card {
            padding: 60px 20px !important;
          }
          .newsletter-form {
            flex-direction: column;
            border: none;
            box-sizing: border-box;
          }
          .newsletter-input {
            padding: 1rem;
            border: 1px solid var(--border);
            border-bottom: none;
            width: 100%;
            box-sizing: border-box;
          }
          .newsletter-btn {
            border: 1px solid var(--border);
            padding: 1rem;
            width: 100%;
            box-sizing: border-box;
            min-width: unset;
          }
        }
      ` }} />
    </section>
  );
}
