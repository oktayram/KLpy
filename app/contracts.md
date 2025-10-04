"# 123geleverd.nl Backend Admin Panel Contracts

## Overview
Backend admin panel for courier service management with order tracking, pricing management, user management, and analytics.

## API Contracts

### Authentication & Users
```
POST /api/auth/login - Admin login
POST /api/auth/logout - Admin logout  
GET /api/auth/me - Get current admin user
GET /api/users - List customers
POST /api/users - Create customer
PUT /api/users/:id - Update customer
DELETE /api/users/:id - Delete customer
```

### Orders Management  
```
GET /api/orders - List all orders (with filters)
GET /api/orders/:id - Get order details
POST /api/orders - Create new order
PUT /api/orders/:id - Update order
DELETE /api/orders/:id - Cancel order
PUT /api/orders/:id/status - Update order status
GET /api/orders/analytics - Order statistics
```

### Pricing Management
```
GET /api/pricing - Get pricing rules
POST /api/pricing - Create pricing rule
PUT /api/pricing/:id - Update pricing rule  
DELETE /api/pricing/:id - Delete pricing rule
GET /api/pricing/calculate - Calculate price for route
```

### Couriers Management
```
GET /api/couriers - List couriers
POST /api/couriers - Add courier
PUT /api/couriers/:id - Update courier
DELETE /api/couriers/:id - Remove courier
GET /api/couriers/:id/orders - Get courier orders
PUT /api/couriers/:id/status - Update courier status
```

### Analytics & Reports
```
GET /api/analytics/dashboard - Dashboard stats
GET /api/analytics/revenue - Revenue reports
GET /api/analytics/orders - Order reports
GET /api/analytics/performance - Performance metrics
```

### Settings
```
GET /api/settings - Get system settings
PUT /api/settings - Update settings
GET /api/settings/vehicle-types - Get vehicle types
POST /api/settings/vehicle-types - Add vehicle type
```

## Database Models

### Order
- id, customer_id, pickup_address, delivery_address
- vehicle_type, status, price, created_at, updated_at  
- courier_id, pickup_time, delivery_time
- special_instructions, tracking_number

### Customer  
- id, name, email, phone, company
- addresses (pickup/delivery history)
- created_at, total_orders

### Courier
- id, name, email, phone, vehicle_type
- status (available/busy/offline)
- current_location, rating

### PricingRule
- id, vehicle_type, base_price, price_per_km
- time_multiplier, area_multiplier
- active, created_at

### Admin
- id, username, email, role
- permissions, last_login

## Admin Panel Features

### Dashboard
- Today's orders count
- Revenue today/this month  
- Active couriers count
- Pending orders
- Recent activity feed
- Performance charts

### Orders Management
- Orders table with filters (status, date, courier)
- Order details modal
- Status update functionality
- Assign/reassign courier
- Print shipping labels
- Customer communication

### Couriers Management  
- Couriers list with status
- Add/edit courier profiles
- View courier performance
- Assign orders to couriers
- Track courier locations (mock)

### Pricing Management
- Vehicle type pricing rules
- Distance-based pricing
- Time-based multipliers
- Special area pricing
- Bulk pricing updates

### Analytics
- Revenue charts (daily/monthly/yearly)
- Order volume trends  
- Courier performance metrics
- Customer analytics
- Geographic heat maps (mock)

### Settings
- System configuration
- Vehicle types management
- Service areas
- Business hours
- Email templates
- API keys management

## Frontend Integration Changes

### Mock Data Replacement
Replace mock data in:
- `/src/data/mockData.js` - Remove mock functions
- `/src/components/PriceCalculator.js` - Use real API calls
- Add proper error handling and loading states

### New Admin Routes
- `/admin/dashboard` - Main dashboard
- `/admin/orders` - Orders management  
- `/admin/couriers` - Couriers management
- `/admin/pricing` - Pricing rules
- `/admin/analytics` - Reports & analytics
- `/admin/settings` - System settings

### Authentication
- Admin login page
- Protected routes for admin panel
- JWT token management
- Role-based permissions

## Implementation Priority

### Phase 1: Core Backend
1. Database models setup
2. Authentication system
3. Basic CRUD APIs
4. Order management APIs

### Phase 2: Admin Panel
1. Admin login/dashboard
2. Orders management interface  
3. Basic analytics
4. Courier management

### Phase 3: Advanced Features
1. Real-time tracking (mock)
2. Advanced analytics
3. Pricing management
4. System settings

### Phase 4: Integration  
1. Connect frontend calculator to real APIs
2. Customer portal (optional)
3. Email notifications (mock)
4. API documentation

## Technology Stack
- Backend: FastAPI + MongoDB
- Admin Frontend: React + shadcn/ui
- Authentication: JWT
- Charts: Recharts/Chart.js
- Real-time: WebSockets (mock)"