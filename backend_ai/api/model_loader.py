"""
Model loader and prediction service
"""

import joblib
import json
import numpy as np
import pandas as pd
from pathlib import Path
from typing import Dict, List, Tuple
import logging

from api.config import (
    MODEL_PATH, 
    FEATURE_CONFIG_PATH, 
    REQUIRED_FEATURES,
    DEFAULT_FEATURE_VALUES,
    LEAD_QUALITY_THRESHOLDS,
    RECOMMENDED_ACTIONS
)

logger = logging.getLogger(__name__)


class ModelService:
    """Service for loading model and making predictions"""
    
    def __init__(self):
        self.model = None
        self.feature_config = None
        self.is_loaded = False
        
    def load_model(self) -> bool:
        """Load the trained model and configuration"""
        try:
            logger.info(f"Loading model from {MODEL_PATH}")
            self.model = joblib.load(MODEL_PATH)
            logger.info("Model loaded successfully")
            
            # Load feature configuration
            if FEATURE_CONFIG_PATH.exists():
                with open(FEATURE_CONFIG_PATH, 'r') as f:
                    self.feature_config = json.load(f)
                logger.info("Feature configuration loaded")
            else:
                logger.warning("Feature configuration not found, using defaults")
                self.feature_config = {
                    'feature_columns': REQUIRED_FEATURES,
                    'model_type': 'xgboost'
                }
            
            self.is_loaded = True
            return True
            
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            self.is_loaded = False
            return False
    
    def prepare_features(self, features: Dict) -> pd.DataFrame:
        """Prepare features for prediction"""
        
        # Create feature dictionary with defaults
        feature_dict = DEFAULT_FEATURE_VALUES.copy()
        
        # Update with provided features
        feature_dict.update({k: v for k, v in features.items() if v is not None})
        
        # Ensure all required features are present
        for feature in REQUIRED_FEATURES:
            if feature not in feature_dict:
                logger.warning(f"Missing feature: {feature}, using default value")
                feature_dict[feature] = DEFAULT_FEATURE_VALUES.get(feature, 0)
        
        # Create DataFrame with features in correct order
        feature_values = [feature_dict[f] for f in REQUIRED_FEATURES]
        df = pd.DataFrame([feature_values], columns=REQUIRED_FEATURES)
        
        return df
    
    def predict(self, features: Dict) -> Dict:
        """Make prediction for a single lead"""
        
        if not self.is_loaded:
            raise RuntimeError("Model not loaded. Call load_model() first.")
        
        try:
            # Prepare features
            X = self.prepare_features(features)
            
            # Get prediction probability
            probability = self.model.predict_proba(X)[0][1]  # Probability of positive class
            
            # Convert to lead score (0-100)
            lead_score = float(probability * 100)
            
            # Determine lead quality
            lead_quality = self._get_lead_quality(lead_score)
            
            # Get recommended action
            recommended_action = RECOMMENDED_ACTIONS[lead_quality]
            
            # Calculate confidence interval (simple approximation)
            confidence_interval = self._calculate_confidence_interval(probability)
            
            return {
                'lead_score': round(lead_score, 2),
                'conversion_probability': round(probability, 4),
                'lead_quality': lead_quality,
                'recommended_action': recommended_action,
                'confidence_interval': confidence_interval
            }
            
        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            raise
    
    def predict_batch(self, features_list: List[Dict]) -> List[Dict]:
        """Make predictions for multiple leads"""
        
        if not self.is_loaded:
            raise RuntimeError("Model not loaded. Call load_model() first.")
        
        results = []
        for features in features_list:
            try:
                result = self.predict(features)
                results.append(result)
            except Exception as e:
                logger.error(f"Error predicting lead: {str(e)}")
                results.append({
                    'lead_score': 0.0,
                    'conversion_probability': 0.0,
                    'lead_quality': 'error',
                    'recommended_action': 'review_manually',
                    'confidence_interval': {'lower': 0.0, 'upper': 0.0},
                    'error': str(e)
                })
        
        return results
    
    def _get_lead_quality(self, score: float) -> str:
        """Determine lead quality based on score"""
        if score >= LEAD_QUALITY_THRESHOLDS['hot']:
            return 'hot'
        elif score >= LEAD_QUALITY_THRESHOLDS['warm']:
            return 'warm'
        else:
            return 'cold'
    
    def _calculate_confidence_interval(self, probability: float, confidence: float = 0.95) -> Dict[str, float]:
        """
        Calculate confidence interval for probability estimate
        Using simple Wilson score interval approximation
        """
        # For single prediction, use a simplified approach
        # In production, you'd want more sophisticated methods
        margin = 0.05  # ±5% margin
        
        lower = max(0.0, probability - margin)
        upper = min(1.0, probability + margin)
        
        return {
            'lower': round(lower, 4),
            'upper': round(upper, 4)
        }
    
    def get_model_info(self) -> Dict:
        """Get model information"""
        if not self.is_loaded:
            return {
                'model_loaded': False,
                'error': 'Model not loaded'
            }
        
        info = {
            'model_type': self.feature_config.get('model_type', 'xgboost'),
            'training_date': self.feature_config.get('training_date', 'unknown'),
            'num_features': len(REQUIRED_FEATURES),
            'feature_names': REQUIRED_FEATURES,
            'performance_metrics': self.feature_config.get('metrics', {})
        }
        
        return info


# Global model service instance
model_service = ModelService()


def get_model_service() -> ModelService:
    """Get the global model service instance"""
    return model_service