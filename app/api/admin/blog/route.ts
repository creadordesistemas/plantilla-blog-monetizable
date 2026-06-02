import { NextResponse } from 'next/server';
import { readData, writeData, deleteData } from '@/services/db';
import { indexUrl } from '@/lib/google-indexing';

export async function GET() {
  const data = await readData<any[]>('blog');
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const newItem = await request.json();
    if (!newItem.id) {
      newItem.id = Date.now().toString();
    }
    if (!newItem.state) {
      newItem.state = 'publicado';
    }
    if (!newItem.fechaPublicacion) {
      newItem.fechaPublicacion = new Date().toISOString().split('T')[0];
    }
    await writeData('blog', newItem);

    // Indexación en Google asíncrona si está publicado
    if (newItem.state === 'publicado' && newItem.slug) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tudominio.com';
      const postUrl = `${siteUrl}/blog/${newItem.slug}`;
      indexUrl(postUrl).catch(err => {
        console.error(`[Indexation Async Error] ${postUrl}:`, err);
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al guardar el artículo' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedItem = await request.json();
    if (!updatedItem.id) {
      return NextResponse.json({ error: 'Falta la ID del artículo' }, { status: 400 });
    }
    await writeData('blog', updatedItem);

    // Indexación en Google asíncrona si está publicado
    if (updatedItem.state === 'publicado' && updatedItem.slug) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tudominio.com';
      const postUrl = `${siteUrl}/blog/${updatedItem.slug}`;
      indexUrl(postUrl).catch(err => {
        console.error(`[Indexation Async Error] ${postUrl}:`, err);
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al actualizar el artículo' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Falta la ID del artículo' }, { status: 400 });
    }
    await deleteData('blog', id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al eliminar el artículo' }, { status: 500 });
  }
}
