const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/authorizationMiddleware');
const {
  getNearbyDonations,
  requestFoodDonation,
  acceptPickup,
  getDonationHistory
} = require('../controllers/ngoController');
const {
  validateNgoNearbySearch,
  validateNgoRequestDonation,
  validateNgoAcceptPickup
} = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/nearby', authenticateToken, requireRole('ngo'), validateNgoNearbySearch, getNearbyDonations);
router.post('/:id/request', authenticateToken, requireRole('ngo'), validateNgoRequestDonation, requestFoodDonation);
router.put('/:id/accept', authenticateToken, requireRole('ngo'), validateNgoAcceptPickup, acceptPickup);
router.get('/history', authenticateToken, requireRole('ngo'), getDonationHistory);

module.exports = router;
