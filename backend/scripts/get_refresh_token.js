import { google } from 'googleapis';
import http from 'http';
import url from 'url';
import dotenv from 'dotenv';

dotenv.config();

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/oauth2callback';

if (!clientId || !clientSecret || clientId.includes('tu_google') || clientSecret.includes('tu_google')) {
  console.log('================================================================');
  console.log('AVISO: Credenciales no configuradas todavía en backend/.env');
  console.log('================================================================');
  console.log('Para generar el Refresh Token, primero debes crear tus credenciales');
  console.log('de OAuth 2.0 en Google Cloud Console, copiarlas en backend/.env');
  console.log('y luego ejecutar este script nuevamente.');
  console.log('Consulte las instrucciones en el README de la raíz.');
  console.log('================================================================\n');
  process.exit(0);
}

const parsedUrl = new URL(redirectUri);
const PORT = parsedUrl.port || 5000;
const PATH = parsedUrl.pathname || '/oauth2callback';

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);

const scopes = [
  'https://www.googleapis.com/auth/calendar'
];

const authorizeUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent'
});

console.log('\n================================================================');
console.log('AUTENTICACIÓN DE GOOGLE CALENDAR (OAUTH 2.0)');
console.log('================================================================\n');
console.log('1. Abre el siguiente enlace en tu navegador para autorizar la aplicación:\n');
console.log(authorizeUrl);
console.log('\n2. Una vez que aceptes, serás redirigido y el script capturará tus tokens.\n');

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith(PATH)) {
      const q = url.parse(req.url, true).query;
      if (q.code) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>¡Autorización Exitosa!</h1><p>Puedes cerrar esta pestaña y volver a la terminal de VS Code / consola.</p>');
        
        console.log('Intercambiando código de autorización por tokens...');
        const { tokens } = await oauth2Client.getToken(q.code);
        console.log('\n================================================================');
        console.log('TOKENS OBTENIDOS CON ÉXITO:');
        console.log('================================================================');
        console.log(`\nGOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`);
        console.log('Copia este valor y pégalo en tu archivo backend/.env');
        console.log('================================================================\n');
        
        server.close(() => {
          console.log('Servidor de autenticación temporal cerrado.');
          process.exit(0);
        });
      } else {
        res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Error</h1><p>No se pudo obtener el código de autorización.</p>');
      }
    }
  } catch (err) {
    console.error('Error durante el callback de autenticación:', err);
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Error interno</h1><p>' + err.message + '</p>');
  }
});

server.listen(PORT, () => {
  console.log(`Esperando redirección en ${redirectUri} ...`);
});
