import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { readData } from '@/services/db';
import { notFound } from 'next/navigation';
import Newsletter from '@/components/Newsletter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AdSenseUnit from '@/components/AdSenseUnit';
import { cookies } from 'next/headers';
import { Metadata } from 'next';
import BlogViewTracker from '@/components/BlogViewTracker';
import BlogComments from '@/components/BlogComments';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const [posts, settings] = await Promise.all([
    readData<any[]>('blog').catch(() => []),
    readData<any>('settings').catch(() => ({}))
  ]);
  const post = Array.isArray(posts) ? posts.find(p => p.slug === params.slug) : undefined;

  if (!post || (post.state && post.state !== 'publicado')) {
    return {};
  }

  const siteName = settings?.siteName || 'Mi Blog Tech';
  const title = `${post.titulo} | ${siteName}`;
  const description = post.extracto || (post.contenido ? post.contenido.slice(0, 155) + '...' : '');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${settings?.domain || 'tudominio.com'}`;
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const imageUrl = post.image_url || `${siteUrl}/og-image.png`;

  return {
    title,
    description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title,
      description,
      url: postUrl,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.titulo,
        },
      ],
      type: 'article',
      publishedTime: post.fechaPublicacion,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const posts = await readData<any[]>('blog').catch(() => []);
  const post = Array.isArray(posts) ? posts.find(p => p.slug === params.slug) : undefined;

  if (!post || (post.state && post.state !== 'publicado')) {
    notFound();
  }

  const cookieStore = cookies();
  const hasMemberSession = cookieStore.has('member-session');
  const isLocked = !!post.exclusive && !hasMemberSession;

  // Leer configuración de comunidad y generales para dinámicos
  const [communityData, settings] = await Promise.all([
    readData<any>('community').catch(() => ({})),
    readData<any>('settings').catch(() => ({}))
  ]);
  const priceMonthly = communityData.priceMonthly || 49;
  const stripeLink = communityData.stripeLink || '#';
  const siteName = settings.siteName || 'Mi Blog Tech';
  const authorName = settings.authorName || 'Serafín';

  const previewContent = post.contenido ? post.contenido.slice(0, 300) + '...' : '';
  // Siempre enviamos el contenido completo al HTML para indexación (Googlebot-friendly)
  const contentToRender = post.contenido || '';

  // Tiempo de lectura estimado (200 palabras/minuto)
  const wordCount = (post.contenido || '').split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.round(wordCount / 200));
  const readingTime = `${readingMinutes} min de lectura`;

  // Sanitización de AdSense: inyectar solo si son credenciales de producción reales (sin placeholders)
  const rawAdsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adsenseClientId = rawAdsenseClientId && !rawAdsenseClientId.includes('XXXXXXXX') ? rawAdsenseClientId : null;
  const adsenseTopSlot = process.env.NEXT_PUBLIC_ADSENSE_TOP_SLOT;
  const adsenseBottomSlot = process.env.NEXT_PUBLIC_ADSENSE_BOTTOM_SLOT;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${settings.domain || 'tudominio.com'}`;
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  // Fallback de imagen OG apuntando al asset verificado de la raíz
  const imageUrl = post.image_url || `${siteUrl}/og-image.png`;

  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.titulo,
    "description": post.extracto || previewContent,
    "image": imageUrl,
    "datePublished": post.fechaPublicacion,
    "dateModified": post.fechaModificacion || post.fechaPublicacion,
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": siteUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    }
  };

  // Marcado estructurado oficial para Paywall técnico (previene penalización de cloaking y habilita indexación completa)
  if (isLocked) {
    jsonLd.isAccessibleForFree = "False";
    jsonLd.hasPart = {
      "@type": "WebPageElement",
      "isAccessibleForFree": "False",
      "cssSelector": ".paywalled-content"
    };
  }

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
        "name": post.titulo,
        "item": postUrl
      }
    ]
  };

  return (
    <>
      <BlogViewTracker slug={post.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Navbar />
      <main style={{ backgroundColor: 'var(--background)', minHeight: '100vh', paddingTop: '120px' }}>
        <article className="blog-article">

          {/* Cabecera */}
          <header className="blog-header">
            <div className="blog-meta">
              <span className="blog-tag">
                {(post.categoria || 'Sistemas').toUpperCase()}
              </span>
              <span>{post.fechaPublicacion || ''}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {readingTime}
              </span>
            </div>
            <h1 className="blog-title">{post.titulo}</h1>
            {post.extracto && (
              <p className="blog-extracto">{post.extracto}</p>
            )}
          </header>

          {/* Slot AdSense Superior */}
          {adsenseClientId && adsenseTopSlot && (
            <AdSenseUnit client={adsenseClientId} slot={adsenseTopSlot} />
          )}

          {/* Contenido Markdown */}
          <div className={isLocked ? "markdown-body paywalled-content" : "markdown-body"}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {contentToRender}
            </ReactMarkdown>
          </div>

          {/* Muro de Pago (Paywall) Monolith Noir */}
          {isLocked && (
            <div className="paywall-container">
              <div className="paywall-fade"></div>
              <div className="paywall-box">
                <div className="paywall-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <div className="paywall-header">CONTENIDO EXCLUSIVO // PROTOCOLO_RESTRINGIDO</div>
                <h3 className="paywall-title">Este artículo requiere acceso de miembro</h3>
                <p className="paywall-text">
                  Los análisis y guías avanzadas se reservan exclusivamente para los miembros activos de la comunidad privada.
                </p>
                <div className="paywall-actions">
                  <a href={stripeLink} className="btn-primary" style={{ padding: '1rem 2rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
                    UNIRSE A LA COMUNIDAD • {priceMonthly}€/mes
                  </a>
                  <a href="/comunidad?login=true" className="btn-outline" style={{ padding: '1rem 2rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #333', background: 'transparent', color: '#fff', fontSize: '0.85rem' }}>
                    Ya soy miembro (Iniciar Sesión)
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Slot AdSense Inferior */}
          {!isLocked && adsenseClientId && adsenseBottomSlot && (
            <AdSenseUnit client={adsenseClientId} slot={adsenseBottomSlot} />
          )}

          {/* Newsletter */}
          {!isLocked && (
            <div style={{ margin: '4rem 0' }}>
              <Newsletter />
            </div>
          )}

          {/* Debates Técnicos (Solo si el artículo no está bloqueado por muro de pago) */}
          {!isLocked && (
            <BlogComments slug={post.slug} isMember={hasMemberSession} />
          )}

        </article>

        <style>{`
          /* ── Layout del artículo ── */
          .blog-article {
            max-width: 760px;
            margin: 0 auto;
            padding: 0 24px 80px;
          }

          /* ── Cabecera ── */
          .blog-header {
            margin-bottom: 3rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid var(--border);
          }
          .blog-meta {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 0.75rem;
            margin-bottom: 1.25rem;
            color: var(--foreground-secondary);
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.2em;
          }
          .blog-tag {
            background: var(--card-bg);
            border: 1px solid var(--border);
            padding: 4px 12px;
            border-radius: 2px;
          }
          .blog-title {
            font-size: clamp(1.8rem, 5vw, 3rem);
            font-weight: 800;
            line-height: 1.1;
            font-family: 'Space Grotesk', sans-serif;
            letter-spacing: -0.03em;
            margin-bottom: 1.25rem;
          }
          .blog-extracto {
            color: var(--foreground-secondary);
            font-size: 1.1rem;
            line-height: 1.7;
            border-left: 3px solid var(--primary);
            padding-left: 1.25rem;
            margin: 0;
          }

          /* ── CTA ── */
          .blog-cta {
            padding-top: 3rem;
            border-top: 1px solid var(--border);
            text-align: center;
          }
          .blog-cta h4 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.4rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
          }

          /* ════════════════════════════════════════════
             Estilos del Markdown — SEO friendly
          ════════════════════════════════════════════ */
          .markdown-body {
            color: var(--foreground-secondary);
            font-size: 1.1rem;
            line-height: 1.85;
            font-family: 'Inter', sans-serif;
            margin-bottom: 3rem;
            word-break: break-word;
            overflow-wrap: break-word;
          }

          /* Headings */
          .markdown-body h1,
          .markdown-body h2,
          .markdown-body h3,
          .markdown-body h4,
          .markdown-body h5,
          .markdown-body h6 {
            font-family: 'Space Grotesk', sans-serif;
            color: var(--foreground);
            font-weight: 700;
            line-height: 1.2;
            letter-spacing: -0.02em;
            margin-top: 2.5rem;
            margin-bottom: 0.9rem;
          }
          .markdown-body h1 { display: none; }
          .markdown-body h2 {
            font-size: clamp(1.3rem, 3.5vw, 1.75rem);
            border-bottom: 1px solid var(--border);
            padding-bottom: 0.5rem;
          }
          .markdown-body h3 { font-size: clamp(1.1rem, 2.5vw, 1.35rem); }
          .markdown-body h4 { font-size: 1.05rem; color: var(--foreground-secondary); }

          /* Párrafos y texto */
          .markdown-body p { margin-bottom: 1.5rem; }
          .markdown-body strong { color: var(--foreground); font-weight: 700; }
          .markdown-body em { font-style: italic; color: var(--foreground-secondary); }

          /* Links */
          .markdown-body a {
            color: var(--foreground);
            text-decoration: underline;
            text-underline-offset: 3px;
            transition: opacity 0.2s;
          }
          .markdown-body a:hover { opacity: 0.65; }

          /* Listas */
          .markdown-body ul,
          .markdown-body ol {
            margin: 1rem 0 1.75rem 1.4rem;
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
          }
          .markdown-body li { line-height: 1.75; }

          /* Código en línea */
          .markdown-body :not(pre) > code {
            font-family: 'Courier New', monospace;
            font-size: 0.87em;
            background: var(--card-bg);
            border: 1px solid var(--border);
            padding: 2px 7px;
            border-radius: 3px;
            color: var(--foreground);
          }

          /* Bloques de código — ideal para tutoriales */
          .markdown-body pre {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 4px;
            padding: 1.5rem;
            overflow-x: auto;
            margin: 2rem 0;
            -webkit-overflow-scrolling: touch;
          }
          .markdown-body pre code {
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
            line-height: 1.65;
            color: var(--foreground);
          }

          /* Imágenes */
          .markdown-body img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            margin: 2rem auto;
            display: block;
          }

          /* Citas */
          .markdown-body blockquote {
            border-left: 3px solid rgba(255,255,255,0.3);
            padding: 0.5rem 1.5rem;
            margin: 2rem 0;
            color: var(--foreground-secondary);
            font-style: italic;
          }
          .markdown-body blockquote p { margin-bottom: 0; }

          /* Tablas */
          .markdown-body table {
            width: 100%;
            border-collapse: collapse;
            margin: 2rem 0;
            font-size: 0.95rem;
            display: block;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          .markdown-body th,
          .markdown-body td {
            border: 1px solid var(--border);
            padding: 0.65rem 1rem;
            text-align: left;
          }
          .markdown-body th {
            background: var(--card-bg);
            color: var(--foreground);
            font-weight: 700;
            white-space: nowrap;
          }

          /* Separadores */
          .markdown-body hr {
            border: none;
            border-top: 1px solid var(--border);
            margin: 3rem 0;
          }

          /* ── Paywall Indexable (Googlebot-friendly visual masking) ── */
          .paywalled-content {
            position: relative;
            max-height: 380px;
            overflow: hidden;
            user-select: none;
            -webkit-user-select: none;
            pointer-events: none;
            mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
            -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
          }

          /* ── Paywall (Monolith Noir) ── */
          .paywall-container {
            position: relative;
            margin-top: -3rem;
            padding-top: 5rem;
            z-index: 10;
          }
          .paywall-fade {
            position: absolute;
            top: -120px;
            left: 0;
            right: 0;
            height: 180px;
            background: linear-gradient(to bottom, rgba(10, 10, 10, 0) 0%, var(--background) 100%);
            pointer-events: none;
          }
          .paywall-box {
            background: #0d0d0d;
            border: 1px solid #1f1f1f;
            padding: 3rem 2rem;
            text-align: center;
            border-radius: 4px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          }
          .paywall-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 54px;
            height: 54px;
            border-radius: 50%;
            background: rgba(255,255,255,0.02);
            border: 1px solid #222;
            margin-bottom: 1.5rem;
          }
          .paywall-header {
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 0.3em;
            color: var(--foreground-secondary);
            margin-bottom: 0.75rem;
            text-transform: uppercase;
          }
          .paywall-title {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 1.5rem;
            font-weight: 700;
            color: #fff;
            margin-bottom: 1rem;
          }
          .paywall-text {
            color: #666;
            font-size: 0.95rem;
            line-height: 1.6;
            max-width: 520px;
            margin: 0 auto 2.5rem;
          }
          .paywall-actions {
            display: flex;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
          }
          @media (max-width: 600px) {
            .paywall-actions {
              flex-direction: column;
              align-items: stretch;
            }
            .paywall-actions a {
              justify-content: center;
            }
            .paywall-box {
              padding: 2rem 1.5rem;
            }
          }

          /* ════════════════════════════════════════════
             Responsive — Móvil y Tablet
          ════════════════════════════════════════════ */
          @media (max-width: 768px) {
            .blog-article {
              padding: 0 20px 60px;
            }
            .blog-header {
              margin-bottom: 2rem;
            }
            .blog-extracto {
              font-size: 1rem;
            }
            .markdown-body {
              font-size: 1rem;
            }
            .markdown-body pre {
              padding: 1rem;
            }
            .markdown-body pre code {
              font-size: 0.82rem;
            }
          }
          @media (max-width: 480px) {
            .blog-article {
              padding: 0 16px 48px;
            }
          }
        `}</style>
      </main>
      <Footer />
    </>
  );
}
