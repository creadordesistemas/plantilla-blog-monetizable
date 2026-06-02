'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { getPublicSettings } from '@/app/actions';
import staticSettings from '@/data/settings.json';

const navItems = [
  { label: 'Blog', href: '/blog' },
  { label: 'Comunidad', href: '/comunidad' },
];

interface MemberSession {
  name: string;
  email: string;
  avatar_url: string | null;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
}

function MemberAvatar({ name, avatar_url, size = 34 }: { name: string; avatar_url: string | null; size?: number }) {
  const initials = getInitials(name);
  const fontSize = size * 0.38;

  if (avatar_url) {
    return (
      <img
        src={avatar_url}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid var(--border)',
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--foreground) 0%, var(--foreground-secondary) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize,
        fontWeight: '800',
        fontFamily: 'Space Grotesk, sans-serif',
        color: 'var(--background)',
        letterSpacing: '-0.02em',
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {initials || '??'}
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [member, setMember] = useState<MemberSession | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<any>(staticSettings);

  useEffect(() => {
    getPublicSettings().then(data => {
      if (data) setSettings((prev: any) => ({ ...prev, ...data }));
    });
  }, []);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detectar sesión de miembro
  useEffect(() => {
    fetch('/api/community/me?t=' + Date.now(), { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.member) {
          setMember(data.member);
        } else {
          setMember(null);
        }
      })
      .catch(() => {
        setMember(null);
      });
  }, []);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/community/logout');
      setMember(null);
      setDropdownOpen(false);
      setMenuOpen(false);
      window.location.href = '/comunidad';
    } catch {
      setLoggingOut(false);
    }
  };

  // Generar nav items dinámicos según sesión
  const dynamicNavItems = navItems.map(item => {
    if (item.label === 'Comunidad' && member && mounted) {
      return { ...item, href: '/comunidad/privado' };
    }
    return item;
  });

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}

        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: scrolled ? '0.8rem 0' : '1.5rem 0',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          backgroundColor: scrolled ? 'var(--navbar-bg)' : 'transparent',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none'
        }}
      >
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          gap: '1rem'
        }}>
          {/* Logo — dinámico desde data/settings.json → Admin → Settings */}
          <Link href="/" style={{
            fontWeight: '700',
            fontSize: '1.2rem',
            letterSpacing: '-0.03em',
            color: 'var(--foreground)',
            textDecoration: 'none',
            fontFamily: 'Space Grotesk',
            whiteSpace: 'nowrap'
          }}>
            {(() => {
              const name = (settings.siteName || 'MI BLOG').toUpperCase();
              const parts = name.split(' ');
              if (parts.length === 1) return name;
              const first = parts[0];
              const rest = parts.slice(1).join(' ');
              return <>{first}<span style={{ color: 'var(--foreground-secondary)' }}>{rest}</span></>;
            })()}
          </Link>

          {/* Desktop links */}
          <div className="nav-links">
            {dynamicNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  color: 'var(--foreground-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--foreground-secondary)')}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA / Profile */}
          <div className="nav-cta" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <ThemeToggle />

            {mounted && member ? (
              /* ── Menú de perfil del miembro ── */
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-label="Menú de perfil"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    background: 'none',
                    border: '1px solid var(--border)',
                    borderRadius: '100px',
                    padding: '4px 12px 4px 4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: 'var(--foreground)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--foreground-secondary)'; }}
                  onMouseLeave={e => { if (!dropdownOpen) e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  <MemberAvatar name={member.name} avatar_url={member.avatar_url} size={30} />
                  <ChevronDown
                    size={14}
                    style={{
                      transition: 'transform 0.2s ease',
                      transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      color: 'var(--foreground-secondary)',
                    }}
                  />
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 10px)',
                        right: 0,
                        width: '280px',
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border)',
                        boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
                        zIndex: 1001,
                        overflow: 'hidden',
                      }}
                    >
                      {/* Info del miembro */}
                      <div style={{
                        padding: '1.25rem 1.25rem 1rem',
                        borderBottom: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                      }}>
                        <MemberAvatar name={member.name} avatar_url={member.avatar_url} size={40} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{
                            fontFamily: 'Space Grotesk, sans-serif',
                            fontWeight: '700',
                            fontSize: '0.9rem',
                            color: 'var(--foreground)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            {member.name}
                          </div>
                          <div style={{
                            fontSize: '0.72rem',
                            color: 'var(--foreground-secondary)',
                            fontFamily: 'monospace',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            {member.email}
                          </div>
                        </div>
                      </div>

                      {/* Opciones del menú */}
                      <div style={{ padding: '0.5rem 0' }}>
                        <Link
                          href="/comunidad/privado"
                          onClick={() => setDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.7rem 1.25rem',
                            color: 'var(--foreground-secondary)',
                            textDecoration: 'none',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = 'var(--background)';
                            e.currentTarget.style.color = 'var(--foreground)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--foreground-secondary)';
                          }}
                        >
                          <LayoutDashboard size={16} />
                          Área privada
                        </Link>

                        <button
                          onClick={handleLogout}
                          disabled={loggingOut}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.7rem 1.25rem',
                            width: '100%',
                            background: 'none',
                            border: 'none',
                            color: 'var(--foreground-secondary)',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: loggingOut ? 'wait' : 'pointer',
                            transition: 'all 0.15s ease',
                            textAlign: 'left',
                            fontFamily: 'inherit',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,68,68,0.06)';
                            e.currentTarget.style.color = '#ff4444';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--foreground-secondary)';
                          }}
                        >
                          <LogOut size={16} />
                          {loggingOut ? 'Cerrando...' : 'Cerrar sesión'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* ── Botón ACCESO (sin sesión) ── */
              <Link href="/comunidad" className="btn-primary" style={{
                padding: '8px 20px',
                fontSize: '0.7rem',
                textDecoration: 'none',
                whiteSpace: 'nowrap'
              }}>
                ACCESO
              </Link>
            )}
          </div>

          {/* Mobile: controls */}
          <div className="nav-mobile-controls" style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <ThemeToggle />
            {mounted && member ? (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menú de perfil"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                }}
              >
                <MemberAvatar name={member.name} avatar_url={member.avatar_url} size={32} />
              </button>
            ) : (
              <Link href="/blog" style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: 'var(--foreground)',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                textDecoration: 'none'
              }}>
                BLOG
              </Link>
            )}
            <button
              className="nav-burger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Abrir menú"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--foreground)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex'
              }}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'var(--drawer-bg)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2.5rem',
            }}
          >
            {dynamicNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  fontFamily: 'Space Grotesk',
                  color: 'var(--foreground)',
                  textDecoration: 'none',
                  letterSpacing: '-0.02em',
                }}
              >
                {item.label}
              </Link>
            ))}

            {mounted && member ? (
              /* ── Mobile: Perfil del miembro ── */
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.25rem',
                marginTop: '1rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--border)',
                width: '240px',
              }}>
                <MemberAvatar name={member.name} avatar_url={member.avatar_url} size={52} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: '700',
                    fontSize: '1rem',
                    color: 'var(--foreground)',
                  }}>
                    {member.name}
                  </div>
                  <div style={{
                    fontSize: '0.72rem',
                    color: 'var(--foreground-secondary)',
                    fontFamily: 'monospace',
                    marginTop: '0.25rem',
                  }}>
                    {member.email}
                  </div>
                </div>
                <Link
                  href="/comunidad/privado"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary"
                  style={{
                    padding: '12px 32px',
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <LayoutDashboard size={16} /> ÁREA PRIVADA
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  style={{
                    padding: '10px 32px',
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    letterSpacing: '0.1em',
                    cursor: loggingOut ? 'wait' : 'pointer',
                    fontFamily: 'Space Grotesk, sans-serif',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s',
                  }}
                >
                  <LogOut size={16} />
                  {loggingOut ? 'CERRANDO...' : 'CERRAR SESIÓN'}
                </button>
              </div>
            ) : (
              <Link
                href="/comunidad"
                onClick={() => setMenuOpen(false)}
                className="btn-primary"
                style={{
                  padding: '14px 40px',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  marginTop: '1rem'
                }}
              >
                ACCESO
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .nav-links {
          display: flex;
          gap: 2.5rem;
          align-items: center;
        }
        .nav-burger {
          display: flex;
        }
        @media (max-width: 768px) {
          .nav-links {
            display: none !important;
          }
          .nav-cta {
            display: none !important;
          }
          .nav-mobile-controls {
            display: flex !important;
          }
        }
      ` }} />
    </>
  );
}
