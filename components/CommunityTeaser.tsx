import Link from 'next/link';

export default function CommunityTeaser() {
  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--card-bg)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
          ÚNETE A LA <span style={{ color: 'var(--foreground-secondary)' }}>COMUNIDAD</span>
        </h2>
        <p className="text-secondary" style={{ fontSize: '1.2rem', marginBottom: '2.5rem', lineHeight: '1.8' }}>
          {/* ✏️ PERSONALIZAR: describe qué recibirán los miembros de tu comunidad */}
          La plantilla incluye un <strong>sistema de membresía premium completo</strong>. Configura tu propio precio mensual en el panel, conecta tu enlace de Stripe y ofrece contenido exclusivo, recursos descargables y artículos restringidos para monetizar tu audiencia de forma recurrente.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/comunidad" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1rem', textDecoration: 'none' }}>
            ACCEDER AHORA
          </Link>
          <Link href="/blog" className="btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1rem', textDecoration: 'none' }}>
            LEER EL BLOG
          </Link>
        </div>
      </div>
    </section>
  );
}
