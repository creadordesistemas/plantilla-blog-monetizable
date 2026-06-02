'use client';

import { motion } from 'framer-motion';

export default function AutomationFlow() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>

      {/* Texto técnico de fondo */}
      <div style={{
        position: 'absolute',
        fontSize: '6.5rem',
        fontWeight: '900',
        color: 'rgba(255,255,255,0.035)',
        userSelect: 'none',
        fontFamily: 'Space Grotesk',
        letterSpacing: '-0.05em',
        pointerEvents: 'none',
      }}>
        SISTEMA
      </div>

      {/* Grid de fondo */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07 }}>
        <defs>
          <pattern id="techgrid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#ffffff" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#techgrid)" />
      </svg>

      {/* SVG principal */}
      <svg
        width="500"
        height="380"
        viewBox="0 0 500 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'relative', zIndex: 1, maxWidth: '100%' }}
      >
        <defs>
          {/* Glow suave */}
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Glow fuerte para nodo central */}
          <filter id="glow-strong" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ─── PATHS DE CONEXIÓN (dashes animadas) ─── */}

        {/* INPUT → CORE */}
        <motion.path
          d="M 112,100 C 168,100 170,192 197,192"
          stroke="#3a3a3a"
          strokeWidth="1"
          strokeDasharray="5 5"
          animate={{ strokeDashoffset: [30, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
        />
        {/* CRM → CORE */}
        <motion.path
          d="M 112,262 C 168,262 170,192 197,192"
          stroke="#3a3a3a"
          strokeWidth="1"
          strokeDasharray="5 5"
          animate={{ strokeDashoffset: [30, 0] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: 'linear', delay: 0.6 }}
        />
        {/* CORE → WEBHOOK */}
        <motion.path
          d="M 303,192 C 332,192 332,100 388,100"
          stroke="#3a3a3a"
          strokeWidth="1"
          strokeDasharray="5 5"
          animate={{ strokeDashoffset: [30, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: 'linear', delay: 0.3 }}
        />
        {/* CORE → DATABASE */}
        <motion.path
          d="M 303,192 C 332,192 332,262 388,262"
          stroke="#3a3a3a"
          strokeWidth="1"
          strokeDasharray="5 5"
          animate={{ strokeDashoffset: [30, 0] }}
          transition={{ duration: 2.3, repeat: Infinity, ease: 'linear', delay: 1.1 }}
        />

        {/* ─── PARTÍCULAS DE DATOS ─── */}

        {/* INPUT → CORE: 2 partículas */}
        <motion.circle r="3.5" fill="white" filter="url(#glow)"
          initial={{ offsetDistance: '0%' }} animate={{ offsetDistance: '100%' }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{ offsetPath: "path('M 112,100 C 168,100 170,192 197,192')" }}
        />
        <motion.circle r="2.5" fill="rgba(255,255,255,0.5)" filter="url(#glow)"
          initial={{ offsetDistance: '0%' }} animate={{ offsetDistance: '100%' }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 1 }}
          style={{ offsetPath: "path('M 112,100 C 168,100 170,192 197,192')" }}
        />

        {/* CRM → CORE */}
        <motion.circle r="3.5" fill="white" filter="url(#glow)"
          initial={{ offsetDistance: '0%' }} animate={{ offsetDistance: '100%' }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear', delay: 0.7 }}
          style={{ offsetPath: "path('M 112,262 C 168,262 170,192 197,192')" }}
        />

        {/* CORE → WEBHOOK */}
        <motion.circle r="3" fill="rgba(255,255,255,0.75)" filter="url(#glow)"
          initial={{ offsetDistance: '0%' }} animate={{ offsetDistance: '100%' }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay: 0.3 }}
          style={{ offsetPath: "path('M 303,192 C 332,192 332,100 388,100')" }}
        />

        {/* CORE → DATABASE */}
        <motion.circle r="3" fill="rgba(255,255,255,0.75)" filter="url(#glow)"
          initial={{ offsetDistance: '0%' }} animate={{ offsetDistance: '100%' }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', delay: 1.2 }}
          style={{ offsetPath: "path('M 303,192 C 332,192 332,262 388,262')" }}
        />

        {/* ─── NODO: INPUT ─── */}
        <rect x="20" y="80" width="92" height="40" fill="rgba(10,10,10,0.95)" stroke="#2e2e2e" strokeWidth="1" />
        {/* Barra superior */}
        <rect x="20" y="80" width="92" height="2" fill="#444" />
        <text x="36" y="97" fill="white" fontSize="9" fontFamily="Space Grotesk" fontWeight="700" letterSpacing="1.5">INPUT</text>
        <text x="36" y="111" fill="#555" fontSize="7" fontFamily="Inter" letterSpacing="1">DATA STREAM</text>
        {/* Indicador ONLINE */}
        <motion.circle cx="29" cy="87" r="3" fill="#4ade80"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />

        {/* ─── NODO: CRM ─── */}
        <rect x="20" y="242" width="92" height="40" fill="rgba(10,10,10,0.95)" stroke="#2e2e2e" strokeWidth="1" />
        <rect x="20" y="242" width="92" height="2" fill="#444" />
        <text x="36" y="259" fill="white" fontSize="9" fontFamily="Space Grotesk" fontWeight="700" letterSpacing="1.5">CRM</text>
        <text x="36" y="273" fill="#555" fontSize="7" fontFamily="Inter" letterSpacing="1">SYNC v2.4</text>
        <motion.circle cx="29" cy="249" r="3" fill="#4ade80"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 2.1, repeat: Infinity, delay: 0.5 }}
        />

        {/* ─── NODO: CORE (principal) ─── */}
        {/* Halo animado exterior */}
        <motion.rect
          x="188" y="163" width="124" height="58"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
          fill="none"
          animate={{ opacity: [0.15, 0.5, 0.15] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        />
        <rect x="193" y="168" width="114" height="48" fill="rgba(5,5,5,0.98)" stroke="#555" strokeWidth="1.5" filter="url(#glow-strong)" />
        {/* Barra superior CORE */}
        <rect x="193" y="168" width="114" height="2.5" fill="#666" />
        <text x="250" y="188" textAnchor="middle" fill="white" fontSize="12" fontFamily="Space Grotesk" fontWeight="700" letterSpacing="3">CORE</text>
        <text x="250" y="204" textAnchor="middle" fill="#555" fontSize="7" fontFamily="Inter" letterSpacing="1.5">PROCESSING UNIT</text>
        {/* Dot CORE */}
        <motion.circle cx="202" cy="176" r="3" fill="#4ade80"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />

        {/* ─── NODO: WEBHOOK ─── */}
        <rect x="388" y="80" width="92" height="40" fill="rgba(10,10,10,0.95)" stroke="#2e2e2e" strokeWidth="1" />
        <rect x="388" y="80" width="92" height="2" fill="#444" />
        <text x="404" y="97" fill="white" fontSize="9" fontFamily="Space Grotesk" fontWeight="700" letterSpacing="1">WEBHOOK</text>
        <text x="404" y="111" fill="#555" fontSize="7" fontFamily="Inter" letterSpacing="1">PORT 443</text>
        <motion.circle cx="397" cy="87" r="3" fill="#4ade80"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.9, repeat: Infinity, delay: 0.3 }}
        />

        {/* ─── NODO: DATABASE ─── */}
        <rect x="388" y="242" width="92" height="40" fill="rgba(10,10,10,0.95)" stroke="#2e2e2e" strokeWidth="1" />
        <rect x="388" y="242" width="92" height="2" fill="#444" />
        <text x="404" y="259" fill="white" fontSize="9" fontFamily="Space Grotesk" fontWeight="700" letterSpacing="1">DATABASE</text>
        <text x="404" y="273" fill="#555" fontSize="7" fontFamily="Inter" letterSpacing="1">STORAGE</text>
        <motion.circle cx="397" cy="249" r="3" fill="#4ade80"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
        />

        {/* ─── MARCADORES DE ESQUINA ─── */}
        <line x1="2" y1="2" x2="18" y2="2" stroke="#333" strokeWidth="1" />
        <line x1="2" y1="2" x2="2" y2="18" stroke="#333" strokeWidth="1" />
        <line x1="498" y1="2" x2="482" y2="2" stroke="#333" strokeWidth="1" />
        <line x1="498" y1="2" x2="498" y2="18" stroke="#333" strokeWidth="1" />
        <line x1="2" y1="378" x2="18" y2="378" stroke="#333" strokeWidth="1" />
        <line x1="2" y1="378" x2="2" y2="362" stroke="#333" strokeWidth="1" />
        <line x1="498" y1="378" x2="482" y2="378" stroke="#333" strokeWidth="1" />
        <line x1="498" y1="378" x2="498" y2="362" stroke="#333" strokeWidth="1" />

        {/* ─── BARRA DE ESTADO INFERIOR ─── */}
        <text x="10" y="373" fill="#333" fontSize="7" fontFamily="'Inter', monospace" letterSpacing="1">BLOG-TEMPLATE / SYS v1.0</text>
        <motion.circle cx="473" cy="370" r="3" fill="#4ade80"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <text x="480" y="374" fill="#4ade80" fontSize="7" fontFamily="Inter" letterSpacing="1">LIVE</text>
      </svg>
    </div>
  );
}
