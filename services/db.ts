import { supabase, supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function readData<T>(table: string): Promise<T> {
  if (!isSupabaseConfigured) {
    return getMockData(table) as T;
  }
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*');

    if (error || !data) {
      console.warn(`Fallback local activado para la tabla ${table}`);
      return getMockData(table) as T;
    }

    if (['settings', 'community', 'newsletter_config'].includes(table)) {
      return (data && data.length > 0 ? data[0] : getMockData(table)) as T;
    }

    return data as T;
  } catch (err) {
    return getMockData(table) as T;
  }
}

// Datos de prueba para desarrollo local sin Supabase (y modo demo)
function getMockData(table: string): any {
  const mocks: any = {
    community: {
      priceMonthly: 49,
      stripeLink: '#',
      features: [
        'Acceso a todos los artículos exclusivos sobre monetización',
        'Recursos descargables premium (PDFs, plantillas, guías)',
        'Soporte directo para configurar tu blog',
        'Sesiones mensuales en directo con Serafín',
        'Acceso anticipado a nuevas versiones de la plantilla',
      ],
    },
    settings: {
      siteName: 'CreadorDeSistemas',
      tagline: 'LA PLANTILLA OPEN SOURCE PARA LANZAR TU BLOG MONETIZABLE',
      siteDescription:
        'Demo en vivo de la plantilla blog monetizable. Código abierto, gratuito, desplegable en minutos con Next.js, Supabase y Vercel. Incluye panel de administración, AdSense y membresías con Stripe.',
      contactEmail: 'hola@creadordesistemas.com',
      supportEmail: 'hola@creadordesistemas.com',
      instagram: 'https://instagram.com/creadordesistemas',
      tiktok: 'https://tiktok.com/@creadordesistemas',
      youtube: 'https://youtube.com/@creadordesistemas',
      linkedin: 'https://linkedin.com/in/creadordesistemas',
      logo: '',
      favicon: '/favicon.ico',
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      accentColor: '#6366f1',
      domain: 'creadordesistemas.com',
      heroStyle: 'TYPOGRAPHIC',
      authorName: 'Serafín',
      authorTitle: 'creadordesistemas.com',
      authorPhilosophy: '"Cualquier persona puede tener su propio blog monetizable. Solo necesita las herramientas correctas."',
      authorBio:
        'Soy Serafín de creadordesistemas.com, y he diseñado esta plantilla para que cualquier persona pueda lanzar su propio blog monetizable sin complicaciones. Código abierto, gratuito, y listo para generar ingresos desde el día uno.',
    },
    blog: [
      {
        id: '1',
        slug: 'guia-instalacion-blog-monetizable',
        titulo: 'GUÍA COMPLETA: INSTALA Y DESPLIEGA TU BLOG EN MINUTOS',
        categoria: 'Instalación & Configuración',
        tags: ['instalacion', 'vercel', 'nextjs', 'supabase'],
        fechaPublicacion: '2024-05-10',
        extracto:
          'Paso a paso desde cero: clona el repositorio, configura las variables de entorno y despliega tu blog en Vercel. Sin conocimientos avanzados necesarios.',
        contenido: `# Guía Completa: Instala y Despliega tu Blog en Minutos

Esta guía te lleva desde cero hasta tener tu blog funcionando en producción. Sigue los pasos en orden y en menos de 30 minutos tendrás tu blog online.

## Requisitos previos

Antes de empezar, necesitas:
- [Node.js 18+](https://nodejs.org/) instalado en tu ordenador
- Una cuenta gratuita en [Vercel](https://vercel.com/)
- Una cuenta gratuita en [Supabase](https://supabase.com/)
- Git instalado

## Paso 1: Clona el repositorio

\`\`\`bash
git clone https://github.com/creadordesistemas/plantilla-blog-monetizable.git
cd plantilla-blog-monetizable
npm install
\`\`\`

## Paso 2: Configura las variables de entorno

Copia el archivo de ejemplo:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edita \`.env.local\` con tus credenciales de Supabase.

## Paso 3: Crea las tablas en Supabase

Ve al **SQL Editor** de tu proyecto en Supabase y ejecuta el script SQL incluido en el README. Crea las tablas: \`blog\`, \`members\`, \`settings\`, \`community\`, \`newsletter_config\`.

## Paso 4: Prueba en local

\`\`\`bash
npm run dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000). Deberías ver el blog funcionando.

## Paso 5: Despliega en Vercel

La forma más rápida es el botón de un click en el README, que clona el repo y configura Vercel automáticamente:

1. Haz click en **Deploy with Vercel**
2. Conecta tu cuenta de GitHub
3. Rellena las variables de entorno en el asistente
4. ¡Deploy!

> **Tip**: Cada vez que hagas \`git push\`, Vercel redespliega automáticamente. Gratis.

## Verifica que todo funciona

- \`/\` → Home del blog
- \`/blog\` → Listado de artículos
- \`/admin\` → Panel de administración (usuario/contraseña del \`.env.local\`)
- \`/comunidad\` → Página de membresía

¡Listo! Tu blog está en producción.`,
        state: 'publicado',
        exclusive: false,
        views: 3847,
        image_url:
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
      },
      {
        id: '2',
        slug: 'configurar-google-adsense-blog',
        titulo: 'CÓMO CONFIGURAR GOOGLE ADSENSE EN TU BLOG (SIN TOCAR CÓDIGO)',
        categoria: 'Monetización',
        tags: ['adsense', 'monetizacion', 'ingresos', 'publicidad'],
        fechaPublicacion: '2024-05-18',
        extracto:
          'La plantilla ya tiene AdSense preconfigurado. Solo necesitas tu Publisher ID y dos Slot IDs. Te explico cómo obtenerlos y activarlos en 10 minutos.',
        contenido: `# Cómo Configurar Google AdSense en tu Blog (Sin Tocar Código)

Una de las grandes ventajas de esta plantilla es que **Google AdSense ya está integrado**. Solo tienes que añadir tus credenciales.

## ¿Qué es Google AdSense?

AdSense es el programa de publicidad de Google que te permite mostrar anuncios en tu blog y ganar dinero cada vez que alguien los ve o hace click. Es la forma más sencilla de monetizar un blog con tráfico.

## Paso 1: Crea tu cuenta en AdSense

1. Ve a [google.com/adsense](https://www.google.com/adsense/)
2. Registra tu sitio con tu dominio real (el de Vercel o tu dominio propio)
3. Espera la aprobación de Google (puede tardar días o semanas)

> **Importante**: Necesitas contenido real publicado para que Google apruebe tu sitio. Publica al menos 3-5 artículos antes de solicitar la aprobación.

## Paso 2: Obtén tu Publisher ID y Slot IDs

Una vez aprobado:

1. En AdSense → **Anuncios** → **Por unidad de anuncio**
2. Crea 2 unidades de tipo "Pantalla adaptable":
   - \`SLOT_CABECERA\` (para la cabecera del blog)
   - \`SLOT_PIE\` (para el pie de cada artículo)
3. Anota cada **Slot ID** (formato: \`1234567890\`)
4. Anota tu **Publisher ID** (formato: \`ca-pub-XXXXXXXXXXXXXXXX\`)

## Paso 3: Configura las variables de entorno

En Vercel → Settings → Environment Variables, añade:

\`\`\`env
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_TOP_SLOT=1234567890
NEXT_PUBLIC_ADSENSE_BOTTOM_SLOT=0987654321
\`\`\`

## Paso 4: Verifica tu ads.txt

El archivo \`public/ads.txt\` ya existe en el repo. Edítalo con tu Publisher ID:

\`\`\`
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
\`\`\`

## ¿Cuánto puedo ganar?

Depende del tráfico y la temática. Con 10.000 visitas/mes puedes esperar entre €50-€200/mes. Con 100.000 visitas, entre €500-€2.000/mes. El objetivo es construir tráfico orgánico consistente.`,
        state: 'publicado',
        exclusive: false,
        views: 2561,
        image_url:
          'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=2071&auto=format&fit=crop',
      },
      {
        id: '3',
        slug: 'stack-tecnico-nextjs-supabase-vercel',
        titulo: 'POR QUÉ NEXT.JS + SUPABASE + VERCEL ES LA MEJOR STACK GRATUITA',
        categoria: 'Tecnología',
        tags: ['nextjs', 'supabase', 'vercel', 'typescript', 'stack'],
        fechaPublicacion: '2024-06-02',
        extracto:
          'La combinación perfecta para lanzar un blog profesional sin pagar nada. Te explico qué hace cada pieza, por qué la elegí y cómo encajan entre sí.',
        contenido: `# Por Qué Next.js + Supabase + Vercel es la Mejor Stack Gratuita

Cuando diseñé esta plantilla, tenía un objetivo claro: **cero coste inicial, máxima profesionalidad**. Esta stack lo cumple con creces.

## Next.js 14 — El Framework

Next.js es el framework React más popular del mundo, mantenido por Vercel. La plantilla usa:

- **App Router** — La nueva forma de estructurar rutas con layouts anidados
- **Server Components** — Renderizado en servidor para máximo SEO y velocidad
- **TypeScript** — Tipado estático que evita errores en producción
- **API Routes** — Endpoints internos sin necesidad de un backend separado

### ¿Por qué no WordPress?

WordPress es potente, pero requiere hosting de pago, actualizaciones constantes y tiene un coste de mantenimiento real. Next.js + Vercel es gratis, más rápido y más seguro.

## Supabase — La Base de Datos

Supabase es el "Firebase open source". Ofrece:

- **PostgreSQL** — Base de datos relacional robusta
- **Auth integrada** — Para la gestión de miembros
- **Storage** — Para las imágenes del blog
- **Plan gratuito** — Suficiente para empezar y crecer

### Tablas que usa la plantilla

\`\`\`sql
blog          -- artículos del blog
members       -- miembros de la comunidad  
settings      -- configuración global del sitio
community     -- datos de la membresía (precio, features)
newsletter_config -- configuración de Brevo
\`\`\`

## Vercel — El Hosting

Vercel es la plataforma de despliegue creada por los mismos autores de Next.js. Ventajas:

- **Plan gratuito generoso** — Perfecto para blogs con tráfico moderado
- **Deploy automático** — Cada \`git push\` redespliega en segundos
- **CDN global** — Tu blog se sirve desde el servidor más cercano al usuario
- **SSL incluido** — HTTPS automático sin configuración

## SEO Técnico de Fábrica

La plantilla incluye sin configuración adicional:

- \`/sitemap.xml\` — Generado automáticamente con tus artículos
- \`/robots.txt\` — Optimizado para Googlebot
- **Open Graph** — Previews en redes sociales
- **JSON-LD** — Rich snippets en resultados de Google
- **Cabeceras de seguridad** — CSP, HSTS, X-Frame-Options

Todo esto sin que tengas que tocar una sola línea de configuración.`,
        state: 'publicado',
        exclusive: false,
        views: 1892,
        image_url:
          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
      },
      {
        id: '4',
        slug: 'crear-comunidad-membresia-stripe',
        titulo: 'CREA TU COMUNIDAD DE MEMBRESÍA Y COBRA CON STRIPE',
        categoria: 'Monetización',
        tags: ['stripe', 'membresia', 'comunidad', 'ingresos-recurrentes'],
        fechaPublicacion: '2024-06-10',
        extracto:
          'La segunda vía de monetización de la plantilla: un área privada para miembros de pago. Configura el precio, conecta Stripe y empieza a cobrar ingresos recurrentes.',
        contenido: `# Crea tu Comunidad de Membresía y Cobra con Stripe

Además de AdSense, la plantilla incluye un sistema completo de membresía de pago. Es la segunda vía de ingresos, y la más poderosa: **ingresos recurrentes mensuales**.

## ¿Qué incluye el sistema de membresía?

- **Área privada** en \`/comunidad/privado\` solo accesible para miembros activos
- **Artículos exclusivos** marcados con 🔒 en el blog
- **Recursos descargables** (PDFs, plantillas, guías)
- **Gestión de miembros** desde el panel de administración

## Paso 1: Configura el precio en el Admin

1. Ve a \`/admin\` → **Ajustes de Comunidad**
2. Establece tu precio mensual en euros
3. Define los beneficios que verán los visitantes en la página \`/comunidad\`

## Paso 2: Conecta Stripe

1. Crea una cuenta gratuita en [stripe.com](https://stripe.com)
2. Ve a **Products** → **Add product** → configura el precio recurrente mensual
3. En **Payment links** → crea un link de pago
4. Pega el link en Admin → **Ajustes de Comunidad** → **Stripe Link**

## Paso 3: Crea contenido exclusivo

En el panel Admin → Blog → al crear un artículo, activa la opción **"Exclusivo para miembros"**.

El artículo aparecerá en el blog con un candado 🔒 y solo los miembros podrán leerlo completo.

## ¿Cuánto puedo cobrar?

Depende de tu nicho y el valor que aportes. Algunos ejemplos:

| Tipo de membresía | Precio habitual |
|---|---|
| Newsletter premium | €5-15/mes |
| Comunidad con recursos | €20-50/mes |
| Mentoría grupal | €50-150/mes |

Con 20 miembros a €49/mes son **€980/mes de ingresos recurrentes**. Ese es el objetivo.

## Gestión de miembros

Desde Admin → **Miembros** puedes:
- Ver todos los miembros activos
- Crear nuevos miembros manualmente
- Desactivar accesos

Los miembros reciben un email de bienvenida con un link para configurar su contraseña.`,
        state: 'publicado',
        exclusive: false,
        views: 1456,
        image_url:
          'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop',
      },
      {
        id: '5',
        slug: 'numeros-reales-blog-monetizable',
        titulo: 'NÚMEROS REALES: CUÁNTO PUEDE GENERAR UN BLOG CON ESTA PLANTILLA',
        categoria: 'Monetización',
        tags: ['ingresos', 'adsense', 'stripe', 'monetizacion', 'numeros'],
        fechaPublicacion: '2024-06-18',
        extracto:
          'Proyecciones reales basadas en datos del sector: cuánto puedes ganar con AdSense y membresías en función de tu tráfico. Solo para miembros.',
        contenido: `# Números Reales: Cuánto Puede Generar un Blog con Esta Plantilla

Este artículo es exclusivo para miembros. Aquí comparto proyecciones reales basadas en datos del sector, sin humo ni promesas vacías.

## Fuente de ingresos 1: Google AdSense

Los ingresos de AdSense dependen de tres factores: tráfico, temática y geografía.

### Proyecciones por tráfico mensual

| Visitas/mes | RPM estimado | Ingresos estimados |
|---|---|---|
| 5.000 | €2-4 | €10-20/mes |
| 20.000 | €2-4 | €40-80/mes |
| 50.000 | €3-6 | €150-300/mes |
| 100.000 | €3-6 | €300-600/mes |

## Fuente de ingresos 2: Membresía con Stripe

Los ingresos de membresía son más predecibles porque son recurrentes.

### Proyecciones por número de miembros

| Miembros | Precio | Ingresos/mes |
|---|---|---|
| 10 | €29/mes | €290/mes |
| 20 | €49/mes | €980/mes |
| 50 | €49/mes | €2.450/mes |
| 100 | €29/mes | €2.900/mes |

## El sistema que lo hace posible

...contenido exclusivo para miembros...`,
        state: 'publicado',
        exclusive: true,
        views: 678,
        image_url:
          'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=2071&auto=format&fit=crop',
      },
    ],
    systems: [
      {
        id: '1',
        name: 'PLANTILLA BLOG STARTER',
        slug: 'blog-starter',
        price: 0,
        status: 'activo',
        type: 'tool',
        descripcionCorta: 'La plantilla base gratuita para lanzar tu blog monetizable. Open source en GitHub.',
        imageUrl:
          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
        enlaceStripe: 'https://github.com/creadordesistemas/plantilla-blog-monetizable',
      },
      {
        id: '2',
        name: 'PLANTILLA BLOG PRO',
        slug: 'blog-pro',
        price: 97,
        status: 'activo',
        type: 'tool',
        descripcionCorta:
          'Versión avanzada con módulo de afiliados, analytics propios y soporte prioritario.',
        imageUrl:
          'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
        enlaceStripe: '#',
      },
    ],
    resources: [
      {
        id: '1',
        title: 'Checklist: Lanzamiento de Blog en 30 Días',
        category: 'plantilla',
        description:
          'Paso a paso completo para pasar de cero a blog en producción con contenido y AdSense configurado.',
        url: '#',
      },
      {
        id: '2',
        title: 'Guía: Cómo Conseguir la Aprobación de AdSense',
        category: 'guia',
        description:
          'Los criterios exactos que revisa Google para aprobar tu sitio y qué necesitas tener antes de solicitarlo.',
        url: '#',
      },
      {
        id: '3',
        title: 'Plantilla SQL: Supabase Setup Completo',
        category: 'plantilla',
        description: 'Script SQL listo para ejecutar en Supabase que crea todas las tablas necesarias con RLS.',
        url: '#',
      },
    ],
  };
  return mocks[table] || (['blog', 'systems', 'resources'].includes(table) ? [] : {});
}


export async function writeData<T>(table: string, payload: any): Promise<void> {
  if (!isSupabaseConfigured) {
    console.warn(`Supabase no configurado. Simulación de escritura local.`);
    return;
  }
  // Para tablas de configuración única, usamos upsert basado en una ID fija o el primer registro
  if (['settings', 'community', 'newsletter_config'].includes(table)) {
    const { error } = await supabaseAdmin
      .from(table)
      .upsert({ id: 1, ...payload }); // Usamos id 1 como ancla para registros únicos
    if (error) throw error;
  } else {
    // Para tablas CRUD (systems, blog, resources), el payload debe incluir la ID si es una actualización
    const { error } = await supabaseAdmin
      .from(table)
      .upsert(payload);
    if (error) throw error;
  }
}

// Función específica para borrar (necesaria para sistemas, blog, recursos)
export async function deleteData(table: string, id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    console.warn(`Supabase no configurado. Simulación de borrado local.`);
    return;
  }
  const { error } = await supabaseAdmin
    .from(table)
    .delete()
    .eq('id', id);
  if (error) throw error;
}
