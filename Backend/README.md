# FoodLink AI Backend

Production-ready backend for the FoodLink AI frontend. This backend uses:

- Node.js + Express.js
- Firebase Firestore as the persistent database
- Firebase Authentication via Firebase Admin SDK
- JWT authentication with signed tokens
- bcrypt password hashing
- Multer for file uploads
- dotenv for environment configuration
- Helmet, Morgan, and CORS for production middleware

## Directory structure

backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
├── uploads/
├── app.js
├── server.js
├── package.json
└── README.md

## Setup

1. Copy `.env.example` into `.env`.
2. Configure Firebase Admin service account and required environment variables.
3. Install dependencies:

```bash
cd backend
npm install
```

4. Start in development mode:

```bash
npm run dev
```

5. Start in production mode:

```bash
npm start
```

## Environment variables

Required values:

- `PORT`
- `JWT_SECRET`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `CORS_ORIGIN`
- `APP_URL`

Optional values:

- `FIREBASE_API_KEY`
- `AI_PROVIDER` (reserved for future external AI integration)
- `GEMINI_API_KEY`
- `LOGISTICS_PROVIDER_API_KEY`
- `LOGISTICS_SERVICE_URL`
- `LOGISTICS_WEBHOOK_SECRET`

## Available endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `GET /api/inventory`
- `POST /api/inventory`
- `PUT /api/inventory/:id/reserve`
- `DELETE /api/inventory/:id`
- `POST /api/ai/predict-freshness`
- `POST /api/ai/recommend-ngos`
- `GET /api/ai/insights`
- `POST /api/ai/smart-analysis`
- `POST /api/ai/assistant-chat`
- `POST /api/ai/recipe-generator`
- `POST /api/logistics/dispatch`
- `GET /api/logistics/track/:trackingNumber`
- `POST /api/logistics/verify-qr`
- `POST /api/logistics/webhook`
- `GET /api/notifications`
- `POST /api/notifications`
- `PUT /api/notifications/:id/read`
- `POST /api/uploads/image`
