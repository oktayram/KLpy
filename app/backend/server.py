from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime

# Import database functions
from .database import connect_to_mongo, close_mongo_connection, seed_default_data

# Import route modules
from .routes.admin_routes import router as admin_router
from .routes.order_routes import router as order_router  
from .routes.courier_routes import router as courier_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI(
    title=\"123 Geleverd API\",
    description=\"Courier service management API\",
    version=\"1.0.0\"
)

# Create a router with the /api prefix for basic routes
api_router = APIRouter(prefix=\"/api\")

# Define Models (keep for backward compatibility)
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Basic routes
@api_router.get(\"/\")
async def root():
    return {\"message\": \"123 Geleverd API is running\"}

@api_router.get(\"/health\")
async def health_check():
    return {\"status\": \"healthy\", \"timestamp\": datetime.utcnow()}

# Legacy status check routes (keep for backward compatibility)
@api_router.post(\"/status\", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    from .database import get_database
    db = get_database()
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get(\"/status\", response_model=List[StatusCheck])
async def get_status_checks():
    from .database import get_database
    db = get_database()
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include all routers
app.include_router(api_router)
app.include_router(admin_router)
app.include_router(order_router)
app.include_router(courier_router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[\"*\"],
    allow_methods=[\"*\"],
    allow_headers=[\"*\"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event(\"startup\")
async def startup_db_client():
    \"\"\"Initialize database connection and seed default data\"\"\"
    try:
        await connect_to_mongo()
        await seed_default_data()
        logger.info(\"Database connected and initialized successfully\")
    except Exception as e:
        logger.error(f\"Error connecting to database: {e}\")

@app.on_event(\"shutdown\") 
async def shutdown_db_client():
    \"\"\"Close database connection\"\"\"
    await close_mongo_connection()
    logger.info(\"Database connection closed\")