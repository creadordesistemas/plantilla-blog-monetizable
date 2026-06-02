'use client';

import { useState, useMemo } from 'react';

interface AdminChartProps {
  blogPosts: any[];
  members: any[];
}

// Genera datos simulados realistas para los últimos 7 días
function generateSimulatedData(seed: number) {
  const base = [2, 0, 1, 3, 1, 2, 4];
  return base.map((v, i) => Math.max(0, v + Math.round(Math.sin(seed + i) * 1.5)));
}

export default function AdminChart({ blogPosts = [], members = [] }: AdminChartProps) {
  const [activeTab, setActiveTab] = useState<'both' | 'blog' | 'members'>('both');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Genera las etiquetas de los últimos 7 días
  const labels = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    });
  }, []);

  // Cuenta registros reales por día
  const getRealCounts = (data: any[]) => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      return data.filter((item: any) => item.created_at?.split('T')[0] === dateStr).length;
    });
  };

  const blogReal = getRealCounts(blogPosts);
  const membersReal = getRealCounts(members);

  // Si todos los valores son 0, usar datos simulados
  const allZero = blogReal.every(v => v === 0) && membersReal.every(v => v === 0);
  const blogData = allZero ? generateSimulatedData(1) : blogReal;
  const membersData = allZero ? generateSimulatedData(3) : membersReal;

  const isSimulated = allZero;

  // Parámetros SVG
  const chartWidth = 600;
  const chartHeight = 220;
  const paddingX = 48;
  const paddingY = 24;
  const usableW = chartWidth - paddingX * 2;
  const usableH = chartHeight;
  const totalH = chartHeight + paddingY * 2;

  const maxVal = Math.max(...blogData, ...membersData, 3);

  // Convierte un valor a coordenada Y
  const toY = (val: number) => paddingY + usableH * (1 - val / maxVal);
  // Convierte un índice a coordenada X
  const toX = (i: number) => paddingX + (usableW / (blogData.length - 1)) * i;

  // Genera el path de una línea SVG
  const buildPath = (data: number[]) => {
    return data
      .map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)} ${toY(v).toFixed(1)}`)
      .join(' ');
  };

  // Genera el path del área rellena (bajo la línea)
  const buildArea = (data: number[]) => {
    const line = buildPath(data);
    const lastX = toX(data.length - 1).toFixed(1);
    const firstX = toX(0).toFixed(1);
    const baseY = (paddingY + usableH).toFixed(1);
    return `${line} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
  };

  const blogPath = buildPath(blogData);
  const membersPath = buildPath(membersData);
  const blogArea = buildArea(blogData);
  const membersArea = buildArea(membersData);

  const BLOG_COLOR = '#6366f1';
  const MEMBERS_COLOR = '#10b981';

  const showBlog = activeTab === 'both' || activeTab === 'blog';
  const showMembers = activeTab === 'both' || activeTab === 'members';

  return (
    <div className="glass" style={{ padding: '2.5rem', border: '1px solid #222', background: '#0a0a0a', position: 'relative' }}>
      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.25em', color: '#666', textTransform: 'uppercase' }}>
            MÉTRICAS // ACTIVIDAD_DIARIA
          </span>
          <h3 style={{ fontSize: '1.4rem', fontFamily: 'Space Grotesk', fontWeight: '700', color: '#fff', marginTop: '0.25rem' }}>
            REGISTROS POR DÍA
          </h3>
          {isSimulated && (
            <span style={{ fontSize: '0.6rem', color: '#6366f1', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', padding: '2px 8px', fontWeight: '700', letterSpacing: '0.08em', display: 'inline-block', marginTop: '0.4rem' }}>
              ◈ DATOS SIMULADOS — DEMO
            </span>
          )}
        </div>

        {/* Selector de vista */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', border: '1px solid #222', padding: '2px', background: '#000' }}>
            {(['both', 'blog', 'members'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setHoveredIndex(null); }}
                style={{
                  padding: '0.35rem 0.85rem',
                  background: activeTab === tab ? '#fff' : 'transparent',
                  color: activeTab === tab ? '#000' : '#666',
                  border: 'none',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  transition: 'all 0.2s'
                }}
              >
                {tab === 'both' ? 'Ambos' : tab === 'blog' ? `Blog (${blogPosts.length})` : `Miembros (${members.length})`}
              </button>
            ))}
          </div>

          {/* Leyenda */}
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem', color: '#666' }}>
            {showBlog && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ display: 'inline-block', width: '20px', height: '2px', background: BLOG_COLOR, borderRadius: '2px' }} />
                Publicaciones
              </span>
            )}
            {showMembers && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ display: 'inline-block', width: '20px', height: '2px', background: MEMBERS_COLOR, borderRadius: '2px' }} />
                Miembros
              </span>
            )}
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${chartWidth} ${totalH}`}
          style={{ width: '100%', minWidth: '460px', height: 'auto', display: 'block' }}
        >
          <defs>
            {/* Gradientes de relleno */}
            <linearGradient id="blogGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={BLOG_COLOR} stopOpacity="0.18" />
              <stop offset="100%" stopColor={BLOG_COLOR} stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="membersGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={MEMBERS_COLOR} stopOpacity="0.14" />
              <stop offset="100%" stopColor={MEMBERS_COLOR} stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Líneas horizontales de cuadrícula */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingY + usableH * (1 - ratio);
            const val = Math.round(maxVal * ratio);
            return (
              <g key={idx}>
                <line
                  x1={paddingX} y1={y}
                  x2={chartWidth - paddingX} y2={y}
                  stroke="#1a1a1a" strokeWidth="1" strokeDasharray="3 5"
                />
                <text x={paddingX - 8} y={y + 4} fill="#444" fontSize="9" fontFamily="monospace" textAnchor="end">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Áreas bajo las líneas */}
          {showMembers && <path d={membersArea} fill="url(#membersGrad)" />}
          {showBlog && <path d={blogArea} fill="url(#blogGrad)" />}

          {/* Líneas principales */}
          {showMembers && (
            <path
              d={membersPath}
              fill="none"
              stroke={MEMBERS_COLOR}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: 'drawLine 1.2s ease-out forwards' }}
            />
          )}
          {showBlog && (
            <path
              d={blogPath}
              fill="none"
              stroke={BLOG_COLOR}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: 'drawLine 1s ease-out forwards' }}
            />
          )}

          {/* Puntos interactivos */}
          {blogData.map((val, i) => {
            const cx = toX(i);
            const cy = toY(val);
            const isHov = hoveredIndex === i;
            return (
              <g
                key={`pt-${i}`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Zona de hover */}
                <rect
                  x={cx - usableW / blogData.length / 2}
                  y={paddingY}
                  width={usableW / blogData.length}
                  height={usableH}
                  fill="transparent"
                />
                {/* Línea vertical de hover */}
                {isHov && (
                  <line x1={cx} y1={paddingY} x2={cx} y2={paddingY + usableH} stroke="#333" strokeWidth="1" strokeDasharray="3 3" />
                )}
                {/* Punto blog */}
                {showBlog && (
                  <circle cx={cx} cy={cy} r={isHov ? 5 : 3} fill={isHov ? '#fff' : BLOG_COLOR} stroke={BLOG_COLOR} strokeWidth="1.5" style={{ transition: 'r 0.15s, fill 0.15s' }} />
                )}
                {/* Punto miembros */}
                {showMembers && (
                  <circle cx={cx} cy={toY(membersData[i])} r={isHov ? 5 : 3} fill={isHov ? '#fff' : MEMBERS_COLOR} stroke={MEMBERS_COLOR} strokeWidth="1.5" style={{ transition: 'r 0.15s, fill 0.15s' }} />
                )}
                {/* Etiqueta de fecha */}
                <text
                  x={cx} y={totalH - 8}
                  fill={isHov ? '#fff' : '#555'}
                  fontSize="9"
                  fontFamily="Space Grotesk"
                  fontWeight="600"
                  textAnchor="middle"
                  style={{ transition: 'fill 0.15s' }}
                >
                  {labels[i].toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip flotante */}
        {hoveredIndex !== null && (
          <div style={{
            position: 'absolute',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#0d0d0d',
            border: '1px solid #333',
            padding: '0.8rem 1.2rem',
            pointerEvents: 'none',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
            zIndex: 10,
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
            minWidth: '160px'
          }}>
            <div style={{ color: '#555', borderBottom: '1px solid #222', paddingBottom: '0.3rem', marginBottom: '0.2rem', fontWeight: '700', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
              {labels[hoveredIndex].toUpperCase()}
            </div>
            {showBlog && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: BLOG_COLOR, display: 'inline-block', flexShrink: 0 }} />
                <span style={{ color: '#888' }}>Publicaciones:</span>
                <strong style={{ color: BLOG_COLOR }}>{blogData[hoveredIndex]}</strong>
              </div>
            )}
            {showMembers && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: MEMBERS_COLOR, display: 'inline-block', flexShrink: 0 }} />
                <span style={{ color: '#888' }}>Miembros:</span>
                <strong style={{ color: MEMBERS_COLOR }}>{membersData[hoveredIndex]}</strong>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes drawLine {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: 0; }
        }
        path[stroke] {
          stroke-dasharray: 1000;
        }
      `}</style>
    </div>
  );
}
