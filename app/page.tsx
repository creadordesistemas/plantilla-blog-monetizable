import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import FAQ from '@/components/FAQ';
import AboutMe from '@/components/AboutMe';
import CommunityTeaser from '@/components/CommunityTeaser';
import FeatureShowcase from '@/components/FeatureShowcase';
import { readData } from '@/services/db';
import BlogCard from '@/components/BlogCard';
import Link from 'next/link';

export default async function Home() {
  const allPosts = await readData<any[]>('blog').catch(() => []);
  const recentPosts = Array.isArray(allPosts)
    ? allPosts
        .filter((post: any) => !post.state || post.state === 'publicado')
        .map((post: any) => ({ ...post, exclusive: !!post.exclusive }))
        .slice(0, 3)
    : [];

  return (
    <>
      <Navbar />
      <main>
        <Hero />

        {/* Sección explicativa morada — para qué sirve cada parte del blog */}
        <FeatureShowcase />

        {/* Sobre mí - Sección de Historia y Autoridad */}
        <AboutMe />

        {/* Comunidad Teaser */}
        <CommunityTeaser />

        {/* Últimas Publicaciones - Interlinking de Alto Impacto para Googlebot */}
        {recentPosts.length > 0 && (
          <section className="section-padding" style={{ backgroundColor: 'var(--background)', borderTop: '1px solid var(--border)', paddingBottom: '80px', position: 'relative', overflow: 'hidden' }}>
            <div className="container">
              <div style={{ marginBottom: '60px', borderLeft: '4px solid var(--primary)', paddingLeft: '24px' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.3em', color: 'var(--foreground-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  BLOG // PUBLICACIONES RECIENTES
                </div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'Space Grotesk', margin: 0 }}>
                  ÚLTIMOS <span style={{ color: 'var(--foreground-secondary)' }}>ARTÍCULOS</span>
                </h2>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
              }}>
                {recentPosts.map((post: any) => (
                  <BlogCard
                    key={post.slug}
                    titulo={post.titulo}
                    extracto={post.extracto}
                    categoria={post.categoria || 'General'}
                    slug={post.slug}
                    fecha={post.fechaPublicacion}
                    exclusive={!!post.exclusive}
                  />
                ))}
              </div>
              
              <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <Link href="/blog" className="btn-outline" style={{ display: 'inline-flex', padding: '1rem 2rem', textDecoration: 'none', letterSpacing: '0.1em', fontWeight: 700, fontSize: '0.8rem' }}>
                  VER TODOS LOS ARTÍCULOS →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* FAQ - Acordeón SEO */}
        <FAQ />

        {/* Newsletter */}
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}

