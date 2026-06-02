import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyPassword, signSessionToken } from '@/lib/security';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'El email es requerido' }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ error: 'La contraseña es requerida' }, { status: 400 });
    }

    const cleanedEmail = email.toLowerCase().trim();

    // Consultar en la tabla members
    const { data: member, error } = await supabaseAdmin
      .from('members')
      .select('*')
      .eq('email', cleanedEmail)
      .eq('status', 'activo')
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: 'Error al consultar la base de datos de miembros' }, { status: 500 });
    }

    if (!member) {
      return NextResponse.json({ 
        error: 'Este email no cuenta con acceso activo a la comunidad. Valida tu membresía o contacta a soporte.' 
      }, { status: 403 });
    }

    // Si el miembro no tiene contraseña establecida (password_hash es null/empty)
    if (!member.password_hash) {
      return NextResponse.json({ 
        error: 'Tu cuenta aún no está activada. Por favor, busca en tu correo el enlace de activación para establecer tu contraseña.' 
      }, { status: 403 });
    }

    // Verificar contraseña
    const isMatch = verifyPassword(password, member.password_hash);
    if (!isMatch) {
      return NextResponse.json({ error: 'La contraseña introducida es incorrecta.' }, { status: 401 });
    }

    // Configurar la cookie de sesión del miembro (email firmado con HMAC-SHA256)
    const response = NextResponse.json({ success: true, redirect: '/comunidad/privado' });
    response.cookies.set('member-session', signSessionToken(cleanedEmail), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 días
      path: '/'
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al iniciar sesión' }, { status: 500 });
  }
}
