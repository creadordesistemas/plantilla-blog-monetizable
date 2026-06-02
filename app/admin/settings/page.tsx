'use client';

import { useState, useEffect } from 'react';
import { Save, Check, AlertCircle, Share2, Code } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(settingsData => {
        setSettings(settingsData || {});
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar configuraciones:", err);
        setLoading(false);
      });
  }, []);

  const showFeedback = (type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const resSettings = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (resSettings.ok) {
        showFeedback('success', 'Configuraciones actualizadas correctamente');
      } else {
        showFeedback('error', 'Error al guardar las configuraciones');
      }
    } catch (err) {
      showFeedback('error', 'Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ color: '#666' }}>Cargando infraestructura de control...</div>;

  return (
    <div>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>CENTRO DE CONTROL & AJUSTES</h1>
        <p style={{ color: '#666' }}>Gestiona redes sociales y scripts de tracking.</p>
      </div>

      {feedback && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: feedback.type === 'success' ? 'rgba(0,255,0,0.05)' : 'rgba(255,0,0,0.05)',
          border: `1px solid ${feedback.type === 'success' ? '#00ff00' : '#ff0000'}`,
          borderRadius: '8px',
          color: feedback.type === 'success' ? '#00ff00' : '#ff0000',
          marginBottom: '2rem',
          display: 'flex', gap: '1rem'
        }}>
          {feedback.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          {feedback.msg}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="settings-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Social Media */}
        <div className="glass" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <Share2 size={20} color="var(--secondary)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Social Media</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input placeholder="Instagram URL" value={settings.instagram || ''} onChange={e => setSettings({...settings, instagram: e.target.value})} style={{ padding: '0.8rem', background: '#111', border: '1px solid #222', color: '#fff', borderRadius: '4px' }} />
            <input placeholder="TikTok URL" value={settings.tiktok || ''} onChange={e => setSettings({...settings, tiktok: e.target.value})} style={{ padding: '0.8rem', background: '#111', border: '1px solid #222', color: '#fff', borderRadius: '4px' }} />
            <input placeholder="YouTube URL" value={settings.youtube || ''} onChange={e => setSettings({...settings, youtube: e.target.value})} style={{ padding: '0.8rem', background: '#111', border: '1px solid #222', color: '#fff', borderRadius: '4px' }} />
            <input placeholder="LinkedIn URL" value={settings.linkedin || ''} onChange={e => setSettings({...settings, linkedin: e.target.value})} style={{ padding: '0.8rem', background: '#111', border: '1px solid #222', color: '#fff', borderRadius: '4px' }} />
          </div>
        </div>

        {/* Tracking Scripts */}
        <div className="glass" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <Code size={20} color="var(--secondary)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Tracking Scripts</h3>
          </div>
          <textarea 
            placeholder="Google Analytics, Meta Pixel, etc."
            value={settings.scripts ? (Array.isArray(settings.scripts) ? settings.scripts.join('\n') : settings.scripts) : ''}
            onChange={e => setSettings({...settings, scripts: e.target.value.split('\n')})}
            style={{ width: '100%', height: '180px', padding: '0.8rem', background: '#111', border: '1px solid #222', color: '#fff', fontFamily: 'monospace', borderRadius: '4px', resize: 'none' }}
          />
        </div>

        <button type="submit" disabled={saving} className="btn-primary" style={{ gridColumn: 'span 2', padding: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <Save size={20} /> {saving ? 'GUARDANDO AJUSTES...' : 'GUARDAR CONFIGURACIÓN GENERAL'}
        </button>
      </form>
      <style>{`
        @media (max-width: 768px) {
          .settings-grid {
            grid-template-columns: 1fr !important;
          }
          .settings-grid [style*="span 2"] {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
