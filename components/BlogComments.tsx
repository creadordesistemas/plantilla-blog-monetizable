'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Comment {
  id: string;
  created_at: string;
  member_name: string;
  member_email: string;
  member_avatar_url?: string | null;
  content: string;
}

function CommentAvatar({ name, avatar_url, isOwned }: { name: string; avatar_url?: string | null; isOwned: boolean }) {
  if (avatar_url) {
    return (
      <img
        src={avatar_url}
        alt={name}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: isOwned ? '1px solid rgba(184,150,46,0.4)' : '1px solid var(--border)',
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <div style={{
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      background: isOwned ? 'rgba(184,150,46,0.08)' : 'var(--background)',
      border: isOwned ? '1px solid rgba(184,150,46,0.3)' : '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: '0.7rem',
      fontWeight: '800',
      color: isOwned ? '#b8962e' : 'var(--foreground-secondary)',
      letterSpacing: '0.05em',
    }}>
      {getInitials(name)}
    </div>
  );
}

interface BlogCommentsProps {
  slug: string;
  isMember: boolean;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Ahora mismo';
  if (diffMin < 60) return `hace ${diffMin}m`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `hace ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `hace ${diffD}d`;
}

export default function BlogComments({ slug, isMember }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // ── Autoría: email del usuario logueado ──
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  // ── Edición inline ──
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // ── Borrado con confirmación ──
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteProcessing, setDeleteProcessing] = useState(false);

  // ── Animación de desaparición ──
  const [fadingOutId, setFadingOutId] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/blog/comments?slug=${slug}`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    setMounted(true);
    fetchComments();

    // Obtener email del usuario logueado para detección de autoría
    if (isMember) {
      fetch('/api/community/me?t=' + Date.now(), { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (data.authenticated && data.member?.email) {
            setCurrentUserEmail(data.member.email);
          }
        })
        .catch(() => {});
    }
  }, [isMember, fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch('/api/blog/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al publicar');
      } else {
        setComments((prev) => [...prev, data]);
        setContent('');
        setTimeout(() => {
          listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
        }, 100);
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setSending(false);
    }
  };

  // ── Guardar edición ──
  const handleEditSave = async (commentId: string) => {
    if (!editContent.trim()) return;
    setEditSaving(true);
    setEditError(null);
    try {
      const res = await fetch('/api/blog/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: commentId, content: editContent }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error || 'Error al actualizar');
      } else {
        setComments(prev =>
          prev.map(c => c.id === commentId ? { ...c, content: data.content } : c)
        );
        setEditingId(null);
        setEditContent('');
      }
    } catch {
      setEditError('Error de conexión');
    } finally {
      setEditSaving(false);
    }
  };

  // ── Confirmar borrado ──
  const handleDeleteConfirm = async (commentId: string) => {
    setDeleteProcessing(true);
    try {
      const res = await fetch(`/api/blog/comments?id=${commentId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        // Animación de desaparición antes de eliminar del estado
        setFadingOutId(commentId);
        setDeletingId(null);
        setTimeout(() => {
          setComments(prev => prev.filter(c => c.id !== commentId));
          setFadingOutId(null);
        }, 350);
      } else {
        const data = await res.json();
        setError(data.error || 'Error al eliminar');
        setDeletingId(null);
      }
    } catch {
      setError('Error de conexión');
      setDeletingId(null);
    } finally {
      setDeleteProcessing(false);
    }
  };

  const isOwner = (comment: Comment) => {
    return currentUserEmail && comment.member_email === currentUserEmail;
  };

  return (
    <section style={{ marginTop: '4rem', borderTop: '1px solid var(--border)', paddingTop: '3rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.3em',
          color: 'var(--foreground-secondary)', marginBottom: '0.5rem'
        }}>
          DEBATE_TÉCNICO // HILO_ACTIVO
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.4rem',
            fontWeight: '800', color: 'var(--foreground)', margin: 0
          }}>
            DEBATES DE MIEMBROS
          </h2>
          {!loading && (
            <span style={{
              fontSize: '0.65rem', fontWeight: '700', padding: '2px 10px',
              background: 'var(--card-bg)', border: '1px solid var(--border)',
              color: 'var(--foreground-secondary)', letterSpacing: '0.1em'
            }}>
              {comments.length} ENTRADA{comments.length !== 1 ? 'S' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Lista de comentarios */}
      <div
        ref={listRef}
        style={{
          display: 'flex', flexDirection: 'column', gap: '1px',
          marginBottom: '2rem', maxHeight: comments.length > 5 ? '420px' : 'none',
          overflowY: comments.length > 5 ? 'auto' : 'visible',
          scrollbarWidth: 'thin', scrollbarColor: 'var(--border) transparent'
        }}
      >
        {loading ? (
          <div style={{ padding: '2rem', color: 'var(--foreground-secondary)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
            Cargando hilo de debate...
          </div>
        ) : comments.length === 0 ? (
          <div style={{
            padding: '2.5rem', background: 'var(--card-bg)', border: '1px solid var(--border)',
            textAlign: 'center', color: 'var(--foreground-secondary)', fontSize: '0.85rem', fontFamily: 'monospace'
          }}>
            <div style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>[ ]</div>
            Hilo vacío. Sé el primero en abrir el debate técnico.
          </div>
        ) : (
          comments.map((c, idx) => {
            const owned = isOwner(c);
            const isEditing = editingId === c.id;
            const isDeleting = deletingId === c.id;
            const isFading = fadingOutId === c.id;

            return (
              <div
                key={c.id}
                style={{
                  display: 'flex', gap: '1rem', padding: '1.25rem 1.5rem',
                  background: idx % 2 === 0 ? 'var(--card-bg)' : 'var(--background)',
                  border: '1px solid var(--border)',
                  animation: isFading ? 'commentFadeOut 0.35s ease-out forwards' : 'fadeIn 0.3s ease-out',
                  transition: 'opacity 0.3s, transform 0.3s',
                }}
              >
                {/* Avatar */}
                <CommentAvatar name={c.member_name} avatar_url={c.member_avatar_url} isOwned={!!owned} />
                {/* Contenido */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--foreground)', letterSpacing: '0.05em' }}>
                      {c.member_name.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--foreground-secondary)', fontFamily: 'monospace' }}>
                      {"//"} {timeAgo(c.created_at)}
                    </span>
                    <span style={{
                      fontSize: '0.55rem', padding: '1px 6px', background: 'var(--background)',
                      border: '1px solid var(--border)', color: 'var(--foreground-secondary)', letterSpacing: '0.1em'
                    }}>
                      MIEMBRO
                    </span>
                    {owned && (
                      <span style={{
                        fontSize: '0.55rem', padding: '1px 6px',
                        background: 'rgba(184,150,46,0.06)', border: '1px solid rgba(184,150,46,0.2)',
                        color: '#b8962e', letterSpacing: '0.1em'
                      }}>
                        TÚ
                      </span>
                    )}
                  </div>

                  {/* ── Modo edición inline ── */}
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.25rem' }}>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        maxLength={1000}
                        rows={3}
                        autoFocus
                        style={{
                          width: '100%', padding: '0.75rem 1rem', background: 'var(--background)',
                          border: '1px solid var(--border)', color: 'var(--foreground)',
                          fontSize: '0.9rem', lineHeight: '1.6', resize: 'vertical',
                          fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box',
                          borderRadius: '0px',
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--foreground-secondary)'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {editError && (
                          <span style={{ fontSize: '0.75rem', color: '#ff4444', fontFamily: 'monospace' }}>
                            [ERROR] {editError}
                          </span>
                        )}
                        <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
                          <button
                            onClick={() => { setEditingId(null); setEditContent(''); setEditError(null); }}
                            disabled={editSaving}
                            style={{
                              padding: '0.4rem 1rem', background: 'transparent',
                              border: '1px solid var(--border)', color: 'var(--foreground-secondary)',
                              fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.08em',
                              cursor: 'pointer', fontFamily: 'monospace', borderRadius: '0px',
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--foreground)'; e.currentTarget.style.color = 'var(--foreground)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--foreground-secondary)'; }}
                          >
                            CANCELAR
                          </button>
                          <button
                            onClick={() => handleEditSave(c.id)}
                            disabled={editSaving || !editContent.trim()}
                            style={{
                              padding: '0.4rem 1rem',
                              background: editSaving || !editContent.trim() ? 'var(--border)' : 'var(--primary)',
                              color: editSaving || !editContent.trim() ? 'var(--foreground-secondary)' : 'var(--secondary)',
                              border: 'none', fontSize: '0.7rem', fontWeight: '800',
                              letterSpacing: '0.08em',
                              cursor: editSaving || !editContent.trim() ? 'not-allowed' : 'pointer',
                              fontFamily: 'Space Grotesk, sans-serif', borderRadius: '0px',
                              transition: 'all 0.2s',
                            }}
                          >
                            {editSaving ? 'GUARDANDO...' : 'GUARDAR →'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* ── Contenido normal ── */
                    <p style={{
                      color: 'var(--foreground)', fontSize: '0.9rem', lineHeight: '1.6',
                      margin: 0, wordBreak: 'break-word'
                    }}>
                      {c.content}
                    </p>
                  )}

                  {/* ── Acciones del autor (solo si es propietario y no está editando) ── */}
                  {owned && !isEditing && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                      {isDeleting ? (
                        /* Micro-confirmación de borrado */
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '0.75rem',
                          padding: '0.35rem 0.75rem',
                          background: 'rgba(255,68,68,0.04)', border: '1px solid rgba(255,68,68,0.15)',
                          animation: 'fadeIn 0.2s ease-out',
                        }}>
                          <span style={{
                            fontSize: '0.7rem', color: '#ff4444', fontFamily: 'monospace',
                            fontWeight: '700', letterSpacing: '0.05em',
                          }}>
                            ¿SEGURO?
                          </span>
                          <button
                            onClick={() => handleDeleteConfirm(c.id)}
                            disabled={deleteProcessing}
                            style={{
                              padding: '0.2rem 0.75rem', background: '#ff4444', color: '#000',
                              border: 'none', fontSize: '0.65rem', fontWeight: '800',
                              letterSpacing: '0.08em', cursor: deleteProcessing ? 'not-allowed' : 'pointer',
                              fontFamily: 'Space Grotesk, sans-serif', borderRadius: '0px',
                              transition: 'all 0.15s',
                            }}
                          >
                            {deleteProcessing ? '...' : 'SÍ'}
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            disabled={deleteProcessing}
                            style={{
                              padding: '0.2rem 0.75rem', background: 'transparent',
                              border: '1px solid var(--border)', color: 'var(--foreground-secondary)',
                              fontSize: '0.65rem', fontWeight: '700',
                              letterSpacing: '0.08em', cursor: 'pointer',
                              fontFamily: 'monospace', borderRadius: '0px',
                              transition: 'all 0.15s',
                            }}
                          >
                            NO
                          </button>
                        </div>
                      ) : (
                        /* Botones de acción normales */
                        <>
                          <button
                            onClick={() => {
                              setEditingId(c.id);
                              setEditContent(c.content);
                              setEditError(null);
                              setDeletingId(null);
                            }}
                            style={{
                              padding: '0.25rem 0.6rem', background: 'transparent',
                              border: '1px solid var(--border)', color: 'var(--foreground-secondary)',
                              fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.1em',
                              cursor: 'pointer', fontFamily: 'monospace', borderRadius: '0px',
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--foreground)'; e.currentTarget.style.color = 'var(--foreground)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--foreground-secondary)'; }}
                          >
                            EDITAR
                          </button>
                          <button
                            onClick={() => {
                              setDeletingId(c.id);
                              setEditingId(null);
                            }}
                            style={{
                              padding: '0.25rem 0.6rem', background: 'transparent',
                              border: '1px solid var(--border)', color: 'var(--foreground-secondary)',
                              fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.1em',
                              cursor: 'pointer', fontFamily: 'monospace', borderRadius: '0px',
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,68,68,0.4)'; e.currentTarget.style.color = '#ff4444'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--foreground-secondary)'; }}
                          >
                            ELIMINAR
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Formulario o Widget de bloqueo */}
      {mounted && isMember ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe tu análisis técnico, pregunta o aportación..."
              maxLength={1000}
              rows={3}
              style={{
                width: '100%', padding: '1rem 1.25rem', background: 'var(--card-bg)',
                border: '1px solid var(--border)', borderRadius: '2px', color: 'var(--foreground)',
                fontSize: '0.9rem', lineHeight: '1.6', resize: 'vertical',
                fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--foreground-secondary)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            />
            <span style={{
              position: 'absolute', bottom: '8px', right: '12px',
              fontSize: '0.65rem', color: 'var(--foreground-secondary)', fontFamily: 'monospace'
            }}>
              {content.length}/1000
            </span>
          </div>

          {error && (
            <div style={{
              padding: '0.75rem 1rem', background: 'rgba(255,68,68,0.05)',
              border: '1px solid rgba(255,68,68,0.2)', color: '#ff4444',
              fontSize: '0.8rem', fontFamily: 'monospace'
            }}>
              [ERROR] {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={sending || !content.trim()}
              style={{
                padding: '0.75rem 2rem', background: sending || !content.trim() ? 'var(--border)' : 'var(--primary)',
                color: sending || !content.trim() ? 'var(--foreground-secondary)' : 'var(--secondary)',
                border: 'none', fontSize: '0.8rem', fontWeight: '800',
                letterSpacing: '0.1em', cursor: sending || !content.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', fontFamily: 'Space Grotesk, sans-serif'
              }}
            >
              {sending ? 'PUBLICANDO...' : 'PUBLICAR APORTACIÓN →'}
            </button>
          </div>
        </form>
      ) : (
        /* Widget de bloqueo */
        <div style={{
          padding: '2.5rem 2rem', background: 'var(--card-bg)',
          border: '1px solid var(--border)', textAlign: 'center', position: 'relative', overflow: 'hidden'
        }}>
          {/* Decoración de fondo */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.03,
            backgroundImage: 'repeating-linear-gradient(0deg, var(--foreground) 0px, var(--foreground) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, var(--foreground) 0px, var(--foreground) 1px, transparent 1px, transparent 40px)',
            pointerEvents: 'none'
          }} />

          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '44px', height: '44px', borderRadius: '50%',
            background: 'var(--background)', border: '1px solid var(--border)',
            marginBottom: '1.25rem'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="var(--foreground-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <div style={{
            display: 'inline-flex', alignItems: 'center',
            fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.3em',
            color: 'var(--foreground-secondary)', marginBottom: '0.75rem'
          }}>
            🔒 DEBATE TÉCNICO RESTRINGIDO — EXCLUSIVO PARA MIEMBROS
          </div>

          <h3 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.1rem',
            fontWeight: '700', color: 'var(--foreground)', marginBottom: '0.75rem'
          }}>
            Accede al debate y aporta tu perspectiva técnica
          </h3>
          <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.85rem', lineHeight: '1.6', maxWidth: '420px', margin: '0 auto 2rem' }}>
            Los miembros activos pueden leer y participar en todos los hilos de debate técnico de cada artículo.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/comunidad" style={{
              padding: '0.75rem 1.75rem', background: 'var(--primary)', color: 'var(--secondary)',
              textDecoration: 'none', fontWeight: '800', fontSize: '0.8rem',
              letterSpacing: '0.08em', fontFamily: 'Space Grotesk, sans-serif'
            }}>
              UNIRSE A LA COMUNIDAD
            </a>
            <a href="/comunidad?login=true" style={{
              padding: '0.75rem 1.75rem', background: 'transparent',
              border: '1px solid var(--border)', color: 'var(--foreground-secondary)', textDecoration: 'none',
              fontSize: '0.8rem', letterSpacing: '0.05em'
            }}>
              Ya soy miembro → Iniciar sesión
            </a>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes commentFadeOut {
          from { opacity: 1; transform: translateY(0); max-height: 200px; }
          to   { opacity: 0; transform: translateY(-8px); max-height: 0; padding: 0; margin: 0; overflow: hidden; }
        }
      `}</style>
    </section>
  );
}
