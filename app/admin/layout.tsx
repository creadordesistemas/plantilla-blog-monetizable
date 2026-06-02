'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Settings, Package, FileText, Users, LogOut, Menu, X, Mail } from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { name: 'Blog',      icon: FileText,         path: '/admin/blog' },
  { name: 'Comunidad', icon: Users,            path: '/admin/community' },
  { name: 'Newsletter', icon: Mail,            path: '/admin/newsletter' },
  { name: 'Ajustes',   icon: Settings,         path: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const SidebarContent = () => (
    <>
      <div>
        <div style={{
          fontWeight: '900',
          fontSize: '1.1rem',
          marginBottom: '3rem',
          letterSpacing: '-0.05em',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          ADMIN<span style={{ color: '#444' }}>PANEL</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.9rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  color: active ? '#fff' : '#555',
                  backgroundColor: active ? 'rgba(255,255,255,0.07)' : 'transparent',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: active ? '600' : '400',
                  transition: 'all 0.18s',
                  borderLeft: active ? '2px solid #fff' : '2px solid transparent',
                }}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.9rem',
          padding: '0.75rem 1rem',
          color: '#ff4444',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.88rem',
          fontWeight: '500',
          width: '100%',
        }}
      >
        <LogOut size={18} />
        Cerrar Sesión
      </button>
    </>
  );

  if (pathname === '/admin/login') {
    return (
      <div className="admin-wrapper" style={{ minHeight: '100vh', background: '#000' }}>
        {children}
      </div>
    );
  }

  return (
    <div className="admin-wrapper" style={{ display: 'flex', minHeight: '100vh' }}>

      {/* ── Desktop Sidebar ── */}
      <aside className="admin-sidebar">
        <SidebarContent />
      </aside>

      {/* ── Mobile: top bar ── */}
      <div className="admin-topbar">
        <span style={{ fontWeight: '900', fontSize: '1rem', letterSpacing: '-0.04em' }}>
          ADMIN<span style={{ color: '#444' }}>PANEL</span>
        </span>
        <button
          onClick={() => setOpen(true)}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }}
          aria-label="Abrir menú admin"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.7)',
                zIndex: 1100,
              }}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.28 }}
              style={{
                position: 'fixed',
                top: 0, left: 0, bottom: 0,
                width: '260px',
                background: '#0a0a0a',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                zIndex: 1200,
                padding: '2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <button
                onClick={() => setOpen(false)}
                style={{
                  position: 'absolute', top: '1.2rem', right: '1.2rem',
                  background: 'none', border: 'none', color: '#666',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <main className="admin-main">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {children}
        </motion.div>
      </main>

      <style>{`
        /* ── Forzar tema oscuro en todo el panel admin ── */
        .admin-wrapper {
          color-scheme: dark;
          --background: #000000;
          --foreground: #ffffff;
          --border: rgba(255, 255, 255, 0.08);
          background: #000;
          color: #fff;
        }
        .admin-wrapper input,
        .admin-wrapper textarea,
        .admin-wrapper select {
          background: #111;
          color: #fff;
          border-color: rgba(255,255,255,0.12);
        }
        .admin-wrapper input::placeholder,
        .admin-wrapper textarea::placeholder {
          color: #666;
        }

        /* ── Desktop sidebar ── */
        .admin-sidebar {
          width: 240px;
          flex-shrink: 0;
          border-right: 1px solid rgba(255,255,255,0.05);
          padding: 2.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }
        .admin-topbar {
          display: none;
        }
        .admin-main {
          flex: 1;
          min-width: 0;
          padding: 4rem;
          overflow-x: hidden;
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .admin-sidebar {
            display: none !important;
          }
          .admin-topbar {
            display: flex !important;
            position: fixed;
            top: 0; left: 0; right: 0;
            height: 56px;
            background: rgba(0,0,0,0.98);
            border-bottom: 1px solid rgba(255,255,255,0.06);
            padding: 0 1.25rem;
            align-items: center;
            justify-content: space-between;
            z-index: 900;
            backdrop-filter: blur(10px);
          }
          .admin-main {
            padding: 1.5rem 1.25rem;
            padding-top: calc(56px + 1.5rem);
          }
        }

        /* ── Inputs y forms globales del admin ── */
        @media (max-width: 768px) {
          /* Formularios de 2 columnas → 1 columna */
          [style*="gridTemplateColumns: '1fr 1fr'"],
          [style*="gridTemplateColumns: \\"1fr 1fr\\""],
          [style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          /* Headers con título + botón → columna */
          [style*="justifyContent: 'space-between'"][style*="alignItems: 'center'"] {
            flex-wrap: wrap;
            gap: 1rem;
          }
          /* Tablas de items → más compactos */
          [style*="padding: '1.5rem 2rem'"] {
            padding: 1rem !important;
            flex-direction: column !important;
            gap: 1rem !important;
            align-items: flex-start !important;
          }
        }

        /* Glass card del admin */
        .glass {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
