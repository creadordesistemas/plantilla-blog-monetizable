import { NextResponse } from 'next/server';
import { readData } from '@/services/db';

function markdownToHtml(markdown: string): string {
  // Conversión básica de Markdown a HTML sin dependencias
  let html = markdown
    // Negritas
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Cursivas
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Encabezados
    .replace(/^### (.*?)$/gm, '<h3 style="color:#ffffff;font-size:1.2rem;margin-top:20px;margin-bottom:10px;">$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2 style="color:#ffffff;font-size:1.4rem;margin-top:25px;margin-bottom:10px;">$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1 style="color:#ffffff;font-size:1.75rem;margin-top:30px;margin-bottom:15px;">$1</h1>');
    
  // Enlaces
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color:#00ff00;text-decoration:none;border-bottom:1px solid #00ff00">$1</a>');

  // Párrafos (separa por saltos dobles)
  return html
    .split(/\n\s*\n/)
    .map(p => {
      p = p.trim();
      if (!p) return '';
      if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<ol') || p.startsWith('<li')) return p;
      return `<p style="margin-top:0;margin-bottom:1.5rem;line-height:1.7;color:#cccccc">${p}</p>`;
    })
    .join('\n');
}

export async function POST(request: Request) {
  try {
    const { asunto, titulo, cuerpo, listaId } = await request.json();
    
    if (!asunto || !titulo || !cuerpo) {
      return NextResponse.json({ error: 'Faltan campos requeridos (asunto, titulo, cuerpo)' }, { status: 400 });
    }

    // Leer la configuración guardada de newsletter
    const config = await readData<any>('newsletter_config');
    
    // Obtener las credenciales (de BD con fallback a .env.local)
    const apiKey = config?.apiKeyBrevo || process.env.BREVO_API_KEY;
    
    // Determinar la lista de envío
    const listIdStr = listaId || config?.listaBrevoId;

    if (!apiKey) {
      return NextResponse.json({ error: 'La API Key de Brevo no está configurada.' }, { status: 400 });
    }

    if (!listIdStr) {
      return NextResponse.json({ error: 'El ID de lista de Brevo no está configurado.' }, { status: 400 });
    }

    const listId = Number(listIdStr);
    if (isNaN(listId)) {
      return NextResponse.json({ error: 'El ID de lista debe ser un número válido.' }, { status: 400 });
    }

    // Generar el contenido HTML
    const cuerpoHtml = markdownToHtml(cuerpo);

    // Diseño técnico de alta costura (Monolith Noir)
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${asunto}</title>
</head>
<body style="background-color: #000000; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #0d0d0d; border: 1px solid #222222; padding: 40px; box-sizing: border-box;">
    <div style="border-bottom: 1px solid #222222; padding-bottom: 20px; margin-bottom: 30px; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.25em; color: #666666; font-weight: 700;">
      ${config?.siteName || 'MI BLOG'} // BOLETÍN OFICIAL
    </div>
    <h1 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 25px; color: #ffffff; line-height: 1.3;">
      ${titulo}
    </h1>
    <div style="font-size: 1rem; line-height: 1.7; color: #cccccc;">
      ${cuerpoHtml}
    </div>
    <div style="margin-top: 50px; border-top: 1px solid #222222; padding-top: 25px; font-size: 0.75rem; color: #555555; line-height: 1.5;">
      Recibes este correo porque te suscribiste a ${config?.domain || 'tudominio.com'}.<br>
      Puedes gestionar tu suscripción o darte de baja a través de los enlaces provistos por Brevo.
    </div>
  </div>
</body>
</html>
    `;

    // 1. Crear la campaña en Brevo (se crea en borrador)
    const createRes = await fetch('https://api.brevo.com/v3/emailCampaigns', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: `Campaña: ${asunto} (${new Date().toLocaleDateString()})`,
        sender: {
          name: config?.senderName || 'Mi Blog',
          email: config?.senderEmail || process.env.BREVO_SENDER_EMAIL || 'hola@tudominio.com'
        },
        replyTo: config?.senderEmail || process.env.BREVO_SENDER_EMAIL || 'hola@tudominio.com',
        subject: asunto,
        htmlContent: htmlContent,
        recipients: {
          listIds: [listId]
        }
      })
    });

    if (!createRes.ok) {
      const errorData = await createRes.json();
      return NextResponse.json({ error: `Error al crear la campaña en Brevo: ${JSON.stringify(errorData)}` }, { status: createRes.status });
    }

    const campaignData = await createRes.json();
    const campaignId = campaignData.id;

    if (!campaignId) {
      return NextResponse.json({ error: 'No se recibió ID de campaña de Brevo.' }, { status: 500 });
    }

    // 2. Disparar el envío de la campaña inmediatamente
    const sendRes = await fetch(`https://api.brevo.com/v3/emailCampaigns/${campaignId}/sendNow`, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!sendRes.ok) {
      const errorData = await sendRes.json();
      return NextResponse.json({ error: `Error al disparar el envío en Brevo: ${JSON.stringify(errorData)}` }, { status: sendRes.status });
    }

    return NextResponse.json({ success: true, campaignId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al procesar el envío' }, { status: 500 });
  }
}
