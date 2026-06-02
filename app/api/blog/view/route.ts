import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'Falta el slug del artículo' }, { status: 400 });
    }

    // 1. Obtener visualizaciones actuales del artículo
    const { data: post, error: fetchError } = await supabaseAdmin
      .from('blog')
      .select('id, views')
      .eq('slug', slug)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!post) {
      return NextResponse.json({ error: 'Artículo no encontrado' }, { status: 404 });
    }

    // 2. Incrementar contador localmente
    const currentViews = post.views || 0;
    const { error: updateError } = await supabaseAdmin
      .from('blog')
      .update({ views: currentViews + 1 })
      .eq('id', post.id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, views: currentViews + 1 });
  } catch (error: any) {
    console.error('Error al registrar visita:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
