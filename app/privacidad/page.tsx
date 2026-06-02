import type { Metadata } from 'next';
import BackButton from '@/components/BackButton';
import DeleteDataForm from '@/components/DeleteDataForm';

export const metadata: Metadata = {
  title: 'Política de Privacidad | [Nombre de tu Blog / Marca]',
  description:
    'Conoce cómo [Nombre de tu Blog / Marca] recopila, trata y protege tus datos personales conforme al RGPD y la LOPD.',
};

export default function PrivacidadPage() {
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
            Política de Privacidad
          </h1>
          <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.9rem' }}>
            Última actualización: mayo de 2026
          </p>
        </div>

        {/* Secciones */}
        {[
          {
            title: '1. Responsable del Tratamiento',
            content: (
              <>
                <p>
                  El responsable del tratamiento de los datos personales recabados a través de este
                  sitio web es:
                </p>
                <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', lineHeight: 2 }}>
                  <li><strong>Denominación:</strong> [Nombre de tu Blog / Marca]</li>
                  <li>
                    <strong>Correo electrónico de contacto:</strong>{' '}
                    <a
                      href="mailto:contacto@tudominio.com"
                      style={{ color: 'var(--foreground-secondary)', textDecoration: 'underline' }}
                    >
                      contacto@tudominio.com
                    </a>
                  </li>
                  <li><strong>Sitio web:</strong> [tudominio.com]</li>
                </ul>
              </>
            ),
          },
          {
            title: '2. Datos que Recopilamos',
            content: (
              <>
                <p>Recopilamos las siguientes categorías de datos personales:</p>
                <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', lineHeight: 2 }}>
                  <li>
                    <strong>Datos de identificación y contacto:</strong> nombre y dirección de
                    correo electrónico proporcionados voluntariamente en formularios de contacto o
                    suscripción al boletín.
                  </li>
                  <li>
                    <strong>Datos de navegación:</strong> dirección IP, tipo de navegador,
                    páginas visitadas, duración de la visita y origen del tráfico, recopilados
                    automáticamente mediante cookies analíticas.
                  </li>
                  <li>
                    <strong>Datos de pago:</strong> procesados íntegramente por Stripe. [Nombre de tu Blog / Marca] no almacena datos de tarjetas de crédito.
                  </li>
                  <li>
                    <strong>Datos publicitarios:</strong> identificadores de cookies asociados a
                    Google AdSense y DoubleClick para la personalización de anuncios.
                  </li>
                </ul>
              </>
            ),
          },
          {
            title: '3. Finalidad del Tratamiento',
            content: (
              <>
                <p>Los datos son tratados con las siguientes finalidades:</p>
                <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', lineHeight: 2 }}>
                  <li>Gestión y prestación de los servicios contratados a través de este sitio web.</li>
                  <li>Comunicaciones comerciales y envío del boletín informativo, con el consentimiento previo del usuario.</li>
                  <li>Análisis estadístico del uso del sitio para la mejora de los contenidos y la experiencia de usuario.</li>
                  <li>Mostrar publicidad personalizada a través de Google AdSense, conforme a las políticas de Google.</li>
                  {/* ✏️ PERSONALIZAR: añade aquí las finalidades específicas de tu blog/negocio si las hay */}
                </ul>
              </>
            ),
          },
          {
            title: '4. Base Legal del Tratamiento',
            content: (
              <ul style={{ paddingLeft: '1.5rem', lineHeight: 2 }}>
                <li><strong>Ejecución de un contrato:</strong> cuando el tratamiento es necesario para la prestación del servicio contratado.</li>
                <li><strong>Consentimiento:</strong> para el envío de comunicaciones comerciales y el uso de cookies no esenciales.</li>
                <li><strong>Interés legítimo:</strong> para el análisis del tráfico web y la mejora de la seguridad.</li>
              </ul>
            ),
          },
          {
            title: '5. Transferencias a Terceros',
            content: (
              <>
                <p>
                  [Nombre de tu Blog / Marca] puede compartir tus datos con los siguientes proveedores de
                  servicios, únicamente en la medida necesaria para prestar los servicios:
                </p>
                <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', lineHeight: 2 }}>
                  <li><strong>Stripe, Inc.</strong> — procesamiento de pagos. Política de privacidad: stripe.com/es/privacy.</li>
                  <li><strong>Supabase</strong> — almacenamiento de datos de la plataforma. Política de privacidad: supabase.com/privacy.</li>
                  <li>
                    <strong>Google LLC (AdSense / DoubleClick)</strong> — publicidad de terceros y personalización de anuncios.
                    Informamos a los usuarios que:
                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem', listStyleType: 'circle', lineHeight: 1.6 }}>
                      <li>Los proveedores de terceros, incluido Google, utilizan cookies para mostrar anuncios basándose en las visitas anteriores del usuario a este sitio web o a otros sitios web.</li>
                      <li>El uso de cookies publicitarias permite a Google y a sus socios mostrar anuncios a los usuarios en función de las visitas realizadas a este sitio y/o a otros sitios de Internet.</li>
                      <li>Los usuarios pueden inhabilitar la publicidad personalizada. Para ello, pueden acceder a la{' '}
                        <a
                          href="https://adssettings.google.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--foreground-secondary)', textDecoration: 'underline' }}
                        >
                          Configuración de anuncios de Google
                        </a>
                        .</li>
                      <li>Alternativamente, los usuarios pueden inhabilitar el uso de cookies de un tercero para la publicidad personalizada visitando{' '}
                        <a
                          href="https://www.aboutads.info"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--foreground-secondary)', textDecoration: 'underline' }}
                        >
                          www.aboutads.info
                        </a>
                        .</li>
                    </ul>
                    Para obtener más detalles sobre el tratamiento de datos por parte de Google, consulta su{' '}
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--foreground-secondary)', textDecoration: 'underline' }}
                    >
                      Política de Privacidad de Google
                    </a>
                    .
                  </li>
                  <li><strong>Vercel, Inc.</strong> — infraestructura de alojamiento web.</li>
                </ul>
              </>
            ),
          },
          {
            title: '6. Conservación de los Datos',
            content: (
              <p>
                Los datos se conservarán durante el tiempo estrictamente necesario para cumplir
                con la finalidad para la que fueron recabados y, en todo caso, durante los plazos
                de conservación legalmente establecidos. Los datos de clientes se conservarán
                durante la vigencia de la relación comercial y un período adicional de 5 años para
                el cumplimiento de obligaciones legales.
              </p>
            ),
          },
          {
            title: '7. Derechos del Interesado (ARCO+)',
            content: (
              <>
                <p>
                  El usuario puede ejercer los siguientes derechos en cualquier momento enviando
                  una solicitud a{' '}
                  <a
                    href="mailto:contacto@tudominio.com"
                    style={{ color: 'var(--foreground-secondary)', textDecoration: 'underline' }}
                  >
                    contacto@tudominio.com
                  </a>
                  :
                </p>
                <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', lineHeight: 2 }}>
                  <li><strong>Acceso:</strong> conocer qué datos personales se tratan.</li>
                  <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
                  <li><strong>Supresión:</strong> solicitar la eliminación de los datos cuando ya no sean necesarios.</li>
                  <li><strong>Oposición:</strong> oponerse al tratamiento de tus datos con fines de marketing directo.</li>
                  <li><strong>Limitación:</strong> restringir el tratamiento en determinadas circunstancias.</li>
                  <li><strong>Portabilidad:</strong> recibir tus datos en un formato estructurado y de uso común.</li>
                </ul>
                <p style={{ marginTop: '1rem' }}>
                  Asimismo, tienes derecho a presentar una reclamación ante la{' '}
                  <a
                    href="https://www.aepd.es"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--foreground-secondary)', textDecoration: 'underline' }}
                  >
                    Agencia Española de Protección de Datos (AEPD)
                  </a>
                  .
                </p>
                <DeleteDataForm />
              </>
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
