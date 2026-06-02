# Manual del Panel Admin - Bloque 1

## Acceso
El panel es accesible en `/admin`. Se requiere inicio de sesión con las credenciales configuradas en las variables de entorno `ADMIN_USER` y `ADMIN_PASSWORD`.

## Módulos Disponibles

### 1. Dashboard
Vista general con estadísticas rápidas de visitas, sistemas activos y suscriptores.

### 2. Global Settings
Permite configurar los aspectos básicos del sitio:
- Nombre del sitio.
- Emails de contacto y soporte.
- Enlaces a redes sociales (Instagram, TikTok).
- Scripts personalizados y dominios.

### 3. Sistemas
Módulo para la gestión CRUD de los sistemas comerciales almacenados en Supabase.

### 4. Blog y Comunidad
Módulo para la gestión CRUD de artículos del blog, control de exclusividad de lectura, y administración de los debates y comentarios de los miembros.

## Guardado de Cambios
Cada módulo interactúa directamente con Supabase (para datos dinámicos como miembros, leads y artículos) o actualiza la configuración en la base de datos para módulos como settings y newsletter_config. No es necesario reiniciar el servidor para que los cambios surtan efecto.
