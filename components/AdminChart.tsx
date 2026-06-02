'use client';

import { useState } from 'react';

interface AdminChartProps {
  blogPosts: any[];
  members: any[];
}

export default function AdminChart({ blogPosts = [], members = [] }: AdminChartProps) {
  const [activeTab, setActiveTab] = useState<'blog' | 'members'>('blog');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 1. Agrupar registros por fecha (últimos 7 días)
  const getDailyData = () => {
    const data = activeTab === 'blog' ? blogPosts : members;
    const days = 7;
    const result = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(now.getDate() - i);
      const dateStr = targetDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
      const targetDateStr = targetDate.toISOString().split('T')[0];

      // Filtrar registros creados este día
      const dayRecords = data.filter((item: any) => {
        if (!item.created_at) return false;
        return item.created_at.split('T')[0] === targetDateStr;
      });

      // Calcular "velas" ficticias basadas en distribución horaria real
      // Si no hay registros, todo es 0
      let open = 0;
      let close = 0;
      let high = 0;
      let low = 0;

      if (dayRecords.length > 0) {
        // Mapear las horas de creación
        const hours = dayRecords.map((r: any) => {
          const date = new Date(r.created_at);
          return date.getHours();
        });

        const minHour = Math.min(...hours);
        const maxHour = Math.max(...hours);

        low = minHour;
        high = maxHour + 1; // Le sumamos 1 para visualización
        open = Math.floor(dayRecords.length * 0.3) || 1;
        close = dayRecords.length;
      }

      result.push({
        date: dateStr,
        count: dayRecords.length,
        open,
        close,
        high,
        low,
        records: dayRecords
      });
    }

    return result;
  };

  const chartData = getDailyData();
  const maxCount = Math.max(...chartData.map(d => d.count), 5); // Evitar división por cero, mínimo escala de 5

  // Parámetros de renderizado SVG
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;
  const width = 600;
  const height = chartHeight + paddingY * 2;
  const usableWidth = width - paddingX * 2;
  const usableHeight = chartHeight;

  return (
    <div className="glass" style={{ padding: '2.5rem', border: '1px solid #222', background: '#0a0a0a', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.25em', color: '#666', textTransform: 'uppercase' }}>
            MÉTRICAS // VOLATILIDAD_ACTIVIDAD
          </span>
          <h3 style={{ fontSize: '1.4rem', fontFamily: 'Space Grotesk', fontWeight: '700', color: '#fff', marginTop: '0.25rem' }}>
            REGISTROS POR DÍA
          </h3>
        </div>

        {/* Selector de Pestañas Monolith */}
        <div style={{ display: 'flex', border: '1px solid #222', padding: '2px', background: '#000' }}>
          <button
            onClick={() => { setActiveTab('blog'); setHoveredIndex(null); }}
            style={{
              padding: '0.4rem 1rem',
              background: activeTab === 'blog' ? '#fff' : 'transparent',
              color: activeTab === 'blog' ? '#000' : '#666',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.2s'
            }}
          >
            Publicaciones ({blogPosts.length})
          </button>
          <button
            onClick={() => { setActiveTab('members'); setHoveredIndex(null); }}
            style={{
              padding: '0.4rem 1rem',
              background: activeTab === 'members' ? '#fff' : 'transparent',
              color: activeTab === 'members' ? '#000' : '#666',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.2s'
            }}
          >
            Comunidad ({members.length})
          </button>
        </div>
      </div>

      {/* Gráfica SVG */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', minWidth: '500px', height: 'auto', display: 'block' }}>
          
          {/* Líneas horizontales de cuadrícula (Grid) */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingY + usableHeight * (1 - ratio);
            const val = Math.round(maxCount * ratio);
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#161616"
                  strokeWidth="1"
                  strokeDasharray="2 4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 4}
                  fill="#444"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Gráfico de Velas / Actividad por Día */}
          {chartData.map((day, idx) => {
            const barCount = chartData.length;
            const x = paddingX + (usableWidth / (barCount - 1 || 1)) * idx;
            
            // Si el conteo es 0, dibujamos una marca en la base
            const isZero = day.count === 0;
            
            // Alturas relativas basadas en conteo
            const topY = paddingY + usableHeight * (1 - day.close / maxCount);
            const bottomY = paddingY + usableHeight * (1 - day.open / maxCount);
            
            // Alturas de mechas (volatilidad diaria basada en distribución horaria 0-24)
            const highY = paddingY + usableHeight * (1 - (day.high / 24) * (day.count / maxCount));
            const lowY = paddingY + usableHeight * (1 - (day.low / 24) * (day.count / maxCount));

            const isHovered = hoveredIndex === idx;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Zona de interacción invisible alrededor del día */}
                <rect
                  x={x - usableWidth / barCount / 2}
                  y={paddingY}
                  width={usableWidth / barCount}
                  height={usableHeight}
                  fill="transparent"
                />

                {!isZero ? (
                  <>
                    {/* Wick (Mecha) - Línea vertical técnica */}
                    <line
                      x1={x}
                      y1={Math.min(highY, topY)}
                      x2={x}
                      y2={Math.max(lowY, bottomY)}
                      stroke={isHovered ? '#fff' : '#444'}
                      strokeWidth="1.5"
                    />

                    {/* Candle Body (Cuerpo de Vela) */}
                    <rect
                      x={x - 6}
                      y={Math.min(topY, bottomY)}
                      width="12"
                      height={Math.max(Math.abs(bottomY - topY), 4)} // Asegurar altura mínima visible
                      fill={isHovered ? '#fff' : 'rgba(255,255,255,0.06)'}
                      stroke={isHovered ? '#fff' : '#666'}
                      strokeWidth="1.5"
                    />
                  </>
                ) : (
                  // Conteo cero: marca técnica sutil
                  <circle
                    cx={x}
                    cy={paddingY + usableHeight}
                    r="2.5"
                    fill="none"
                    stroke="#222"
                    strokeWidth="1.5"
                  />
                )}

                {/* Etiquetas de fechas en X */}
                <text
                  x={x}
                  y={height - 10}
                  fill={isHovered ? '#fff' : '#555'}
                  fontSize="9.5"
                  fontFamily="Space Grotesk"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {day.date.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip Monolith Flotante */}
        {hoveredIndex !== null && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
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
            gap: '0.2rem',
            zIndex: 10,
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
          }}>
            <div style={{ color: '#666', borderBottom: '1px solid #222', paddingBottom: '0.25rem', marginBottom: '0.25rem', fontWeight: '700' }}>
              REGISTRO_DIARIO // {chartData[hoveredIndex].date.toUpperCase()}
            </div>
            <div>
              <span style={{ color: '#888' }}>Conteo Total:</span> <strong style={{ color: 'var(--primary)' }}>{chartData[hoveredIndex].count}</strong>
            </div>
            {chartData[hoveredIndex].count > 0 && (
              <>
                <div>
                  <span style={{ color: '#888' }}>Volatilidad:</span> {chartData[hoveredIndex].low}:00h - {chartData[hoveredIndex].high - 1}:00h
                </div>
                <div>
                  <span style={{ color: '#888' }}>Estado Ecosistema:</span> Sincronizado
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
