'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Mail, 
  Check, 
  AlertCircle, 
  Loader, 
  Calendar,
  RefreshCw,
  Eye,
  Terminal,
  FileText
} from 'lucide-react';
import AdminChart from '@/components/AdminChart';

export default function AdminDashboard() {
  const [members, setMembers] = useState<any[]>([]);
  const [membersCount, setMembersCount] = useState<number>(0);
  const [newsletterStats, setNewsletterStats] = useState<any>({ uniqueSubscribers: 0 });
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const showFeedback = useCallback((type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3000);
  }, []);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [membersRes, newsletterRes, blogRes] = await Promise.all([
        fetch('/api/admin/community/members'),
        fetch('/api/admin/newsletter/stats'),
        fetch('/api/admin/blog')
      ]);

      const membersData = membersRes.ok ? await membersRes.json() : [];
      const newsletterData = newsletterRes.ok ? await newsletterRes.json() : { uniqueSubscribers: 0 };
      const blogData = blogRes.ok ? await blogRes.json() : [];

      setMembers(Array.isArray(membersData) ? membersData : []);
      setMembersCount(Array.isArray(membersData) ? membersData.length : 0);
      setNewsletterStats(newsletterData);
      setBlogPosts(Array.isArray(blogData) ? blogData : []);
    } catch (err) {
      console.error('Error al cargar datos del dashboard:', err);
      showFeedback('error', 'Error al sincronizar datos del panel');
    } finally {
      setLoading(false);
    }
  }, [showFeedback]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#666', gap: '0.5rem' }}>
        <Loader className="spin" size={20} />
        Sincronizando operaciones del blog...
      </div>
    );
  }

  return (
    <div>
      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>PANEL DE OPERACIONES</h1>
          <p style={{ color: '#666' }}>Dashboard gerencial para supervisión del blog, la comunidad y el boletín.</p>
        </div>
        <button 
          onClick={loadDashboardData} 
          style={{ 
            background: 'none', border: '1px solid #222', color: '#888', padding: '0.6rem 1.2rem', 
            borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          <RefreshCw size={14} /> Actualizar Datos
        </button>
      </div>

      {/* Feedback */}
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

      {/* Grid de Métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        
        {/* Artículos Publicados */}
        <div className="glass" style={{ padding: '2.5rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.2em', color: '#666' }}>ARTÍCULOS // TOTAL</span>
            <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', border: '1px solid #222' }}>
              <FileText size={16} color="var(--primary)" />
            </div>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: '800', color: '#fff', fontFamily: 'Space Grotesk' }}>
            {blogPosts.length}
          </div>
          <p style={{ color: '#444', fontSize: '0.8rem', marginTop: '0.5rem' }}>
            Total de publicaciones redactadas
          </p>
        </div>

        {/* Miembros Comunidad */}
        <div className="glass" style={{ padding: '2.5rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.2em', color: '#666' }}>MIEMBROS // COMUNIDAD</span>
            <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', border: '1px solid #222' }}>
              <Users size={16} color="var(--primary)" />
            </div>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: '800', color: '#fff', fontFamily: 'Space Grotesk' }}>
            {membersCount}
          </div>
          <p style={{ color: '#444', fontSize: '0.8rem', marginTop: '0.5rem' }}>
            Miembros activos en el área privada
          </p>
        </div>

        {/* Suscriptores Brevo */}
        <div className="glass" style={{ padding: '2.5rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.2em', color: '#666' }}>SUSCRIPTORES // BREVO</span>
            <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', border: '1px solid #222' }}>
              <Mail size={16} color="var(--primary)" />
            </div>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: '800', color: '#fff', fontFamily: 'Space Grotesk' }}>
            {newsletterStats.uniqueSubscribers}
          </div>
          <p style={{ color: '#444', fontSize: '0.8rem', marginTop: '0.5rem' }}>
            {newsletterStats.configured ? 'Contactos en lista de correo' : 'Configuración de Brevo pendiente'}
          </p>
        </div>

      </div>

      {/* Sección de Operaciones Visuales e Inteligencia */}
      <div className="admin-operations-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: '3fr 2fr', 
        gap: '2rem', 
        marginBottom: '4rem' 
      }}>
        
        {/* Gráfico SVG de Actividad */}
        <AdminChart blogPosts={blogPosts} members={members} />

        {/* Alcance del Blog (Top Artículos por Lectura) */}
        <div className="glass" style={{ padding: '2.5rem', background: '#0a0a0a', border: '1px solid #222', display: 'flex', flexDirection: 'column' }}>
          <div>
            <span style={{ fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.25em', color: '#666', textTransform: 'uppercase' }}>
              RENDIMIENTO // ALCANCE_BLOG
            </span>
            <h3 style={{ fontSize: '1.4rem', fontFamily: 'Space Grotesk', fontWeight: '700', color: '#fff', marginTop: '0.25rem', marginBottom: '2rem' }}>
              MÁS LEÍDOS
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, justifyContent: 'center' }}>
            {blogPosts && blogPosts.length > 0 ? (
              [...blogPosts]
                .sort((a, b) => (b.views || 0) - (a.views || 0))
                .slice(0, 4)
                .map((post) => {
                  const maxViews = Math.max(...blogPosts.map(p => p.views || 0), 1);
                  const pct = Math.min(((post.views || 0) / maxViews) * 100, 100);
                  
                  return (
                    <div key={post.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                        <span style={{ fontWeight: '700', color: '#ccc', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '220px' }} title={post.titulo}>
                          {post.titulo.toUpperCase()}
                        </span>
                        <span style={{ color: '#888', display: 'flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'monospace' }}>
                          <Eye size={12} /> {post.views || 0}
                        </span>
                      </div>
                      {/* Barra de progreso */}
                      <div style={{ height: '6px', background: '#111', width: '100%', border: '1px solid #222' }}>
                        <div style={{ height: '100%', background: '#fff', width: `${pct}%`, transition: 'width 0.8s ease-out' }} />
                      </div>
                    </div>
                  );
                })
            ) : (
              <div style={{ color: '#444', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>
                Sin lecturas registradas en la base de datos.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Terminal Operativa Agéntica */}
      <div className="glass" style={{ 
        padding: '2.5rem', 
        background: '#050505', 
        border: '1px solid #111', 
        marginBottom: '4rem', 
        fontFamily: 'monospace' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid #161616', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <Terminal size={16} color="#fff" />
          <span style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.2em', color: '#fff' }}>
            AGENTIC // OPERATION_TERMINAL_V1
          </span>
          <span style={{ fontSize: '0.6rem', color: '#ff4444', marginLeft: 'auto', background: 'rgba(255,68,68,0.05)', padding: '2px 8px', border: '1px solid rgba(255,68,68,0.2)', fontWeight: '700' }}>
            LIVE
          </span>
        </div>

        <div style={{ 
          maxHeight: '140px', 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.5rem', 
          fontSize: '0.78rem', 
          color: '#666',
          lineHeight: '1.4'
        }}>
          <p><span style={{ color: '#00ff00' }}>[SYSTEM]</span> Inicializando subsistemas del blog... OK</p>
          <p><span style={{ color: '#00bfff' }}>[API_BREVO]</span> Sincronización de suscriptores finalizada. Total activos: {newsletterStats.uniqueSubscribers}</p>
          <p><span style={{ color: '#ffa500' }}>[INDEXER]</span> Google Indexing API en línea y lista para procesar publicaciones.</p>
          <p><span style={{ color: '#555' }}>[OPTIMIZER]</span> Cache interna compactada y optimizada para el blog.</p>
        </div>
      </div>

      {/* Tabla de Miembros Recientes */}
      <div className="glass" style={{ padding: '2.5rem', overflowX: 'auto' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '2rem', letterSpacing: '0.1em' }}>ÚLTIMOS MIEMBROS REGISTRADOS</h2>
        
        {members.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #222', color: '#555', fontSize: '0.75rem', fontWeight: '700' }}>
                <th style={{ paddingBottom: '1.2rem' }}>NOMBRE</th>
                <th style={{ paddingBottom: '1.2rem' }}>EMAIL</th>
                <th style={{ paddingBottom: '1.2rem' }}>ESTADO</th>
                <th style={{ paddingBottom: '1.2rem' }}>FECHA DE REGISTRO</th>
              </tr>
            </thead>
            <tbody>
              {members.slice(0, 5).map((member: any) => {
                return (
                  <tr key={member.id} style={{ borderBottom: '1px solid #111', fontSize: '0.85rem' }}>
                    <td style={{ padding: '1.5rem 0', fontWeight: '700', color: '#fff' }}>{member.nombre || 'Sin nombre'}</td>
                    <td style={{ padding: '1.5rem 0', color: '#ccc' }}>{member.email}</td>
                    <td style={{ padding: '1.5rem 0' }}>
                      <span style={{ 
                        fontSize: '0.65rem', fontWeight: '700', padding: '3px 8px', 
                        background: member.status === 'activo' ? 'rgba(0,255,0,0.05)' : 'rgba(255,0,0,0.05)', 
                        border: `1px solid ${member.status === 'activo' ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)'}`, 
                        borderRadius: '2px',
                        color: member.status === 'activo' ? '#00ff00' : '#ff0000', 
                        textTransform: 'uppercase', letterSpacing: '0.05em'
                      }}>
                        {member.status || 'activo'}
                      </span>
                    </td>
                    <td style={{ padding: '1.5rem 0', color: '#666', fontSize: '0.8rem' }}>
                      {member.created_at ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Calendar size={12} />
                          {new Date(member.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      ) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#333' }}>
            <Users size={36} style={{ marginBottom: '1rem', color: '#222' }} />
            <p>No se han registrado miembros en la base de datos.</p>
          </div>
        )}
      </div>

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
