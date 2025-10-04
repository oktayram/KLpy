"#!/usr/bin/env python3
import asyncio
import os
import sys
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext

# Set up environment
sys.path.append('.')
from dotenv import load_dotenv
load_dotenv()

async def create_admin_user():
    \"\"\"Create admin user directly\"\"\"
    try:
        # Connect to database
        mongo_url = os.environ['MONGO_URL']
        db_name = os.environ['DB_NAME']
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        
        # Password context
        pwd_context = CryptContext(schemes=[\"bcrypt\"], deprecated=\"auto\")
        
        # Check if admin exists
        existing_admin = await db.admins.find_one({\"username\": \"admin\"})
        if existing_admin:
            print(\"Admin user already exists\")
            return
            
        # Create admin user
        admin_data = {
            \"id\": \"admin_001\",
            \"username\": \"admin\",
            \"email\": \"admin@123geleverd.nl\",
            \"hashed_password\": pwd_context.hash(\"admin123\"),
            \"role\": \"admin\",
            \"permissions\": [\"all\"],
            \"last_login\": None,
            \"created_at\": datetime.utcnow(),
            \"is_active\": True
        }
        
        result = await db.admins.insert_one(admin_data)
        print(f\"Admin user created with ID: {result.inserted_id}\")
        
    except Exception as e:
        print(f\"Error creating admin: {e}\")
    finally:
        client.close()

if __name__ == \"__main__\":
    asyncio.run(create_admin_user())"