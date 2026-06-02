import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { readData } from '@/services/db';
import crypto from 'crypto';

async function getBrevoApiKey(): Promise<string | null> {
  try {
    const config = await readData<any>('newsletter_config');
    return config?.apiKeyBrevo || process.env.BREVO_API_KEY || null;
  } catch {
    return process.env.BREVO_API_KEY || null;
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('members')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al obtener los miembros' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { email, nombre } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'El email es obligatorio' }, { status: 400 });
    }
    
    const cleanEmail = email.toLowerCase().trim();
    const setupToken = crypto.randomUUID();
    const setupTokenExpires = new Date();
    setupTokenExpires.setDate(setupTokenExpires.getDate() + 7); // 7 días de validez

    const { data, error } = await supabaseAdmin
      .from('members')
      .insert([{ 
        email: cleanEmail, 
        nombre: nombre || '', 
        status: 'activo',
        setup_token: setupToken,
        setup_token_expires: setupTokenExpires.toISOString()
      }])
      .select();
      
    if (error) {
      if (error.code === '23505') { // Código de violación de restricción UNIQUE en Postgres
        return NextResponse.json({ error: 'Este email ya está registrado como miembro.' }, { status: 400 });
      }
      throw error;
    }

    const apiKey = await getBrevoApiKey();

    // 1. Enviar correo transaccional de invitación/bienvenida
    if (apiKey) {
      try {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tudominio.com';
        const activationLink = `${siteUrl}/comunidad/setup-password?token=${setupToken}`;
        
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Acceso Confirmado // [Nombre de tu Blog / Marca]</title>
</head>
<body style="background-color: #000000; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #0d0d0d; border: 1px solid #222222; padding: 40px; box-sizing: border-box;">
    <div style="border-bottom: 1px solid #222222; padding-bottom: 20px; margin-bottom: 30px; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.25em; color: #666666; font-weight: 700;">
      [NOMBRE DE TU BLOG / MARCA] // ACCESO AUTORIZADO
    </div>
    
    <h1 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 20px; color: #ffffff; line-height: 1.3;">
      Confirmación de Membresía
    </h1>
    
    <p style="font-size: 1rem; line-height: 1.7; color: #cccccc; margin-bottom: 30px;">
      Hola ${nombre || 'Miembro'},<br><br>
      Tu acceso a la comunidad privada de [Nombre de tu Blog / Marca] ha sido verificado y activado correctamente. 
      Antes de poder acceder, necesitas establecer una contraseña segura para tu cuenta.
    </p>
    
    <div style="margin: 40px 0; text-align: center;">
      <a href="${activationLink}" style="background-color: #ffffff; color: #000000; padding: 15px 30px; text-decoration: none; font-weight: 700; font-size: 0.9rem; border-radius: 4px; display: inline-block; letter-spacing: 0.05em;">
        ESTABLECER CONTRASEÑA →
      </a>
    </div>
    
    <p style="font-size: 0.9rem; line-height: 1.6; color: #666666; margin-bottom: 30px;">
      Este enlace es de uso único y expirará en 7 días por motivos de seguridad.
      Si no puedes hacer clic en el botón, copia y pega la siguiente URL en tu navegador:
      <br>
      <a href="${activationLink}" style="color: #00ff00; text-decoration: underline;">${activationLink}</a>
    </p>
    
    <div style="margin-top: 50px; border-top: 1px solid #222222; padding-top: 25px; font-size: 0.75rem; color: #555555; line-height: 1.5;">
      Recibes este correo porque fuiste dado de alta como miembro activo en tudominio.com.<br>
      Si tienes algún inconveniente, por favor responde a este correo para contactar a soporte.
    </div>
  </div>
</body>
</html>
        `;

        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'api-key': apiKey,
          },
          body: JSON.stringify({
            sender: {
              name: '[Nombre de tu Blog / Marca]',
              email: 'info@tudominio.com'
            },
            replyTo: {
              name: '[Nombre de tu Blog / Marca]',
              email: 'info@tudominio.com'
            },
            to: [
              {
                email: cleanEmail,
                name: nombre || ""
              }
            ],
            subject: '¡Confirmación de registro // [Nombre de tu Blog / Marca]!',
            htmlContent: htmlContent
          })
        });
      } catch (emailErr) {
        console.error("Error al enviar email transaccional:", emailErr);
      }
    }

    // 2. Sincronizar alta con Brevo (Lista ID 4)
    if (apiKey) {
      try {
        await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'api-key': apiKey,
          },
          body: JSON.stringify({
            email: cleanEmail,
            attributes: nombre ? { NOMBRE: nombre, FIRSTNAME: nombre } : {},
            listIds: [4],
            updateEnabled: true
          })
        });
      } catch (brevoErr) {
        console.error("Error al registrar en Brevo:", brevoErr);
      }
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al añadir miembro' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Falta la ID del miembro' }, { status: 400 });
    }

    // Obtener email del miembro antes de eliminarlo para poder sincronizar con Brevo
    const { data: member, error: fetchError } = await supabaseAdmin
      .from('members')
      .select('email')
      .eq('id', id)
      .single();

    if (fetchError || !member) {
      return NextResponse.json({ error: 'Miembro no encontrado en el sistema.' }, { status: 404 });
    }

    const { error } = await supabaseAdmin
      .from('members')
      .delete()
      .eq('id', id);
      
    if (error) throw error;

    // Sincronizar baja con Brevo (Eliminar de Lista ID 4)
    const apiKey = await getBrevoApiKey();
    if (apiKey) {
      try {
        await fetch('https://api.brevo.com/v3/contacts/lists/4/contacts/remove', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'api-key': apiKey,
          },
          body: JSON.stringify({
            emails: [member.email]
          })
        });
      } catch (brevoErr) {
        console.error("Error al eliminar de la lista de Brevo:", brevoErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al eliminar miembro' }, { status: 500 });
  }
}
