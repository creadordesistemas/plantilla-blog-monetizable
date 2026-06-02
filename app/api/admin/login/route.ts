'use strict';

import { NextResponse } from 'next/server';
import { signSessionToken } from '@/lib/security';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const IS_DEMO = process.env.NEXT_PUBLIC_IS_DEMO === 'true';
    const ADMIN_USER = process.env.ADMIN_USER || (IS_DEMO ? 'admin' : null);
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || (IS_DEMO ? 'admin' : null);

    if (!ADMIN_USER || !ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, message: 'Error de configuración del servidor' }, { status: 500 });
    }

    if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true });
      
      // Cookie firmada con HMAC-SHA256 — no se puede falsificar sin conocer JWT_SECRET
      response.cookies.set('admin-session', signSessionToken('admin-authorized'), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ success: false, message: 'Credenciales inválidas' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error en el servidor' }, { status: 500 });
  }
}
