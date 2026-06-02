import { NextResponse } from 'next/server';
import { readData } from '@/services/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, email, mensaje } = body;

    /* ─── Validación básica ─────────────────────────────────── */
    if (!nombre?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: nombre y email.' },
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 });
    }

    /* ─── Leer API key de Brevo desde configuración o env ────── */
    const newsletterSettings: any = await readData('newsletter_config');
    const apiKey = newsletterSettings?.apiKeyBrevo || process.env.BREVO_API_KEY;

    if (!apiKey) {
      console.error('[eliminar-datos] No hay API key de Brevo configurada.');
      return NextResponse.json(
        { error: 'Servicio de email no configurado. Contacta directamente al administrador a través del correo de contacto.' },
        { status: 500 }
      );
    }

    /* ─── Leer email de contacto de configuración o fallback ─── */
    let contactEmail = 'contacto@tudominio.com';
    try {
      const siteSettings: any = await readData('settings');
      if (siteSettings?.contactEmail) {
        contactEmail = siteSettings.contactEmail;
      }
    } catch (e) {
      console.error('[eliminar-datos] Error al leer settings:', e);
    }

    /* ─── Cuerpo del Email HTML para la solicitud de borrado ─── */
    const htmlBody = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#000000;font-family:'Inter',Arial,sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:40px auto;background:#111111;border:1px solid #333333;">
    <tr>
      <td style="padding:32px 40px 24px;border-bottom:1px solid #333333;background:linear-gradient(135deg, #1a0000 0%, #111111 100%);">
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.25em;color:#ff4444;text-transform:uppercase;font-weight:bold;">RGPD // DERECHOS ARCO+</p>
        <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">Solicitud de Supresión de Datos</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:32px 40px;">
        <p style="font-size:14px;color:#888888;line-height:1.6;margin-bottom:24px;">
          Se ha recibido una solicitud formal de ejercicio del <strong>derecho de supresión (derecho al olvido)</strong> conforme al Reglamento General de Protección de Datos (RGPD) a través del portal de privacidad.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-bottom:20px;border-bottom:1px solid #222222;">
              <p style="margin:0 0 4px;font-size:11px;color:#888888;text-transform:uppercase;letter-spacing:0.1em;">Nombre del Interesado</p>
              <p style="margin:0;font-size:15px;color:#ffffff;font-weight:600;">${nombre}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 0;border-bottom:1px solid #222222;">
              <p style="margin:0 0 4px;font-size:11px;color:#888888;text-transform:uppercase;letter-spacing:0.1em;">Email Asociado</p>
              <p style="margin:0;font-size:15px;color:#ffffff;"><a href="mailto:${email}" style="color:#ff4444;text-decoration:underline;">${email}</a></p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 0;border-bottom:1px solid #222222;">
              <p style="margin:0 0 4px;font-size:11px;color:#888888;text-transform:uppercase;letter-spacing:0.1em;">Mensaje / Detalles Adicionales</p>
              <p style="margin:0;font-size:14px;color:#dddddd;line-height:1.6;white-space:pre-wrap;">${mensaje ? mensaje : 'No se incluyeron detalles adicionales. El interesado solicita la eliminación completa y definitiva de sus datos personales almacenados en bases de datos, suscripciones o plataformas vinculadas.'}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 0 0;">
              <p style="margin:0 0 4px;font-size:11px;color:#ff4444;text-transform:uppercase;letter-spacing:0.1em;">Acción Requerida</p>
              <p style="margin:0;font-size:13px;color:#aaaaaa;line-height:1.5;">
                Deberás proceder a identificar los registros asociados a este correo electrónico en Supabase (leads, suscriptores, etc.) y eliminarlos permanentemente en un plazo máximo de 30 días, confirmando posteriormente al usuario la ejecución de la medida.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 40px 32px;border-top:1px solid #333333;background:#0c0c0c;">
        <p style="margin:0;font-size:11px;color:#555555;">Este es un mensaje automático del sistema de cumplimiento RGPD de [Nombre de tu Blog / Marca].</p>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    /* ─── Envío con Brevo API transaccional ─────────────────── */
    const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: {
          name: 'Cumplimiento RGPD — [Nombre de tu Blog / Marca]',
          email: contactEmail,
        },
        to: [{ email: contactEmail, name: 'Administrador' }],
        replyTo: { email: email.trim(), name: nombre.trim() },
        subject: `[RGPD Borrado] Solicitud de Supresión de Datos — ${nombre}`,
        htmlContent: htmlBody,
      }),
    });

    if (!brevoRes.ok) {
      const errorData = await brevoRes.json();
      console.error('[eliminar-datos] Error en API de Brevo:', errorData);
      return NextResponse.json(
        { error: 'Error al procesar la solicitud de borrado. Inténtalo de nuevo.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[eliminar-datos] Error interno:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
