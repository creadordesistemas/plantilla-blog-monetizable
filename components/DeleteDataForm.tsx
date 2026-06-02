'use client';

import { useState } from 'react';
import { ShieldAlert, CheckCircle, Loader2 } from 'lucide-react';

export default function DeleteDataForm() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setErrorMsg('Debes confirmar que deseas que eliminemos tus datos personales.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/eliminar-datos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, email, mensaje }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setNombre('');
        setEmail('');
        setMensaje('');
        setConsent(false);
      } else {
        setErrorMsg(data.error || 'Ocurrió un error al procesar tu solicitud.');
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error de red. Por favor, inténtalo de nuevo.');
      setStatus('error');
    }
  };

  return (
    <div
      style={{
        marginTop: '32px',
        border: '1px solid var(--border)',
        background: 'rgba(255, 68, 68, 0.02)',
        padding: '30px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '4px',
          height: '100%',
          backgroundColor: '#ff4444',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <ShieldAlert size={20} style={{ color: '#ff4444' }} />
        <h3
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '1rem',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            margin: 0,
            textTransform: 'uppercase',
            color: '#fff',
          }}
        >
          Canal Auto-Gestionado de Supresión (RGPD)
        </h3>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--foreground-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
        Si deseas ejercer formalmente tu derecho de supresión de datos (derecho al olvido), completa el siguiente formulario. Nuestro departamento de cumplimiento procesará la solicitud en un plazo máximo de 30 días y eliminará tus registros de forma irreversible en Supabase, Stripe y listas de correo asociadas.
      </p>

      {status === 'success' ? (
        <div
          style={{
            background: 'rgba(74, 222, 128, 0.05)',
            border: '1px solid rgba(74, 222, 128, 0.2)',
            padding: '20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <CheckCircle size={32} style={{ color: '#4ade80' }} />
          <strong style={{ fontSize: '0.9rem', color: '#4ade80', fontFamily: 'Space Grotesk' }}>
            Solicitud Recibida con Éxito
          </strong>
          <span style={{ fontSize: '0.82rem', color: 'var(--foreground-secondary)', lineHeight: 1.5 }}>
            Hemos notificado a nuestro equipo de cumplimiento de tu derecho al olvido. Recibirás un correo de confirmación tan pronto como los datos hayan sido eliminados completamente de nuestros sistemas.
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="del-nombre" style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#888', letterSpacing: '0.1em' }}>
                Nombre completo *
              </label>
              <input
                id="del-nombre"
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Serafín Antúnez"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border)',
                  padding: '12px 16px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(255, 68, 68, 0.5)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="del-email" style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#888', letterSpacing: '0.1em' }}>
                Email registrado *
              </label>
              <input
                id="del-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tuemail@ejemplo.com"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border)',
                  padding: '12px 16px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(255, 68, 68, 0.5)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="del-mensaje" style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#888', letterSpacing: '0.1em' }}>
              Motivo o detalles adicionales (opcional)
            </label>
            <textarea
              id="del-mensaje"
              rows={3}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Ej. Deseo darme de baja del boletín y borrar mi cuenta de la comunidad..."
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border)',
                padding: '12px 16px',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
                resize: 'vertical',
                transition: 'border-color 0.2s',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(255, 68, 68, 0.5)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '4px' }}>
            <input
              id="del-consent"
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              style={{ marginTop: '3px', accentColor: '#ff4444', cursor: 'pointer' }}
            />
            <label htmlFor="del-consent" style={{ fontSize: '0.78rem', color: 'var(--foreground-secondary)', lineHeight: 1.5, cursor: 'pointer', userSelect: 'none' }}>
              Confirmo que soy el titular del correo electrónico indicado y solicito formalmente la supresión de mis datos personales de acuerdo con el artículo 17 del RGPD.
            </label>
          </div>

          {status === 'error' && (
            <div style={{ color: '#ff4444', fontSize: '0.8rem', fontWeight: 600 }}>
              ⚠ {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              alignSelf: 'flex-start',
              background: '#ff4444',
              color: '#ffffff',
              border: 'none',
              padding: '12px 24px',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '0.78rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            onMouseEnter={(e) => {
              if (status !== 'loading') e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            {status === 'loading' ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Procesando...
              </>
            ) : (
              'Solicitar Eliminación Permanente'
            )}
          </button>
        </form>
      )}
    </div>
  );
}
