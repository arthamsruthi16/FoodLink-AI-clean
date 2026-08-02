import { Request, Response, Router } from 'express';

export const docsRouter = Router();

docsRouter.get('/er-diagram', (req: Request, res: Response) => {
  return res.json({
    title: 'FoodLink AI - Entity Relationship Diagram Schema',
    entities: [
      {
        name: 'Users',
        attributes: ['id (PK)', 'email (UNIQUE)', 'password_hash', 'role (ENUM)', 'org_name', 'org_type', 'lat', 'lng', 'verified']
      },
      {
        name: 'Restaurants',
        attributes: ['id (PK)', 'user_id (FK)', 'food_safety_license', 'avg_rating', 'total_donations_count']
      },
      {
        name: 'NGOs',
        attributes: ['id (PK)', 'user_id (FK)', 'non_profit_tax_id', 'storage_capacity_kg', 'dietary_focus']
      },
      {
        name: 'Food_Inventory',
        attributes: ['id (PK)', 'restaurant_id (FK)', 'food_name', 'category', 'quantity', 'prepared_at', 'expiry_time', 'food_condition', 'freshness_score', 'urgency_score', 'status']
      },
      {
        name: 'Donations',
        attributes: ['id (PK)', 'food_item_id (FK)', 'restaurant_id (FK)', 'ngo_id (FK)', 'status', 'qr_verification_code', 'created_at']
      },
      {
        name: 'Pickup_Requests',
        attributes: ['id (PK)', 'donation_id (FK)', 'logistics_provider', 'tracking_number', 'courier_name', 'eta_minutes', 'verified_by_ngo']
      }
    ]
  });
});

docsRouter.get('/database-schema', (req: Request, res: Response) => {
  const ddl = `
-- MySQL / PostgreSQL Database Schema for FoodLink AI
CREATE TABLE users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  email VARCHAR(128) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('restaurant', 'ngo', 'admin') NOT NULL,
  org_name VARCHAR(128) NOT NULL,
  org_type VARCHAR(64) NOT NULL,
  address VARCHAR(255) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  lat DECIMAL(9,6) NOT NULL,
  lng DECIMAL(9,6) NOT NULL,
  verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE food_inventory (
  id VARCHAR(64) PRIMARY KEY,
  restaurant_id VARCHAR(64) NOT NULL,
  food_name VARCHAR(128) NOT NULL,
  category VARCHAR(64) NOT NULL,
  quantity DECIMAL(8,2) NOT NULL,
  quantity_unit VARCHAR(16) NOT NULL,
  prepared_at TIMESTAMP NOT NULL,
  expiry_time TIMESTAMP NOT NULL,
  food_condition VARCHAR(64) NOT NULL,
  storage_condition VARCHAR(32) NOT NULL,
  image_url VARCHAR(512),
  status VARCHAR(32) DEFAULT 'Safe',
  urgency_score INT DEFAULT 50,
  freshness_confidence DECIMAL(5,2) DEFAULT 95.0,
  is_reserved BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (restaurant_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE pickup_requests (
  id VARCHAR(64) PRIMARY KEY,
  food_item_id VARCHAR(64) NOT NULL,
  restaurant_id VARCHAR(64) NOT NULL,
  ngo_id VARCHAR(64) NOT NULL,
  tracking_number VARCHAR(64) UNIQUE NOT NULL,
  status VARCHAR(32) DEFAULT 'Scheduled',
  courier_name VARCHAR(128),
  estimated_arrival_minutes INT,
  qr_verification_code VARCHAR(32) UNIQUE NOT NULL,
  verified_by_ngo BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (food_item_id) REFERENCES food_inventory(id),
  FOREIGN KEY (restaurant_id) REFERENCES users(id),
  FOREIGN KEY (ngo_id) REFERENCES users(id)
);
`;
  return res.type('text/plain').send(ddl);
});

docsRouter.get('/api-endpoints', (req: Request, res: Response) => {
  return res.json({
    endpoints: [
      { method: 'POST', path: '/api/auth/register', description: 'Register new restaurant, NGO, or admin user' },
      { method: 'POST', path: '/api/auth/login', description: 'Authenticate user & issue JWT token' },
      { method: 'GET', path: '/api/inventory', description: 'Browse live surplus food inventory with ML freshness status' },
      { method: 'POST', path: '/api/inventory', description: 'List new surplus food with automated AI freshness analysis' },
      { method: 'PUT', path: '/api/inventory/:id/reserve', description: 'NGO reserves food item & dispatches logistics' },
      { method: 'POST', path: '/api/ai/predict-freshness', description: 'ML model predicting food freshness & safe consumption window' },
      { method: 'POST', path: '/api/ai/recommend-ngos', description: 'ML matchmaker ranking nearest NGOs by capacity & proximity' },
      { method: 'POST', path: '/api/ai/smart-analysis', description: 'Server-side Gemini 3.6 Flash LLM vision & safety audit' },
      { method: 'POST', path: '/api/logistics/dispatch', description: 'Provider-agnostic courier dispatch request' },
      { method: 'GET', path: '/api/logistics/track/:trackingNumber', description: 'Get live logistics tracking & ETA' },
      { method: 'POST', path: '/api/logistics/verify-qr', description: 'Handover verification using QR verification code' }
    ]
  });
});
