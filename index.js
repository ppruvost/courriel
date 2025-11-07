import express from 'express';
import { google } from 'googleapis';
import fs from 'fs';

// ⚙️ Variables d’environnement (à configurer dans Render)
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || 'https://courriel.onrender.com/oauth2callback';

// Initialisation du serveur Express
const app = express();
const port = process.env.PORT || 3000;

// Création du client OAuth2
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Chargement des tokens si déjà enregistrés
let tokens = null;
if (fs.existsSync('token.json')) {
  tokens = JSON.parse(fs.readFileSync('token.json', 'utf-8'));
  oAuth2Client.setCredentials(tokens);
  console.log('✅ Token existant chargé');
}

// 🔹 Route principale : page d’accueil
app.get('/', async (req, res) => {
  if (!tokens) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/gmail.readonly'],
    });
    res.send(`
      <h1>Connexion Gmail</h1>
      <p><a href="${authUrl}">👉 Autoriser l’accès à Gmail</a></p>
    `);
  } else {
    res.redirect('/emails');
  }
});

// 🔹 Route de callback OAuth2
app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send('Aucun code reçu depuis Google.');

  try {
    const { tokens: newTokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(newTokens);
    fs.writeFileSync('token.json', JSON.stringify(newTokens));
    tokens = newTokens;
    console.log('✅ Authentification réussie et token sauvegardé');
    res.redirect('/emails');
  } catch (error) {
    console.error('Erreur OAuth2 :', error);
    res.send('Erreur lors de l’authentification.');
  }
});

// 🔹 Exemple : lecture des labels Gmail
app.get('/emails', async (req, res) => {
  if (!tokens) return res.redirect('/');

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

  try {
    const result = await gmail.users.labels.list({ userId: 'me' });
    const labels = result.data.labels.map(l => `<li>${l.name}</li>`).join('');
    res.send(`<h1>Labels Gmail</h1><ul>${labels}</ul>`);
  } catch (error) {
    console.error(error);
    res.send('Erreur lors de la récupération des labels Gmail.');
  }
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`🚀 Serveur actif sur le port ${port}`);
});
