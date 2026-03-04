from datetime import datetime
from api.config import DEFAULT_FEATURE_VALUES, REQUIRED_FEATURES

class IngestionAdapter:
    """Maps raw source data to the model's required 24-feature schema."""

    @staticmethod
    def map_generic_lead(raw_data: dict, source: str) -> tuple:
        """Standardizes leads from any source (Google Forms, IG, etc.)"""
        now = datetime.now()
        
        # 1. Standard Lead Info
        lead_info = {
            "email": raw_data.get("email") or raw_data.get("Email Address"),
            "full_name": raw_data.get("name") or raw_data.get("Full Name"),
            "phone": raw_data.get("phone") or raw_data.get("Phone Number"),
            "source": source,
            "created_at": now.isoformat(),
            "status": "new"
        }

        # 2. Dynamic Temporal Features
        features = {
            "hour": now.hour,
            "day_of_week": now.weekday(),
            "month": now.month,
            "is_weekend": 1 if now.weekday() >= 5 else 0
        }

        # 3. Fill missing behavioral features with defaults
        for feature in REQUIRED_FEATURES:
            if feature not in features:
                # Use source-provided data if available (e.g., if form has 'price')
                features[feature] = raw_data.get(feature, DEFAULT_FEATURE_VALUES.get(feature, 0))

        return lead_info, features