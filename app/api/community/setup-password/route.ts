import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { hashPassword } from '@/lib/security';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();
    
    if (!token) {
      return NextResponse.json({ error: 'El token de activación es requerido.' }, { status: 400 });
    }
    
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres.' }, { status: 400 });
    }

    // 1. Buscar miembro con token válido y que no haya expirado
    const { data: member, error: findError } = await supabaseAdmin
      .from('members')
      .select('*')
      .eq('setup_token', token)
      .maybeSingle();

    if (findError || !member) {
      return NextResponse.json({ 
        error: 'El token de invitación es inválido o ya fue utilizado.' 
      }, { status: 400 });
    }

    // Verificar si el token ya expiró
    const expirationDate = new Date(member.setup_token_expires);
    if (expirationDate < new Date()) {
      return NextResponse.json({ 
        error: 'El enlace de invitación ha expirado. Por favor solicita uno nuevo.' 
      }, { status: 400 });
    }

    // 2. Hashear la nueva contraseña
    const passwordHash = hashPassword(password);

    // 3. Actualizar la contraseña en la base de datos y limpiar los campos del token
    const { error: updateError } = await supabaseAdmin
      .from('members')
      .update({
        password_hash: passwordHash,
        setup_token: null,
        setup_token_expires: null
      })
      .eq('id', member.id);

    if (updateError) {
      return NextResponse.json({ error: 'Error al actualizar la contraseña del miembro.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al procesar la solicitud' }, { status: 500 });
  }
}
