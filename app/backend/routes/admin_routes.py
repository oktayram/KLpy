from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import HTTPAuthorizationCredentials
from typing import List, Optional
from datetime import timedelta
from ..auth import authenticate_user, create_access_token, get_current_user, require_admin
from ..models import AdminLogin, DashboardStats, RevenueReport, OrderAnalytics
from ..services.analytics_service import AnalyticsService

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.post("/login")
async def login(login_data: AdminLogin):
    """Admin login"""
    user = await authenticate_user(login_data.username, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=1440)  # 24 hours
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    
    # Update last login
    from ..database import get_admins_collection
    from datetime import datetime
    admins_col = get_admins_collection()
    await admins_col.update_one(
        {"username": user["username"]},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "username": user["username"],
            "email": user["email"],
            "role": user["role"]
        }
    }

@router.get("/me")
async def get_current_admin(current_user: dict = Depends(get_current_user)):
    """Get current admin user info"""
    return {
        "username": current_user["username"],
        "email": current_user["email"],
        "role": current_user["role"],
        "last_login": current_user.get("last_login")
    }

@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(current_user: dict = Depends(require_admin)):
    """Get dashboard statistics"""
    return await AnalyticsService.get_dashboard_stats()

@router.get("/analytics/revenue", response_model=List[RevenueReport])
async def get_revenue_reports(
    days: int = Query(default=30, ge=1, le=365),
    current_user: dict = Depends(require_admin)
):
    """Get revenue reports"""
    return await AnalyticsService.get_revenue_reports(days)

@router.get("/analytics/orders", response_model=OrderAnalytics)
async def get_order_analytics(
    period: str = Query(default="month", regex="^(week|month|year)$"),
    current_user: dict = Depends(require_admin)
):
    """Get order analytics"""
    return await AnalyticsService.get_order_analytics(period)

@router.get("/analytics/performance")
async def get_performance_metrics(current_user: dict = Depends(require_admin)):
    """Get performance metrics"""
    return await AnalyticsService.get_performance_metrics()