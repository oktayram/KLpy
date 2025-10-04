from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from ..auth import require_admin, get_current_user
from ..models import Order, OrderCreate, OrderUpdate, OrderStatus, PriceCalculation, VehicleType, Address
from ..services.order_service import OrderService

router = APIRouter(prefix="/api/orders", tags=["Orders"])

# Public routes (for customer frontend)
@router.post("/calculate-price", response_model=PriceCalculation)
async def calculate_price(
    pickup_address: str,
    delivery_address: str,
    vehicle_type: VehicleType
):
    """Calculate transport price (public endpoint)"""
    return await OrderService.calculate_price(pickup_address, delivery_address, vehicle_type)

@router.post("/create", response_model=Order)
async def create_order(order_data: OrderCreate):
    """Create new order (public endpoint)"""
    return await OrderService.create_order(order_data)

@router.get("/track/{tracking_number}", response_model=Order)
async def track_order(tracking_number: str):
    """Track order by tracking number (public endpoint)"""
    order = await OrderService.get_order_by_tracking(tracking_number)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    return order

# Admin routes
@router.get("/", response_model=List[Order])
async def get_orders(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=1000),
    status: Optional[OrderStatus] = Query(default=None),
    search: Optional[str] = Query(default=None),
    current_user: dict = Depends(require_admin)
):
    """Get orders with filters (admin only)"""
    return await OrderService.get_orders(skip, limit, status, search)

@router.get("/{order_id}", response_model=Order)
async def get_order(order_id: str, current_user: dict = Depends(require_admin)):
    """Get order by ID (admin only)"""
    order = await OrderService.get_order_by_id(order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    return order

@router.put("/{order_id}", response_model=Order)
async def update_order(
    order_id: str,
    update_data: OrderUpdate,
    current_user: dict = Depends(require_admin)
):
    """Update order (admin only)"""
    order = await OrderService.update_order(order_id, update_data)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    return order

@router.delete("/{order_id}")
async def delete_order(order_id: str, current_user: dict = Depends(require_admin)):
    """Delete order (admin only)"""
    success = await OrderService.delete_order(order_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    return {"message": "Order deleted successfully"}

@router.get("/analytics/stats")
async def get_order_analytics(current_user: dict = Depends(require_admin)):
    """Get order analytics (admin only)"""
    return await OrderService.get_order_analytics()