from fastapi import FastAPI, HTTPException, status, Body
from api.database.firebase_config import get_db
from api.services.ingestion_service import IngestionAdapter
from api.model_loader import get_model_service
from api.config import API_TITLE, FIREBASE_COLLECTION_LEADS

app = FastAPI(title=API_TITLE)
db = get_db()
model_service = get_model_service()

@app.on_event("startup")
async def startup_event():
    model_service.load_model()

@app.post("/api/ingest/{source}", tags=["Ingestion"])
async def ingest_lead(source: str, raw_data: dict = Body(...)):
    """
    Unified endpoint for real-time ingestion (FB, IG, Google Forms).
    Performs Adapter mapping -> Scoring -> Firebase Storage.
    """
    try:
        # 1. Map to standard schema
        lead_info, features = IngestionAdapter.map_generic_lead(raw_data, source)
        
        # 2. Immediate Scoring
        scoring_result = model_service.predict(features)
        
        # 3. Save to Firebase
        lead_data = {
            **lead_info,
            "features": features,
            "scoring": scoring_result,
            "lead_quality": scoring_result["lead_quality"],
            "lead_score": scoring_result["lead_score"]
        }
        
        doc_ref = db.collection(FIREBASE_COLLECTION_LEADS).add(lead_data)
        
        return {
            "status": "success",
            "firebase_id": doc_ref[1].id,
            "score": scoring_result["lead_score"],
            "quality": scoring_result["lead_quality"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))