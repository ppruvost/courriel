# Gmail OAuth – Authentification avec Node.js

Ce projet permet de réaliser une authentification sécurisée via **OAuth2 Gmail**, en utilisant **Node.js** et la bibliothèque officielle **Google APIs**.  
L’application peut être déployée facilement sur **Render**, service cloud compatible avec Node.js.

---

# Fonctionnalités

- Connexion sécurisée via **Google OAuth 2.0**
- Récupération du **jeton d’accès Gmail**
- Serveur Express minimal et rapide
- Ouverture automatique du navigateur pour l’autorisation utilisateur

---

# Structure du projet

gmail-oauth/
│
├── .github/workflows/ → (optionnel) tests ou déploiement CI/CD
├── documents/ → documentation technique (ex : GCP_OAuth_setup.md)
├── .gitignore → fichiers à ignorer (node_modules, .env, etc.)
├── LICENCE → licence MIT
├── conditions.md → conditions d’utilisation
├── confidentialite.md → politique de confidentialité
├── index.js → script principal Node.js (serveur Express)
├── package.json → dépendances et scripts
└── README.md → ce fichier
---
# Installation

# step 1. Cloner le dépôt
git clone https://github.com/ppruvost/gmail-oauth.git
cd gmail-oauth
# step 2. Installer les dépendances
Copier le code
npm install
# step 3. Créer un projet Google Cloud
Rendez-vous sur https://console.cloud.google.com

Activez l’API Gmail et OAuth Consent Screen

# Créez des identifiants OAuth 2.0
Ajoutez l’URL de redirection :
Copier le code
http://localhost:3000/oauth2callback
Téléchargez le fichier credentials.json et placez-le dans le dossier documents/ (ou à la racine).

# Déploiement sur Render
Créez un nouveau service web depuis votre dépôt GitHub.
Configurez :
Build Command : npm install
Start Command : npm start

# Ajoutez vos variables d’environnement dans l’onglet Environment :
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
REDIRECT_URI
Déployez

# Sécurité
Ne partagez jamais votre credentials.json ou vos jetons OAuth.

Ajoutez ce fichier à votre .gitignore :

credentials.json
token.json
Utilisez des variables d’environnement pour les identifiants sensibles.

# Licence
Ce projet est distribué sous licence MIT.
Vous êtes libre de l’utiliser, le modifier et le distribuer en citant l’auteur original.

# Auteur
ppruvost
Projet : Authentification OAuth Gmail avec Node.js et Express
Déploiement : Render
