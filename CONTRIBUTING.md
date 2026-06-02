# 🤝 Guía de Contribución

¡Gracias por querer contribuir a **Plantilla Blog Monetizable**! Este proyecto es open-source y toda ayuda es bienvenida.

---

## 📋 Antes de empezar

1. **Forkea** el repositorio
2. **Clona** tu fork localmente:
   ```bash
   git clone https://github.com/TU-USUARIO/plantilla-blog-monetizable.git
   cd plantilla-blog-monetizable
   ```
3. Instala dependencias:
   ```bash
   npm install
   ```
4. Copia el `.env.example` y configura tus variables:
   ```bash
   cp .env.example .env.local
   ```

---

## 🌿 Flujo de trabajo

1. Crea una **rama** descriptiva desde `main`:
   ```bash
   git checkout -b feat/mi-mejora
   # o
   git checkout -b fix/bug-que-arreglo
   ```
2. Haz tus cambios (con commits descriptivos en inglés o español)
3. Asegúrate de que el proyecto **compila sin errores**:
   ```bash
   npm run lint
   npm run build
   ```
4. Abre un **Pull Request** hacia `main` con:
   - Título claro: `feat: añadir soporte para categorías anidadas`
   - Descripción de qué hace y por qué

---

## 🐛 Reportar bugs

Usa los [GitHub Issues](https://github.com/creadordesistemas/plantilla-blog-monetizable/issues) e incluye:

- Versión de Node.js (`node -v`)
- Sistema operativo
- Pasos para reproducirlo
- Comportamiento esperado vs. comportamiento real
- Capturas de pantalla si aplica

---

## 💡 Proponer nuevas funcionalidades

Antes de ponerte a programar algo grande, **abre un Issue** para discutirlo. Así evitamos trabajo duplicado.

Etiqueta el Issue con `enhancement` y describe:
- El problema que resuelve
- Tu propuesta de solución
- Alternativas que consideraste

---

## ✅ Estándares de código

- **TypeScript** estricto — no uses `any` sin justificación
- **ESLint** debe pasar sin errores (`npm run lint`)
- Componentes en `PascalCase`, funciones en `camelCase`
- Comentarios en español para lógica de negocio
- No subas `.env.local` ni secretos — están en `.gitignore`

---

## 🚀 Tipos de contribuciones que más necesitamos

- 🌍 **Traducciones** (inglés, portugués, francés)
- 🎨 **Temas visuales** alternativos
- 📝 **Documentación** mejorada
- 🧪 **Tests** (el proyecto no tiene tests aún — ¡gran oportunidad!)
- 🐛 **Bugfixes** de issues abiertos
- ⚡ **Optimizaciones** de rendimiento

---

## 📜 Licencia

Al contribuir, aceptas que tu código se publique bajo la [licencia MIT](./LICENSE) del proyecto.

---

*Hecho con ❤️ para la comunidad hispana de código abierto.*
