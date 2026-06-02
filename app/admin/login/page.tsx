'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--background)'
    }}>
      <form onSubmit={handleSubmit} style={{
        padding: '2rem',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <h1 style={{ textAlign: 'center' }}>Admin Login</h1>
        
        {error && <p style={{ color: 'red', fontSize: '0.875rem' }}>{error}</p>}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="username">Usuario</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: '0.75rem',
            backgroundColor: 'var(--foreground)',
            color: 'var(--background)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '0.5rem'
          }}
        >
          {loading ? 'Cargando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
