import React, { useState } from 'react';

export const SystemDocsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'er' | 'arch' | 'api' | 'ddl' | 'deploy' | 'github'>('er');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Developer Documentation & Portfolio Showcase
        </span>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          System Architecture & Technical Specifications
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Complete engineering blueprint, ER diagrams, REST API specs, database DDLs, and deployment steps for FoodLink AI.
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-bold">
        <button
          onClick={() => setActiveSection('er')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeSection === 'er' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          1. ER Diagram
        </button>
        <button
          onClick={() => setActiveSection('arch')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeSection === 'arch' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          2. System Architecture
        </button>
        <button
          onClick={() => setActiveSection('api')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeSection === 'api' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          3. API Documentation
        </button>
        <button
          onClick={() => setActiveSection('ddl')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeSection === 'ddl' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          4. Database Schema (DDL)
        </button>
        <button
          onClick={() => setActiveSection('deploy')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeSection === 'deploy' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          5. Deployment & Docker
        </button>
        <button
          onClick={() => setActiveSection('github')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeSection === 'github' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          6. GitHub Tree
        </button>
      </div>

      {/* Content Panels */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        
        {/* SECTION 1: ER DIAGRAM */}
        {activeSection === 'er' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Entity Relationship Diagram Schema</h2>
            <p className="text-xs text-slate-500">Relational schema design supporting Users, Roles, Inventory, Donations, Logistics, and Analytics.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-emerald-600">USERS TABLE</span>
                <ul className="text-slate-600 dark:text-slate-300 space-y-1 text-[11px]">
                  <li>• id (PK, VARCHAR)</li>
                  <li>• name, email (UNIQUE)</li>
                  <li>• password_hash</li>
                  <li>• role (restaurant/ngo/admin)</li>
                  <li>• org_name, org_type</li>
                  <li>• lat, lng (GPS coordinates)</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-sky-600">FOOD_INVENTORY TABLE</span>
                <ul className="text-slate-600 dark:text-slate-300 space-y-1 text-[11px]">
                  <li>• id (PK, VARCHAR)</li>
                  <li>• restaurant_id (FK -&gt; USERS.id)</li>
                  <li>• food_name, category</li>
                  <li>• quantity, unit</li>
                  <li>• prepared_at, expiry_time</li>
                  <li>• urgency_score, freshness_confidence</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-amber-600">PICKUP_REQUESTS TABLE</span>
                <ul className="text-slate-600 dark:text-slate-300 space-y-1 text-[11px]">
                  <li>• id (PK, VARCHAR)</li>
                  <li>• food_item_id (FK -&gt; FOOD_INVENTORY.id)</li>
                  <li>• ngo_id (FK -&gt; USERS.id)</li>
                  <li>• tracking_number (UNIQUE)</li>
                  <li>• courier_name, eta_minutes</li>
                  <li>• qr_verification_code</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: SYSTEM ARCHITECTURE */}
        {activeSection === 'arch' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Full Stack System Architecture</h2>
            <div className="p-6 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs space-y-3 leading-relaxed">
              <p className="text-emerald-400 font-bold">[ CLIENT BROWSER / SPA ]</p>
              <p>  └── React 19 + Tailwind CSS v4 + Framer Motion + Leaflet Interactive Maps</p>
              <p>  └── HTTP REST Client with JWT Authorization headers</p>
              <p className="text-sky-400 font-bold">[ REVERSE PROXY & CONTAINER INGRESS ]</p>
              <p>  └── Nginx Routing traffic exclusively to Port 3000</p>
              <p className="text-amber-400 font-bold">[ EXPRESS NODE.JS BACKEND SERVER ]</p>
              <p>  ├── /api/auth (JWT Sign/Verify, Role-based Auth)</p>
              <p>  ├── /api/inventory (Surplus Food CRUD, Real-time status calculator)</p>
              <p>  ├── /api/ai (Freshness Predictor, NGO Matchmaker, Gemini 3.6 Flash LLM)</p>
              <p>  └── /api/logistics (Provider-Agnostic Logistics Interface & Webhooks)</p>
            </div>
          </div>
        )}

        {/* SECTION 3: API ENDPOINTS */}
        {activeSection === 'api' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">REST API & Webhook Documentation</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                    <th className="py-2">Method</th>
                    <th className="py-2">Endpoint</th>
                    <th className="py-2">Description</th>
                    <th className="py-2">Auth Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  <tr><td className="py-2.5 text-emerald-600 font-bold">POST</td><td>/api/auth/register</td><td>Register new Restaurant, NGO, or Admin user</td><td>No</td></tr>
                  <tr><td className="py-2.5 text-emerald-600 font-bold">POST</td><td>/api/auth/login</td><td>Authenticate user and issue JWT bearer token</td><td>No</td></tr>
                  <tr><td className="py-2.5 text-sky-600 font-bold">GET</td><td>/api/inventory</td><td>Get all surplus food items with live freshness countdowns</td><td>No</td></tr>
                  <tr><td className="py-2.5 text-emerald-600 font-bold">POST</td><td>/api/inventory</td><td>Add surplus food item with automated ML analysis</td><td>Yes (JWT)</td></tr>
                  <tr><td className="py-2.5 text-amber-600 font-bold">PUT</td><td>/api/inventory/:id/reserve</td><td>NGO reserves item and dispatches courier pickup</td><td>Yes (JWT)</td></tr>
                  <tr><td className="py-2.5 text-emerald-600 font-bold">POST</td><td>/api/ai/smart-analysis</td><td>Gemini 3.6 Flash server-side LLM vision & safety audit</td><td>Yes (JWT)</td></tr>
                  <tr><td className="py-2.5 text-purple-600 font-bold">POST</td><td>/api/logistics/webhook</td><td>Webhook receiver for external logistics status updates</td><td>Webhook Secret</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 4: DDL SCHEMA */}
        {activeSection === 'ddl' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Production Database Schema (DDL)</h2>
            <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed">
{`CREATE TABLE users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  email VARCHAR(128) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('restaurant', 'ngo', 'admin') NOT NULL,
  org_name VARCHAR(128) NOT NULL,
  org_type VARCHAR(64) NOT NULL,
  address VARCHAR(255) NOT NULL,
  lat DECIMAL(9,6) NOT NULL,
  lng DECIMAL(9,6) NOT NULL,
  verified BOOLEAN DEFAULT TRUE
);

CREATE TABLE food_inventory (
  id VARCHAR(64) PRIMARY KEY,
  restaurant_id VARCHAR(64) NOT NULL,
  food_name VARCHAR(128) NOT NULL,
  category VARCHAR(64) NOT NULL,
  quantity DECIMAL(8,2) NOT NULL,
  prepared_at TIMESTAMP NOT NULL,
  expiry_time TIMESTAMP NOT NULL,
  status VARCHAR(32) DEFAULT 'Safe',
  FOREIGN KEY (restaurant_id) REFERENCES users(id)
);`}
            </pre>
          </div>
        )}

        {/* SECTION 5: DEPLOYMENT */}
        {activeSection === 'deploy' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Deployment Guide (Docker & Cloud Run)</h2>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs space-y-3 font-mono text-slate-700 dark:text-slate-300">
              <p># 1. Build Production Container Image</p>
              <p className="text-emerald-600 font-bold">docker build -t foodlink-ai:latest .</p>
              <p># 2. Run Container on Port 3000</p>
              <p className="text-emerald-600 font-bold">docker run -p 3000:3000 -e GEMINI_API_KEY="YOUR_KEY" foodlink-ai:latest</p>
            </div>
          </div>
        )}

        {/* SECTION 6: GITHUB TREE */}
        {activeSection === 'github' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">GitHub Project Structure</h2>
            <pre className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed">
{`FoodLink-AI/
├── .env.example              # Environment variable declarations
├── package.json              # NPM dependencies & esbuild full-stack scripts
├── server.ts                 # Express + Vite server entry point (Port 3000)
├── server/
│   ├── db.ts                 # Pre-seeded database store
│   └── routes/
│       ├── auth.ts           # JWT Registration & Login
│       ├── inventory.ts      # Surplus Food CRUD & Real-time status
│       ├── ai.ts             # ML Freshness & Gemini 3.6 Flash LLM
│       ├── logistics.ts      # Provider-agnostic logistics & webhooks
│       └── docs.ts           # Architecture & DDL API endpoints
└── src/
    ├── App.tsx               # Main React Application
    ├── components/           # Navbar, Footer, FoodMap, AiInspector, QRCodeModal
    ├── context/              # AuthContext & FoodContext
    ├── pages/                # LandingPage, Restaurant, NGO, Admin, Carbon, Docs
    ├── services/             # REST API Client
    └── utils/                # ML Engine & PDF Receipt Generator`}
            </pre>
          </div>
        )}

      </div>

    </div>
  );
};
