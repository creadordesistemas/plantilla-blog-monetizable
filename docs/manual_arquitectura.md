# Manual de Arquitectura - Bloque 1

## Capas del Sistema

### 1. Capa de Presentación (Frontend)
Ubicada en `/app`. Utiliza el App Router de Next.js para manejar rutas estáticas y dinámicas. Los estilos se gestionan mediante Vanilla CSS en `/app/globals.css`.

### 2. Capa de Servicios (Business Logic)
Ubicada en `/services`. Centraliza la lógica de negocio. El archivo `db.ts` actúa como el motor de persistencia, encapsulando el acceso a la base de datos externa (Supabase) con un fallback a datos estáticos/mocks locales en caso de desconexión o desarrollo local sin variables de entorno.

### 3. Capa de Datos (Persistence)
Ubicada en la base de datos de **Supabase**. Las tablas relacionales y el almacenamiento de objetos de Supabase se encargan de persistir toda la información dinámica de artículos, leads, miembros y comentarios. Adicionalmente, el panel administra variables globales persistidas mediante tablas de configuración única (`settings`, `community`, `newsletter_config`).

### 4. Capa de API (Backend)
Ubicada en `/app/api`. Define los endpoints necesarios para que el frontend interactúe con la base de datos de Supabase de forma segura, utilizando `supabaseAdmin` con RLS bypass para el panel de control privado, y `supabase` respetando políticas RLS para la consulta pública.
