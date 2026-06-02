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
    slug: 'inteligencia-artificial',
    label: 'Inteligencia Artificial',
    description: 'Protocolos avanzados de IA: integración de LLMs, automatización cognitiva y arquitectura de modelos para sistemas de producción.',
    keywords: ['inteligencia', 'ia', 'artificial', 'llm', 'gpt', 'machine learning'],
  },
  {
    slug: 'automatizacion',
    label: 'Automatización',
    description: 'Flujos de automatización de élite: n8n, Make, Zapier y pipelines personalizados para escalar operaciones sin fricción.',
    keywords: ['automatizacion', 'automatización', 'auto', 'n8n', 'make', 'zapier'],
  },
  {
    slug: 'arquitectura-y-desarrollo',
    label: 'Arquitectura y Desarrollo',
    description: 'Arquitectura modular, infraestructura escalable y patrones de desarrollo para sistemas críticos de alto rendimiento.',
    keywords: ['arquitectura', 'desarrollo', 'infraestructura', 'devops', 'backend', 'frontend'],
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
