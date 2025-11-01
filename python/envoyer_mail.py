# Python example: Gmail API (OAuth2)
# Prérequis: credentials.json (OAuth client ID) et token.json (après autorisation)
# Installation: pip install -r requirements.txt
import os
import base64
from email.mime.text import MIMEText
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/gmail.send']

def get_service():
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    service = build('gmail', 'v1', credentials=creds)
    return service

def create_message(sender, to, subject, message_text):
    msg = MIMEText(message_text)
    msg['to'] = to
    msg['from'] = sender
    msg['subject'] = subject
    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
    return {'raw': raw}

def send_message(service, user_id, message):
    sent = service.users().messages().send(userId=user_id, body=message).execute()
    print('Message Id:', sent['id'])
    return sent

if __name__ == '__main__':
    service = get_service()
    sender = input('From (your email): ').strip()
    to = input('To: ').strip()
    subject = 'Test depuis Gmail API'
    body = 'Bonjour — message envoyé via l\'API Gmail (Python).'
    msg = create_message(sender, to, subject, body)
    send_message(service, 'me', msg)
