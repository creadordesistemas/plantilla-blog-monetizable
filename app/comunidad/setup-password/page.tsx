'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Lock, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function SetupPasswordPage() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tok = params.get('token');
      setToken(tok);
      if (!tok) {
        setStatus('error');
        setErrorMsg('Falta el token de activación en el enlace. Por favor verifica el correo.');
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    if (password.length < 6) {
      setStatus('error');
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setStatus('error');
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/community/setup-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Error al establecer la contraseña.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Error de conexión con el servidor. Inténtalo de nuevo.');
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: 'var(--background)', minHeight: '100vh', paddingTop: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingBottom: '80px' }}>
        <div style={{ width: 'min(460px, 100%)', padding: '0 20px' }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass" 
            style={{ padding: '3rem', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: '#0d0d0d' }}
          >
            <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.3em', color: '#666', marginBottom: '0.75rem' }}>
                MEMBER // SETUP_PASSWORD
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '700', fontFamily: 'Space Grotesk', color: '#fff', marginBottom: '0.5rem' }}>
                ACTIVA TU ACCESO
              </h1>
              <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Crea una contraseña segura para acceder a la biblioteca privada de creadores de sistemas.
              </p>
            </div>

            {status === 'success' ? (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ 
                  width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(0, 255, 0, 0.03)', 
                  border: '1px solid #00ff00', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00ff00' 
                }}>
                  <Check size={28} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>¡Contraseña Establecida!</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                  Tu cuenta ha sido activada correctamente. Ya puedes acceder al panel de miembros utilizando tu email y la contraseña que acabas de configurar.
                </p>
                <a href="/comunidad?login=true" className="btn-primary" style={{ width: '100%', padding: '1rem', textDecoration: 'none', display: 'flex', justifyContent: 'center', fontWeight: '700' }}>
                  INICIAR SESIÓN DE MIEMBRO
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {status === 'error' && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: 'rgba(255,68,68,0.03)', border: '1px solid rgba(255,68,68,0.2)', color: '#ff6666', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>{errorMsg}</div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.1em', color: '#aaa', textTransform: 'uppercase' }}>
                    Nueva Contraseña
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#000', border: '1px solid #333', padding: '0.75rem 1rem', position: 'relative' }}>
                    <Lock size={16} color="#555" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      disabled={status === 'loading' || !token}
                      required
                      style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.9rem', width: 'calc(100% - 24px)', outline: 'none' }}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPass(!showPass)}
                      style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.1em', color: '#aaa', textTransform: 'uppercase' }}>
                    Confirmar Contraseña
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#000', border: '1px solid #333', padding: '0.75rem 1rem' }}>
                    <Lock size={16} color="#555" />
                    <input
                      type="password"
                      placeholder="Repite la contraseña"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      disabled={status === 'loading' || !token}
                      required
                      style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.9rem', width: '100%', outline: 'none' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading' || !token}
                  className="btn-primary"
                  style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', cursor: status === 'loading' ? 'not-allowed' : 'pointer', opacity: status === 'loading' ? 0.6 : 1 }}
                >
                  {status === 'loading' ? 'Guardando contraseña...' : 'ESTABLECER CONTRASEÑA'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
