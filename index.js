// ---------------- IMPORTS ----------------
import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';

// ---------------- VARIABLES D'ENVIRONNEMENT ----------------
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const SENDER_EMAIL = process.env.GOOGLE_SENDER_EMAIL;
const TO_EMAIL = process.env.TO_EMAIL;
const RENDER_SECRET_TOKEN = process.env.RENDER_SECRET_TOKEN; // à créer sur Render
const PORT = process.env.PORT || 3000;

// ---------------- INITIALISATION DU SERVEUR ----------------
const app = express();
app.use(express.json());

// ---------------- CORS pour GitHub Pages ----------------
app.use(cors({
  origin: 'https://ppruvost.github.io', // Remplace par ton nom GitHub
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ---------------- ROUTE GET TEST ----------------
app.get('/', (req, res) => {
  res.send('🚀 Serveur en ligne !');
});

// ---------------- CONFIGURATION GOOGLE API ----------------
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// ---------------- ROUTE SECURISEE /send-email ----------------
app.post('/send-email', async (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || authHeader !== `Bearer ${RENDER_SECRET_TOKEN}`) {
    return res.status(401).send('❌ Non autorisé');
  }

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  const { name, email, message } = req.body;

  const messageParts = [
    `From: "${SENDER_EMAIL}" <${SENDER_EMAIL}>`,
    `To: ${TO_EMAIL}`,
    `Subject: Nouveau message de ${name}`,
    '',
    `Email de l'expéditeur : ${email}`,
    '',
    message
  ];

  const rawMessage = Buffer.from(messageParts.join('\n'))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  try {
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: rawMessage }
    });
    console.log('✅ Email envoyé !');
    res.status(200).send('✅ Email envoyé depuis Render !');
  } catch (err) {
    console.error('❌ Erreur envoi email :', err);
    res.status(500).send('❌ Erreur lors de l’envoi de l’email');
  }
});

// ---------------- DÉMARRAGE DU SERVEUR ----------------
app.listen(PORT, () => {
  console.log(`🚀 Serveur actif sur le port ${PORT}`);
});

