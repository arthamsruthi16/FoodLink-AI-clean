# Firebase Firestore Setup for FoodLink AI Backend

This guide explains how to configure Firebase Firestore, initialize the Firebase Admin SDK, create collections, set security rules, and handle environment variables for the backend.

## 1. Firebase project setup

1. Go to https://console.firebase.google.com.
2. Create a new Firebase project for `FoodLink AI`.
3. In the project console, enable `Authentication` and `Firestore Database`.
4. Choose Firestore in production mode for security.

## 2. Firebase Admin service account

1. Open `Project Settings` > `Service accounts`.
2. Click `Generate new private key`.
3. Save the downloaded JSON file securely.
4. Use the values from this JSON to populate your `.env` file.

### Required service account fields

- `project_id`
- `client_email`
- `private_key`

## 3. Environment variables

Copy `backend/.env.example` to `backend/.env` and fill in real values.

Example values:

```env
PORT=4000
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=http://localhost:5173
APP_URL=http://localhost:4000

FIREBASE_PROJECT_ID=foodlink-ai-abcdef
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xyz@foodlink-ai-abcdef.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_API_KEY=your_firebase_web_api_key

GEMINI_API_KEY=your_gemini_api_key
AI_PROVIDER=
LOGISTICS_PROVIDER_API_KEY=your_logistics_provider_api_key
LOGISTICS_SERVICE_URL=https://api.foodlink-logistics.com/v1
LOGISTICS_WEBHOOK_SECRET=your_logistics_webhook_secret
```

> Important: Keep the `.env` file secret. Do not commit `.env` or service account JSON into version control.

## 4. Firebase Admin SDK initialization

The backend uses `backend/config/firebase.js`.

```js
const admin = require('firebase-admin');
const { config } = require('./index');

const firebaseConfig = {
  projectId: config.firebase.projectId,
  clientEmail: config.firebase.clientEmail,
  privateKey: config.firebase.privateKey
};

if (!firebaseConfig.projectId || !firebaseConfig.clientEmail || !firebaseConfig.privateKey) {
  throw new Error('Firebase service account information is not fully configured in environment variables.');
}

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig)
});

const firestore = admin.firestore();
const auth = admin.auth();

module.exports = {
  admin,
  firestore,
  auth
};
```

## 5. Firestore collections

The backend expects these collections in Firestore:

- `users`
- `food_items`
- `pickups`
- `notifications`

### Example document structure

`users/{userId}`
- `id`, `authUid`, `name`, `email`, `role`, `orgName`, `orgType`, `address`, `city`, `country`, `region`, `phone`, `lat`, `lng`, `verified`, `createdAt`, `passwordHash`

`food_items/{itemId}`
- `id`, `restaurantId`, `restaurantName`, `restaurantAddress`, `foodName`, `category`, `quantity`, `quantityUnit`, `preparedAt`, `expiryTime`, `foodCondition`, `storageCondition`, `status`, `urgencyScore`, `freshnessConfidence`, `predictedFreshnessState`, `isReserved`, `qrCodeData`, `createdAt`

`pickups/{pickupId}`
- `id`, `foodItemId`, `foodName`, `ngoId`, `ngoName`, `status`, `trackingNumber`, `qrVerificationCode`, `scheduledTime`, `completedAt`, `verifiedByNgo`

`notifications/{notificationId}`
- `id`, `userId`, `title`, `message`, `type`, `read`, `timestamp`, `linkId`

## 6. Firestore security rules

Add the file `backend/firestore.rules` and deploy with Firebase CLI.

Rules are configured for:

- authenticated access only
- role-based writes for restaurants, NGOs, and admin
- safe user profile updates
- protected notification creation
- no document deletion by app users

## 7. Deploy security rules and indexes

Install Firebase CLI if needed:

```bash
npm install -g firebase-tools
```

Then from `backend/`:

```bash
firebase login
firebase init firestore
firebase deploy --only firestore:rules,firestore:indexes
```

## 8. Local emulator (optional)

Use the Firebase emulator for local testing:

```bash
firebase emulators:start --only firestore,auth
```

Then point the backend to the emulator with environment variables or `FIRESTORE_EMULATOR_HOST`.

## 9. Verify connection

Start the backend with:

```bash
npm run dev
```

Then verify the health endpoint:

```bash
curl http://localhost:4000/health
```

If this succeeds, Firestore is properly configured.
