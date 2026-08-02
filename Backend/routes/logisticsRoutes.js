const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  dispatchPickup,
  trackShipment,
  verifyQrCode,
  handleWebhook
} = require('../controllers/logisticsController');

const router = express.Router();

router.post('/dispatch', authenticateToken, dispatchPickup);
router.get('/track/:trackingNumber', trackShipment);
router.post('/verify-qr', authenticateToken, verifyQrCode);
router.post('/webhook', handleWebhook);

module.exports = router;
