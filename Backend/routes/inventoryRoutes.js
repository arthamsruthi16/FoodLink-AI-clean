const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  getInventory,
  getFoodItem,
  getMyDonations,
  createInventoryItem,
  updateInventoryItem,
  reserveInventoryItem,
  deleteInventoryItem
} = require('../controllers/inventoryController');
const {
  validateDonation,
  validateDonationUpdate
} = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/', getInventory);
router.get('/mine', authenticateToken, getMyDonations);
router.get('/:id', getFoodItem);
router.post('/', authenticateToken, validateDonation, createInventoryItem);
router.put('/:id', authenticateToken, validateDonationUpdate, updateInventoryItem);
router.put('/:id/reserve', authenticateToken, reserveInventoryItem);
router.delete('/:id', authenticateToken, deleteInventoryItem);

module.exports = router;
