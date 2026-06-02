import { NextResponse } from 'next/server';
import { readData } from '@/services/db';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    // Leer configuración de Brevo desde el panel (opcional, fallback a env)
    const newsletterSettings: any = await readData('newsletter_config').catch(() => null);

    const apiKey = newsletterSettings?.apiKeyBrevo || process.env.BREVO_API_KEY;
    const listId = newsletterSettings?.listaBrevoId || '3'; // ID 3 por defecto

    if (!apiKey) {
      return NextResponse.json({ error: 'Configuración de servidor de correo incompleta.' }, { status: 500 });
    }

    // Llamada oficial a Brevo
    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        email: email,
        listIds: [Number(listId)],
        updateEnabled: true // Si el email ya está suscrito, no da error, simplemente actualiza sus listas
      })
    });

    if (!brevoRes.ok) {
      const errorData = await brevoRes.json();
      console.error("Error en la API de Brevo:", errorData);
      return NextResponse.json({ error: 'Fallo de protocolo en el servidor de correo. Reinténtalo.' }, { status: 400 });
    }

    // ─── Enviar correo transaccional de bienvenida ───
    let contactEmail = 'info@tudominio.com';
    try {
      const siteSettings: any = await readData('settings').catch(() => null);
      if (siteSettings?.contactEmail) {
        contactEmail = siteSettings.contactEmail;
      }
    } catch (e) {
      console.error('[newsletter] Error al leer la configuración de settings:', e);
    }

    const welcomeHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Acceso Confirmado // [Nombre de tu Blog / Marca]</title>
</head>
<body style="margin:0;padding:0;background-color:#000000;font-family:'Inter',Arial,sans-serif;color:#ffffff;padding:40px 20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background-color:#111111;border:1px solid #333333;box-sizing:border-box;">
    <tr>
      <td style="padding:32px 40px 24px;border-bottom:1px solid #333333;">
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.25em;color:#888888;text-transform:uppercase;font-weight:700;">[NOMBRE DE TU BLOG / MARCA] // PROTOCOLO_ACTIVADO</p>
      </td>
    </tr>
    <tr>
      <td style="padding:40px 40px 30px;">
        <h1 style="margin:0 0 20px;font-family:'Space Grotesk',sans-serif;font-size:24px;font-weight:800;color:#ffffff;line-height:1.2;letter-spacing:-0.02em;">
          YA ESTÁS DENTRO DEL SISTEMA
        </h1>
        <p style="margin:0 0 30px;font-size:15px;line-height:1.7;color:#cccccc;">
          Hola,<br><br>
          Has activado tu suscripción a los boletines semanales de <strong>[Nombre de tu Blog / Marca]</strong>.<br><br>
          A partir de ahora, recibirás análisis, artículos técnicos y novedades directamente en tu bandeja de entrada.
        </p>
        <table cellpadding="0" cellspacing="0" style="margin:30px 0;">
          <tr>
            <td style="background-color:#ffffff;padding:14px 28px;text-align:center;">
              <a href="https://tudominio.com/blog" style="color:#000000;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.05em;display:inline-block;text-transform:uppercase;">
                EXPLORAR EL BLOG →
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 40px 32px;border-top:1px solid #333333;font-size:12px;color:#555555;line-height:1.5;">
        Recibes este correo porque te has suscrito al newsletter en <a href="https://tudominio.com" style="color:#888888;text-decoration:underline;">tudominio.com</a>.<br>
        Puedes darte de baja en cualquier momento a través del enlace de baja del boletín.
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    try {
      const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
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
          replyTo: {
            name: '[Nombre de tu Blog / Marca]',
            email: contactEmail,
          },
          to: [{ email: email, name: '' }],
          subject: '¡Bienvenido al boletín // [Nombre de tu Blog / Marca]!',
          htmlContent: welcomeHtml,
        }),
      });

      if (!emailRes.ok) {
        const errorData = await emailRes.json();
        console.error("[newsletter] Error al enviar email transaccional:", errorData);
      }
    } catch (emailErr) {
      console.error("[newsletter] Error al enviar email transaccional:", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
