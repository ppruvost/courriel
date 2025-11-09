import { google } from 'googleapis';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const SENDER_EMAIL = process.env.GOOGLE_SENDER_EMAIL;
const TO_EMAIL = process.env.TO_EMAIL;

// Création du client OAuth2
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Fonction pour envoyer un email
async function sendEmail() {
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  const messageParts = [
    `From: "${SENDER_EMAIL}" <${SENDER_EMAIL}>`,
    `To: ${TO_EMAIL}`,
    'Subject: Test GitHub Actions',
    '',
    'Bonjour ! Ceci est un email envoyé automatiquement depuis GitHub Actions.'
  ];

  const message = Buffer.from(messageParts.join('\n'))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  try {
    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: message },
    });
    console.log('✅ Email envoyé ! ID :', res.data.id);
  } catch (err) {
    console.error('❌ Erreur envoi email :', err);
    process.exit(1);
  }
}

sendEmail();
