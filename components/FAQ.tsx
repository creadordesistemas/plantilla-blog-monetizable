'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

// ✏️ PERSONALIZAR: reemplaza estas preguntas y respuestas con las de tu propio nicho
const faqs = [
  {
    question: '¿QUÉ ES ESTA PLANTILLA Y QUÉ INCLUYE?',
    answer: 'Es una plantilla de código abierto y totalmente gratuita para crear tu propio blog monetizable con Google AdSense. Incluye blog completo con panel de administración, sistema de membresías con Stripe, newsletter con Brevo, SEO técnico, modo oscuro y despliegue en un clic en Vercel. Todo listo para usar desde el primer momento.'
  },
  {
    question: '¿CÓMO FUNCIONA EL ÁREA PRIVADA PARA MIEMBROS?',
    answer: 'La plantilla incluye un sistema completo de membresía de pago integrado con Stripe. Los visitantes se registran a través de un enlace de pago que tú configuras, y una vez dentro acceden a artículos exclusivos, recursos descargables y contenido premium. Tú controlas el precio, los beneficios y la gestión de miembros desde el panel de administración.'
  },
  {
    question: '¿PARA QUÉ SIRVE LA SECCIÓN DE NEWSLETTER?',
    answer: 'La plantilla incluye integración nativa con Brevo (antes Sendinblue) para captar suscriptores y enviar boletines. Es la forma más directa de construir una audiencia propia sin depender de algoritmos de redes sociales. Lo configuras en minutos desde el panel de administración añadiendo tu API Key de Brevo.'
  },
  {
    question: '¿CÓMO SE MONETIZA UN BLOG CON ESTA PLANTILLA?',
    answer: 'La plantilla soporta dos vías de monetización: Google AdSense para ingresos pasivos mediante publicidad (ya preconfigurado, solo añades tus credenciales), y membresía de pago con Stripe para acceso a contenido exclusivo. Ambas se activan desde el panel de administración sin tocar una línea de código.'
  },
  {
    question: '¿ES SEGURO UTILIZARLA?',
    answer: 'Sí, es completamente seguro. Es un repositorio de código abierto publicado en GitHub bajo licencia MIT: puedes ver, revisar y auditar cada línea de código. No necesitas registrarte en ningún lugar para usarla. La descargas, la configuras con tus propias credenciales y es 100% tuya desde el primer momento.'
  }
];

// JSON-LD FAQPage para rich snippets en Google
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--background)' }}>
      {/* JSON-LD FAQPage schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="container faq-wrapper">

        {/* Columna izquierda — Sticky en desktop */}
        <div className="faq-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ borderLeft: '4px solid var(--primary)', paddingLeft: '2rem' }}
          >
            <h2 style={{
              fontSize: 'clamp(1.75rem, 2.5vw, 2.5rem)',
              fontFamily: 'Space Grotesk',
              fontWeight: '700',
              lineHeight: '1.2',
            }}>
              PREGUNTAS{' '}
              <span style={{ color: 'var(--foreground-secondary)' }}>FRECUENTES</span>
            </h2>
            <p style={{
              marginTop: '1.5rem',
              color: 'var(--foreground-secondary)',
              fontSize: '0.95rem',
              lineHeight: '1.7',
            }}>
              Respuestas directas sobre el blog, la comunidad y cómo funciona todo.
            </p>
          </motion.div>
        </div>

        {/* Columna derecha — Cards scrolleables */}
        <motion.div
          className="faq-right"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                className="faq-item-new"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  className="faq-header-new"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-title-new" style={{ color: isOpen ? 'var(--foreground)' : 'var(--foreground-secondary)' }}>
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    style={{ flexShrink: 0 }}
                  >
                    <Plus size={18} color="var(--foreground-secondary)" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="faq-answer">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .faq-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6rem;
          align-items: start;
        }

        .faq-left {
          position: sticky;
          top: 120px;
        }

        .faq-right {
          display: flex;
          flex-direction: column;
          gap: 1px;
          border: 1px solid var(--border);
          background-color: var(--border);
        }

        .faq-item-new {
          background-color: var(--background);
          transition: background-color 0.25s ease;
        }

        .faq-item-new:hover {
          background-color: var(--card-bg);
        }

        .faq-header-new {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          gap: 1rem;
        }

        .faq-title-new {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          transition: color 0.25s ease;
        }

        .faq-answer {
          padding: 0 2rem 2rem 2rem;
          color: var(--foreground-secondary);
          line-height: 1.75;
          font-size: 0.95rem;
        }

        @media (max-width: 900px) {
          .faq-wrapper {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .faq-left {
            position: static;
          }
        }

        @media (max-width: 600px) {
          .faq-wrapper {
            gap: 2rem;
          }
          .faq-header-new {
            padding: 1.5rem;
          }
          .faq-answer {
            padding: 0 1.5rem 1.5rem 1.5rem;
          }
        }
      ` }} />
    </section>
  );
}
