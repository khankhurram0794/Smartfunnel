import time
import sys
import os

# 1. Setup paths to find your teammate's 'api' folder
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import firebase_admin
from firebase_admin import credentials, firestore
from api.model_loader import get_model_service
from api.services.ingestion_service import IngestionAdapter

# 2. Connect to Firebase using the key you just downloaded
KEY_PATH = "serviceAccountKey.json" 

if not firebase_admin._apps:
    cred = credentials.Certificate(KEY_PATH)
    firebase_admin.initialize_app(cred)

db = firestore.client()
print("🔥 AI Engine Connected to Firebase")

# 3. Load Your Teammate's Model
print("🧠 Loading XGBoost Model...")
model_service = get_model_service()
success = model_service.load_model()

if not success:
    print("❌ Critical Error: Could not load model. Check 'models/trained/best_model.pkl'")
    sys.exit(1)
else:
    print("✅ Model & Feature Config Loaded!")

# 4. The Listener Function
def on_snapshot(col_snapshot, changes, read_time):
    for change in changes:
        if change.type.name == 'ADDED':
            doc = change.document
            data = doc.to_dict()
            lead_id = doc.id
            
            # Check if it needs scoring (if aiScore is 0 or missing)
            if data.get('aiScore', 0) == 0:
                print(f"⚡ New Lead Detected: {data.get('name', 'Unknown')}")
                
                try:
                    # A. USE TEAMMATE'S ADAPTER to fill in missing Ecommerce data
                    _, features = IngestionAdapter.map_generic_lead(data, source="manual_entry")
                    
                    # B. PREDICT
                    prediction = model_service.predict(features)
                    
                    # C. UPDATE FIREBASE
                    db.collection('leads').document(lead_id).update({
                        'aiScore': prediction['lead_score'],
                        'status': prediction['lead_quality'].capitalize(), # Hot/Warm/Cold
                        'aiStatus': 'Scored',
                        'recommendedAction': prediction['recommended_action']
                    })
                    
                    print(f"✅ Scored: {prediction['lead_score']} ({prediction['lead_quality']})")
                    
                except Exception as e:
                    print(f"⚠️ Scoring Failed: {e}")

# 5. Start Watching
print("👀 Watching 'leads' collection...")
query = db.collection('leads').where('aiScore', '==', 0)
query.on_snapshot(on_snapshot)

while True:
    time.sleep(1)