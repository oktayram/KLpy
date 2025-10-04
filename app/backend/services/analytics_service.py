from typing import Dict, List, Any
from datetime import datetime, timedelta
from ..database import get_orders_collection, get_couriers_collection, get_customers_collection
from ..models import DashboardStats, RevenueReport, OrderAnalytics

class AnalyticsService:
    
    @staticmethod
    async def get_dashboard_stats() -> DashboardStats:
        """Get dashboard statistics"""
        orders_col = get_orders_collection()
        couriers_col = get_couriers_collection()
        
        # Date ranges
        today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        month_start = today.replace(day=1)
        
        # Basic counts
        total_orders = await orders_col.count_documents({})
        orders_today = await orders_col.count_documents({"created_at": {"$gte": today}})
        pending_orders = await orders_col.count_documents({"status": "pending"})
        completed_orders = await orders_col.count_documents({"status": "delivered"})
        active_couriers = await couriers_col.count_documents({"status": {"$in": ["available", "busy"]}})
        
        # Revenue calculations
        revenue_today_pipeline = [
            {"$match": {"created_at": {"$gte": today}, "status": {"$ne": "cancelled"}}},
            {"$group": {"_id": None, "total": {"$sum": "$price"}}}
        ]
        revenue_today_result = await orders_col.aggregate(revenue_today_pipeline).to_list(None)
        revenue_today = revenue_today_result[0]["total"] if revenue_today_result else 0
        
        revenue_month_pipeline = [
            {"$match": {"created_at": {"$gte": month_start}, "status": {"$ne": "cancelled"}}},
            {"$group": {"_id": None, "total": {"$sum": "$price"}}}
        ]
        revenue_month_result = await orders_col.aggregate(revenue_month_pipeline).to_list(None)
        revenue_month = revenue_month_result[0]["total"] if revenue_month_result else 0
        
        # Average delivery time (mock calculation)
        avg_delivery_time = 35.5  # minutes - would be calculated from actual delivery times
        
        return DashboardStats(
            total_orders=total_orders,
            orders_today=orders_today,
            revenue_today=revenue_today,
            revenue_month=revenue_month,
            active_couriers=active_couriers,
            pending_orders=pending_orders,
            completed_orders=completed_orders,
            average_delivery_time=avg_delivery_time
        )
    
    @staticmethod
    async def get_revenue_reports(days: int = 30) -> List[RevenueReport]:
        """Get revenue reports for specified days"""
        orders_col = get_orders_collection()
        
        # Calculate date range
        end_date = datetime.utcnow().replace(hour=23, minute=59, second=59)
        start_date = end_date - timedelta(days=days-1)
        start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Aggregate pipeline for daily revenue
        pipeline = [
            {
                "$match": {
                    "created_at": {"$gte": start_date, "$lte": end_date},
                    "status": {"$ne": "cancelled"}
                }
            },
            {
                "$group": {
                    "_id": {
                        "$dateToString": {
                            "format": "%Y-%m-%d",
                            "date": "$created_at"
                        }
                    },
                    "revenue": {"$sum": "$price"},
                    "orders_count": {"$sum": 1}
                }
            },
            {
                "$sort": {"_id": 1}
            }
        ]
        
        results = await orders_col.aggregate(pipeline).to_list(None)
        
        # Fill missing dates with 0 revenue
        revenue_reports = []
        current_date = start_date
        results_dict = {item["_id"]: item for item in results}
        
        while current_date <= end_date:
            date_str = current_date.strftime("%Y-%m-%d")
            if date_str in results_dict:
                data = results_dict[date_str]
                revenue_reports.append(RevenueReport(
                    date=date_str,
                    revenue=data["revenue"],
                    orders_count=data["orders_count"]
                ))
            else:
                revenue_reports.append(RevenueReport(
                    date=date_str,
                    revenue=0.0,
                    orders_count=0
                ))
            current_date += timedelta(days=1)
        
        return revenue_reports
    
    @staticmethod
    async def get_order_analytics(period: str = "month") -> OrderAnalytics:
        """Get order analytics for specified period"""
        orders_col = get_orders_collection()
        
        # Calculate date range based on period
        now = datetime.utcnow()
        if period == "week":
            start_date = now - timedelta(days=7)
        elif period == "month":
            start_date = now - timedelta(days=30)
        elif period == "year":
            start_date = now - timedelta(days=365)
        else:
            start_date = now - timedelta(days=30)  # default to month
        
        # Basic order counts
        match_filter = {"created_at": {"$gte": start_date}}
        total_orders = await orders_col.count_documents(match_filter)
        completed_orders = await orders_col.count_documents({**match_filter, "status": "delivered"})
        cancelled_orders = await orders_col.count_documents({**match_filter, "status": "cancelled"})
        
        # Average price
        avg_price_pipeline = [
            {"$match": {**match_filter, "status": {"$ne": "cancelled"}}},
            {"$group": {"_id": None, "avg_price": {"$avg": "$price"}}}
        ]
        avg_price_result = await orders_col.aggregate(avg_price_pipeline).to_list(None)
        average_price = avg_price_result[0]["avg_price"] if avg_price_result else 0
        
        # Popular vehicle types
        vehicle_pipeline = [
            {"$match": match_filter},
            {"$group": {"_id": "$vehicle_type", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        vehicle_results = await orders_col.aggregate(vehicle_pipeline).to_list(None)
        popular_vehicle_types = {item["_id"]: item["count"] for item in vehicle_results}
        
        return OrderAnalytics(
            period=period,
            total_orders=total_orders,
            completed_orders=completed_orders,
            cancelled_orders=cancelled_orders,
            average_price=round(average_price, 2) if average_price else 0,
            popular_vehicle_types=popular_vehicle_types
        )
    
    @staticmethod 
    async def get_performance_metrics() -> Dict[str, Any]:
        """Get performance metrics"""
        orders_col = get_orders_collection()
        couriers_col = get_couriers_collection()
        
        # Delivery time analysis (mock data for demo)
        delivery_times = {
            "average_pickup_time": 25.3,  # minutes
            "average_delivery_time": 45.7,  # minutes
            "on_time_delivery_rate": 94.2,  # percentage
        }
        
        # Courier performance
        courier_pipeline = [
            {
                "$lookup": {
                    "from": "orders",
                    "localField": "id", 
                    "foreignField": "courier_id",
                    "as": "orders"
                }
            },
            {
                "$project": {
                    "name": 1,
                    "total_deliveries": {"$size": "$orders"},
                    "rating": 1,
                    "status": 1
                }
            },
            {"$sort": {"total_deliveries": -1}},
            {"$limit": 10}
        ]
        
        top_couriers = await couriers_col.aggregate(courier_pipeline).to_list(None)
        
        # Order completion rate
        total_orders = await orders_col.count_documents({})
        completed = await orders_col.count_documents({"status": "delivered"})
        completion_rate = (completed / total_orders * 100) if total_orders > 0 else 0
        
        return {
            "delivery_times": delivery_times,
            "top_couriers": top_couriers,
            "completion_rate": round(completion_rate, 2),
            "total_orders_processed": total_orders
        }