const express = require('express');
const { register, login, logout, getProfile, updateProfile, listUsers } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/authorizationMiddleware');
const { validateRegistration, validateLogin } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/logout', authenticateToken, logout);
router.get('/me', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.get('/users', authenticateToken, requireRole('admin'), listUsers);

module.exports = router;
