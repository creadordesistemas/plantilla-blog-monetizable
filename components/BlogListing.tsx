'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlogCard from './BlogCard';
import Link from 'next/link';
import { BLOG_CATEGORIES, normalizeCategory } from '@/lib/categories';

interface Post {
  id: string;
  titulo: string;
  extracto: string;
  categoria: string;
  slug: string;
  fechaPublicacion?: string;
  state?: string;
  exclusive?: boolean;
  views?: number;
  image_url: string;
}

interface BlogListingProps {
  initialPosts: Post[];
}
const CATEGORIES = [
  'Todos',
  'Exclusivos',
  ...BLOG_CATEGORIES.map(c => c.label)
];

export default function BlogListing({ initialPosts }: BlogListingProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    fetch('/api/community/me?t=' + Date.now(), { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.member) {
          setIsMember(true);
        }
      })
      .catch(() => {});

    // Escuchar el evento de actualización de perfil en caliente
    const handleProfileUpdate = () => {
      fetch('/api/community/me?t=' + Date.now(), { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          setIsMember(!!(data.authenticated && data.member));
        })
        .catch(() => {});
    };

    window.addEventListener('profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('profile-updated', handleProfileUpdate);
  }, []);

  const sortedPosts = [...initialPosts].sort((a, b) => {
    const dateA = a.fechaPublicacion || '';
    const dateB = b.fechaPublicacion || '';
    return dateB.localeCompare(dateA);
  });

  const filteredPosts = sortedPosts.filter((post) => {
    if (selectedCategory === 'Todos') return true;
    if (selectedCategory === 'Exclusivos') return post.exclusive;
    return normalizeCategory(post.categoria) === selectedCategory;
  });

  const featuredPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1);
  const restrictedPosts = sortedPosts.filter(p => p.exclusive);
  const totalViews = sortedPosts.reduce((acc, p) => acc + (p.views || 0), 0);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '4rem', alignItems: 'start' }} className="blog-grid-layout">

      {/* ── COLUMNA IZQUIERDA: Listado principal ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

        {/* Filtros */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
          borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem'        }}>
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            const isExclusivos = category === 'Exclusivos';

            let buttonStyle: React.CSSProperties = {
              background: isActive ? 'var(--foreground)' : 'transparent',
              color: isActive ? 'var(--background)' : 'var(--foreground-secondary)',
              border: isActive ? '1px solid var(--foreground)' : '1px solid var(--border)',
              padding: '0.5rem 1.2rem',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-sans)',
              letterSpacing: '0.08em',
              borderRadius: '2px'
            };

            if (isExclusivos) {
              buttonStyle = {
                ...buttonStyle,
                borderColor: isActive ? '#b8962e' : 'rgba(184, 150, 46, 0.4)',
                background: isActive ? '#b8962e' : 'transparent',
                color: isActive ? '#000000' : '#b8962e',
              };
            }

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={buttonStyle}
                onMouseEnter={e => {
                  if (!isActive) {
                    if (isExclusivos) {
                      e.currentTarget.style.borderColor = '#b8962e';
                      e.currentTarget.style.background = 'rgba(184, 150, 46, 0.05)';
                    } else {
                      e.currentTarget.style.color = 'var(--foreground)';
                    }
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    if (isExclusivos) {
                      e.currentTarget.style.borderColor = 'rgba(184, 150, 46, 0.4)';
                      e.currentTarget.style.background = 'transparent';
                    } else {
                      e.currentTarget.style.color = 'var(--foreground-secondary)';
                    }
                  }
                }}
              >
                {isExclusivos ? `🔒 ${category.toUpperCase()}` : category.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* Artículos */}
        <div style={{ minHeight: '400px' }}>
          {filteredPosts.length === 0 ? (
            <div style={{
              color: 'var(--foreground-secondary)', padding: '6rem 2rem',
              textAlign: 'center', border: '1px dashed var(--border)',
              fontFamily: 'monospace', fontSize: '0.85rem'
            }}>
              [ Sin artículos en esta categoría ]
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', backgroundColor: 'var(--border)' }}>

              {/* Artículo Destacado */}
              {featuredPost && (
                <div style={{ backgroundColor: 'var(--background)', width: '100%' }}>
                  <Link href={`/blog/${featuredPost.slug}`} style={{ textDecoration: 'none' }}>
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        padding: '3rem', borderBottom: '1px solid var(--border)',
                        display: 'flex', flexDirection: 'column', gap: '1.5rem',
                        cursor: 'pointer', position: 'relative', overflow: 'hidden'
                      }}
                    >
                      {featuredPost.exclusive && (
                        <div style={{
                          position: 'absolute', top: '1.5rem', right: '1.5rem',
                          fontSize: '0.55rem', fontWeight: '800', padding: '3px 10px',
                          background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.2)',
                          color: '#b8962e', letterSpacing: '0.15em'
                        }}>
                          🔒 PROTOCOLO RESTRINGIDO
                        </div>
                      )}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '1rem',
                        fontSize: '0.7rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.25em'
                      }}>
                        <span style={{ border: '1px solid var(--primary)', padding: '2px 8px', borderRadius: '2px', textTransform: 'uppercase' }}>
                          {normalizeCategory(featuredPost.categoria)}
                        </span>
                        <span style={{ color: 'var(--foreground-secondary)' }}>
                          {featuredPost.fechaPublicacion || 'ARTÍCULO DESTACADO'}
                        </span>
                      </div>

                      <h2 style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                        fontWeight: '800', lineHeight: '1.15',
                        color: 'var(--foreground)', margin: 0, letterSpacing: '-0.02em'
                      }}>
                        {featuredPost.titulo}
                      </h2>

                      <p style={{
                        color: 'var(--foreground-secondary)', fontSize: '1.05rem',
                        lineHeight: '1.75', maxWidth: '700px', margin: 0
                      }}>
                        {featuredPost.extracto}
                      </p>

                      <div style={{
                        fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.1em',
                        color: featuredPost.exclusive ? '#b8962e' : 'var(--foreground)',
                        display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem'
                      }}>
                        {featuredPost.exclusive ? '🔒 ACCESO SOLO MIEMBROS →' : 'LEER PROTOCOLO DESTACADO →'}
                      </div>
                    </motion.div>
                  </Link>
                </div>
              )}

              {/* Grilla de artículos secundarios */}
              {gridPosts.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '2px', backgroundColor: 'var(--border)'
                }}>
                  <AnimatePresence mode="popLayout">
                    {gridPosts.map((post, idx) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.35, delay: idx * 0.05 }}
                        style={{ backgroundColor: 'var(--background)' }}
                      >
                        <BlogCard
                          titulo={post.titulo}
                          extracto={post.extracto}
                          categoria={normalizeCategory(post.categoria)}
                          slug={post.slug}
                          fecha={post.fechaPublicacion}
                          exclusive={post.exclusive}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

            </div>
          )}
        </div>
      </div>

      <aside style={{ display: 'flex', flexDirection: 'column', gap: '2px', position: 'sticky', top: '120px' }}>

        {/* Widget de membresía o bienvenida */}
        {isMember ? (
          <div style={{
            padding: '2rem', background: 'linear-gradient(135deg, rgba(184, 150, 46, 0.08) 0%, rgba(184, 150, 46, 0.02) 100%)',
            border: '1px solid #b8962e',
            display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.3em', color: '#b8962e' }}>
              SESIÓN // MIEMBRO_ACTIVO
            </div>
            <h3 style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem',
              fontWeight: '800', color: '#b8962e', lineHeight: '1.3', margin: 0
            }}>
              Acceso Ilimitado Activado
            </h3>
            <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.82rem', lineHeight: '1.6', margin: 0 }}>
              Dispones de acceso completo a todos los protocolos de arquitectura, automatizaciones y debates de miembros.
            </p>
            <Link href="/comunidad/privado" style={{
              display: 'block', padding: '0.85rem 1rem', background: '#b8962e', color: '#000',
              textDecoration: 'none', fontSize: '0.75rem', fontWeight: '800',
              letterSpacing: '0.1em', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif'
            }}>
              IR AL ÁREA PRIVADA →
            </Link>
          </div>
        ) : (
          <div style={{
            padding: '2rem', background: '#080808', border: '1px solid #161616',
            display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.025,
              backgroundImage: 'repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 20px)',
              pointerEvents: 'none'
            }} />
            <div style={{ fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.3em', color: '#555' }}>
              COMUNIDAD // ACCESO_ÉLITE
            </div>
            <h3 style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem',
              fontWeight: '800', color: '#fff', lineHeight: '1.3', margin: 0
            }}>
              Accede a los protocolos restringidos
            </h3>
            <p style={{ color: '#555', fontSize: '0.82rem', lineHeight: '1.6', margin: 0 }}>
              {restrictedPosts.length} artículos exclusivos disponibles solo para miembros activos de la comunidad.
            </p>
            <Link href="/comunidad" style={{
              display: 'block', padding: '0.85rem 1rem', background: '#fff', color: '#000',
              textDecoration: 'none', fontSize: '0.75rem', fontWeight: '800',
              letterSpacing: '0.1em', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif'
            }}>
              UNIRSE A LA COMUNIDAD →
            </Link>
            <Link href="/comunidad?login=true" style={{
              display: 'block', textAlign: 'center', fontSize: '0.75rem',
              color: '#444', textDecoration: 'none', letterSpacing: '0.05em'
            }}>
              Ya soy miembro → Iniciar sesión
            </Link>
          </div>
        )}

        {/* Estadísticas */}
        <div style={{ padding: '1.75rem', background: '#080808', border: '1px solid #111' }}>
          <div style={{ fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.25em', color: '#444', marginBottom: '1.25rem' }}>
            ESTADÍSTICAS // ALCANCE_REAL
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'ARTÍCULOS PUBLICADOS', value: sortedPosts.length },
              { label: 'LECTURAS TOTALES', value: totalViews.toLocaleString() },
              { label: 'PROTOCOLOS RESTRINGIDOS', value: restrictedPosts.length },
            ].map(stat => (
              <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.65rem', color: '#444', letterSpacing: '0.08em', fontFamily: 'monospace' }}>
                  {stat.label}
                </span>
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Lista de protocolos restringidos */}
        {restrictedPosts.length > 0 && (
          <div style={{ padding: '1.75rem', background: '#080808', border: '1px solid #111' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.25em', color: '#555', marginBottom: '1.25rem' }}>
              🔒 PROTOCOLOS RESTRINGIDOS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#111' }}>
              {restrictedPosts.slice(0, 5).map(post => (
                <Link key={post.id} href={isMember ? `/blog/${post.slug}` : "/comunidad?login=true"} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                  padding: '1rem', background: '#090909', textDecoration: 'none',
                  transition: 'background 0.2s'
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#0f0f0f'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#090909'; }}
                >
                  <span style={{ fontSize: '0.8rem', flexShrink: 0, marginTop: '1px' }}>🔒</span>
                  <span style={{
                    fontSize: '0.78rem', fontWeight: '600', color: isMember ? 'var(--foreground)' : '#555',
                    lineHeight: '1.4', fontFamily: 'Inter, sans-serif'
                  }}>
                    {post.titulo}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </aside>

      <style>{`
        @media (max-width: 900px) {
          .blog-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
