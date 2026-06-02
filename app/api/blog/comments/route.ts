import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/security';

// GET — Obtener comentarios de un post
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Parámetro slug requerido' }, { status: 400 });
    }

    const { data: comments, error } = await supabaseAdmin
      .from('blog_comments')
      .select('id, created_at, member_name, member_email, content')
      .eq('post_slug', slug)
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: 'Error al obtener debates' }, { status: 500 });
    }

    if (!comments || comments.length === 0) {
      return NextResponse.json([]);
    }

    // Resolver y adjuntar de forma masiva los avatares correspondientes de la tabla 'members'
    const emails = Array.from(new Set(comments.map(c => c.member_email)));
    const { data: membersInfo } = await supabaseAdmin
      .from('members')
      .select('email, avatar_url')
      .in('email', emails);

    const avatarMap = new Map();
    if (membersInfo) {
      membersInfo.forEach(m => {
        avatarMap.set(m.email, m.avatar_url);
      });
    }

    const commentsWithAvatars = comments.map(c => ({
      ...c,
      member_avatar_url: avatarMap.get(c.member_email) || null
    }));

    return NextResponse.json(commentsWithAvatars);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — Publicar comentario (solo miembros con sesión activa)
export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('member-session');

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Acceso restringido: sesión de miembro requerida' }, { status: 401 });
    }

    const memberEmail = verifySessionToken(sessionCookie.value);
    if (!memberEmail) {
      return NextResponse.json({ error: 'Sesión inválida o manipulada' }, { status: 401 });
    }

    // Obtener nombre y avatar del miembro desde Supabase
    const { data: member, error: memberError } = await supabaseAdmin
      .from('members')
      .select('nombre, email, status, avatar_url')
      .eq('email', memberEmail)
      .eq('status', 'activo')
      .maybeSingle();

    if (memberError || !member) {
      return NextResponse.json({ error: 'Sesión inválida o membresía inactiva' }, { status: 403 });
    }

    const { slug, content } = await request.json();

    if (!slug || !content?.trim()) {
      return NextResponse.json({ error: 'Slug y contenido son requeridos' }, { status: 400 });
    }

    if (content.trim().length > 1000) {
      return NextResponse.json({ error: 'El comentario no puede superar 1000 caracteres' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('blog_comments')
      .insert({
        post_slug: slug,
        member_email: memberEmail,
        member_name: member.nombre || memberEmail.split('@')[0],
        content: content.trim(),
      })
      .select('id, created_at, member_name, member_email, content')
      .single();

    if (error) {
      return NextResponse.json({ error: 'Error al publicar el debate' }, { status: 500 });
    }

    return NextResponse.json({
      ...data,
      member_avatar_url: member.avatar_url || null
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT — Editar comentario (solo el autor)
export async function PUT(request: Request) {
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
    const { id, content } = await request.json();

    if (!id || !content?.trim()) {
      return NextResponse.json({ error: 'ID y contenido son requeridos' }, { status: 400 });
    }

    if (content.trim().length > 1000) {
      return NextResponse.json({ error: 'El comentario no puede superar 1000 caracteres' }, { status: 400 });
    }

    // Verificar autoría en la base de datos
    const { data: existingComment, error: findError } = await supabaseAdmin
      .from('blog_comments')
      .select('member_email')
      .eq('id', id)
      .maybeSingle();

    if (findError || !existingComment) {
      return NextResponse.json({ error: 'Comentario no encontrado' }, { status: 404 });
    }

    if (existingComment.member_email !== memberEmail) {
      return NextResponse.json({ error: 'No tienes permisos para editar este comentario' }, { status: 403 });
    }

    // Actualizar el comentario
    const { data: updatedComment, error: updateError } = await supabaseAdmin
      .from('blog_comments')
      .update({ content: content.trim() })
      .eq('id', id)
      .select('id, created_at, member_name, member_email, content')
      .single();

    if (updateError) {
      return NextResponse.json({ error: 'Error al actualizar el comentario' }, { status: 500 });
    }

    return NextResponse.json(updatedComment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — Eliminar comentario (solo el autor)
export async function DELETE(request: Request) {
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID de comentario requerido' }, { status: 400 });
    }

    // Verificar autoría en la base de datos
    const { data: existingComment, error: findError } = await supabaseAdmin
      .from('blog_comments')
      .select('member_email')
      .eq('id', id)
      .maybeSingle();

    if (findError || !existingComment) {
      return NextResponse.json({ error: 'Comentario no encontrado' }, { status: 404 });
    }

    if (existingComment.member_email !== memberEmail) {
      return NextResponse.json({ error: 'No tienes permisos para eliminar este comentario' }, { status: 403 });
    }

    // Eliminar el comentario
    const { error: deleteError } = await supabaseAdmin
      .from('blog_comments')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return NextResponse.json({ error: 'Error al eliminar el comentario' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
