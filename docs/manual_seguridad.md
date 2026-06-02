# Manual de Seguridad - Bloque 1

## Medidas Implementadas

### 1. Protección del Panel Admin
Se utiliza un `middleware.ts` en la raíz del proyecto que intercepta todas las peticiones a `/admin/*`. Si no existe una cookie de sesión válida (`admin-session`), el usuario es redirigido automáticamente a `/admin/login`.

### 2. Headers de Seguridad
Configurados en `next.config.js` y reforzados en el Middleware:
- **X-Frame-Options: DENY** (Previene Clickjacking).
- **X-Content-Type-Options: nosniff** (Previene MIME type sniffing).
- **Referrer-Policy: strict-origin-when-cross-origin**.

### 3. Sanitización de Datos
El sistema utiliza el servicio `db.ts` para manejar la persistencia. Se recomienda sanitizar todos los inputs en los endpoints de la API antes de guardarlos en los archivos JSON.

### 4. Credenciales
Las credenciales de acceso se gestionan de forma segura a través de variables de entorno:
- `ADMIN_USER`: Nombre de usuario administrador.
- `ADMIN_PASSWORD`: Contraseña de seguridad de administración.

*Nota: Asegúrate de definir claves seguras y robustas en tu archivo `.env.local` de desarrollo y en las variables de entorno de tu hosting de producción (ej. Vercel) antes de realizar el despliegue.*
