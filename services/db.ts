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
        'Acceso a todos los artículos exclusivos',
        'Recursos descargables premium (PDFs, plantillas)',
        'Comunidad privada en Discord',
        'Sesiones mensuales en directo',
        'Acceso anticipado a nuevos proyectos',
      ],
    },
    settings: {
      siteName: 'TechHub',
      tagline: 'COMPARTO CONOCIMIENTO, CÓDIGO Y ESTRATEGIAS',
      siteDescription:
        'Un espacio donde exploramos arquitectura de software, inteligencia artificial y automatización de élite. Artículos técnicos, recursos prácticos y una comunidad activa.',
      contactEmail: 'hola@techhub.dev',
      supportEmail: 'soporte@techhub.dev',
      instagram: 'https://instagram.com/techhub',
      tiktok: 'https://tiktok.com/@techhub',
      youtube: 'https://youtube.com/@techhub',
      linkedin: 'https://linkedin.com/company/techhub',
      logo: '',
      favicon: '/favicon.ico',
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      accentColor: '#6366f1',
      domain: 'techhub.dev',
      heroStyle: 'TYPOGRAPHIC',
      authorName: 'Alex Sistemas',
      authorTitle: 'Arquitecto de Software & Creador de Contenido',
      authorPhilosophy: '"Los sistemas simples que escalan bien son los más difíciles de construir."',
      authorBio:
        'Llevo más de 10 años diseñando infraestructuras digitales para startups y empresas. Ahora comparto todo lo que sé: arquitectura, IA aplicada, y los sistemas que realmente funcionan en producción.',
    },
    blog: [
      {
        id: '1',
        slug: 'arquitectura-modular-protocolo-escalado',
        titulo: 'ARQUITECTURA MODULAR: EL PROTOCOLO DE ESCALADO',
        categoria: 'Arquitectura',
        tags: ['nextjs', 'sistemas', 'escalado'],
        fechaPublicacion: '2024-05-10',
        extracto:
          'Cómo diseñar infraestructuras que soporten el crecimiento exponencial sin comprometer la latencia ni la estabilidad del core.',
        contenido: `# Arquitectura Modular: El Protocolo de Escalado

La arquitectura modular no es una tendencia pasajera. Es el resultado de años de fracasos colectivos aprendiendo que los sistemas monolíticos tienen un techo.

## ¿Qué es realmente la modularidad?

Un sistema modular es aquel en el que cada componente puede **ser reemplazado, actualizado o eliminado** sin que el resto colapse. Suena simple. En la práctica, la mayoría de los equipos fallan en el tercer punto.

## Los 3 pilares del protocolo

### 1. Contratos explícitos entre módulos

Cada módulo define exactamente qué consume y qué expone. Nada más. Esto se implementa con:

\`\`\`typescript
interface UserModule {
  getUser(id: string): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<void>;
}
\`\`\`

### 2. Estado encapsulado

Ningún módulo accede directamente al estado de otro. Toda comunicación pasa por la interfaz definida.

### 3. Despliegue independiente

Cada módulo puede desplegarse en producción por separado. Esto requiere que los contratos sean versionados y retrocompatibles.

## El anti-patrón más común

El acoplamiento oculto. Dos módulos que "parecen" independientes pero comparten una tabla de base de datos, un archivo de configuración global o un servicio interno.

> Si cambiar el módulo A requiere modificar el módulo B, no tienes módulos. Tienes un monolito disfrazado.

## Conclusión

La arquitectura modular no se implementa de una vez. Se construye iterativamente, refactorizando los acoplamientos cada vez que se descubren.`,
        state: 'publicado',
        exclusive: false,
        views: 1247,
        image_url:
          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
      },
      {
        id: '2',
        slug: 'ia-automatizacion-elite-2024',
        titulo: 'IA Y AUTOMATIZACIÓN DE ÉLITE EN 2024',
        categoria: 'Inteligencia Artificial',
        tags: ['ia', 'llm', 'automatizacion'],
        fechaPublicacion: '2024-05-18',
        extracto:
          'Protocolos avanzados para integrar LLMs en flujos de trabajo operativos de alta precisión sin sacrificar confiabilidad.',
        contenido: `# IA y Automatización de Élite en 2024

El año 2024 marcó un punto de inflexión. Los LLMs pasaron de ser juguetes tecnológicos a convertirse en el núcleo de sistemas productivos reales.

## El problema de la confiabilidad

El mayor obstáculo para usar IA en producción no es la capacidad del modelo. Es la **predictibilidad de su output**.

Un sistema que falla el 5% del tiempo en un contexto de juego es aceptable. En un flujo de facturación automatizado, ese 5% es catastrófico.

## La solución: IA como capa de decisión, no de ejecución

\`\`\`
[Input] → [LLM: clasifica y decide] → [Sistema determinista: ejecuta]
\`\`\`

El LLM nunca toca la base de datos directamente. Nunca ejecuta código. Clasifica la intención y genera un comando estructurado que el sistema determinista valida y ejecuta.

## Stack técnico recomendado

- **Orchestration**: LangChain o LlamaIndex para pipelines complejos
- **Structured outputs**: Siempre JSON schema validation en el output del LLM
- **Fallback**: Sistema de reglas clásicas cuando el LLM tiene baja confianza
- **Logging**: Cada decisión de la IA queda registrada para auditoría

## Caso real: Clasificación automática de soporte

Implementamos un sistema que clasifica tickets de soporte con un LLM, los enruta al equipo correcto y genera una respuesta inicial. El equipo humano solo interviene en el 20% de los casos.

El resultado: tiempo de primera respuesta reducido de 4 horas a 8 minutos.`,
        state: 'publicado',
        exclusive: false,
        views: 892,
        image_url:
          'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop',
      },
      {
        id: '3',
        slug: 'next-js-14-guia-completa',
        titulo: 'NEXT.JS 14: LA GUÍA QUE NADIE MÁS TE DA',
        categoria: 'Desarrollo Web',
        tags: ['nextjs', 'react', 'typescript'],
        fechaPublicacion: '2024-06-02',
        extracto:
          'Server Components, App Router, y las decisiones de arquitectura que separan los proyectos que escalan de los que se convierten en deuda técnica.',
        contenido: `# Next.js 14: La Guía que Nadie Más te Da

Next.js 14 no es solo una actualización. Es un cambio de paradigma que obliga a repensar cómo estructuramos nuestras aplicaciones.

## Server Components: el cambio más importante

La mayoría de tutoriales te explican *qué* son los Server Components. Pocos te explican *cuándo no usarlos*.

**Usa Server Components cuando:**
- Accedes a datos (base de datos, APIs internas)
- No necesitas interactividad del usuario
- Quieres reducir el JavaScript que llega al cliente

**Usa Client Components cuando:**
- Necesitas hooks (useState, useEffect, useContext)
- Manejas eventos del usuario (onClick, onChange)
- Usas APIs del navegador (localStorage, window)

## El error más común: "use client" en cascada

\`\`\`tsx
// ❌ Mal: todo el árbol se convierte en cliente
'use client';
export default function Page() {
  return <HeavyComponent />;
}

// ✅ Bien: solo el componente interactivo es cliente
export default function Page() {
  return (
    <div>
      <StaticContent />      {/* Server Component */}
      <InteractiveWidget /> {/* Client Component */}
    </div>
  );
}
\`\`\`

## Conclusión

Next.js 14 premia a los desarrolladores que piensan en términos de fronteras entre servidor y cliente. Los que no lo hacen, construyen SPAs disfrazadas.`,
        state: 'publicado',
        exclusive: false,
        views: 2103,
        image_url:
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
      },
      {
        id: '4',
        slug: 'sistemas-ingresos-pasivos-developer',
        titulo: 'CÓMO GENERO INGRESOS PASIVOS COMO DEVELOPER',
        categoria: 'Monetización',
        tags: ['ingresos', 'saas', 'monetizacion'],
        fechaPublicacion: '2024-06-10',
        extracto:
          'El stack exacto, los números reales y los errores que no deberías cometer. Solo para miembros.',
        contenido: `# Cómo Genero Ingresos Pasivos como Developer

Este artículo es exclusivo para miembros de la comunidad. Aquí comparto los números reales de mis proyectos, las herramientas que uso y los errores que casi me costaron años de trabajo.

## Mis fuentes de ingreso actuales

1. **Blog con AdSense**: €800-1200/mes con 50k visitas mensuales
2. **Plantillas y recursos digitales**: €2000-3500/mes
3. **Comunidad de membresía**: €1800/mes (38 miembros × €49)
4. **Consultoría puntual**: €150/hora, 10-15h/mes

## El sistema que lo hace posible

...contenido exclusivo para miembros...`,
        state: 'publicado',
        exclusive: true,
        views: 445,
        image_url:
          'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=2071&auto=format&fit=crop',
      },
    ],
    systems: [
      {
        id: '1',
        name: 'SISTEMA ALPHA',
        slug: 'alpha',
        price: 990,
        status: 'activo',
        type: 'tool',
        descripcionCorta: 'Arquitectura de base para startups y proyectos de alto crecimiento.',
        imageUrl:
          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
        enlaceStripe: '#',
      },
      {
        id: '2',
        name: 'SISTEMA OMEGA',
        slug: 'omega',
        price: 2500,
        status: 'activo',
        type: 'tool',
        descripcionCorta:
          'Infraestructura empresarial de alta disponibilidad con redundancia total.',
        imageUrl:
          'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
        enlaceStripe: '#',
      },
    ],
    resources: [
      {
        id: '1',
        title: 'Protocolo de Automatización V1',
        category: 'automatizacion',
        description:
          'Flujo de trabajo completo para gestión de leads con IA. Incluye prompts, diagramas y código.',
        url: '#',
      },
      {
        id: '2',
        title: 'Masterclass: Arquitectura Next.js',
        category: 'curso',
        description:
          'Cómo estructurar proyectos Next.js para máxima velocidad y escalabilidad. 3 horas de video.',
        url: '#',
      },
      {
        id: '3',
        title: 'Plantilla de Blog Monetizable',
        category: 'plantilla',
        description: 'Esta misma plantilla con configuración avanzada y módulo de afiliados.',
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
