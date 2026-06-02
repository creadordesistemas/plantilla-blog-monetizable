# 🎬 Demo Local — Guía Rápida

Levanta la plantilla en tu máquina en menos de 3 minutos con datos de ejemplo precargados, **sin necesitar Supabase ni variables de entorno**.

---

## ⚡ Modo Demo (recomendado para explorar)

```bash
# 1. Clona la rama demo del repositorio
git clone -b demo https://github.com/creadordesistemas/plantilla-blog-monetizable.git
cd plantilla-blog-monetizable

# 2. Instala dependencias
npm install

# 3. Arranca la demo con datos de ejemplo
npm run demo
```

Abre **http://localhost:3000** — verás el blog funcionando con artículos, comunidad y panel de administración ya cargados.

### ¿Qué incluye la demo?

| Sección | Datos de ejemplo |
|---|---|
| 🏠 **Home** | Hero, About Me, últimos artículos |
| 📝 **Blog** | 4 artículos (3 públicos + 1 exclusivo) |
| 👥 **Comunidad** | Página de membresía configurada |
| ⚙️ **Admin** | Panel en `/admin` (usuario: `admin`, contraseña: `admin`) |

### Restaurar tus datos después de la demo

```bash
npm run demo:restore
```

---

## 🛠️ Modo Desarrollo (con tu propia base de datos)

Si ya tienes Supabase configurado:

```bash
# 1. Copia el archivo de entorno
cp .env.example .env.local

# 2. Edita .env.local con tus credenciales reales
# (ver README principal para la lista completa de variables)

# 3. Inicia el servidor
npm run dev
```

---

## 🗺️ Rutas principales

| Ruta | Descripción |
|---|---|
| `/` | Landing page principal |
| `/blog` | Listado de artículos |
| `/comunidad` | Página de membresía pública |
| `/admin` | Panel de administración |
| `/comunidad/privado` | Área privada de miembros |

---

## 🎓 Siguiente paso: el Curso de Personalización

Una vez que la demo esté corriendo, sigue el **[Curso de Personalización](../README.md#-curso-de-personalización-guiado)** en el README principal.

Son 5 módulos con pasos detallados para transformar la demo en **tu propio blog personalizado**.

---

> **Nota:** En modo demo los datos se guardan en archivos JSON locales (`/data/`). En producción, los datos viven en Supabase (PostgreSQL). La app funciona igual en ambos casos.
