const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  predictFreshness,
  recommendNgos,
  smartAnalysis,
  getInsights,
  assistantChat,
  generateRecipe
} = require('../controllers/aiController');

const router = express.Router();

router.post('/predict-freshness', authenticateToken, predictFreshness);
router.post('/recommend-ngos', authenticateToken, recommendNgos);
router.post('/smart-analysis', authenticateToken, smartAnalysis);
router.get('/insights', getInsights);
router.post('/assistant-chat', authenticateToken, assistantChat);
router.post('/recipe-generator', authenticateToken, generateRecipe);

module.exports = router;
