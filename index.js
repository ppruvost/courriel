import express from 'express';
import { google } from 'googleapis';

// ⚙️ Variables d’environnement
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const SENDER_EMAIL = process.env.GOOGLE_SENDER_EMAIL;
const TO_EMAIL = process.env.TO_EMAIL;
const RENDER_SECRET_TOKEN = process.env.RENDER_SECRET_TOKEN; // à créer sur Render

// Initialisation du serveur Express
const app = express();
const port = process.env.PORT || 3000;

// Création du client OAuth2
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// On utilise directement le refresh token
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// ---------------- ROUTE SECURISEE /send-email ----------------
app.post('/send-email', async (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || authHeader !== `Bearer ${RENDER_SECRET_TOKEN}`) {
    return res.status(401).send('❌ Non autorisé');
  }

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  const messageParts = [
    `From: "${SENDER_EMAIL}" <${SENDER_EMAIL}>`,
    `To: ${TO_EMAIL}`,
    'Subject: Test email depuis Render',
    '',
    'Bonjour ! Ceci est un email envoyé automatiquement depuis Render via GitHub Actions.'
  ];

  const message = Buffer.from(messageParts.join('\n'))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  try {
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: message },
    });
    console.log('✅ Email envoyé !');
    res.status(200).send('✅ Email envoyé depuis Render !');
  } catch (err) {
    console.error('❌ Erreur envoi email :', err);
    res.status(500).send('❌ Erreur lors de l’envoi de l’email');
  }
});

// ---------------- DÉMARRAGE DU SERVEUR ----------------
app.listen(port, () => {
  console.log(`🚀 Serveur actif sur le port ${port}`);
});
