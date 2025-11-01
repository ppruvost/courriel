[GCP_OAuth_setup.md](https://github.com/user-attachments/files/23282050/GCP_OAuth_setup.md)
# Guide rapide: créer des identifiants OAuth2 pour Gmail API

1. Aller sur Google Cloud Console: https://console.cloud.google.com
2. Créer un projet ou en sélectionner un existant.
3. Activer l'API Gmail (Library -> Gmail API -> Enable).
4. Credentials -> Create Credentials -> OAuth Client ID.
   - Application type: Desktop app (ou Web app selon usage).
5. Télécharger `credentials.json`.
6. Utiliser OAuth Playground or local flow to obtain refresh token / token.json.
