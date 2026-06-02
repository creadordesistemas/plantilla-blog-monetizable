'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, Download, Play, Book, Code, X, Mail, AlertCircle } from 'lucide-react';

export default function CommunityPage() {
  const [community, setCommunity] = useState<any>({ priceMonthly: 49 });
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal de login de miembro
  const [loginOpen, setLoginOpen] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPassword, setMemberPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/community').then(res => res.json()),
      fetch('/api/admin/resources').then(res => res.json())
    ]).then(([commData, resData]) => {
      setCommunity(commData);
      setResources(Array.isArray(resData) ? resData : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('login') === 'true') {
        setLoginOpen(true);
      }
    }
  }, []);

  useEffect(() => {
    if (loginOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setMemberEmail('');
      setMemberPassword('');
      setLoginStatus('idle');
      setLoginError('');
    }
    return () => { document.body.style.overflow = ''; };
  }, [loginOpen]);

  const handleMemberLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberEmail.trim() || !memberPassword) return;
    setLoginStatus('loading');
    setLoginError('');
 
    try {
      const res = await fetch('/api/community/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: memberEmail.trim(), password: memberPassword })
      });
      const data = await res.json();
 
      if (res.ok && data.redirect) {
        window.location.href = data.redirect;
      } else {
        setLoginError(data.error || 'Error al validar el acceso');
        setLoginStatus('error');
      }
    } catch (err) {
      setLoginError('Error de conexión. Inténtalo de nuevo.');
      setLoginStatus('error');
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'curso': return <Play size={18} />;
      case 'automatizacion': return <Code size={18} />;
      case 'guia': return <Book size={18} />;
      default: return <Download size={18} />;
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: 'var(--background)', minHeight: '100vh', paddingTop: '120px' }}>

        {/* Hero Comunidad */}
        <section className="section-padding">
          <div className="container">
            <div style={{ borderLeft: '4px solid var(--primary)', paddingLeft: '32px', marginBottom: '60px' }}>
              <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', marginBottom: '1.5rem', fontFamily: 'Space Grotesk', fontWeight: '700' }}>
                ESPACIO <span style={{ color: 'var(--foreground-secondary)' }}>PRIVADO</span>
              </h1>
              {/* ✏️ PERSONALIZAR: describe qué encontrarán los miembros en tu comunidad */}
              <p className="text-secondary" style={{ maxWidth: '700px', fontSize: '1.2rem', lineHeight: '1.7', marginBottom: '2.5rem' }}>
                Un espacio exclusivo de conocimiento compartido. Accede a contenido premium, recursos descargables y debates solo disponibles para miembros activos.
              </p>
              <button
                onClick={() => setLoginOpen(true)}
                className="btn-outline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 2rem', fontSize: '0.85rem', border: '1px solid var(--border)', background: 'transparent', color: 'var(--primary)', cursor: 'pointer' }}
              >
                <Lock size={16} /> ACCESO MIEMBROS
              </button>
            </div>
          </div>
        </section>

        {/* Galería de Recursos */}
        <section className="section-padding" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <h2 style={{ fontSize: '1.5rem', fontFamily: 'Space Grotesk', marginBottom: '3rem', letterSpacing: '0.2em' }}>
              LIBRERÍA // RECURSOS_DISPONIBLES
            </h2>

            {loading ? (
              <div style={{ color: 'var(--foreground-secondary)', fontSize: '0.8rem', fontFamily: 'monospace' }}>SINCRONIZANDO RECURSOS...</div>
            ) : (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                gap: '1.5rem'
              }}>
                {resources.length > 0 ? resources.map((res: any) => (
                  <motion.div 
                    key={res.id}
                    whileHover={{ 
                      y: -4,
                      backgroundColor: 'var(--card-hover)',
                      borderColor: 'var(--card-hover-border)'
                    }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    style={{ 
                      padding: '2.5rem', 
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                      <div style={{ color: 'var(--foreground-secondary)', fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.2em' }}>
                        {res.category.toUpperCase()}
                      </div>
                      <div style={{ color: 'var(--foreground)' }}>{getIcon(res.category)}</div>
                    </div>

                    <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', fontFamily: 'Space Grotesk', color: 'var(--foreground)' }}>
                      {res.title}
                    </h3>
                    <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                      {res.description}
                    </p>

                    <div style={{ marginTop: 'auto' }}>
                      <button
                        onClick={() => setLoginOpen(true)}
                        className="btn-outline"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '0.7rem', padding: '12px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--foreground-secondary)', cursor: 'pointer' }}
                      >
                        <Lock size={14} /> ACCESO RESTRINGIDO
                      </button>
                    </div>
                  </motion.div>
                )) : (
                  <div style={{ padding: '5rem', textAlign: 'center', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)', gridColumn: 'span 3', color: 'var(--foreground-secondary)' }}>
                    No hay recursos desplegados todavía.
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Call to Action - Protocolo de Acceso */}
        <section className="section-padding" style={{ backgroundColor: 'var(--card-bg)', borderTop: '1px solid var(--border)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontFamily: 'Space Grotesk', color: 'var(--foreground)' }}>¿QUIERES ACCEDER A TODO EL CONTENIDO?</h2>
              <p className="text-secondary" style={{ marginBottom: '3rem', color: 'var(--foreground-secondary)' }}>
                {/* ✏️ PERSONALIZAR: describe los beneficios de unirse a tu comunidad */}
                Únete a la membresía y desbloquea el acceso completo a todo el contenido exclusivo, recursos y la comunidad privada.
              </p>
              <div style={{ fontSize: '4rem', fontWeight: '800', fontFamily: 'Space Grotesk', marginBottom: '3rem', border: '1px solid var(--border)', padding: '2rem', display: 'inline-block', color: 'var(--foreground)' }}>
                {community.priceMonthly || 49}€<span style={{ fontSize: '1rem', color: 'var(--foreground-secondary)' }}>/MES</span>
              </div>
              <br />
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href={community.stripeLink || '#'} className="btn-primary" style={{ padding: '1.2rem 3rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  UNIRME A LA COMUNIDAD <ArrowRight size={18} />
                </a>
                <button
                  onClick={() => setLoginOpen(true)}
                  style={{ padding: '1.2rem 3rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--foreground-secondary)', cursor: 'pointer', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Lock size={16} /> Ya soy miembro
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Modal de login de miembro */}
      <AnimatePresence>
        {loginOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setLoginOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', zIndex: 9998 }}
            />
            <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '2rem' }}>
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.97 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '2.5rem', width: 'min(440px, 100%)', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
              >
                <button
                  onClick={() => setLoginOpen(false)}
                  style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: 'var(--foreground-secondary)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}
                >
                  <X size={18} />
                </button>

                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.3em', color: 'var(--foreground-secondary)', marginBottom: '0.75rem' }}>
                    MEMBER // ACCESS_PROTOCOL
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', fontFamily: 'Space Grotesk', color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                    ACCESO DE MIEMBRO
                  </h2>
                  <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    Introduce tu email para acceder a la biblioteca privada y artículos exclusivos.
                  </p>
                </div>

                <form onSubmit={handleMemberLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.1em', color: 'var(--foreground-secondary)', textTransform: 'uppercase' }}>
                      Email de Miembro
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--background)', border: '1px solid var(--border)', padding: '0.75rem 1rem' }}>
                      <Mail size={16} color="var(--foreground-secondary)" />
                      <input
                        type="email"
                        placeholder="tu@email.com"
                        value={memberEmail}
                        onChange={e => setMemberEmail(e.target.value)}
                        autoFocus
                        required
                        style={{ background: 'transparent', border: 'none', color: 'var(--foreground)', fontSize: '0.9rem', width: '100%', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.1em', color: 'var(--foreground-secondary)', textTransform: 'uppercase' }}>
                      Contraseña
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--background)', border: '1px solid var(--border)', padding: '0.75rem 1rem' }}>
                      <Lock size={16} color="var(--foreground-secondary)" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={memberPassword}
                        onChange={e => setMemberPassword(e.target.value)}
                        required
                        style={{ background: 'transparent', border: 'none', color: 'var(--foreground)', fontSize: '0.9rem', width: '100%', outline: 'none' }}
                      />
                    </div>
                  </div>

                  {loginStatus === 'error' && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(255,68,68,0.05)', border: '1px solid rgba(255,68,68,0.3)', color: '#ff6666', fontSize: '0.85rem', lineHeight: '1.5' }}>
                      <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                      {loginError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loginStatus === 'loading'}
                    className="btn-primary"
                    style={{ padding: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: loginStatus === 'loading' ? 0.6 : 1, cursor: loginStatus === 'loading' ? 'not-allowed' : 'pointer' }}
                  >
                    {loginStatus === 'loading' ? 'Verificando acceso...' : 'Entrar al área privada →'}
                  </button>

                  <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--foreground-secondary)' }}>
                    ¿Aún no eres miembro?{' '}
                    <a href={community.stripeLink || '#'} style={{ color: 'var(--foreground)', textDecoration: 'underline' }}>Únete aquí</a>
                  </p>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
