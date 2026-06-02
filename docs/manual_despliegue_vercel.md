# Manual de Despliegue en Vercel - Bloque 1

## Requisitos Previos
1. Una cuenta en [Vercel](https://vercel.com).
2. El repositorio conectado a Vercel.

## Configuración de Variables de Env (Production)
- `ADMIN_USER`: El usuario maestro que usarás para acceder al panel.
- `ADMIN_PASSWORD`: Una contraseña fuerte y altamente segura para el administrador.
- `JWT_SECRET`: Una clave secreta larga y aleatoria para firmar tokens.

## Pasos para el Despliegue
1. Sube el código a tu repositorio de GitHub/GitLab.
2. Importa el proyecto en Vercel.
3. Asegúrate de que el comando de build sea `next build`.
4. Vercel detectará automáticamente la configuración de Next.js.

## Notas sobre Persistencia
El proyecto está completamente integrado con Supabase, por lo que todos los datos (artículos, miembros, configuraciones, etc.) se almacenan de forma segura y persistente en la nube. Las modificaciones realizadas en producción persistirán perfectamente entre redespliegues sin depender del sistema de archivos efímero de Vercel.
