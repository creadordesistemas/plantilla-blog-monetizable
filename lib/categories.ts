/**
 * Configuración centralizada de categorías del blog.
 * Usado por: BlogListing, /blog/categoria/[cat], sitemap.ts
 */

export interface CategoryConfig {
  slug: string;
  label: string;
  description: string;
  keywords: string[];
}

export const BLOG_CATEGORIES: CategoryConfig[] = [
  {
    slug: 'instalacion-y-configuracion',
    label: 'Instalación & Configuración',
    description: 'Guías y tutoriales paso a paso para configurar tu entorno, clonar el repositorio, configurar Supabase y desplegar tu blog en Vercel.',
    keywords: ['instalacion', 'configuracion', 'despliegue', 'instalación', 'configuración', 'setup'],
  },
  {
    slug: 'monetizacion',
    label: 'Monetización',
    description: 'Estrategias de ingresos activos y pasivos: configuración de Google AdSense, pasarelas de pago con Stripe, membresías recurrentes y optimización de conversión.',
    keywords: ['monetizacion', 'ingresos', 'adsense', 'stripe', 'membresia', 'dinero', 'comunidad', 'cobrar', 'monetización', 'membresía'],
  },
  {
    slug: 'tecnologia',
    label: 'Tecnología',
    description: 'Detalles técnicos e infraestructura de vanguardia: arquitectura en Next.js 14, base de datos relacional PostgreSQL en Supabase, CDN de Vercel y SEO optimizado.',
    keywords: ['tecnologia', 'stack', 'nextjs', 'react', 'supabase', 'typescript', 'backend', 'frontend', 'tecnología'],
  },
];

/**
 * Normaliza una categoría raw del post a su config correspondiente.
 */
export function normalizeCategoryToConfig(rawCategory: string): CategoryConfig | null {
  const c = rawCategory ? rawCategory.toLowerCase().trim() : '';
  return BLOG_CATEGORIES.find(cat => cat.keywords.some(kw => c.includes(kw))) || null;
}

/**
 * Normaliza una categoría raw del post a su label legible.
 */
export function normalizeCategory(rawCategory: string): string {
  const config = normalizeCategoryToConfig(rawCategory);
  return config ? config.label : 'Otros';
}

/**
 * Encuentra la config de categoría por slug de URL.
 */
export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return BLOG_CATEGORIES.find(cat => cat.slug === slug);
}
