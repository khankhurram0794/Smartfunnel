import firebase_admin
from firebase_admin import credentials, firestore
from api.config import FIREBASE_CRED_PATH

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    cred = credentials.Certificate(FIREBASE_CRED_PATH)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def get_db():
    return db