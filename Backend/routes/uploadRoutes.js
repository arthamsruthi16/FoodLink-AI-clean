const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { uploadSingleImage } = require('../controllers/uploadController');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/image', authenticateToken, upload.single('image'), uploadSingleImage);

module.exports = router;
