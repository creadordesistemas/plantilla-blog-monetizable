'use client';

import { useState, useEffect } from 'react';
import { Users, DollarSign, Activity, Check, AlertCircle, Plus, Trash2, Search, Mail, BookOpen } from 'lucide-react';

export default function AdminCommunityPage() {
  const [activeTab, setActiveTab] = useState<'resources' | 'members'>('resources');
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const [resources, setResources] = useState<any[]>([]);
  const [editingResource, setEditingResource] = useState<any>(null);

  // Miembros
  const [members, setMembers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMember, setNewMember] = useState({ email: '', nombre: '' });
  const [addingMember, setAddingMember] = useState(false);

  useEffect(() => {
    fetch('/api/admin/community').then(res => res.json()).then(data => {
      setSettings(data);
      setLoading(false);
    });
    fetchResources();
    fetchMembers();
  }, []);

  const fetchResources = async () => {
    const res = await fetch('/api/admin/resources');
    const data = await res.json();
    setResources(Array.isArray(data) ? data : []);
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/admin/community/members');
      if (res.ok) {
        const data = await res.json();
        setMembers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching members:", err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/community', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (res.ok) {
      setFeedback({ type: 'success', msg: 'Configuración de comunidad guardada' });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingResource.id ? 'PUT' : 'POST';
    await fetch('/api/admin/resources', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingResource),
    });
    setEditingResource(null);
    fetchResources();
    setFeedback({ type: 'success', msg: 'Recurso actualizado' });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDeleteResource = async (id: string) => {
    if (confirm('¿Eliminar recurso?')) {
      await fetch(`/api/admin/resources?id=${id}`, { method: 'DELETE' });
      fetchResources();
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.email) return;
    setAddingMember(true);
    try {
      const res = await fetch('/api/admin/community/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember)
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', msg: 'Miembro añadido correctamente' });
        setNewMember({ email: '', nombre: '' });
        fetchMembers();
      } else {
        setFeedback({ type: 'error', msg: data.error || 'Error al añadir miembro' });
      }
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Error de conexión' });
    } finally {
      setAddingMember(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas revocar el acceso a este miembro?')) {
      try {
        const res = await fetch(`/api/admin/community/members?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setFeedback({ type: 'success', msg: 'Acceso de miembro revocado' });
          fetchMembers();
        } else {
          setFeedback({ type: 'error', msg: 'Error al eliminar miembro' });
        }
      } catch (err) {
        setFeedback({ type: 'error', msg: 'Error de conexión' });
      } finally {
        setTimeout(() => setFeedback(null), 3000);
      }
    }
  };

  // Filtrado de miembros en base a la búsqueda
  const filteredMembers = members.filter(m => 
    (m.email && m.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (m.nombre && m.nombre.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return <div style={{ color: '#666' }}>Cargando infraestructura de comunidad...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>COMUNIDAD</h1>
          <p style={{ color: '#666' }}>Gestiona el acceso de miembros y la librería de recursos técnicos.</p>
        </div>

        {/* Control de pestañas */}
        <div style={{ display: 'flex', gap: '0.5rem', background: '#111', padding: '0.4rem', borderRadius: '4px', border: '1px solid #222' }}>
          <button 
            onClick={() => setActiveTab('resources')}
            className={`btn-tab ${activeTab === 'resources' ? 'active' : ''}`}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', 
              padding: '0.6rem 1.2rem', fontSize: '0.8rem', border: 'none', 
              background: activeTab === 'resources' ? '#222' : 'transparent', 
              color: activeTab === 'resources' ? '#fff' : '#666', cursor: 'pointer',
              fontWeight: activeTab === 'resources' ? '700' : '400'
            }}
          >
            <BookOpen size={16} /> Recursos & Costos
          </button>
          <button 
            onClick={() => setActiveTab('members')}
            className={`btn-tab ${activeTab === 'members' ? 'active' : ''}`}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', 
              padding: '0.6rem 1.2rem', fontSize: '0.8rem', border: 'none', 
              background: activeTab === 'members' ? '#222' : 'transparent', 
              color: activeTab === 'members' ? '#fff' : '#666', cursor: 'pointer',
              fontWeight: activeTab === 'members' ? '700' : '400'
            }}
          >
            <Users size={16} /> Miembros Activos ({members.length})
          </button>
        </div>
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

      {activeTab === 'resources' ? (
        <>
          {/* Configuración de Membresía */}
          <div className="community-main-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
            <div className="glass" style={{ padding: '3rem' }}>
              <h3 style={{ marginBottom: '2rem', fontSize: '1.2rem', fontWeight: '700' }}>Protocolo de Membresía</h3>
              <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666' }}>
                    <DollarSign size={16} /> <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>Precio Mensual (€)</label>
                  </div>
                  <input type="number" value={settings.priceMonthly} onChange={e => setSettings({...settings, priceMonthly: Number(e.target.value)})} style={{ padding: '1rem', background: '#111', border: '1px solid #222', color: '#fff', fontSize: '1.2rem', fontWeight: '700' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666' }}>
                    <Activity size={16} /> <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>Estado de Inscripción</label>
                  </div>
                  <select value={settings.status} onChange={e => setSettings({...settings, status: e.target.value})} style={{ padding: '1rem', background: '#111', border: '1px solid #222', color: '#fff' }}>
                    <option value="abierta">Abierta (Venta activa)</option>
                    <option value="cerrada">Cerrada (Lista de espera)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <label style={{ fontSize: '0.8rem', color: '#666' }}>Link de Checkout (Stripe)</label>
                  <input value={settings.stripeLink || ''} onChange={e => setSettings({...settings, stripeLink: e.target.value})} style={{ padding: '1rem', background: '#111', border: '1px solid #222', color: '#fff' }} />
                </div>

                <button type="submit" className="btn-primary" style={{ padding: '1.2rem' }}>GUARDAR CONFIGURACIÓN</button>
              </form>
            </div>

            <div className="glass" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '100px', marginBottom: '2rem' }}>
                <Users size={48} color="var(--secondary)" />
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: '700' }}>Miembros de la Red</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0.5rem 0', color: 'var(--primary)', fontFamily: 'Space Grotesk' }}>{members.length}</div>
              <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '1rem' }}>Suscritos y validados de forma manual a través del panel admin.</p>
            </div>
          </div>

          {/* GESTOR DE RECURSOS */}
          <div style={{ marginTop: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>LIBRERÍA DE RECURSOS</h2>
              <button onClick={() => setEditingResource({ title: '', category: 'automatizacion', description: '', url: '' })} className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.7rem' }}>+ AÑADIR RECURSO</button>
            </div>

            {editingResource && (
              <div className="glass" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid var(--primary)' }}>
                <form onSubmit={handleSaveResource} className="resource-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input placeholder="Título del Recurso" value={editingResource.title} onChange={e => setEditingResource({...editingResource, title: e.target.value})} style={{ padding: '1rem', background: '#111', border: '1px solid #222', color: '#fff' }} required />
                  <select value={editingResource.category} onChange={e => setEditingResource({...editingResource, category: e.target.value})} style={{ padding: '1rem', background: '#111', border: '1px solid #222', color: '#fff' }}>
                    <option value="automatizacion">Automatización</option>
                    <option value="curso">Curso</option>
                    <option value="skill">Skill</option>
                    <option value="guia">Guía</option>
                  </select>
                  <input placeholder="URL del recurso (Link / Descarga)" value={editingResource.url} onChange={e => setEditingResource({...editingResource, url: e.target.value})} style={{ padding: '1rem', background: '#111', border: '1px solid #222', color: '#fff', gridColumn: 'span 2' }} required />
                  <textarea placeholder="Descripción corta..." value={editingResource.description} onChange={e => setEditingResource({...editingResource, description: e.target.value})} style={{ padding: '1rem', background: '#111', border: '1px solid #222', color: '#fff', gridColumn: 'span 2', height: '80px' }} />
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn-primary">Sincronizar Recurso</button>
                    <button onClick={() => setEditingResource(null)} type="button" className="btn-outline">Cancelar</button>
                  </div>
                </form>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {resources.length > 0 ? resources.map((res: any) => (
                <div key={res.id} className="glass" style={{ padding: '1.5rem' }}>
                  <div style={{ fontSize: '0.6rem', color: 'var(--foreground-secondary)', marginBottom: '0.5rem', fontWeight: '700' }}>{res.category.toUpperCase()}</div>
                  <h4 style={{ marginBottom: '0.5rem' }}>{res.title}</h4>
                  <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '1.5rem' }}>{res.description}</p>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setEditingResource(res)} style={{ color: '#fff', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer' }}>Editar</button>
                    <button onClick={() => handleDeleteResource(res.id)} style={{ color: '#ff4444', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer' }}>Eliminar</button>
                  </div>
                </div>
              )) : <div style={{ color: '#333', gridColumn: 'span 3', textAlign: 'center', padding: '4rem' }}>No hay recursos publicados en la comunidad.</div>}
            </div>
          </div>
        </>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }} className="community-main-grid">
          {/* Alta de miembro */}
          <form onSubmit={handleAddMember} className="glass" style={{ padding: '2.5rem', height: 'fit-content' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '700' }}>Alta de Nuevo Miembro</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#888', fontWeight: '700' }}>EMAIL DEL MIEMBRO</label>
                <input 
                  type="email" 
                  placeholder="ejemplo@correo.com"
                  value={newMember.email} 
                  onChange={e => setNewMember({...newMember, email: e.target.value})} 
                  style={{ padding: '1rem', background: '#000', border: '1px solid #222', color: '#fff', borderRadius: '4px' }} 
                  required 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#888', fontWeight: '700' }}>NOMBRE (OPCIONAL)</label>
                <input 
                  type="text" 
                  placeholder="Juan Pérez"
                  value={newMember.nombre} 
                  onChange={e => setNewMember({...newMember, nombre: e.target.value})} 
                  style={{ padding: '1rem', background: '#000', border: '1px solid #222', color: '#fff', borderRadius: '4px' }} 
                />
              </div>
            </div>

            <button type="submit" disabled={addingMember} className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
              <Plus size={18} /> {addingMember ? 'Inscribiendo...' : 'Autorizar Acceso'}
            </button>
          </form>

          {/* Listado de miembros */}
          <div className="glass" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Miembros con Acceso Activo</h3>
              
              {/* Buscador */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#000', border: '1px solid #222', padding: '0.5rem 1rem', borderRadius: '4px', width: '220px' }}>
                <Search size={16} color="#666" />
                <input 
                  type="text" 
                  placeholder="Buscar miembro..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.85rem', width: '100%', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {filteredMembers.length > 0 ? filteredMembers.map((m: any) => (
                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 1.5rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.02)', borderRadius: '40px', color: 'var(--primary)' }}>
                      <Mail size={16} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.1rem' }}>{m.nombre || 'Miembro Anónimo'}</h4>
                      <p style={{ color: '#666', fontSize: '0.8rem' }}>{m.email} • {new Date(m.created_at).toLocaleDateString('es-ES')}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteMember(m.id)}
                    style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="Revocar acceso"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#555', fontSize: '0.9rem' }}>
                  {searchQuery ? 'No se encontraron miembros con ese email/nombre.' : 'No hay miembros inscritos en la base de datos.'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .community-main-grid {
            grid-template-columns: 1fr !important;
          }
          .resource-form-grid {
            grid-template-columns: 1fr !important;
          }
          .resource-form-grid [style*="span 2"] {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
