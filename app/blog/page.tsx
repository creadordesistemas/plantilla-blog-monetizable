import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogListing from '@/components/BlogListing';
import { readData } from '@/services/db';
import { Metadata } from 'next';

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tudominio.com';

export const metadata: Metadata = {
  title: 'Blog Técnico | [Nombre de tu Blog / Marca]',
  description: 'Artículos técnicos, tutoriales y guías sobre programación, sistemas y desarrollo.',
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: 'Blog Técnico | [Nombre de tu Blog / Marca]',
    description: 'Artículos técnicos, tutoriales y guías sobre programación, sistemas y desarrollo.',
    url: `${siteUrl}/blog`,
    type: 'website',
  },
};

export default async function BlogPage() {
  const allPosts = await readData<any[]>('blog');
  const posts = Array.isArray(allPosts)
    ? allPosts
        .filter((post: any) => !post.state || post.state === 'publicado')
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
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Navbar />
      <main style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
        <section className="section-padding" style={{ paddingTop: '160px' }}>
          <div className="container">
            <div style={{ marginBottom: '80px', borderLeft: '4px solid var(--primary)', paddingLeft: '32px' }}>
              <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', fontFamily: 'Space Grotesk' }}>
                BLOG <span style={{ color: 'var(--foreground-secondary)' }}>TÉCNICO</span>
              </h1>
              <p className="text-secondary" style={{ fontSize: '1.2rem', maxWidth: '600px' }}>
                Análisis de arquitectura, automatización de élite y estrategias de escalabilidad para sistemas críticos.
              </p>
            </div>

            <BlogListing initialPosts={posts} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
