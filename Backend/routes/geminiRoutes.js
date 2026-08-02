const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  freshnessSuggestion,
  donationDescription,
  ngoRecommendation,
  donationSummary
} = require('../controllers/geminiController');

const router = express.Router();

router.post('/freshness', authenticateToken, freshnessSuggestion);
router.post('/description', authenticateToken, donationDescription);
router.post('/ngo-recommendation', authenticateToken, ngoRecommendation);
router.post('/summary', authenticateToken, donationSummary);

module.exports = router;
