// send-mail.js
// Node.js + Nodemailer + OAuth2 pour Gmail
// Fonctionne directement avec les secrets GitHub :
// GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, GOOGLE_SENDER_EMAIL, TO_EMAIL (optionnel)

import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const SENDER_EMAIL = process.env.GOOGLE_SENDER_EMAIL;
const TO_EMAIL = process.env.TO_EMAIL || SENDER_EMAIL; // fallback si TO_EMAIL non défini

// Vérification des variables d'environnement
if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN || !SENDER_EMAIL) {
  console.error('❌ Missing environment variables. Please set GitHub Secrets.');
  process.exit(1);
}

// Création du client OAuth2
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  'https://developers.google.com/oauthplayground' // redirect URI (non utilisée ici)
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail() {
  try {
    // Récupération du access token
    const accessTokenResponse = await oAuth2Client.getAccessToken();
    const accessToken = accessTokenResponse?.token;

    if (!accessToken) {
      throw new Error('Impossible de récupérer l’access token.');
    }

    // Création du transporteur Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: SENDER_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken
      }
    });

    // Définition du mail
    const mailOptions = {
      from: SENDER_EMAIL,
      to: TO_EMAIL,
      subject: '📧 Test email depuis GitHub Actions',
      text: 'Bonjour — ceci est un test envoyé via Nodemailer + OAuth2 depuis GitHub Actions.',
    };

    // Envoi du mail
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email envoyé avec succès ! MessageId:', result.messageId);
  } catch (err) {
    console.error('❌ Erreur lors de l’envoi du mail :', err);
    process.exit(1); // GitHub Actions considérera le job comme échoué
  }
}

// Lancement de l’envoi
sendMail();
