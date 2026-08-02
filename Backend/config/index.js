const dotenv = require('dotenv');

dotenv.config();

const requiredEnv = [
  'JWT_SECRET',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY'
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`Warning: ${key} is not set in environment variables.`);
  }
});

const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  jwtSecret: process.env.JWT_SECRET || 'change_this_secret',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  appUrl: process.env.APP_URL || 'http://localhost:4000',
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\n/g, '\n')
      : undefined,
    apiKey: process.env.FIREBASE_API_KEY || ''
  },
  aiProvider: process.env.AI_PROVIDER || null,
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  logisticsProviderApiKey: process.env.LOGISTICS_PROVIDER_API_KEY || '',
  logisticsServiceUrl: process.env.LOGISTICS_SERVICE_URL || '',
  logisticsWebhookSecret: process.env.LOGISTICS_WEBHOOK_SECRET || ''
};

module.exports = { config };
