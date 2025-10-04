from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import math
from ..database import get_orders_collection, get_customers_collection, get_pricing_rules_collection
from ..models import Order, OrderCreate, OrderUpdate, OrderStatus, PriceCalculation, VehicleType
import uuid

class OrderService:
    
    @staticmethod
    async def calculate_price(pickup_address: str, delivery_address: str, vehicle_type: VehicleType) -> PriceCalculation:
        """Calculate price for transport"""
        # Mock distance calculation (in real app, use Google Maps API)
        # For demo, generate distance based on postal codes
        distance = await OrderService._calculate_distance(pickup_address, delivery_address)
        
        # Get pricing rules
        pricing_col = get_pricing_rules_collection()
        pricing_rule = await pricing_col.find_one({
            "vehicle_type": vehicle_type,
            "is_active": True
        })
        
        if not pricing_rule:
            # Default pricing if no rule found
            default_pricing = {
                "bestelauto": {"base_price": 25.0, "price_per_km": 1.2},
                "bestelbus": {"base_price": 35.0, "price_per_km": 1.5}, 
                "bakwagen": {"base_price": 45.0, "price_per_km": 1.8}
            }
            pricing = default_pricing.get(vehicle_type, default_pricing["bestelauto"])
        else:
            pricing = {
                "base_price": pricing_rule["base_price"],
                "price_per_km": pricing_rule["price_per_km"],
                "time_multiplier": pricing_rule.get("time_multiplier", 1.0),
                "area_multiplier": pricing_rule.get("area_multiplier", 1.0)
            }
        
        # Calculate pricing
        base_price = pricing["base_price"]
        distance_price = distance * pricing["price_per_km"]
        total_price = (base_price + distance_price) * pricing.get("time_multiplier", 1.0) * pricing.get("area_multiplier", 1.0)
        
        # Calculate estimated time (30 km/h average + 15 min pickup time)
        travel_time = (distance / 30) * 60  # minutes
        total_time = travel_time + 15
        
        return PriceCalculation(
            base_price=base_price,
            distance_price=distance_price,
            total_price=round(total_price, 2),
            estimated_time=f"{int(total_time)} minuten",
            distance=distance,
            vehicle_type=vehicle_type
        )
    
    @staticmethod
    async def _calculate_distance(pickup: str, delivery: str) -> float:
        """Mock distance calculation based on postal codes"""
        # In real app, use Google Maps Distance Matrix API
        # For demo, generate realistic distances
        pickup_code = pickup.split()[0] if pickup else "1000"
        delivery_code = delivery.split()[0] if delivery else "1000"
        
        try:
            pickup_num = int(''.join(filter(str.isdigit, pickup_code)))
            delivery_num = int(''.join(filter(str.isdigit, delivery_code)))
            distance = abs(pickup_num - delivery_num) / 100 + 5  # Basic distance simulation
            return min(max(distance, 2), 100)  # Between 2-100 km
        except:
            return 15.0  # Default distance
    
    @staticmethod
    async def create_order(order_data: OrderCreate) -> Order:
        """Create new order"""
        orders_col = get_orders_collection()
        customers_col = get_customers_collection()
        
        # Calculate pricing
        pickup_addr = f"{order_data.pickup_address.postal_code} {order_data.pickup_address.city}"
        delivery_addr = f"{order_data.delivery_address.postal_code} {order_data.delivery_address.city}"
        
        price_calc = await OrderService.calculate_price(pickup_addr, delivery_addr, order_data.vehicle_type)
        
        # Create order
        order = Order(
            customer_name=order_data.customer_name,
            customer_email=order_data.customer_email, 
            customer_phone=order_data.customer_phone,
            pickup_address=order_data.pickup_address,
            delivery_address=order_data.delivery_address,
            vehicle_type=order_data.vehicle_type,
            price=price_calc.total_price,
            distance=price_calc.distance,
            special_instructions=order_data.special_instructions,
            estimated_delivery=datetime.utcnow() + timedelta(hours=2),  # Mock estimate
            customer_id=""  # Will be set after customer creation/lookup
        )
        
        # Create or update customer
        existing_customer = await customers_col.find_one({"email": order_data.customer_email})
        if existing_customer:
            order.customer_id = existing_customer["id"]
            # Update customer's total orders
            await customers_col.update_one(
                {"id": existing_customer["id"]},
                {"$inc": {"total_orders": 1}}
            )
        else:
            # Create new customer
            from ..models import Customer
            new_customer = Customer(
                name=order_data.customer_name,
                email=order_data.customer_email,
                phone=order_data.customer_phone,
                total_orders=1
            )
            await customers_col.insert_one(new_customer.dict())
            order.customer_id = new_customer.id
        
        # Insert order
        await orders_col.insert_one(order.dict())
        return order
    
    @staticmethod
    async def get_orders(skip: int = 0, limit: int = 100, status: Optional[OrderStatus] = None, 
                        search: Optional[str] = None) -> List[Order]:
        """Get orders with filters"""
        orders_col = get_orders_collection()
        
        # Build query
        query = {}
        if status:
            query["status"] = status
        if search:
            query["$or"] = [
                {"tracking_number": {"$regex": search, "$options": "i"}},
                {"customer_name": {"$regex": search, "$options": "i"}},
                {"customer_email": {"$regex": search, "$options": "i"}}
            ]
        
        # Execute query
        cursor = orders_col.find(query).sort("created_at", -1).skip(skip).limit(limit)
        orders = await cursor.to_list(length=limit)
        
        return [Order(**order) for order in orders]
    
    @staticmethod
    async def get_order_by_id(order_id: str) -> Optional[Order]:
        """Get order by ID"""
        orders_col = get_orders_collection()
        order = await orders_col.find_one({"id": order_id})
        return Order(**order) if order else None
    
    @staticmethod
    async def get_order_by_tracking(tracking_number: str) -> Optional[Order]:
        """Get order by tracking number"""
        orders_col = get_orders_collection()
        order = await orders_col.find_one({"tracking_number": tracking_number})
        return Order(**order) if order else None
    
    @staticmethod
    async def update_order(order_id: str, update_data: OrderUpdate) -> Optional[Order]:
        """Update order"""
        orders_col = get_orders_collection()
        
        update_dict = {}
        for field, value in update_data.dict(exclude_unset=True).items():
            if value is not None:
                update_dict[field] = value
        
        if update_dict:
            update_dict["updated_at"] = datetime.utcnow()
            
            result = await orders_col.update_one(
                {"id": order_id},
                {"$set": update_dict}
            )
            
            if result.modified_count:
                return await OrderService.get_order_by_id(order_id)
        
        return None
    
    @staticmethod
    async def delete_order(order_id: str) -> bool:
        """Delete order"""
        orders_col = get_orders_collection()
        result = await orders_col.delete_one({"id": order_id})
        return result.deleted_count > 0
    
    @staticmethod
    async def get_order_analytics() -> Dict[str, Any]:
        """Get order analytics"""
        orders_col = get_orders_collection()
        
        # Get basic stats
        total_orders = await orders_col.count_documents({})
        today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        orders_today = await orders_col.count_documents({"created_at": {"$gte": today}})
        
        # Get status breakdown
        status_pipeline = [
            {"$group": {"_id": "$status", "count": {"$sum": 1}}}
        ]
        status_stats = await orders_col.aggregate(status_pipeline).to_list(None)
        
        # Get vehicle type breakdown
        vehicle_pipeline = [
            {"$group": {"_id": "$vehicle_type", "count": {"$sum": 1}}}
        ]
        vehicle_stats = await orders_col.aggregate(vehicle_pipeline).to_list(None)
        
        return {
            "total_orders": total_orders,
            "orders_today": orders_today,
            "status_breakdown": {item["_id"]: item["count"] for item in status_stats},
            "vehicle_breakdown": {item["_id"]: item["count"] for item in vehicle_stats}
        }