import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogListing from '@/components/BlogListing';
import { readData } from '@/services/db';
import { BLOG_CATEGORIES, getCategoryBySlug, normalizeCategoryToConfig } from '@/lib/categories';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tudominio.com';

// Genera las rutas estáticas para cada categoría
export async function generateStaticParams() {
  return BLOG_CATEGORIES.map((cat) => ({
    cat: cat.slug,
  }));
}

export async function generateMetadata({ params }: { params: { cat: string } }): Promise<Metadata> {
  const category = getCategoryBySlug(params.cat);

  if (!category) {
    return {};
  }

  const title = `${category.label} | Blog Técnico | [Nombre de tu Blog / Marca]`;
  const description = category.description;
  const url = `${siteUrl}/blog/categoria/${category.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: '[Nombre de tu Blog / Marca]',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CategoryPage({ params }: { params: { cat: string } }) {
  const category = getCategoryBySlug(params.cat);

  if (!category) {
    notFound();
  }

  const allPosts = await readData<any[]>('blog');
  const posts = Array.isArray(allPosts)
    ? allPosts
        .filter((post: any) => {
          if (post.state && post.state !== 'publicado') return false;
          const postCat = normalizeCategoryToConfig(post.categoria);
          return postCat?.slug === category.slug;
        })
        .map((post: any) => ({ ...post, exclusive: !!post.exclusive }))
    : [];

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${siteUrl}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": category.label,
        "item": `${siteUrl}/blog/categoria/${category.slug}`
      }
    ]
  };

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category.label} — Blog Técnico`,
    "description": category.description,
    "url": `${siteUrl}/blog/categoria/${category.slug}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "[Nombre de tu Blog / Marca]",
      "url": siteUrl
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <Navbar />
      <main style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
        <section className="section-padding" style={{ paddingTop: '160px' }}>
          <div className="container">

            {/* Breadcrumb visual */}
            <nav style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              marginBottom: '2rem', fontSize: '0.75rem', fontWeight: '600',
              letterSpacing: '0.1em', color: 'var(--foreground-secondary)'
            }}>
              <Link href="/blog" style={{
                color: 'var(--foreground-secondary)', textDecoration: 'none',
                transition: 'color 0.2s'
              }}>
                BLOG
              </Link>
              <span style={{ color: 'var(--border)' }}>{"//"}</span>
              <span style={{ color: 'var(--foreground)' }}>
                {category.label.toUpperCase()}
              </span>
            </nav>

            {/* Header de categoría */}
            <div style={{
              marginBottom: '80px', borderLeft: '4px solid var(--primary)',
              paddingLeft: '32px'
            }}>
              <h1 style={{
                fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem',
                fontFamily: 'Space Grotesk', lineHeight: '1.1', letterSpacing: '-0.03em'
              }}>
                {category.label.toUpperCase()}
              </h1>
              <p className="text-secondary" style={{ fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.7' }}>
                {category.description}
              </p>
            </div>

            {/* Navegación entre categorías */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
              marginBottom: '3rem', paddingBottom: '1.5rem',
              borderBottom: '1px solid var(--border)'
            }}>
              <Link
                href="/blog"
                style={{
                  background: 'transparent',
                  color: 'var(--foreground-secondary)',
                  border: '1px solid var(--border)',
                  padding: '0.5rem 1.2rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  textDecoration: 'none',
                  letterSpacing: '0.08em',
                  borderRadius: '2px',
                  transition: 'all 0.2s',
                }}
              >
                TODOS
              </Link>
              {BLOG_CATEGORIES.map((cat) => {
                const isActive = cat.slug === category.slug;
                return (
                  <Link
                    key={cat.slug}
                    href={`/blog/categoria/${cat.slug}`}
                    style={{
                      background: isActive ? 'var(--foreground)' : 'transparent',
                      color: isActive ? 'var(--background)' : 'var(--foreground-secondary)',
                      border: isActive ? '1px solid var(--foreground)' : '1px solid var(--border)',
                      padding: '0.5rem 1.2rem',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      textDecoration: 'none',
                      letterSpacing: '0.08em',
                      borderRadius: '2px',
                      transition: 'all 0.2s',
                    }}
                  >
                    {cat.label.toUpperCase()}
                  </Link>
                );
              })}
            </div>

            {/* Listado de posts filtrados */}
            {posts.length > 0 ? (
              <BlogListing initialPosts={posts} />
            ) : (
              <div style={{
                color: 'var(--foreground-secondary)', padding: '6rem 2rem',
                textAlign: 'center', border: '1px dashed var(--border)',
                fontFamily: 'monospace', fontSize: '0.85rem'
              }}>
                [ Sin protocolos publicados en {category.label} ]
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
