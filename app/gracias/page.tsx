import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import ScrollToTop from '@/components/ScrollToTop';

export const metadata: Metadata = {
  title: 'Suscripción Confirmada | Mi Blog',
  description: 'Ya formas parte de nuestra comunidad. Recibirás contenido de valor directamente en tu bandeja de entrada.',
  robots: { index: false, follow: false }, // No indexar páginas de confirmación
};

export default function GraciasPage() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main style={{ backgroundColor: 'var(--background)', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <section style={{ width: '100%', padding: '120px 24px 80px' }}>
          <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>

            {/* Icono check */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '72px',
              height: '72px',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              marginBottom: '2.5rem',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            {/* Etiqueta */}
            <p style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.3em',
              color: 'var(--foreground-secondary)',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}>
              ACCESO CONCEDIDO // SISTEMA_ACTIVO
            </p>

            {/* Título */}
            <h1 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              marginBottom: '1.5rem',
              lineHeight: 1.1,
            }}>
              YA ESTÁS<br />
              <span style={{ color: 'var(--foreground-secondary)' }}>SUSCRITO</span>
            </h1>

            {/* Descripción */}
            <p style={{
              color: 'var(--foreground-secondary)',
              fontSize: '1.1rem',
              lineHeight: 1.75,
              marginBottom: '3rem',
              maxWidth: '480px',
              margin: '0 auto 3rem',
            }}>
              {/* ✏️ PERSONALIZAR: mensaje de bienvenida para nuevos suscriptores */}
              Revisa tu bandeja de entrada. Pronto recibirás contenido exclusivo seleccionado especialmente para ti.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/blog"
                className="btn-primary"
                style={{ padding: '1rem 2.5rem', textDecoration: 'none', fontWeight: 700 }}
              >
                LEER EL BLOG
              </Link>
              <Link
                href="/comunidad"
                style={{
                  padding: '1rem 2.5rem',
                  textDecoration: 'none',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                }}
              >
                VER LA COMUNIDAD
              </Link>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
