import type { Metadata } from 'next';
import BackButton from '@/components/BackButton';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | [Nombre de tu Blog / Marca]',
  description:
    'Lee los términos y condiciones comerciales que rigen la contratación de servicios y licencias de software de [Nombre de tu Blog / Marca].',
};

export default function TerminosPage() {
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
            Términos y Condiciones
          </h1>
          <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.9rem' }}>
            Última actualización: mayo de 2026
          </p>
        </div>

        {/* Secciones */}
        {[
          {
            title: '1. Identificación y Aceptación',
            content: (
              <p>
                El presente documento establece los Términos y Condiciones de contratación y uso
                que regulan el acceso al sitio web <strong>[tudominio.com]</strong> y la
                adquisición de los servicios y productos ofrecidos por <strong>[Nombre de tu Blog / Marca]</strong> (en adelante, «el Prestador»). El mero acceso al sitio o la
                contratación de cualquier servicio implica la aceptación plena y sin reservas de
                los presentes términos. Si no estás de acuerdo con alguno de ellos, te rogamos
                que te abstengas de utilizar el sitio o contratar los servicios.
              </p>
            ),
          },
          {
            title: '2. Propiedad Intelectual e Industrial',
            content: (
              <>
                <p>
                  Todos los contenidos del sitio web —incluyendo, sin carácter limitativo, textos,
                  gráficos, logotipos, iconos, imágenes, código fuente, diseños y software— son
                  propiedad exclusiva de [Nombre de tu Blog / Marca] o de sus licenciantes y están
                  protegidos por las leyes españolas y europeas de propiedad intelectual e
                  industrial.
                </p>
                <p style={{ marginTop: '1rem' }}>
                  Queda expresamente prohibida la reproducción total o parcial, distribución,
                  comunicación pública o cualquier otra forma de explotación de dichos contenidos
                  sin la autorización escrita previa del Prestador.
                </p>
              </>
            ),
          },
          {
            title: '3. Descripción de los Servicios',
            content: (
              <>
                {/* ✏️ PERSONALIZAR: reemplaza esta lista con los servicios o productos que ofreces en tu blog */}
                <p>[Nombre de tu Blog / Marca] ofrece los siguientes servicios y productos digitales:</p>
                <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', lineHeight: 2 }}>
                  <li>
                    <strong>Contenido editorial:</strong> publicación de artículos, guías y recursos informativos
                    en el área pública del blog, disponibles de forma gratuita.
                  </li>
                  <li>
                    <strong>Membresía de comunidad:</strong> acceso a un espacio privado con contenido exclusivo,
                    recursos descargables y debates entre miembros, mediante suscripción mensual.
                  </li>
                  <li>
                    <strong>Newsletter:</strong> envío periódico de contenido seleccionado a los suscriptores que
                    hayan dado su consentimiento expreso.
                  </li>
                  <li>
                    <strong>[Servicio adicional]:</strong> [describe aquí cualquier otro servicio o producto digital
                    que ofrezcas: cursos, ebooks, consultoría, etc.].
                  </li>
                </ul>
              </>
            ),
          },
          {
            title: '4. Licencias de Software',
            content: (
              <>
                <p>
                  La adquisición de cualquier sistema o herramienta de software comercializada por
                  el Prestador otorga al cliente una <strong>licencia de uso personal,
                  intransferible y no exclusiva</strong> del producto, sujeta a las siguientes
                  condiciones:
                </p>
                <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', lineHeight: 2 }}>
                  <li>Está <strong>expresamente prohibida</strong> la reventa, sublicencia,
                    redistribución o copia del código fuente sin autorización escrita previa del
                    Prestador.</li>
                  <li>El cliente podrá usar el software únicamente en el ámbito de su propio negocio
                    o actividad profesional.</li>
                  <li>Las actualizaciones o mejoras del software podrán ser incluidas en la licencia
                    o requerir la adquisición de un nuevo plan, según se especifique en cada
                    producto.</li>
                  <li>El Prestador se reserva el derecho de revocar la licencia en caso de
                    incumplimiento de los presentes términos.</li>
                </ul>
              </>
            ),
          },
          {
            title: '5. Precios, Pago y Política de Reembolso',
            content: (
              <>
                <p>
                  Los precios de los servicios y productos se expresan en euros (€) e incluyen el
                  IVA aplicable salvo que se indique lo contrario. El Prestador se reserva el
                  derecho de modificar los precios en cualquier momento, sin que ello afecte a los
                  pedidos ya confirmados.
                </p>
                <p style={{ marginTop: '1rem' }}>
                  Los pagos se procesan de forma segura a través de <strong>Stripe</strong>, que
                  actúa como procesador de pagos independiente. [Nombre de tu Blog / Marca] no almacena
                  datos de tarjetas de crédito o débito. Todas las transacciones están cifradas
                  mediante SSL/TLS.
                </p>
                <p style={{ marginTop: '1rem' }}>
                  Dada la naturaleza digital de los servicios y licencias, <strong>no se
                  aceptarán devoluciones</strong> una vez iniciada la prestación del servicio o
                  activada la licencia, salvo en los casos en que la normativa de consumidores y
                  usuarios lo exija imperativamente.
                </p>
              </>
            ),
          },
          {
            title: '6. Obligaciones del Cliente',
            content: (
              <ul style={{ paddingLeft: '1.5rem', lineHeight: 2 }}>
                <li>Proporcionar información veraz, actualizada y completa en el proceso de contratación.</li>
                <li>Utilizar los servicios y productos adquiridos conforme a la legalidad vigente y a los presentes términos.</li>
                <li>No utilizar los sistemas o contenidos del Prestador para actividades ilícitas, fraudulentas o contrarias a la buena fe.</li>
                <li>Mantener la confidencialidad de las credenciales de acceso a plataformas o entornos entregados en el marco del servicio.</li>
              </ul>
            ),
          },
          {
            title: '7. Exención de Responsabilidad',
            content: (
              <>
                <p>
                  El Prestador no será responsable de los daños o perjuicios derivados de:
                </p>
                <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', lineHeight: 2 }}>
                  <li>La implantación técnica del cliente, cuando éste no siga las recomendaciones o especificaciones indicadas por el Prestador.</li>
                  <li>Interrupciones en el servicio causadas por terceros, fuerza mayor o problemas de infraestructura ajena al Prestador.</li>
                  <li>La pérdida de beneficios, datos u oportunidades de negocio derivadas del uso o mal uso de los servicios.</li>
                  <li>Los resultados económicos obtenidos por el cliente a través de los sistemas implementados, que dependen de factores externos fuera del control del Prestador.</li>
                </ul>
              </>
            ),
          },
          {
            title: '8. Publicidad de Terceros y Enlaces Externos',
            content: (
              <>
                <p>
                  Este sitio web puede mostrar contenidos publicitarios patrocinados de terceros (como anuncios provistos por <strong>Google AdSense</strong>) y contener enlaces a sitios web externos gestionados por terceros ajenos al Prestador.
                </p>
                <p style={{ marginTop: '1rem' }}>
                  El Prestador no ejerce ningún control sobre dichos sitios externos ni asume responsabilidad alguna por las políticas de privacidad, términos de uso, exactitud, veracidad, calidad o legalidad de los servicios, productos, contenidos o anuncios ofrecidos en ellos. El acceso y uso de tales enlaces y contenidos se realiza bajo el exclusivo riesgo del usuario.
                </p>
              </>
            ),
          },
          {
            title: '9. Modificación de los Términos',
            content: (
              <p>
                El Prestador se reserva el derecho de modificar los presentes Términos y
                Condiciones en cualquier momento. Cualquier cambio entrará en vigor desde su
                publicación en el sitio web. El uso continuado del sitio o de los servicios tras
                la publicación de los cambios constituirá la aceptación de los nuevos términos.
              </p>
            ),
          },
          {
            title: '10. Legislación Aplicable y Jurisdicción',
            content: (
              <p>
                Los presentes Términos y Condiciones se rigen por la legislación española. Para
                la resolución de cualquier controversia derivada de su interpretación o
                cumplimiento, las partes se someten, con renuncia expresa a cualquier otro fuero,
                a los <strong>Juzgados y Tribunales competentes de España</strong>, sin perjuicio
                de los derechos que asistan al consumidor conforme a la normativa vigente de
                protección de los consumidores y usuarios.
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
