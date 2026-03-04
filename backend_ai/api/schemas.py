"""
Pydantic schemas for API request and response validation
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict
from datetime import datetime


class LeadFeatures(BaseModel):
    """Input features for lead scoring"""
    
    # Temporal features
    hour: Optional[int] = Field(12, ge=0, le=23, description="Hour of day (0-23)")
    day_of_week: Optional[int] = Field(3, ge=0, le=6, description="Day of week (0=Monday, 6=Sunday)")
    month: Optional[int] = Field(10, ge=1, le=12, description="Month (1-12)")
    is_weekend: Optional[int] = Field(0, ge=0, le=1, description="Weekend indicator (0 or 1)")
    
    # Product features
    price: Optional[float] = Field(100.0, gt=0, description="Product price")
    category_depth: Optional[int] = Field(2, ge=1, description="Category hierarchy depth")
    category_l1_encoded: Optional[int] = Field(0, ge=0, description="Encoded category level 1")
    
    # User behavioral features
    total_events: Optional[int] = Field(5, ge=0, description="Total user events")
    unique_products: Optional[int] = Field(3, ge=0, description="Unique products viewed")
    category_diversity: Optional[int] = Field(2, ge=0, description="Number of unique categories")
    brand_diversity: Optional[int] = Field(1, ge=0, description="Number of unique brands")
    
    # Price statistics
    avg_price_viewed: Optional[float] = Field(100.0, ge=0, description="Average price of viewed products")
    
    # Session features
    num_sessions: Optional[int] = Field(2, ge=0, description="Number of sessions")
    num_view: Optional[int] = Field(8, ge=0, description="Number of view events")
    num_cart: Optional[int] = Field(1, ge=0, description="Number of cart additions")
    view_to_cart_rate: Optional[float] = Field(0.125, ge=0, le=1, description="View to cart conversion rate")
    engagement_score: Optional[float] = Field(3.5, ge=0, description="User engagement score")
    
    # Session metrics
    session_events: Optional[int] = Field(4, ge=0, description="Events per session")
    session_products: Optional[int] = Field(2, ge=0, description="Products per session")
    session_avg_price: Optional[float] = Field(100.0, ge=0, description="Average session price")
    session_duration_min: Optional[float] = Field(5.0, ge=0, description="Session duration in minutes")
    
    # Product popularity features
    product_views: Optional[int] = Field(100, ge=0, description="Total product views")
    unique_viewers: Optional[int] = Field(50, ge=0, description="Unique viewers of product")
    product_conversion_rate: Optional[float] = Field(0.05, ge=0, le=1, description="Product conversion rate")
    
    class Config:
        schema_extra = {
            "example": {
                "hour": 14,
                "day_of_week": 2,
                "month": 10,
                "is_weekend": 0,
                "price": 299.99,
                "category_depth": 3,
                "category_l1_encoded": 5,
                "total_events": 15,
                "unique_products": 8,
                "category_diversity": 4,
                "brand_diversity": 3,
                "avg_price_viewed": 250.50,
                "num_sessions": 3,
                "num_view": 20,
                "num_cart": 3,
                "view_to_cart_rate": 0.15,
                "engagement_score": 7.5,
                "session_events": 8,
                "session_products": 5,
                "session_avg_price": 275.00,
                "session_duration_min": 12.5,
                "product_views": 500,
                "unique_viewers": 250,
                "product_conversion_rate": 0.08
            }
        }


class LeadScoreRequest(BaseModel):
    """Request model for single lead scoring"""
    
    lead_id: Optional[str] = Field(None, description="Optional lead identifier")
    features: LeadFeatures
    
    class Config:
        schema_extra = {
            "example": {
                "lead_id": "LEAD_12345",
                "features": {
                    "hour": 14,
                    "num_cart": 3,
                    "view_to_cart_rate": 0.25,
                    "engagement_score": 8.5
                }
            }
        }


class BatchLeadScoreRequest(BaseModel):
    """Request model for batch lead scoring"""
    
    leads: List[LeadScoreRequest] = Field(..., description="List of leads to score")
    
    @validator('leads')
    def validate_batch_size(cls, v):
        if len(v) > 1000:
            raise ValueError("Maximum batch size is 1000 leads")
        if len(v) == 0:
            raise ValueError("At least one lead is required")
        return v


class LeadScoreResponse(BaseModel):
    """Response model for lead scoring"""
    
    lead_id: Optional[str] = Field(None, description="Lead identifier if provided")
    lead_score: float = Field(..., ge=0, le=100, description="Lead score (0-100)")
    conversion_probability: float = Field(..., ge=0, le=1, description="Probability of conversion")
    lead_quality: str = Field(..., description="Lead quality category (hot/warm/cold)")
    recommended_action: str = Field(..., description="Recommended action for this lead")
    confidence_interval: Dict[str, float] = Field(..., description="95% confidence interval")
    timestamp: datetime = Field(default_factory=datetime.now, description="Scoring timestamp")
    
    class Config:
        schema_extra = {
            "example": {
                "lead_id": "LEAD_12345",
                "lead_score": 87.5,
                "conversion_probability": 0.875,
                "lead_quality": "hot",
                "recommended_action": "immediate_sales_call",
                "confidence_interval": {
                    "lower": 0.853,
                    "upper": 0.897
                },
                "timestamp": "2024-01-15T14:30:00"
            }
        }


class BatchLeadScoreResponse(BaseModel):
    """Response model for batch lead scoring"""
    
    total_leads: int = Field(..., description="Total number of leads scored")
    processing_time_ms: float = Field(..., description="Processing time in milliseconds")
    results: List[LeadScoreResponse] = Field(..., description="Individual lead scores")
    summary: Dict[str, int] = Field(..., description="Summary statistics")


class HealthResponse(BaseModel):
    """Health check response"""
    
    status: str = Field(..., description="API status")
    model_loaded: bool = Field(..., description="Model load status")
    version: str = Field(..., description="API version")
    timestamp: datetime = Field(default_factory=datetime.now)


class ModelInfoResponse(BaseModel):
    """Model information response"""
    
    model_type: str = Field(..., description="Model algorithm type")
    training_date: str = Field(..., description="Model training date")
    num_features: int = Field(..., description="Number of input features")
    feature_names: List[str] = Field(..., description="List of feature names")
    performance_metrics: Dict = Field(..., description="Model performance metrics")  # Changed to Dict without type constraint


class ErrorResponse(BaseModel):
    """Error response model"""
    
    error: str = Field(..., description="Error type")
    message: str = Field(..., description="Error message")
    details: Optional[Dict] = Field(None, description="Additional error details")
    timestamp: datetime = Field(default_factory=datetime.now)