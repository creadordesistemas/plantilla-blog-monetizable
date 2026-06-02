'use client';

import { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Edit3, Check, AlertCircle, Eye } from 'lucide-react';
import Link from 'next/link';


export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch('/api/admin/blog');
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const showFeedback = (type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingPost.id ? 'PUT' : 'POST';
    try {
      const res = await fetch('/api/admin/blog', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPost),
      });
      if (res.ok) {
        showFeedback('success', 'Artículo publicado/actualizado');
        setEditingPost(null);
        fetchPosts();
      } else showFeedback('error', 'Error al procesar el artículo');
    } catch (err) {
      showFeedback('error', 'Error de conexión');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar artículo definitivamente?')) {
      await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' });
      showFeedback('success', 'Artículo eliminado');
      fetchPosts();
    }
  };

  if (loading) return <div style={{ color: '#666' }}>Sincronizando blog...</div>;

  return (
    <div>
      <div className="admin-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>BLOG & NOTICIAS</h1>
          <p style={{ color: '#666' }}>Publica artículos de autoridad sobre sistemas.</p>
        </div>
        <button onClick={() => setEditingPost({ titulo: '', slug: '', extracto: '', contenido: '', categoria: 'Automatización', tags: [], state: 'publicado', exclusive: false, image_url: '' })} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Nuevo Artículo
        </button>
      </div>

      {feedback && (
        <div style={{ padding: '1rem', backgroundColor: feedback.type === 'success' ? 'rgba(0,255,0,0.05)' : 'rgba(255,0,0,0.05)', border: `1px solid ${feedback.type === 'success' ? '#00ff00' : '#ff0000'}`, borderRadius: '8px', color: feedback.type === 'success' ? '#00ff00' : '#ff0000', marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
          {feedback.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />} {feedback.msg}
        </div>
      )}

      {editingPost && (
        <div className="glass" style={{ padding: '3rem', marginBottom: '3rem' }}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <input placeholder="Título del Artículo" value={editingPost.titulo} onChange={e => setEditingPost({...editingPost, titulo: e.target.value})} style={{ padding: '1rem', background: '#111', border: '1px solid #222', color: '#fff' }} required />
              <select value={editingPost.categoria || 'Automatización'} onChange={e => setEditingPost({...editingPost, categoria: e.target.value})} style={{ padding: '1rem', background: '#111', border: '1px solid #222', color: '#fff', outline: 'none', cursor: 'pointer' }}>
                <option value="Inteligencia Artificial">Inteligencia Artificial</option>
                <option value="Automatización">Automatización</option>
                <option value="Arquitectura y Desarrollo">Arquitectura y Desarrollo</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <input placeholder="slug-del-articulo" value={editingPost.slug} onChange={e => setEditingPost({...editingPost, slug: e.target.value})} style={{ padding: '1rem', background: '#111', border: '1px solid #222', color: '#fff' }} required />
              <select value={editingPost.state || 'publicado'} onChange={e => setEditingPost({...editingPost, state: e.target.value})} style={{ padding: '1rem', background: '#111', border: '1px solid #222', color: '#fff' }}>
                <option value="publicado">Publicado</option>
                <option value="borrador">Borrador</option>
              </select>
            </div>
            <textarea placeholder="Extracto corto para la tarjeta..." value={editingPost.extracto} onChange={e => setEditingPost({...editingPost, extracto: e.target.value})} style={{ padding: '1rem', background: '#111', border: '1px solid #222', color: '#fff', height: '80px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#888' }}>URL de imagen OG (Redes Sociales)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }} className="admin-upload-row">
                <input 
                  placeholder="https://..." 
                  value={editingPost.image_url || ''} 
                  onChange={e => setEditingPost({...editingPost, image_url: e.target.value})} 
                  style={{ flex: 1, padding: '1rem', background: '#111', border: '1px solid #222', color: '#fff' }} 
                />
                <label style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1.5rem', 
                  background: '#222', border: '1px solid #333', color: '#fff', fontSize: '0.85rem', 
                  fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none',
                  borderRadius: '2px', transition: 'all 0.2s'
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; }}
                >
                  <Plus size={14} /> Subir Portada
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    const formData = new FormData();
                    formData.append('file', file);
                    
                    showFeedback('success', 'Subiendo portada...');
                    try {
                      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
                      const data = await res.json();
                      if (res.ok) {
                        setEditingPost({...editingPost, image_url: data.url});
                        showFeedback('success', 'Portada cargada');
                      } else throw new Error(data.error);
                    } catch (err) {
                      showFeedback('error', 'Error al subir la portada');
                    }
                  }} />
                </label>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.85rem', color: '#888' }}>Contenido Completo (Soporta Markdown)</label>
                <label style={{ cursor: 'pointer', color: 'var(--primary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Plus size={14} /> Subir Imagen
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    const formData = new FormData();
                    formData.append('file', file);
                    
                    showFeedback('success', 'Subiendo imagen...');
                    try {
                      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
                      const data = await res.json();
                      if (res.ok) {
                        const imgMarkdown = `\n![Imagen](${data.url})\n`;
                        setEditingPost({...editingPost, contenido: (editingPost.contenido || '') + imgMarkdown});
                        showFeedback('success', 'Imagen insertada');
                      } else throw new Error(data.error);
                    } catch (err) {
                      showFeedback('error', 'Error al subir imagen (¿Creaste el bucket?)');
                    }
                  }} />
                </label>
              </div>
              <textarea placeholder="# Título 1&#10;Escribe aquí tu contenido usando **Markdown**..." value={editingPost.contenido} onChange={e => setEditingPost({...editingPost, contenido: e.target.value})} style={{ padding: '1rem', background: '#111', border: '1px solid #222', color: '#fff', height: '400px', fontFamily: 'monospace' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid #222', borderRadius: '4px' }}>
              <input
                type="checkbox"
                id="exclusive-check"
                checked={!!editingPost.exclusive}
                onChange={e => setEditingPost({...editingPost, exclusive: e.target.checked})}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
              <label htmlFor="exclusive-check" style={{ cursor: 'pointer', userSelect: 'none' }}>
                <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Exclusivo para Comunidad</span>
                <span style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>Solo los miembros con sesión activa podrán leer el artículo completo</span>
              </label>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn-primary">PUBLICAR AHORA</button>
              <button onClick={() => setEditingPost(null)} type="button" className="btn-outline">CANCELAR</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {posts.length > 0 ? posts.map((p: any) => (
          <div key={p.id} className="glass admin-item-row" style={{ padding: '1.5rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <FileText size={24} color="#333" />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.2rem' }}>
                  <h4 style={{ fontWeight: '700' }}>{p.titulo}</h4>
                  {p.exclusive && (
                    <span style={{ fontSize: '0.6rem', fontWeight: '700', padding: '2px 8px', background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', color: '#ffd700', letterSpacing: '0.1em' }}>EXCLUSIVO</span>
                  )}
                </div>
                <p style={{ color: '#444', fontSize: '0.8rem' }}>{p.categoria.toUpperCase()} • /{p.slug}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link href={`/blog/${p.slug}`} target="_blank" style={{ padding: '0.8rem', color: '#666' }}><Eye size={18} /></Link>
              <button onClick={() => setEditingPost(p)} style={{ padding: '0.8rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><Edit3 size={18} /></button>
              <button onClick={() => handleDelete(p.id)} style={{ padding: '0.8rem', background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
            </div>
          </div>
        )) : <div style={{ padding: '5rem', textAlign: 'center', color: '#333' }}>No hay artículos publicados.</div>}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .admin-form-grid {
            grid-template-columns: 1fr !important;
          }
          .admin-header-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
          .admin-item-row {
            flex-direction: column !important;
            gap: 0.75rem !important;
            align-items: flex-start !important;
          }
          .admin-upload-row {
            flex-direction: column !important;
          }
          .admin-upload-row label {
            justify-content: center;
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
