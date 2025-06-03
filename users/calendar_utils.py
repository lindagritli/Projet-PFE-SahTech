# from google.oauth2 import service_account
# from googleapiclient.discovery import build
# import datetime

# SCOPES = ['https://www.googleapis.com/auth/calendar']
# SERVICE_ACCOUNT_FILE ='C:/Users/Gritli/PROJET-PFE/sahtech-459201-25f4f8134f26.json'  # <- modifie ici

# def create_google_meet_link(summary, start_datetime, end_datetime):
#     credentials = service_account.Credentials.from_service_account_file(
#         SERVICE_ACCOUNT_FILE, scopes=SCOPES)

#     service = build('calendar', 'v3', credentials=credentials)

#     event = {
#         'summary': summary,
#         'start': {'dateTime': start_datetime.isoformat(), 'timeZone': 'Europe/Paris'},
#         'end': {'dateTime': end_datetime.isoformat(), 'timeZone': 'Europe/Paris'}
#         ,
#         'conferenceData': {
#             'createRequest': {
#                 'requestId': f"rdv-{datetime.datetime.now().timestamp()}",
#                 'conferenceSolutionKey': {
#                     'type': 'hangoutsMeet'  # ✅ correcte pour Google Meet
#                 }
#             }
#         }
#     }

#     event = service.events().insert(
#         calendarId='primary',
#         body=event,
#         conferenceDataVersion=1
#     ).execute()

#     return event['hangoutLink']


import uuid

def generate_jitsi_link(medecin_email, patient_email):
    # Génère une salle unique : docteur-patient-xxxxxx
    room_id = f"{medecin_email.split('@')[0]}-{patient_email.split('@')[0]}-{uuid.uuid4().hex[:6]}"
    return f"https://meet.jit.si/{room_id}"
