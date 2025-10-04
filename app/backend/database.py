from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional
import os
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class Database:
    client: Optional[AsyncIOMotorClient] = None
    database: Optional[AsyncIOMotorDatabase] = None

db_instance = Database()

async def connect_to_mongo():
    """Create database connection"""
    db_instance.client = AsyncIOMotorClient(os.environ.get("MONGO_URL"))
    db_instance.database = db_instance.client[os.environ.get("DB_NAME", "courier_db")]
    
    # Create indexes for better performance
    try:
        # Orders indexes
        await db_instance.database.orders.create_index("tracking_number", unique=True)
        await db_instance.database.orders.create_index("customer_email")
        await db_instance.database.orders.create_index("status")
        await db_instance.database.orders.create_index("created_at")
        await db_instance.database.orders.create_index("courier_id")
        
        # Customers indexes  
        await db_instance.database.customers.create_index("email", unique=True)
        await db_instance.database.customers.create_index("phone")
        
        # Couriers indexes
        await db_instance.database.couriers.create_index("email", unique=True)
        await db_instance.database.couriers.create_index("status")
        await db_instance.database.couriers.create_index("vehicle_type")
        
        # Admins indexes
        await db_instance.database.admins.create_index("username", unique=True)
        await db_instance.database.admins.create_index("email", unique=True)
        
        # Pricing rules indexes
        await db_instance.database.pricing_rules.create_index("vehicle_type")
        await db_instance.database.pricing_rules.create_index("is_active")
        
        logger.info("Database indexes created successfully")
        
    except Exception as e:
        logger.error(f"Error creating indexes: {e}")

async def close_mongo_connection():
    """Close database connection"""
    if db_instance.client:
        db_instance.client.close()

def get_database() -> AsyncIOMotorDatabase:
    """Get database instance"""
    return db_instance.database

# Collection helpers
def get_orders_collection():
    return db_instance.database.orders

def get_customers_collection():
    return db_instance.database.customers

def get_couriers_collection():
    return db_instance.database.couriers

def get_admins_collection():
    return db_instance.database.admins

def get_pricing_rules_collection():
    return db_instance.database.pricing_rules

def get_settings_collection():
    return db_instance.database.settings

async def seed_default_data():
    """Seed database with default data"""
    try:
        # Create default admin user
        admins_col = get_admins_collection()
        admin_exists = await admins_col.find_one({"username": "admin"})
        
        if not admin_exists:
            from passlib.context import CryptContext
            pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
            
            default_admin = {
                "username": "admin",
                "email": "admin@123geleverd.nl",
                "hashed_password": pwd_context.hash("admin123"),
                "role": "admin",
                "permissions": ["all"],
                "created_at": datetime.utcnow(),
                "is_active": True
            }
            
            await admins_col.insert_one(default_admin)
            logger.info("Default admin user created")
        
        # Create default pricing rules
        pricing_col = get_pricing_rules_collection()
        pricing_exists = await pricing_col.find_one({"vehicle_type": "bestelauto"})
        
        if not pricing_exists:
            default_pricing = [
                {
                    "name": "Bestelauto Standard",
                    "vehicle_type": "bestelauto",
                    "base_price": 25.0,
                    "price_per_km": 1.2,
                    "time_multiplier": 1.0,
                    "area_multiplier": 1.0,
                    "is_active": True,
                    "created_at": datetime.utcnow()
                },
                {
                    "name": "Bestelbus Standard", 
                    "vehicle_type": "bestelbus",
                    "base_price": 35.0,
                    "price_per_km": 1.5,
                    "time_multiplier": 1.0,
                    "area_multiplier": 1.0,
                    "is_active": True,
                    "created_at": datetime.utcnow()
                },
                {
                    "name": "Bakwagen Standard",
                    "vehicle_type": "bakwagen", 
                    "base_price": 45.0,
                    "price_per_km": 1.8,
                    "time_multiplier": 1.0,
                    "area_multiplier": 1.0,
                    "is_active": True,
                    "created_at": datetime.utcnow()
                }
            ]
            
            await pricing_col.insert_many(default_pricing)
            logger.info("Default pricing rules created")
            
        # Create default system settings
        settings_col = get_settings_collection()
        settings_exists = await settings_col.find_one({"_id": "system_settings"})
        
        if not settings_exists:
            default_settings = {
                "_id": "system_settings",
                "company_name": "123 Geleverd",
                "contact_phone": "085 760 92 08", 
                "contact_email": "info@123geleverd.nl",
                "business_hours_start": "07:00",
                "business_hours_end": "23:00",
                "weekend_hours_start": "08:00", 
                "weekend_hours_end": "20:00",
                "default_currency": "EUR",
                "tax_rate": 21.0,
                "created_at": datetime.utcnow()
            }
            
            await settings_col.insert_one(default_settings)
            logger.info("Default system settings created")
            
    except Exception as e:
        logger.error(f"Error seeding default data: {e}")