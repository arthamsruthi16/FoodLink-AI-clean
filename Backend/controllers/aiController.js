const { recommendNgos: serviceRecommendNgos, predictFoodFreshness, generateRecipe: serviceGenerateRecipe, assistantChat: aiAssistantChat, summarizeAnalytics } = require('../services/aiService');
const { queryFoodItems } = require('../models/foodModel');

async function predictFreshness(req, res) {
  const { category, foodCondition, storageCondition, preparedAt, expiryTime } = req.body;
  if (!category || !foodCondition || !storageCondition || !preparedAt || !expiryTime) {
    return res.status(400).json({ error: 'Missing required freshness prediction fields.' });
  }

  const prediction = predictFoodFreshness(category, foodCondition, storageCondition, preparedAt, expiryTime);
  res.json(prediction);
}

async function recommendNgos(req, res) {
  const { lat, lng, quantityKg } = req.body;
  if (lat === undefined || lng === undefined || quantityKg === undefined) {
    return res.status(400).json({ error: 'Missing NGO recommendation inputs.' });
  }

  const allUsersSnapshot = await require('../config/firebase').firestore.collection('users').get();
  const ngos = allUsersSnapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((user) => user.role === 'ngo');

  const recommendations = serviceRecommendNgos(Number(lat), Number(lng), Number(quantityKg), ngos);
  res.json({ recommendations });
}

async function smartAnalysis(req, res) {
  const { foodName, category, quantity, foodCondition, notes, imageBase64 } = req.body;
  if (!foodName || !category || !quantity || !foodCondition) {
    return res.status(400).json({ error: 'Missing smart analysis inputs.' });
  }

  const analysis = {
    foodName,
    category,
    quantity,
    foodCondition,
    notes: notes || '',
    predictedFreshness: predictFoodFreshness(category, foodCondition, 'Refrigerated', new Date().toISOString(), new Date(Date.now() + 4 * 3600000).toISOString()),
    recommendation: 'Ready for NGO pickup. Package with cold-chain support when needed.',
    keywords: ['urgent', 'refrigerated', 'fast pickup']
  };

  res.json({ analysis });
}

async function getInsights(req, res) {
  const [foodRes, pickupRes] = await Promise.all([
    queryFoodItems(),
    require('../config/firebase').firestore.collection('pickups').get()
  ]);

  const inventoryItems = foodRes;
  const pickups = pickupRes.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const analytics = summarizeAnalytics(inventoryItems, pickups);
  res.json({ analytics });
}

async function assistantChat(req, res) {
  const { message, contextRole } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required for assistant chat.' });
  }

  const response = aiAssistantChat(message, contextRole);
  res.json(response);
}

async function generateRecipe(req, res) {
  const { items, servingCount } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'A list of items is required for recipe generation.' });
  }

  const recipe = serviceGenerateRecipe(items, Number(servingCount) || 4);
  res.json(recipe);
}

module.exports = {
  predictFreshness,
  recommendNgos,
  smartAnalysis,
  getInsights,
  assistantChat,
  generateRecipe
};
