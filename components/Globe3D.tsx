'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function useIsDarkTheme() {
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    const check = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDark(theme !== 'light');
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

export default function Globe3D() {
  const isDark = useIsDarkTheme();
  const pointsRef = useRef<THREE.Points>(null);
  const glowRef = useRef<THREE.Points>(null);

  // Crear la nube de puntos para el globo
  const points = useMemo(() => {
    const p = [];
    const n = 2500;
    const r = 2.5;
    for (let i = 0; i < n; i++) {
      const phi = Math.acos(-1 + (2 * i) / n);
      const theta = Math.sqrt(n * Math.PI) * phi;
      p.push(
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi)
      );
    }
    return new Float32Array(p);
  }, []);

  // Crear puntos de "servidores" (puntos más brillantes)
  const servers = useMemo(() => {
    const p = [];
    const n = 20;
    const r = 2.51; // Ligeramente por encima de la superficie
    for (let i = 0; i < n; i++) {
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      p.push(
        r * Math.cos(phi) * Math.sin(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(theta)
      );
    }
    return new Float32Array(p);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.1;
      pointsRef.current.rotation.x = time * 0.05;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y = time * 0.1;
      glowRef.current.rotation.x = time * 0.05;
      // Efecto de parpadeo para los servidores
      const material = glowRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.5 + Math.sin(time * 3) * 0.5;
    }
  });

  return (
    <group>
      {/* Estructura del globo */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length / 3}
            array={points}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isDark ? 0.015 : 0.025}
          color={isDark ? "#888888" : "#111111"}
          transparent
          opacity={isDark ? 0.6 : 0.9}
          sizeAttenuation
        />
      </points>

      {/* Servidores / Puntos de luz */}
      <points ref={glowRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={servers.length / 3}
            array={servers}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isDark ? 0.08 : 0.06}
          color={isDark ? "#FFFFFF" : "#000000"}
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </points>
      
      {/* Luz ambiente suave */}
      <ambientLight intensity={0.5} />
    </group>
  );
}
