import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Verifica un token firmado con HMAC-SHA256 usando Web Crypto API.
 * Compatible con el Edge Runtime de Next.js Middleware.
 */
async function verifyAdminToken(token: string, secret: string): Promise<boolean> {
  try {
    const lastDot = token.lastIndexOf('.');
    if (lastDot === -1) return false;

    const payload = token.substring(0, lastDot);
    const signature = token.substring(lastDot + 1);

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const expectedSigBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    const expectedSig = btoa(String.fromCharCode(...Array.from(new Uint8Array(expectedSigBuffer))))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    return signature === expectedSig;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, '') || '/';
  const secret = process.env.JWT_SECRET || 'fallback-inseguro-cambiar-en-produccion';

  // 1. Proteger rutas de administración
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    const session = request.cookies.get('admin-session');
    if (!session || !(await verifyAdminToken(session.value, secret))) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 1.1. Proteger endpoints de la API de administración
  if (pathname.startsWith('/api/admin')) {
    if (pathname === '/api/admin/login' || pathname === '/api/admin/logout') {
      return NextResponse.next();
    }

    // Permitir GET público en rutas de catálogo
    if ((pathname === '/api/admin/systems' || pathname === '/api/admin/community' || pathname === '/api/admin/resources') && request.method === 'GET') {
      return NextResponse.next();
    }

    const session = request.cookies.get('admin-session');
    if (!session || !(await verifyAdminToken(session.value, secret))) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // 1.2. Login de miembros de la comunidad (público)
  if (pathname.startsWith('/api/community')) {
    return NextResponse.next();
  }

  // 2. Proteger área privada de la comunidad (verificación básica de presencia de cookie)
  if (pathname.startsWith('/comunidad/privado')) {
    const memberSession = request.cookies.get('member-session');
    if (!memberSession) {
      const communityUrl = new URL('/comunidad', request.url);
      return NextResponse.redirect(communityUrl);
    }
  }

  // 3. Headers de seguridad adicionales
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*', '/comunidad/privado/:path*'],
};
