'use client';

import { useState, useEffect } from 'react';
import { Package, Plus, Trash2, Edit3, Check, AlertCircle } from 'lucide-react';

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export default function AdminSystemsPage() {
  const [systems, setSystems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSystem, setEditingSystem] = useState<any>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    fetchSystems();
  }, []);

  const fetchSystems = async () => {
    const res = await fetch('/api/admin/systems');
    const data = await res.json();
    setSystems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const showFeedback = (type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingSystem.id ? 'PUT' : 'POST';
    
    const systemType = editingSystem.type || 'tool';
    const payload = {
      ...editingSystem,
      type: systemType,
      slug: systemType === 'generic' ? '' : (editingSystem.slug || slugify(editingSystem.name)),
      enlaceStripe: systemType === 'generic' ? '' : (editingSystem.enlaceStripe || ''),
      price: Number(editingSystem.price) || 0
    };

    try {
      const res = await fetch('/api/admin/systems', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showFeedback('success', 'Sistema guardado correctamente');
        setEditingSystem(null);
        fetchSystems();
      } else {
        showFeedback('error', 'Error al guardar el sistema');
      }
    } catch (err) {
      showFeedback('error', 'Error de conexión');
    }
  };

  const handleNameChange = (nameVal: string) => {
    const isGeneric = (editingSystem.type || 'tool') === 'generic';
    setEditingSystem({
      ...editingSystem,
      name: nameVal,
      slug: isGeneric ? '' : slugify(nameVal)
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este sistema de forma permanente?')) {
      try {
        const res = await fetch(`/api/admin/systems?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          showFeedback('success', 'Sistema eliminado');
          fetchSystems();
        } else {
          showFeedback('error', 'Error al eliminar');
        }
      } catch (err) {
        showFeedback('error', 'Error de conexión');
      }
    }
  };

  if (loading) return <div style={{ color: '#666' }}>Sincronizando sistemas con la nube...</div>;

  return (
    <div>
      <div className="admin-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>SISTEMAS</h1>
          <p style={{ color: '#666' }}>Gestiona los productos técnicos de la plataforma.</p>
        </div>
        <button 
          onClick={() => setEditingSystem({ name: '', slug: '', price: '', status: 'activo', type: 'tool', descripcionCorta: '', descripcionLarga: '', enlaceStripe: '', imageUrl: '' })}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> Nuevo Sistema
        </button>
      </div>

      {feedback && (
        <div style={{ 
          padding: '1rem 1.5rem', 
          backgroundColor: feedback.type === 'success' ? 'rgba(0, 255, 0, 0.05)' : 'rgba(255, 0, 0, 0.05)',
          border: `1px solid ${feedback.type === 'success' ? '#00ff00' : '#ff0000'}`,
          borderRadius: '8px',
          color: feedback.type === 'success' ? '#00ff00' : '#ff0000',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {feedback.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          {feedback.msg}
        </div>
      )}

      {editingSystem && (
        <div className="glass" style={{ padding: '3rem', marginBottom: '3rem', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ marginBottom: '2rem' }}>{editingSystem.id ? 'Editar Parámetros' : 'Nueva Configuración'}</h3>
          <form onSubmit={handleSave} className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#666' }}>Nombre del Sistema</label>
              <input value={editingSystem.name} onChange={e => handleNameChange(e.target.value)} style={{ padding: '1rem', background: '#111', border: '1px solid #222', color: '#fff', borderRadius: '4px' }} required />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#666' }}>Tipo de Sistema</label>
              <select 
                value={editingSystem.type || 'tool'} 
                onChange={e => {
                  const newType = e.target.value;
                  setEditingSystem({
                    ...editingSystem,
                    type: newType,
                    ...(newType === 'generic' ? { slug: '', enlaceStripe: '' } : { slug: slugify(editingSystem.name) })
                  });
                }} 
                style={{ padding: '1rem', background: '#111', border: '1px solid #222', color: '#fff', borderRadius: '4px' }}
              >
                <option value="tool">Herramienta (Venta Directa)</option>
                <option value="generic">Expositor (Servicio / Cotización)</option>
              </select>
            </div>

            {(editingSystem.type || 'tool') !== 'generic' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: '#666' }}>Slug (URL)</label>
                <input value={editingSystem.slug} onChange={e => setEditingSystem({...editingSystem, slug: slugify(e.target.value)})} style={{ padding: '1rem', background: '#111', border: '1px solid #222', color: '#fff', borderRadius: '4px' }} required />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#666' }}>Precio (€)</label>
              <input type="number" value={editingSystem.price} onChange={e => setEditingSystem({...editingSystem, price: e.target.value === '' ? '' : Number(e.target.value)})} style={{ padding: '1rem', background: '#111', border: '1px solid #222', color: '#fff', borderRadius: '4px' }} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#666' }}>Estado</label>
              <select value={editingSystem.status} onChange={e => setEditingSystem({...editingSystem, status: e.target.value})} style={{ padding: '1rem', background: '#111', border: '1px solid #222', color: '#fff', borderRadius: '4px' }}>
                <option value="activo">Activo</option>
                <option value="oculto">Oculto</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.8rem', color: '#666' }}>URL de Imagen / Banner</label>
              <input value={editingSystem.imageUrl || ''} onChange={e => setEditingSystem({...editingSystem, imageUrl: e.target.value})} placeholder="https://..." style={{ padding: '1rem', background: '#111', border: '1px solid #222', color: '#fff', borderRadius: '4px' }} />
            </div>

            {(editingSystem.type || 'tool') !== 'generic' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.8rem', color: '#666' }}>Enlace Stripe</label>
                <input value={editingSystem.enlaceStripe || ''} onChange={e => setEditingSystem({...editingSystem, enlaceStripe: e.target.value})} placeholder="https://buy.stripe.com/..." style={{ padding: '1rem', background: '#111', border: '1px solid #222', color: '#fff', borderRadius: '4px' }} />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.8rem', color: '#666' }}>Descripción Corta</label>
              <textarea value={editingSystem.descripcionCorta} onChange={e => setEditingSystem({...editingSystem, descripcionCorta: e.target.value})} style={{ padding: '1rem', background: '#111', border: '1px solid #222', color: '#fff', borderRadius: '4px', height: '100px' }} />
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn-primary">Sincronizar Cambios</button>
              <button onClick={() => setEditingSystem(null)} type="button" className="btn-outline">Descartar</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {systems.length > 0 ? systems.map((s: any) => (
          <div key={s.id} className="glass admin-item-row" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <Package size={24} color={s.status === 'activo' ? '#fff' : '#444'} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.2rem' }}>{s.name}</h4>
                <p style={{ color: '#555', fontSize: '0.85rem' }}>
                  {(s.type || 'tool') === 'generic' ? 'Expositor' : 'Herramienta'} 
                  {(s.type || 'tool') !== 'generic' && s.slug ? ` • /${s.slug}` : ''} 
                  {s.price > 0 ? ` • ${s.price}€` : ' • Sin precio'} 
                  • {s.status.toUpperCase()}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setEditingSystem(s)} style={{ padding: '0.8rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><Edit3 size={18} /></button>
              <button onClick={() => handleDelete(s.id)} style={{ padding: '0.8rem', background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
            </div>
          </div>
        )) : (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#444' }}>No hay sistemas registrados en la base de datos.</div>
        )}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .admin-form-grid {
            grid-template-columns: 1fr !important;
          }
          .admin-form-grid [style*="span 2"] {
            grid-column: span 1 !important;
          }
          .admin-header-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
          .admin-item-row {
            flex-direction: column !important;
            gap: 0.75rem !important;
          }
        }
      `}</style>
    </div>
  );
}
