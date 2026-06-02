'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Tipos ─────────────────────────────────────────────────── */
export type ServiceType = 'web' | 'kit-digital' | 'automatizacion' | 'marketing';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: ServiceType;
  systemName?: string;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

/* ─── Configuración por servicio ─────────────────────────────── */
const SERVICE_CONFIG: Record<ServiceType, {
  label: string;
  numero: string;
  showDescNegocio: boolean;
  showDescNecesidad: boolean;
  showPresupuesto: boolean;
  labelWeb: string;
  labelDesc: string;
  placeholderDesc: string;
}> = {
  'web': {
    label: 'Diseño Web Corporativa',
    numero: '01',
    showDescNegocio: false,
    showDescNecesidad: true,
    showPresupuesto: false,
    labelWeb: 'Tu web actual (si tienes)',
    labelDesc: 'Cuéntanos qué necesitas',
    placeholderDesc: 'Describe brevemente el proyecto web que tienes en mente...',
  },
  'kit-digital': {
    label: 'Kit Digital',
    numero: '02',
    showDescNegocio: true,
    showDescNecesidad: false,
    showPresupuesto: false,
    labelWeb: 'Tu web actual (si tienes)',
    labelDesc: 'Cuéntanos de qué va tu empresa',
    placeholderDesc: 'Describe tu empresa, sector y cuántos empleados tenéis...',
  },
  'automatizacion': {
    label: 'Automatizaciones',
    numero: '04',
    showDescNegocio: false,
    showDescNecesidad: true,
    showPresupuesto: false,
    labelWeb: 'Link de tu web actual (si tienes)',
    labelDesc: '¿Qué necesitas automatizar?',
    placeholderDesc: '¿Qué proceso quieres automatizar o cuál es tu idea?',
  },
  'marketing': {
    label: 'Marketing y Ads',
    numero: '05',
    showDescNegocio: false,
    showDescNecesidad: true,
    showPresupuesto: true,
    labelWeb: 'Tu web actual (si tienes)',
    labelDesc: '¿Qué servicios ofrece tu negocio?',
    placeholderDesc: 'Describe brevemente a qué se dedica tu empresa...',
  },
};

const PRESUPUESTO_RANGOS = [
  '< 500 €/mes',
  '500 – 1.000 €/mes',
  '1.000 – 2.500 €/mes',
  '2.500 – 5.000 €/mes',
  '> 5.000 €/mes',
];

/* ─── Componente ─────────────────────────────────────────────── */
export default function ContactModal({ isOpen, onClose, serviceType, systemName }: ContactModalProps) {
  const config = SERVICE_CONFIG[serviceType];

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [webActual, setWebActual] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [presupuesto, setPresupuesto] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const firstInputRef = useRef<HTMLInputElement>(null);

  /* Focus al abrir */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* Cerrar con Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  /* Reset al cambiar servicio o abrir */
  useEffect(() => {
    if (isOpen) {
      setNombre(''); setEmail(''); setWebActual('');
      setDescripcion(systemName ? `Estoy interesado en el sistema/expositor: ${systemName}` : '');
      setPresupuesto('');
      setStatus('idle'); setErrorMsg('');
    }
  }, [isOpen, serviceType, systemName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim()) {
      setErrorMsg('Nombre y email son obligatorios.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('Introduce un email válido.');
      return;
    }
    setErrorMsg('');
    setStatus('sending');

    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType,
          nombre: nombre.trim(),
          email: email.trim(),
          webActual: webActual.trim() || undefined,
          descripcion: descripcion.trim() || undefined,
          presupuesto: presupuesto || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error desconocido');
      }

      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Error al enviar. Inténtalo de nuevo.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Wrapper para centrar con Flexbox */}
          <div className="modal-wrapper">
            {/* Panel */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`Formulario de contacto — ${config.label}`}
              className="modal-panel"
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
            {/* Header */}
            <div className="modal-header">
              <div className="modal-header-meta">
                <span className="modal-numero">{config.numero}</span>
                <span className="modal-protocol">PROTOCOL</span>
              </div>
              <button
                className="modal-close"
                onClick={onClose}
                aria-label="Cerrar formulario"
              >
                ✕
              </button>
            </div>

            <h2 className="modal-title">{config.label}</h2>
            <p className="modal-subtitle">
              Cuéntanos qué necesitas y te contactamos en menos de 24 h.
            </p>

            {status === 'success' ? (
              <div className="modal-success" role="alert">
                <span className="modal-success-icon" aria-hidden="true">✓</span>
                <strong>Mensaje recibido.</strong>
                <p>Te contactaremos en menos de 24 horas. Gracias por confiar en nosotros.</p>
                <button className="modal-btn" onClick={onClose}>Cerrar</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="modal-form" noValidate>

                {/* Nombre */}
                <div className="modal-field">
                  <label htmlFor={`modal-nombre-${serviceType}`} className="modal-label">
                    Nombre <span aria-hidden="true">*</span>
                  </label>
                  <input
                    ref={firstInputRef}
                    id={`modal-nombre-${serviceType}`}
                    type="text"
                    className="modal-input"
                    placeholder="Tu nombre completo"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>

                {/* Email */}
                <div className="modal-field">
                  <label htmlFor={`modal-email-${serviceType}`} className="modal-label">
                    Email <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id={`modal-email-${serviceType}`}
                    type="email"
                    className="modal-input"
                    placeholder="tu@empresa.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                {/* Web actual */}
                <div className="modal-field">
                  <label htmlFor={`modal-web-${serviceType}`} className="modal-label">
                    {config.labelWeb}
                  </label>
                  <input
                    id={`modal-web-${serviceType}`}
                    type="url"
                    className="modal-input"
                    placeholder="https://tuweb.com"
                    value={webActual}
                    onChange={e => setWebActual(e.target.value)}
                    autoComplete="url"
                  />
                </div>

                {/* Descripción (negocio o necesidad) */}
                {(config.showDescNegocio || config.showDescNecesidad) && (
                  <div className="modal-field">
                    <label htmlFor={`modal-desc-${serviceType}`} className="modal-label">
                      {config.labelDesc}
                    </label>
                    <textarea
                      id={`modal-desc-${serviceType}`}
                      className="modal-textarea"
                      placeholder={config.placeholderDesc}
                      value={descripcion}
                      onChange={e => setDescripcion(e.target.value)}
                      rows={4}
                    />
                  </div>
                )}

                {/* Presupuesto (solo servicio 05) */}
                {config.showPresupuesto && (
                  <div className="modal-field">
                    <label htmlFor={`modal-presupuesto-${serviceType}`} className="modal-label">
                      ¿Cuánto estás dispuesto a invertir al mes en publicidad?
                    </label>
                    <select
                      id={`modal-presupuesto-${serviceType}`}
                      className="modal-select"
                      value={presupuesto}
                      onChange={e => setPresupuesto(e.target.value)}
                    >
                      <option value="">Selecciona un rango</option>
                      {PRESUPUESTO_RANGOS.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Error message */}
                {(status === 'error' || errorMsg) && (
                  <p className="modal-error" role="alert">{errorMsg || 'Error al enviar. Inténtalo de nuevo.'}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className="modal-btn"
                  disabled={status === 'sending'}
                  aria-busy={status === 'sending'}
                >
                  {status === 'sending' ? (
                    <span className="modal-spinner" aria-hidden="true" />
                  ) : null}
                  {status === 'sending' ? 'Enviando...' : 'Enviar mensaje →'}
                </button>

              </form>
            )}
            </motion.div>
          </div>
        </>
      )}

      {/* ── Estilos scoped ───────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `

        /* Overlay */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          z-index: 9998;
        }

        /* Wrapper para centrado flexbox */
        .modal-wrapper {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          pointer-events: none;
          padding: 2rem;
        }

        /* Panel */
        .modal-panel {
          pointer-events: auto;
          position: relative;
          background: #111111;
          border: 1px solid #333333;
          width: min(560px, calc(100vw - 2rem));
          max-height: calc(100vh - 4rem);
          overflow-y: auto;
          padding: 2.5rem;
          box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6);
        }

        /* Scrollbar del panel */
        .modal-panel::-webkit-scrollbar { width: 4px; }
        .modal-panel::-webkit-scrollbar-track { background: #111; }
        .modal-panel::-webkit-scrollbar-thumb { background: #333; }

        /* Header */
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .modal-header-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .modal-numero {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #ffffff;
        }

        .modal-protocol {
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.3em;
          color: #888888;
        }

        .modal-close {
          background: none;
          border: none;
          color: #888888;
          font-size: 1rem;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          transition: color 0.2s ease;
          line-height: 1;
        }

        .modal-close:hover { color: #ffffff; }

        /* Título */
        .modal-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.35rem, 3vw, 1.65rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          margin-bottom: 0.5rem;
          color: #ffffff;
        }

        .modal-subtitle {
          font-size: 0.9rem;
          color: #888888;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        /* Formulario */
        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .modal-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .modal-label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #aaaaaa;
        }

        .modal-label span { color: #ffffff; }

        .modal-input,
        .modal-textarea,
        .modal-select {
          background: #000000;
          border: 1px solid #333333;
          color: #ffffff;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          padding: 0.75rem 1rem;
          outline: none;
          transition: border-color 0.2s ease;
          width: 100%;
          border-radius: 0;
          -webkit-appearance: none;
          appearance: none;
        }

        .modal-input::placeholder,
        .modal-textarea::placeholder {
          color: #555555;
        }

        .modal-input:focus,
        .modal-textarea:focus,
        .modal-select:focus {
          border-color: #ffffff;
        }

        .modal-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .modal-select {
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;
        }

        .modal-select option {
          background: #111111;
          color: #ffffff;
        }

        /* Error */
        .modal-error {
          font-size: 0.82rem;
          color: #f87171;
          padding: 0.5rem 0;
        }

        /* Botón submit */
        .modal-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: #ffffff;
          color: #000000;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: none;
          padding: 0.9rem 1.75rem;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease, opacity 0.2s ease;
          width: 100%;
          margin-top: 0.5rem;
          border-radius: 0;
        }

        .modal-btn:hover:not(:disabled) {
          background: #e5e5e5;
        }

        .modal-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Spinner */
        .modal-spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid #000000;
          border-top-color: transparent;
          border-radius: 50%;
          animation: modalSpin 0.7s linear infinite;
          flex-shrink: 0;
        }

        @keyframes modalSpin {
          to { transform: rotate(360deg); }
        }

        /* Estado success */
        .modal-success {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1.5rem 0;
        }

        .modal-success-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: 1px solid #ffffff;
          color: #ffffff;
          font-size: 1.2rem;
        }

        .modal-success strong {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.1rem;
          color: #ffffff;
        }

        .modal-success p {
          font-size: 0.9rem;
          color: #888888;
          line-height: 1.6;
        }

        .modal-success .modal-btn {
          width: auto;
          margin-top: 1rem;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .modal-wrapper {
            padding: 0;
            align-items: flex-end;
          }
          .modal-panel {
            padding: 1.75rem 1.25rem;
            width: 100%;
            max-height: 92vh;
            border-bottom: none;
          }
        }

      `}} />
    </AnimatePresence>
  );
}
