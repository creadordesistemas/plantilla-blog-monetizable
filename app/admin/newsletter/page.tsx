'use client';

import { useState } from 'react';
import { Send, Check, AlertCircle, Eye } from 'lucide-react';

export default function AdminNewsletterPage() {
  // Estados para envío
  const [newsletter, setNewsletter] = useState({
    asunto: '',
    titulo: '',
    cuerpo: '',
    listaId: '3', // ID 3 por defecto (Newsletter general)
  });

  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletter.asunto || !newsletter.titulo || !newsletter.cuerpo) {
      showFeedback('error', 'Por favor, rellena todos los campos del boletín');
      return;
    }

    if (confirm('¿Estás seguro de que deseas enviar este boletín de inmediato a todos los contactos de la lista seleccionada?')) {
      setSending(true);
      try {
        const res = await fetch('/api/admin/newsletter/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newsletter),
        });
        const data = await res.json();
        if (res.ok) {
          showFeedback('success', 'Boletín enviado con éxito a la lista de Brevo');
          setNewsletter({ asunto: '', titulo: '', cuerpo: '', listaId: '3' });
        } else {
          showFeedback('error', data.error || 'Error al enviar la campaña');
        }
      } catch (err) {
        showFeedback('error', 'Error de conexión con el backend');
      } finally {
        setSending(false);
      }
    }
  };

  // Convertidor simple para previsualización HTML
  const getPreviewHtml = () => {
    let parsedCuerpo = newsletter.cuerpo
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^### (.*?)$/gm, '<h3 style="color:#ffffff;font-size:1.1rem;margin-top:15px;margin-bottom:5px;">$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2 style="color:#ffffff;font-size:1.3rem;margin-top:20px;margin-bottom:8px;">$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1 style="color:#ffffff;font-size:1.5rem;margin-top:25px;margin-bottom:10px;">$1</h1>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color:#00ff00;text-decoration:none;border-bottom:1px solid #00ff00">$1</a>');

    // Separar párrafos
    parsedCuerpo = parsedCuerpo
      .split(/\n\s*\n/)
      .map(p => {
        p = p.trim();
        if (!p) return '';
        if (p.startsWith('<h')) return p;
        return `<p style="margin-top:0;margin-bottom:1rem;line-height:1.6;color:#cccccc;">${p}</p>`;
      })
      .join('\n');

    return `
      <div style="background-color: #000000; color: #ffffff; padding: 25px 15px; font-family: sans-serif; font-size: 0.95rem;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #0d0d0d; border: 1px solid #222; padding: 25px; box-sizing: border-box;">
          <div style="border-bottom: 1px solid #222; padding-bottom: 15px; margin-bottom: 20px; text-transform: uppercase; font-size: 0.65rem; letter-spacing: 0.25em; color: #666; font-weight: 700;">
            [NOMBRE DE TU BLOG / MARCA] // BOLETÍN OFICIAL
          </div>
          <h1 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 20px; color: #ffffff; line-height: 1.3;">
            ${newsletter.titulo || 'TITULO DEL CORREO'}
          </h1>
          <div style="color: #cccccc;">
            ${parsedCuerpo || 'Escribe contenido en el cuerpo usando Markdown para ver la previsualización...'}
          </div>
          <div style="margin-top: 35px; border-top: 1px solid #222; padding-top: 15px; font-size: 0.65rem; color: #555; line-height: 1.5;">
            Recibes este correo porque te suscribiste a tudominio.com.<br>
            Puedes gestionar tu suscripción o darte de baja a través de los enlaces provistos por Brevo.
          </div>
        </div>
      </div>
    `;
  };

  return (
    <div>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>NEWSLETTER</h1>
        <p style={{ color: '#666' }}>Crea, redacta y dispara boletines oficiales a través de la integración con Brevo.</p>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem' }} className="newsletter-grid">
        {/* Formulario de redacción */}
        <form onSubmit={handleSendNewsletter} className="glass" style={{ padding: '2.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: '700' }}>Redacción del Boletín</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#888', fontWeight: '700' }}>REMITENTE OFICIAL</label>
              <input 
                type="text" 
                value="info@tudominio.com" 
                disabled 
                style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.02)', border: '1px solid #222', color: '#555', borderRadius: '4px', cursor: 'not-allowed' }} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#888', fontWeight: '700' }}>LISTA DE CORREO DESTINO</label>
              <select 
                value={newsletter.listaId} 
                onChange={e => setNewsletter({...newsletter, listaId: e.target.value})} 
                style={{ padding: '1rem', background: '#000', border: '1px solid #222', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
              >
                <option value="3">Newsletter General (ID 3)</option>
                <option value="4">Newsletter Miembros (ID 4)</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#888', fontWeight: '700' }}>ASUNTO DEL CORREO (SUBJECT)</label>
              <input 
                type="text" 
                placeholder="Ej: Nuevo lanzamiento: Arquitectura Modular v2"
                value={newsletter.asunto} 
                onChange={e => setNewsletter({...newsletter, asunto: e.target.value})} 
                style={{ padding: '1rem', background: '#000', border: '1px solid #222', color: '#fff', borderRadius: '4px' }} 
                required 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#888', fontWeight: '700' }}>TÍTULO DE CABECERA (H1)</label>
              <input 
                type="text" 
                placeholder="Ej: NUEVA INFRAESTRUCTURA DISPONIBLE"
                value={newsletter.titulo} 
                onChange={e => setNewsletter({...newsletter, titulo: e.target.value})} 
                style={{ padding: '1rem', background: '#000', border: '1px solid #222', color: '#fff', borderRadius: '4px' }} 
                required 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#888', fontWeight: '700' }}>CUERPO DEL MENSAJE (MARKDOWN)</label>
              <textarea 
                placeholder="Escribe el cuerpo del correo en Markdown..."
                value={newsletter.cuerpo} 
                onChange={e => setNewsletter({...newsletter, cuerpo: e.target.value})} 
                style={{ padding: '1rem', background: '#000', border: '1px solid #222', color: '#fff', borderRadius: '4px', height: '220px', fontFamily: 'monospace', resize: 'vertical' }} 
                required 
              />
            </div>
          </div>

          <button type="submit" disabled={sending} className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
            <Send size={18} /> {sending ? 'Enviando Campaña...' : 'Disparar Boletín Masivo'}
          </button>
        </form>

        {/* Previsualización en vivo */}
        <div className="glass" style={{ padding: '2.5rem', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Eye size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Previsualización en Tiempo Real</h3>
          </div>
          
          <div 
            style={{ 
              flex: 1, 
              border: '1px solid #222', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              background: '#000',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ background: '#111', padding: '0.5rem 1rem', fontSize: '0.75rem', color: '#666', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span>Asunto:</span>
                <span style={{ color: '#aaa', fontWeight: '700', marginLeft: '0.5rem' }}>{newsletter.asunto || '(Vacío)'}</span>
              </div>
              <div>
                <span>Lista:</span>
                <span style={{ color: 'var(--primary)', fontWeight: '700', marginLeft: '0.5rem' }}>
                  {newsletter.listaId === '3' ? 'Newsletter General (ID 3)' : 'Newsletter Miembros (ID 4)'}
                </span>
              </div>
            </div>
            <div 
              style={{ flex: 1, overflowY: 'auto' }}
              dangerouslySetInnerHTML={{ __html: getPreviewHtml() }}
            />
          </div>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 1024px) {
          .newsletter-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
