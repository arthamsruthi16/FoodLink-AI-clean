const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const ngoRoutes = require('./routes/ngoRoutes');
const aiRoutes = require('./routes/aiRoutes');
const logisticsRoutes = require('./routes/logisticsRoutes');
const geminiRoutes = require('./routes/geminiRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const docsRoutes = require('./routes/docsRoutes');
const { config } = require('./config');

// Create Express instance and apply standard security middleware.
const app = express();
app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files from the uploads directory.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/ngo', ngoRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/docs', docsRoutes);

// Health route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware must be last.
app.use(errorHandler);

module.exports = app;
