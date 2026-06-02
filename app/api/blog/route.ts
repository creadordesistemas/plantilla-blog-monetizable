import { NextResponse } from 'next/server';
import { readData } from '@/services/db';

export const revalidate = 60; // Cachear por 60 segundos

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const categoria = searchParams.get('categoria')?.toLowerCase();

    const allPosts = await readData<any[]>('blog') || [];
    
    // Filtrar por publicados
    let posts = allPosts.filter((post: any) => !post.state || post.state === 'publicado');

    // Filtrar por categoría si se especifica
    if (categoria) {
      posts = posts.filter((post: any) => post.categoria?.toLowerCase() === categoria);
    }

    // Ordenar por fecha de publicación (más recientes primero)
    posts.sort((a, b) => {
      const dateA = new Date(a.fechaPublicacion || 0).getTime();
      const dateB = new Date(b.fechaPublicacion || 0).getTime();
      return dateB - dateA;
    });

    // Aplicar límite
    posts = posts.slice(0, isNaN(limit) ? 10 : limit);

    // Mapear al formato limpio para consumo de LLMs / agentes
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tudominio.com';
    const cleanPosts = posts.map((post: any) => ({
      titulo: post.titulo,
      slug: post.slug,
      extracto: post.extracto || (post.contenido ? post.contenido.slice(0, 160) + '...' : ''),
      categoria: post.categoria || 'Sistemas',
      fechaPublicacion: post.fechaPublicacion,
      url: `${siteUrl}/blog/${post.slug}`,
    }));

    return NextResponse.json(cleanPosts, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al obtener los artículos' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
