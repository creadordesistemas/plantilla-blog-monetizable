import { google } from 'googleapis';
import http from 'http';
import url from 'url';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Cargar .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = 'http://localhost:3000/oauth2callback';

if (!clientId || clientId === 'pega_aqui_tu_client_id') {
  console.error('\n❌ ERROR: Faltan las credenciales en el archivo .env.local');
  console.error('Por favor, asegúrate de haber puesto GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET.\n');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

// Escucha en el puerto 3000 para recibir el código de autorización
const server = http.createServer(async (req, res) => {
  try {
    if (req.url?.indexOf('/oauth2callback') > -1) {
      const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
      res.end('¡Autenticación completada! Ya puedes cerrar esta pestaña y volver a la terminal.');
      server.destroy();
      
      const code = qs.get('code');
      if (code) {
        console.log('\n✅ Código recibido. Intercambiándolo por tokens...\n');
        const { tokens } = await oauth2Client.getToken(code);
        
        console.log('====================================================');
        console.log('🎉 ¡REFRESH TOKEN OBTENIDO CON ÉXITO! 🎉');
        console.log('====================================================\n');
        console.log('Copia exactamente el siguiente texto (sin comillas) y ponlo en tu .env.local');
        console.log(`en la variable GOOGLE_REFRESH_TOKEN:\n`);
        console.log(`\x1b[32m${tokens.refresh_token}\x1b[0m\n`);
        console.log('====================================================\n');
      }
    }
  } catch (e) {
    console.error('❌ Error al obtener los tokens:', e);
  }
});
import destroyable from 'server-destroy';
destroyable(server);

server.listen(3000, async () => {
  // Genera la URL de autorización
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/indexing'],
    prompt: 'consent' // Fuerza a que siempre devuelva un refresh token
  });

  console.log('\n====================================================');
  console.log('🚀 SCRIPT DE AUTORIZACIÓN DE GOOGLE INDEXING');
  console.log('====================================================\n');
  console.log('1. Abre la siguiente URL en tu navegador:');
  console.log(`\n\x1b[36m${authUrl}\x1b[0m\n`);
  console.log('2. Inicia sesión con la cuenta de Google propietaria de Search Console.');
  console.log('3. Acepta los permisos.');
  console.log('4. Vuelve a esta terminal para ver tu Refresh Token.\n');
});
