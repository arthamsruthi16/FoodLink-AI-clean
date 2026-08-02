import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { aiRouter } from './server/routes/ai';
import { authRouter } from './server/routes/auth';
import { docsRouter } from './server/routes/docs';
import { inventoryRouter } from './server/routes/inventory';
import { logisticsRouter } from './server/routes/logistics';
import { notificationsRouter } from './server/routes/notifications';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // JSON Body Parser
  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.use('/api/auth', authRouter);
  app.use('/api/inventory', inventoryRouter);
  app.use('/api/ai', aiRouter);
  app.use('/api/logistics', logisticsRouter);
  app.use('/api/notifications', notificationsRouter);
  app.use('/api/docs', docsRouter);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'FoodLink AI Platform', timestamp: new Date().toISOString() });
  });

  // Vite Middleware for Development vs Production static build
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 FoodLink AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
