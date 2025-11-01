# Node.js — Nodemailer + OAuth2

1. Installer:
   ```bash
   cd node
   npm install
   ```

2. Créer un fichier `.env` contenant:
   ```
   CLIENT_ID=...
   CLIENT_SECRET=...
   REFRESH_TOKEN=...
   SENDER_EMAIL=you@example.com
   TO_EMAIL=recipient@example.com  # optional
   ```

3. Lancer:
   ```bash
   npm start
   ```

Pour obtenir `REFRESH_TOKEN`, utilisez Google Cloud Console (credentials OAuth 2.0) et OAuth Playground ou implémentez flow côté serveur.
