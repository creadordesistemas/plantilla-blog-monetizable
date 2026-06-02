/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Settings, X, Camera, Loader } from 'lucide-react';

interface Member {
  name: string;
  email: string;
  created_at: string;
  avatar_url?: string | null;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
}

function MemberAvatar({ name, avatar_url, size = 64 }: { name: string; avatar_url?: string | null; size?: number }) {
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

interface Resource {
  id: string;
  name?: string;
  titulo?: string;
  description?: string;
  descripcion?: string;
  url?: string;
  type?: string;
  tipo?: string;
}

interface Post {
  id: string;
  titulo: string;
  extracto?: string;
  slug: string;
  categoria?: string;
  fechaPublicacion?: string;
  image_url: string;
}

interface PrivateAreaClientProps {
  member: Member;
  resources: Resource[];
  exclusivePosts: Post[];
  freePosts: Post[];
}

export default function PrivateAreaClient({ member, resources, exclusivePosts, freePosts }: PrivateAreaClientProps) {
  const [supportForm, setSupportForm] = useState({ asunto: '', mensaje: '' });
  const [supportStatus, setSupportStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  // Ajustes de perfil
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(member);
  const [editName, setEditName] = useState(member.name);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const memberSince = currentMember.created_at
    ? new Date(currentMember.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
    : 'Miembro activo';

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSupportStatus('sending');
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: currentMember.name,
          email: currentMember.email,
          serviceType: 'soporte-miembro',
          webActual: '',
          presupuesto: '',
          descripcion: `[CONSULTA ÉLITE]\nAsunto: ${supportForm.asunto}\n\n${supportForm.mensaje}`,
        }),
      });
      if (res.ok) {
        setSupportStatus('sent');
        setSupportForm({ asunto: '', mensaje: '' });
      } else {
        setSupportStatus('error');
      }
    } catch {
      setSupportStatus('error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const formData = new FormData();
      formData.append('nombre', editName);
      if (selectedFile) {
        formData.append('avatarFile', selectedFile);
      }

      const res = await fetch('/api/community/update-profile', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setUpdateError(data.error || 'Error al guardar los cambios');
      } else {
        setCurrentMember(data.member);
        setUpdateSuccess(true);
        setTimeout(() => {
          setSettingsOpen(false);
          // Disparar evento para que el Navbar actualice su sesión
          window.dispatchEvent(new Event('profile-updated'));
        }, 1200);
      }
    } catch {
      setUpdateError('Error de conexión con el servidor');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <main style={{ backgroundColor: 'var(--background)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        {/* ── CABECERA DEL MIEMBRO ── */}
        <header style={{ marginBottom: '4rem', paddingBottom: '3rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.35em', color: 'var(--foreground-secondary)', marginBottom: '1rem' }}>
            PROTOCOLO_ACTIVO // SESIÓN_VERIFICADA
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <MemberAvatar name={currentMember.name} avatar_url={currentMember.avatar_url} size={72} />
              <div>
                <h1 style={{
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: '800', color: 'var(--foreground)', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1
                }}>
                  BIENVENIDO,{' '}
                  <span style={{ color: 'var(--foreground-secondary)' }}>
                    {currentMember.name.toUpperCase()}
                  </span>
                </h1>
                <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.85rem', marginTop: '1rem', fontFamily: 'monospace' }}>
                  {currentMember.email} &nbsp;•&nbsp; Miembro desde {memberSince} &nbsp;•&nbsp;
                  <span style={{ color: '#00ff41' }}>● ACTIVO</span>
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setEditName(currentMember.name);
                  setPreviewUrl(null);
                  setSelectedFile(null);
                  setUpdateError(null);
                  setUpdateSuccess(false);
                  setSettingsOpen(true);
                }}
                style={{
                  padding: '0.6rem 1.5rem', background: 'var(--foreground)',
                  border: 'none', color: 'var(--background)', fontSize: '0.75rem',
                  fontWeight: '800', letterSpacing: '0.1em', fontFamily: 'monospace',
                  cursor: 'pointer', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '0.5rem'
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
              >
                ⚙ AJUSTES DE PERFIL
              </button>

              <a
                href="/api/community/logout"
                style={{
                  padding: '0.6rem 1.5rem', background: 'transparent',
                  border: '1px solid var(--border)', color: 'var(--foreground-secondary)', fontSize: '0.75rem',
                  letterSpacing: '0.1em', textDecoration: 'none', fontFamily: 'monospace',
                  transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '0.5rem'
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#ff4444'; (e.currentTarget as HTMLElement).style.color = '#ff4444'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--foreground-secondary)'; }}
              >
                ⏻ CERRAR SESIÓN
              </a>
            </div>
          </div>
        </header>

        {/* Stats rápidas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1px', marginTop: '2.5rem', background: 'var(--border)' }}>
            {[
              { label: 'RECURSOS ACTIVOS', value: resources.length },
              { label: 'PROTOCOLOS EXCLUSIVOS', value: exclusivePosts.length },
              { label: 'ESTADO', value: 'ACTIVO' },
              { label: 'NIVEL', value: 'ÉLITE' },
            ].map(stat => (
              <div key={stat.label} style={{ padding: '1.5rem', background: 'var(--card-bg)', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.75rem', fontWeight: '800', color: 'var(--foreground)', marginBottom: '0.25rem' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.55rem', fontWeight: '700', letterSpacing: '0.2em', color: 'var(--foreground-secondary)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

        {/* ── GRID PRINCIPAL ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }} className="private-main-grid">

          {/* ── LIBRERÍA DE RECURSOS ── */}
          <section style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div>
              <div style={{ fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.3em', color: 'var(--foreground-secondary)', marginBottom: '0.5rem' }}>
                LIBRERÍA // RECURSOS_ACTIVOS
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.3rem', fontWeight: '800', color: 'var(--foreground)', margin: 0 }}>
                TUS RECURSOS
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
              {resources.length === 0 ? (
                <div style={{ padding: '3rem', border: '1px solid var(--border)', borderRadius: '2px', textAlign: 'center', color: 'var(--foreground-secondary)', fontSize: '0.8rem', fontFamily: 'monospace', background: 'var(--background)' }}>
                  [ Recursos en preparación — disponibles próximamente ]
                </div>
              ) : (
                resources.map((r) => (
                  <div 
                    key={r.id} 
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '1.25rem 1.5rem', background: 'var(--background)', border: '1px solid var(--border)', gap: '1rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-hover-border)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--foreground)', marginBottom: '0.2rem', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                        {r.titulo || r.name || 'Recurso'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--foreground-secondary)', fontFamily: 'monospace' }}>
                        {(r.tipo || r.type || 'ARCHIVO').toUpperCase()}
                      </div>
                    </div>
                    {r.url ? (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '0.5rem 1rem', background: 'var(--primary)', color: 'var(--secondary)',
                          fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.1em',
                          textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif',
                          flexShrink: 0, whiteSpace: 'nowrap'
                        }}
                      >
                        DESCARGAR →
                      </a>
                    ) : (
                      <span style={{
                        padding: '0.5rem 1rem', background: 'var(--card-bg)', color: 'var(--foreground-secondary)',
                        fontSize: '0.65rem', letterSpacing: '0.1em', fontFamily: 'monospace', flexShrink: 0,
                        border: '1px solid var(--border)'
                      }}>
                        PRÓXIMAMENTE
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          {/* ── ARTÍCULOS EXCLUSIVOS ── */}
          <section style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div>
              <div style={{ fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.3em', color: '#b8962e', marginBottom: '0.5rem' }}>
                🔒 PROTOCOLOS // EXCLUSIVOS_MIEMBROS
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.3rem', fontWeight: '800', color: 'var(--foreground)', margin: 0 }}>
                CONTENIDO EXCLUSIVO
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
              {exclusivePosts.length === 0 ? (
                <div style={{ padding: '3rem', border: '1px solid var(--border)', borderRadius: '2px', textAlign: 'center', color: 'var(--foreground-secondary)', fontSize: '0.8rem', fontFamily: 'monospace', background: 'var(--background)' }}>
                  [ Protocolos exclusivos en preparación ]
                </div>
              ) : (
                exclusivePosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      padding: '1.25rem 1.5rem', background: 'var(--background)',
                      border: '1px solid var(--border)',
                      transition: 'all 0.2s ease', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', gap: '0.3rem'
                    }}
                      onMouseEnter={e => { 
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--card-hover)'; 
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-hover-border)'; 
                      }}
                      onMouseLeave={e => { 
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--background)'; 
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; 
                      }}
                    >
                      <div style={{ fontSize: '0.55rem', color: '#b8962e', fontWeight: '700', letterSpacing: '0.15em' }}>
                        {(post.categoria || 'SISTEMAS').toUpperCase()} {"//"} {post.fechaPublicacion || ''}
                      </div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--foreground)', lineHeight: '1.3' }}>
                        {post.titulo}
                      </div>
                      {post.extracto && (
                        <div style={{
                          fontSize: '0.78rem', color: 'var(--foreground-secondary)', lineHeight: '1.5',
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                        }}>
                          {post.extracto}
                        </div>
                      )}
                      <div style={{ fontSize: '0.65rem', color: '#b8962e', fontWeight: '700', marginTop: '0.25rem' }}>
                        LEER PROTOCOLO →
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Feed de artículos libres recientes */}
            {freePosts.length > 0 && (
              <div>
                <div style={{ fontSize: '0.55rem', fontWeight: '700', letterSpacing: '0.2em', color: 'var(--foreground-secondary)', marginBottom: '0.75rem' }}>
                  TAMBIÉN RECIENTES
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {freePosts.map(post => (
                    <Link key={post.id} href={`/blog/${post.slug}`} style={{
                      fontSize: '0.78rem', color: 'var(--foreground-secondary)', textDecoration: 'none',
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      transition: 'color 0.2s'
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--foreground)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--foreground-secondary)'; }}
                    >
                      <span style={{ color: 'var(--foreground-secondary)' }}>→</span>
                      {post.titulo}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* ── CONSULTA ÉLITE / SOPORTE ── */}
        <section style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '2.5rem', marginTop: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }} className="support-grid">
            <div>
              <div style={{ fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.3em', color: '#00ff41', marginBottom: '0.5rem' }}>
                SOPORTE // PRIORIDAD_ÉLITE
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.3rem', fontWeight: '800', color: 'var(--foreground)', margin: '0 0 1rem' }}>
                CONSULTA DIRECTA
              </h2>
              <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.9rem', lineHeight: '1.7', margin: 0 }}>
                Como miembro activo tienes acceso a soporte técnico prioritario. Tu consulta entra directamente al pipeline de atención preferencial, sin colas públicas.
              </p>
              <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  'Tiempo de respuesta: &lt;24h hábiles',
                  'Atención personalizada por email',
                  'Marcado como PRIORIDAD en el sistema',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--foreground-secondary)' }}>
                    <span style={{ color: '#00ff41', fontSize: '0.6rem' }}>●</span>
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSupportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Asunto de la consulta..."
                value={supportForm.asunto}
                onChange={e => setSupportForm(prev => ({ ...prev, asunto: e.target.value }))}
                required
                style={{
                  padding: '0.9rem 1rem', background: 'var(--background)',
                  border: '1px solid var(--border)', color: 'var(--foreground)', fontSize: '0.9rem',
                  fontFamily: 'Inter, sans-serif', outline: 'none'
                }}
              />
              <textarea
                placeholder="Describe tu consulta técnica con el mayor detalle posible..."
                value={supportForm.mensaje}
                onChange={e => setSupportForm(prev => ({ ...prev, mensaje: e.target.value }))}
                required
                rows={5}
                style={{
                  padding: '0.9rem 1rem', background: 'var(--background)',
                  border: '1px solid var(--border)', color: 'var(--foreground)', fontSize: '0.9rem',
                  fontFamily: 'Inter, sans-serif', outline: 'none', resize: 'vertical'
                }}
              />

              {supportStatus === 'sent' && (
                <div style={{ padding: '0.75rem', background: 'rgba(0,255,65,0.05)', border: '1px solid rgba(0,255,65,0.2)', color: '#00ff41', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                  [OK] Consulta enviada. Recibirás respuesta en &lt;24h.
                </div>
              )}
              {supportStatus === 'error' && (
                <div style={{ padding: '0.75rem', background: 'rgba(255,68,68,0.05)', border: '1px solid rgba(255,68,68,0.2)', color: '#ff4444', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                  [ERROR] No se pudo enviar. Intenta de nuevo.
                </div>
              )}

              <button
                type="submit"
                disabled={supportStatus === 'sending' || supportStatus === 'sent'}
                style={{
                  padding: '0.9rem 1.5rem',
                  background: supportStatus === 'sent' ? 'var(--border)' : 'var(--primary)',
                  color: supportStatus === 'sent' ? 'var(--foreground-secondary)' : 'var(--secondary)',
                  border: 'none', fontSize: '0.8rem', fontWeight: '800',
                  letterSpacing: '0.1em', cursor: supportStatus === 'sent' ? 'not-allowed' : 'pointer',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}
              >
                {supportStatus === 'sending' ? 'ENVIANDO...' : supportStatus === 'sent' ? 'ENVIADO ✓' : 'ENVIAR CONSULTA ÉLITE →'}
              </button>
            </form>
          </div>
        </section>

      </div>

      {/* ── MODAL AJUSTES DE PERFIL (Monolith Noir Style) ── */}
      {settingsOpen && (
        <div style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '2rem'
        }}>
          <div style={{
            background: 'var(--card-bg)', border: '1px solid var(--border)',
            padding: '2.5rem', width: 'min(440px, 100%)', position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', borderRadius: '0px'
          }}>
            {/* Botón Cerrar */}
            <button
              onClick={() => setSettingsOpen(false)}
              style={{
                position: 'absolute', top: '1.25rem', right: '1.25rem',
                background: 'none', border: 'none', color: 'var(--foreground-secondary)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifySelf: 'center'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.35em', color: 'var(--foreground-secondary)', marginBottom: '0.75rem' }}>
                MEMBER // PROFILE_SETTINGS
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', fontFamily: 'Space Grotesk', color: 'var(--foreground)', margin: 0 }}>
                AJUSTES DE PERFIL
              </h2>
            </div>

            <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Selector de Avatar */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    position: 'relative', width: '84px', height: '84px',
                    borderRadius: '50%', cursor: 'pointer', overflow: 'hidden',
                    border: '2px dashed var(--border)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--foreground-secondary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <MemberAvatar name={currentMember.name} avatar_url={currentMember.avatar_url} size={80} />
                  )}
                  {/* Overlay de cámara */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.6)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: 'opacity 0.2s'
                  }}
                    className="avatar-hover-overlay"
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0'; }}
                  >
                    <Camera size={20} color="#fff" />
                  </div>
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                
                <span style={{ fontSize: '0.7rem', color: 'var(--foreground-secondary)', fontFamily: 'monospace' }}>
                  [ CLICK PARA CAMBIAR FOTO ]
                </span>
              </div>

              {/* Nombre */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em', color: 'var(--foreground-secondary)', textTransform: 'uppercase' }}>
                  Nombre de pantalla
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Tu nombre..."
                  required
                  maxLength={50}
                  style={{
                    padding: '0.75rem 1rem', background: 'var(--background)',
                    border: '1px solid var(--border)', color: 'var(--foreground)',
                    fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', outline: 'none',
                    borderRadius: '0px'
                  }}
                />
              </div>

              {/* Mensajes de feedback */}
              {updateError && (
                <div style={{ padding: '0.75rem', background: 'rgba(255,68,68,0.05)', border: '1px solid rgba(255,68,68,0.2)', color: '#ff4444', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                  [ERROR] {updateError}
                </div>
              )}
              {updateSuccess && (
                <div style={{ padding: '0.75rem', background: 'rgba(0,255,65,0.05)', border: '1px solid rgba(0,255,65,0.2)', color: '#00ff41', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                  [OK] Ajustes guardados correctamente.
                </div>
              )}

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={updating || updateSuccess}
                style={{
                  padding: '0.9rem', background: updateSuccess ? 'var(--border)' : 'var(--foreground)',
                  color: updateSuccess ? 'var(--foreground-secondary)' : 'var(--background)',
                  border: 'none', fontSize: '0.8rem', fontWeight: '800',
                  letterSpacing: '0.15em', cursor: updating || updateSuccess ? 'not-allowed' : 'pointer',
                  fontFamily: 'Space Grotesk, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  borderRadius: '0px'
                }}
              >
                {updating ? (
                  <>
                    <Loader size={14} className="animate-spin" style={{ marginRight: '4px' }} /> GUARDANDO...
                  </>
                ) : updateSuccess ? (
                  'GUARDADO ✓'
                ) : (
                  'GUARDAR AJUSTES →'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .private-main-grid {
            grid-template-columns: 1fr !important;
          }
          .support-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
