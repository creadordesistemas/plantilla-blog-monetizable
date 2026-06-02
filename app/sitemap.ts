import { MetadataRoute } from 'next';
import { readData } from '@/services/db';
import { BLOG_CATEGORIES } from '@/lib/categories';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tudominio.com';

  // Obtener artículos del blog desde Supabase
  let posts: any[] = [];
  try {
    const data = await readData<any[]>('blog');
    posts = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error cargando artículos para el sitemap:', error);
  }

  // Filtrar solo artículos publicados
  const publishedPosts = posts.filter(
    (post) => !post.state || post.state === 'publicado'
  );

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // URLs dinámicas de los artículos
  const blogUrls = publishedPosts.map((post) => {
    const postDate = post.fechaPublicacion ? new Date(post.fechaPublicacion) : new Date();
    const isRecent = postDate >= oneWeekAgo;

    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.fechaModificacion 
        ? new Date(post.fechaModificacion) 
        : post.fechaPublicacion 
          ? new Date(post.fechaPublicacion) 
          : new Date(),
      changeFrequency: isRecent ? ('daily' as const) : ('weekly' as const),
      priority: isRecent ? 0.9 : 0.7,
    };
  });

  // URLs estáticas principales
  const staticRoutes = [
    '',
    '/blog',
    '/comunidad',
    '/sistemas',
    '/elevate',
    '/cookies',
    '/privacidad',
    '/terminos',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/blog' ? ('daily' as const) : ('weekly' as const),
    priority: route === '' ? 1.0 : route === '/elevate' || route === '/sistemas' ? 0.9 : 0.8,
  }));

  // URLs de categorías del blog
  const categoryUrls = BLOG_CATEGORIES.map((cat) => ({
    url: `${baseUrl}/blog/categoria/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryUrls, ...blogUrls];
}
