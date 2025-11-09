import express from 'express';
import { google } from 'googleapis';
import fs from 'fs';

// ⚙️ Variables d’environnement (à configurer dans Render)
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || 'https://courriel.onrender.com/oauth2callback';
const RENDER_SECRET_TOKEN = process.env.RENDER_SECRET_TOKEN; // pour sécuriser la route
const SENDER_EMAIL = process.env.GOOGLE_SENDER_EMAIL; // ton email d’expédition
const TO_EMAIL = process.env.TO_EMAIL; // destinataire de test

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

// ---------------- ROUTES EXISTANTES ----------------

// 🔹 Route principale : page d’accueil
app.get('/', async (req, res) => {
  if (!tokens) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/gmail.send'],
    });
    res.send(`
      <h1>Connexion Gmail</h1>
      <p><a href="${authUrl}">👉 Autoriser l’accès à Gmail
