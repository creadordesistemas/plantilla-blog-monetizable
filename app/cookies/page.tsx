import type { Metadata } from 'next';
import BackButton from '@/components/BackButton';

export const metadata: Metadata = {
  title: 'Política de Cookies | [Nombre de tu Blog / Marca]',
  description:
    'Información sobre el uso de cookies en [tudominio.com], incluyendo cookies analíticas y de publicidad conductual de Google AdSense.',
};

export default function CookiesPage() {
  const browserInstructions = [
    {
      name: 'Google Chrome',
      steps: 'Menú (⋮) → Configuración → Privacidad y seguridad → Cookies y otros datos de sitios → gestiona las preferencias o bloquea todas las cookies de terceros.',
    },
    {
      name: 'Mozilla Firefox',
      steps: 'Menú (☰) → Configuración → Privacidad y seguridad → Protección contra el rastreo mejorada → selecciona «Estricto» o gestiona las excepciones manualmente.',
    },
    {
      name: 'Safari (macOS / iOS)',
      steps: 'Preferencias (⌘,) → Privacidad → activa «Impedir seguimiento entre sitios» y gestiona los datos de sitios web almacenados.',
    },
    {
      name: 'Microsoft Edge',
      steps: 'Menú (…) → Configuración → Privacidad, búsqueda y servicios → Prevención de seguimiento → selecciona nivel «Estricto».',
    },
  ];

  return (
    <main
      style={{
        backgroundColor: 'var(--background)',
        minHeight: '100vh',
        paddingTop: '120px',
        paddingBottom: '120px',
      }}
    >
      <div
        className="container"
        style={{ maxWidth: '860px', margin: '0 auto' }}
      >
        {/* Encabezado */}
        <div style={{ marginBottom: '64px' }}>
          <p
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--foreground-secondary)',
              marginBottom: '1.5rem',
            }}
          >
            Legal
          </p>
          <h1
            style={{
              fontFamily: 'Space Grotesk',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: '1.5rem',
            }}
          >
            Política de Cookies
          </h1>
          <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.9rem' }}>
            Última actualización: mayo de 2026
          </p>
        </div>

        {/* Secciones */}
        {[
          {
            title: '1. ¿Qué son las Cookies?',
            content: (
              <p>
                Las cookies son pequeños archivos de texto que los sitios web almacenan en el
                dispositivo del usuario al ser visitados. Permiten que el sitio recuerde información
                sobre tu visita —como tus preferencias de idioma o si has iniciado sesión—, lo que
                puede facilitar tu próxima visita y hacer que el sitio te resulte más útil. Las
                cookies son utilizadas ampliamente por los sitios web para funcionar de manera
                eficiente y para proporcionar información a los propietarios del sitio.
              </p>
            ),
          },
          {
            title: '2. Cookies que Utilizamos',
            content: (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  {
                    type: 'Cookies Estrictamente Necesarias',
                    badge: 'Siempre activas',
                    badgeColor: '#2a2a2a',
                    description:
                      'Son imprescindibles para el funcionamiento básico del sitio web. Incluyen cookies de sesión de administración (httpOnly, sameSite=Strict) que permiten la autenticación segura en el panel de administración. No pueden desactivarse sin afectar al funcionamiento del sitio.',
                    examples: ['admin-session: cookie de sesión del panel de administración.'],
                  },
                  {
                    type: 'Cookies Analíticas',
                    badge: 'Requieren consentimiento',
                    badgeColor: '#1a1a1a',
                    description:
                      'Nos permiten contabilizar las visitas y las fuentes de tráfico para medir y mejorar el rendimiento del sitio. Toda la información que recogen estas cookies es agregada y, por tanto, anónima.',
                    examples: [
                      '_ga, _ga_*: cookies de Google Analytics para distinguir usuarios y sesiones (duración: 2 años).',
                      '_gid: identifica a los usuarios durante un período de 24 horas.',
                    ],
                  },
                  {
                    type: 'Cookies de Publicidad Conductual (Google AdSense / DoubleClick)',
                    badge: 'Requieren consentimiento',
                    badgeColor: '#1a1a1a',
                    description:
                      'Este sitio web participa en el programa Google AdSense. Google y sus socios utilizan cookies de terceros (como la cookie de DoubleClick) para mostrar anuncios basados en las visitas previas del usuario a este sitio web o a otros sitios de Internet. Esto nos permite financiar y mantener el contenido gratuito del portal. Puedes gestionar tu consentimiento o inhabilitar la publicidad personalizada visitando la Configuración de Anuncios de Google o mediante el portal global de exclusión de AboutAds.',
                    examples: [
                      'IDE: utilizada por DoubleClick para registrar e informar sobre las acciones del usuario después de ver o hacer clic en un anuncio (duración: 1 año).',
                      'test_cookie: comprueba si el navegador del usuario admite cookies (duración: 15 minutos).',
                      'DSID: identifica al usuario conectado en dispositivos no pertenecientes a Google para la visualización de publicidad personalizada (duración: 2 semanas).',
                    ],
                  },
                ].map((cookie, i) => (
                  <div
                    key={i}
                    style={{
                      border: '1px solid var(--border)',
                      padding: '28px',
                      background: 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '1rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: 'Space Grotesk',
                          fontSize: '1rem',
                          fontWeight: 600,
                          margin: 0,
                        }}
                      >
                        {cookie.type}
                      </h3>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.15em',
                          padding: '3px 10px',
                          border: '1px solid var(--border)',
                          color: 'var(--foreground-secondary)',
                          background: cookie.badgeColor,
                        }}
                      >
                        {cookie.badge}
                      </span>
                    </div>
                    <p style={{ marginBottom: '1rem', lineHeight: 1.8 }}>{cookie.description}</p>
                    <ul style={{ paddingLeft: '1.5rem', lineHeight: 2 }}>
                      {cookie.examples.map((ex, j) => (
                        <li key={j}><code style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{ex}</code></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ),
          },
          {
            title: '3. Cómo Gestionar las Cookies',
            content: (
              <>
                <p style={{ marginBottom: '1.5rem' }}>
                  Puedes configurar tu navegador para que rechace todas las cookies, para que te
                  avise cuando se envíe una cookie o para que acepte solo las cookies de los sitios
                  que visitas. A continuación te indicamos cómo hacerlo en los principales
                  navegadores:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {browserInstructions.map((browser, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '160px 1fr',
                        gap: '1rem',
                        borderLeft: '2px solid var(--border)',
                        paddingLeft: '1.25rem',
                        alignItems: 'start',
                      }}
                    >
                      <strong style={{ fontSize: '0.88rem' }}>{browser.name}</strong>
                      <span style={{ fontSize: '0.88rem', lineHeight: 1.7 }}>{browser.steps}</span>
                    </div>
                  ))}
                </div>
                <p style={{ marginTop: '1.5rem' }}>
                  Ten en cuenta que la desactivación de cookies puede afectar a la funcionalidad
                  de este sitio y de otros que visites. Para más información sobre las cookies de
                  publicidad de Google y cómo inhabilitarlas de forma personalizada, visita la{' '}
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--foreground-secondary)', textDecoration: 'underline' }}
                  >
                    Configuración de anuncios de Google
                  </a>
                  . Adicionalmente, puedes inhabilitar el uso de cookies de terceros para la publicidad personalizada visitando{' '}
                  <a
                    href="https://www.aboutads.info"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--foreground-secondary)', textDecoration: 'underline' }}
                  >
                    www.aboutads.info
                  </a>
                  .
                </p>
              </>
            ),
          },
          {
            title: '4. Actualizaciones de esta Política',
            content: (
              <p>
                Podemos actualizar esta Política de Cookies periódicamente para reflejar cambios en
                las cookies que utilizamos o por otros motivos operativos, legales o
                reglamentarios. Te recomendamos que revises esta página regularmente para estar
                informado sobre nuestro uso de cookies y tecnologías relacionadas. La fecha de la
                última actualización aparece al inicio del documento.
              </p>
            ),
          },
          {
            title: '5. Contacto',
            content: (
              <p>
                Si tienes preguntas sobre el uso de cookies en este sitio, puedes ponerte en
                contacto con nosotros en{' '}
                <a
                  href="mailto:contacto@tudominio.com"
                  style={{ color: 'var(--foreground-secondary)', textDecoration: 'underline' }}
                >
                  contacto@tudominio.com
                </a>
                .
              </p>
            ),
          },
        ].map((section, i) => (
          <section
            key={i}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)',
              padding: '40px',
              marginBottom: '2px',
            }}
          >
            <h2
              style={{
                fontFamily: 'Space Grotesk',
                fontSize: '1.2rem',
                fontWeight: 600,
                marginBottom: '1.25rem',
                letterSpacing: '-0.01em',
              }}
            >
              {section.title}
            </h2>
            <div
              style={{
                color: 'var(--foreground-secondary)',
                fontSize: '0.92rem',
                lineHeight: 1.8,
              }}
            >
              {section.content}
            </div>
          </section>
        ))}
        <BackButton />
      </div>
    </main>
  );
}
