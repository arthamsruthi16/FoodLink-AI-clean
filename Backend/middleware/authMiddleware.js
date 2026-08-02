const jwt = require('jsonwebtoken');
const { config } = require('../config');
const { getUserById } = require('../models/userModel');
const { isTokenRevoked } = require('../models/tokenBlacklistModel');

async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Invalid authentication token' });
    }

    const revoked = await isTokenRevoked(decoded.jti);
    if (revoked) {
      return res.status(401).json({ error: 'Authentication token has been revoked.' });
    }

    const user = await getUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found for provided token' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message || err);
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
}

module.exports = { authenticateToken };
