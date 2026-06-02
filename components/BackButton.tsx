'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <div style={{ marginTop: '64px', textAlign: 'center' }}>
      <button
        onClick={() => router.back()}
        className="btn-outline"
        style={{ gap: '0.5rem', display: 'inline-flex', alignItems: 'center' }}
      >
        <span style={{ fontSize: '1rem', lineHeight: 1 }}>←</span>
        Volver
      </button>
    </div>
  );
}
