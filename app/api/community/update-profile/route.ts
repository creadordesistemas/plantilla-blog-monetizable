import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { verifySessionToken } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('member-session');

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const memberEmail = verifySessionToken(sessionCookie.value);
    if (!memberEmail) {
      return NextResponse.json({ error: 'Sesión inválida o manipulada' }, { status: 401 });
    }
    const formData = await request.formData();
    
    const nombre = formData.get('nombre') as string | null;
    const file = formData.get('avatarFile') as File | null;
    let avatarUrl = formData.get('avatarUrl') as string | null;

    // Procesar la subida del archivo si se proporciona uno válido
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `avatar-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('blog-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from('blog-images')
        .getPublicUrl(fileName);

      avatarUrl = publicUrlData.publicUrl;
    }

    // Armar objeto de actualización
    const updateFields: any = {};
    if (nombre !== null) {
      updateFields.nombre = nombre.trim();
    }
    if (avatarUrl !== null) {
      updateFields.avatar_url = avatarUrl;
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: 'No hay datos para actualizar' }, { status: 400 });
    }

    // Actualizar la tabla members
    const { data: updatedMember, error: updateError } = await supabaseAdmin
      .from('members')
      .update(updateFields)
      .eq('email', memberEmail)
      .eq('status', 'activo')
      .select()
      .maybeSingle();

    if (updateError || !updatedMember) {
      throw updateError || new Error('No se pudo encontrar el miembro para actualizar');
    }

    return NextResponse.json({
      success: true,
      member: {
        name: updatedMember.nombre,
        email: updatedMember.email,
        avatar_url: updatedMember.avatar_url,
        created_at: updatedMember.created_at
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al actualizar el perfil' }, { status: 500 });
  }
}
