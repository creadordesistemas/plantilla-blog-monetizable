import { NextResponse } from 'next/server';
import { readData, writeData } from '@/services/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { serviceType, nombre, email, webActual, descripcion, presupuesto } = body;

    /* ─── Validación básica ─────────────────────────────────── */
    if (!serviceType || !nombre?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: serviceType, nombre y email.' },
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 });
    }

    /* ─── Guardar lead en Supabase ──────────────────────────── */
    try {
      await writeData('leads', {
        service_type: serviceType,
        nombre: nombre.trim(),
        email: email.trim(),
        web_actual: webActual?.trim() || null,
        descripcion: descripcion?.trim() || null,
        presupuesto: presupuesto || null,
      });
    } catch (dbErr) {
      // No bloqueamos el flujo si falla Supabase; el email sigue enviándose
      console.error('[contacto] Error guardando lead en Supabase:', dbErr);
    }

    /* ─── Leer API key de Brevo desde configuración ─────────── */
    const newsletterSettings: any = await readData('newsletter_config');
    const apiKey = newsletterSettings?.apiKeyBrevo || process.env.BREVO_API_KEY;

    if (!apiKey) {
      console.error('[contacto] No hay API key de Brevo configurada.');
      return NextResponse.json(
        { error: 'Servicio de email no configurado. Por favor, contacta directamente a través del email de contacto.' },
        { status: 500 }
      );
    }

    /* ─── Etiquetas legibles por servicio ───────────────────── */
    const serviceLabels: Record<string, string> = {
      'web': 'Diseño Web Corporativa',
      'kit-digital': 'Kit Digital',
      'automatizacion': 'Automatizaciones',
      'marketing': 'Marketing y Ads',
    };
    const serviceLabel = serviceLabels[serviceType] ?? serviceType;

    /* ─── Body HTML del email ───────────────────────────────── */
    const htmlBody = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#000000;font-family:'Inter',Arial,sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#111111;border:1px solid #333333;">
    <tr>
      <td style="padding:32px 40px 24px;border-bottom:1px solid #333333;">
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.25em;color:#888888;text-transform:uppercase;">[NOMBRE DE TU BLOG / MARCA]</p>
        <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">Nuevo Lead — ${serviceLabel}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:32px 40px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-bottom:20px;border-bottom:1px solid #222222;">
              <p style="margin:0 0 4px;font-size:11px;color:#888888;text-transform:uppercase;letter-spacing:0.1em;">Nombre</p>
              <p style="margin:0;font-size:15px;color:#ffffff;">${nombre}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 0;border-bottom:1px solid #222222;">
              <p style="margin:0 0 4px;font-size:11px;color:#888888;text-transform:uppercase;letter-spacing:0.1em;">Email</p>
              <p style="margin:0;font-size:15px;color:#ffffff;"><a href="mailto:${email}" style="color:#ffffff;">${email}</a></p>
            </td>
          </tr>
          ${webActual ? `
          <tr>
            <td style="padding:20px 0;border-bottom:1px solid #222222;">
              <p style="margin:0 0 4px;font-size:11px;color:#888888;text-transform:uppercase;letter-spacing:0.1em;">Web actual</p>
              <p style="margin:0;font-size:15px;color:#ffffff;"><a href="${webActual}" style="color:#ffffff;">${webActual}</a></p>
            </td>
          </tr>` : ''}
          ${descripcion ? `
          <tr>
            <td style="padding:20px 0;border-bottom:1px solid #222222;">
              <p style="margin:0 0 4px;font-size:11px;color:#888888;text-transform:uppercase;letter-spacing:0.1em;">Descripción</p>
              <p style="margin:0;font-size:15px;color:#ffffff;line-height:1.6;">${descripcion}</p>
            </td>
          </tr>` : ''}
          ${presupuesto ? `
          <tr>
            <td style="padding:20px 0;border-bottom:1px solid #222222;">
              <p style="margin:0 0 4px;font-size:11px;color:#888888;text-transform:uppercase;letter-spacing:0.1em;">Presupuesto mensual</p>
              <p style="margin:0;font-size:15px;color:#ffffff;font-weight:700;">${presupuesto}</p>
            </td>
          </tr>` : ''}
          <tr>
            <td style="padding:20px 0 0;">
              <p style="margin:0 0 4px;font-size:11px;color:#888888;text-transform:uppercase;letter-spacing:0.1em;">Servicio</p>
              <p style="margin:0;font-size:15px;color:#ffffff;">${serviceLabel}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 40px 32px;border-top:1px solid #333333;">
        <p style="margin:0;font-size:12px;color:#555555;">Recibido desde el formulario del Blog</p>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    /* ─── Leer email de contacto desde configuración ─────────── */
    let contactEmail = 'info@tudominio.com';
    try {
      const siteSettings: any = await readData('settings');
      if (siteSettings?.contactEmail) {
        contactEmail = siteSettings.contactEmail;
      }
    } catch (e) {
      console.error('[contacto] Error al leer la configuración de settings:', e);
    }

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
          name: '[Nombre de tu Blog / Marca]',
          email: contactEmail,
        },
        to: [{ email: contactEmail, name: '[Nombre de tu Blog / Marca]' }],
        replyTo: { email: email.trim(), name: nombre.trim() },
        subject: `[Nuevo Lead] ${serviceLabel} — ${nombre}`,
        htmlContent: htmlBody,
      }),
    });

    if (!brevoRes.ok) {
      const errorData = await brevoRes.json();
      console.error('[contacto] Error en API de Brevo:', errorData);
      return NextResponse.json(
        { error: 'Error al enviar el mensaje. Inténtalo de nuevo.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[contacto] Error interno:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
