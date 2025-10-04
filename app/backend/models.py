from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

# Enums
class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed" 
    PICKED_UP = "picked_up"
    IN_TRANSIT = "in_transit"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class CourierStatus(str, Enum):
    AVAILABLE = "available"
    BUSY = "busy"
    OFFLINE = "offline"

class VehicleType(str, Enum):
    BESTELAUTO = "bestelauto"
    BESTELBUS = "bestelbus" 
    BAKWAGEN = "bakwagen"

class UserRole(str, Enum):
    ADMIN = "admin"
    CUSTOMER = "customer"

# Base Models
class Address(BaseModel):
    street: str
    city: str
    postal_code: str
    country: str = "Nederland"
    coordinates: Optional[Dict[str, float]] = None

# Customer Models
class Customer(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    company: Optional[str] = None
    addresses: List[Address] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    total_orders: int = 0
    is_active: bool = True

class CustomerCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    company: Optional[str] = None

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    is_active: Optional[bool] = None

# Order Models
class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    tracking_number: str = Field(default_factory=lambda: f"TR{uuid.uuid4().hex[:6].upper()}")
    customer_id: str
    customer_name: str
    customer_email: str
    customer_phone: str
    
    pickup_address: Address
    delivery_address: Address
    
    vehicle_type: VehicleType
    status: OrderStatus = OrderStatus.PENDING
    price: float
    distance: Optional[float] = None
    
    courier_id: Optional[str] = None
    courier_name: Optional[str] = None
    
    pickup_time: Optional[datetime] = None
    delivery_time: Optional[datetime] = None
    estimated_delivery: Optional[datetime] = None
    
    special_instructions: Optional[str] = None
    notes: Optional[str] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class OrderCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    pickup_address: Address
    delivery_address: Address
    vehicle_type: VehicleType
    special_instructions: Optional[str] = None

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    courier_id: Optional[str] = None
    pickup_time: Optional[datetime] = None
    delivery_time: Optional[datetime] = None
    estimated_delivery: Optional[datetime] = None
    notes: Optional[str] = None

# Courier Models  
class Courier(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    vehicle_type: VehicleType
    license_plate: str
    status: CourierStatus = CourierStatus.OFFLINE
    current_location: Optional[Dict[str, float]] = None
    rating: float = 5.0
    total_deliveries: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class CourierCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    vehicle_type: VehicleType
    license_plate: str

class CourierUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    vehicle_type: Optional[VehicleType] = None
    license_plate: Optional[str] = None
    status: Optional[CourierStatus] = None
    current_location: Optional[Dict[str, float]] = None
    is_active: Optional[bool] = None

# Pricing Models
class PricingRule(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    vehicle_type: VehicleType
    base_price: float
    price_per_km: float
    time_multiplier: float = 1.0
    area_multiplier: float = 1.0
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PricingRuleCreate(BaseModel):
    name: str
    vehicle_type: VehicleType
    base_price: float
    price_per_km: float
    time_multiplier: float = 1.0
    area_multiplier: float = 1.0

class PricingRuleUpdate(BaseModel):
    name: Optional[str] = None
    base_price: Optional[float] = None
    price_per_km: Optional[float] = None
    time_multiplier: Optional[float] = None
    area_multiplier: Optional[float] = None
    is_active: Optional[bool] = None

# Admin Models
class Admin(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: EmailStr
    hashed_password: str
    role: UserRole = UserRole.ADMIN
    permissions: List[str] = []
    last_login: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class AdminCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.ADMIN

class AdminLogin(BaseModel):
    username: str
    password: str

# Analytics Models
class DashboardStats(BaseModel):
    total_orders: int
    orders_today: int
    revenue_today: float
    revenue_month: float
    active_couriers: int
    pending_orders: int
    completed_orders: int
    average_delivery_time: Optional[float] = None

class RevenueReport(BaseModel):
    date: str
    revenue: float
    orders_count: int

class OrderAnalytics(BaseModel):
    period: str
    total_orders: int
    completed_orders: int
    cancelled_orders: int
    average_price: float
    popular_vehicle_types: Dict[str, int]

# Settings Models
class SystemSettings(BaseModel):
    company_name: str = "123 Geleverd"
    contact_phone: str = "085 760 92 08"
    contact_email: str = "info@123geleverd.nl"
    business_hours_start: str = "07:00"
    business_hours_end: str = "23:00"
    weekend_hours_start: str = "08:00"
    weekend_hours_end: str = "20:00"
    default_currency: str = "EUR"
    tax_rate: float = 21.0
    
class SettingsUpdate(BaseModel):
    company_name: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    business_hours_start: Optional[str] = None
    business_hours_end: Optional[str] = None
    weekend_hours_start: Optional[str] = None
    weekend_hours_end: Optional[str] = None
    tax_rate: Optional[float] = None

# Response Models
class PriceCalculation(BaseModel):
    base_price: float
    distance_price: float
    total_price: float
    estimated_time: str
    distance: float
    vehicle_type: VehicleType