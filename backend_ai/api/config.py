"""
Configuration settings for Lead Scoring API
"""
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "trained" / "best_model.pkl"
FEATURE_CONFIG_PATH = BASE_DIR / "models" / "trained" / "feature_config.json"

# Firebase Settings (Update path to your service account key)
FIREBASE_CRED_PATH = os.getenv("FIREBASE_CRED_PATH", str(BASE_DIR / "serviceAccountKey.json"))
FIREBASE_COLLECTION_LEADS = "leads"

API_TITLE = "SmartFunnel Real-Time Lead Scoring"
API_VERSION = "1.0.0"

LEAD_QUALITY_THRESHOLDS = {"hot": 70, "warm": 40, "cold": 0}
RECOMMENDED_ACTIONS = {
    "hot": "immediate_sales_call",
    "warm": "email_nurture_campaign",
    "cold": "retargeting_ads"
}

# The 24 features your XGBoost model expects
REQUIRED_FEATURES = [
    'hour', 'day_of_week', 'month', 'is_weekend', 'price', 'category_depth',
    'category_l1_encoded', 'total_events', 'unique_products', 'category_diversity',
    'brand_diversity', 'avg_price_viewed', 'num_sessions', 'num_view', 'num_cart',
    'view_to_cart_rate', 'engagement_score', 'session_events', 'session_products',
    'session_avg_price', 'session_duration_min', 'product_views', 'unique_viewers',
    'product_conversion_rate'
]

# Baseline defaults for new leads with no behavioral history
DEFAULT_FEATURE_VALUES = {
    'hour': 12, 'day_of_week': 3, 'month': 10, 'is_weekend': 0,
    'price': 100.0, 'category_depth': 2, 'category_l1_encoded': 0,
    'total_events': 5, 'unique_products': 3, 'category_diversity': 2,
    'brand_diversity': 1, 'avg_price_viewed': 100.0, 'num_sessions': 2,
    'num_view': 8, 'num_cart': 1, 'view_to_cart_rate': 0.125,
    'engagement_score': 3.5, 'session_events': 4, 'session_products': 2,
    'session_avg_price': 100.0, 'session_duration_min': 5.0,
    'product_views': 100, 'unique_viewers': 50, 'product_conversion_rate': 0.05
}