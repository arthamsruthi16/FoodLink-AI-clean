function getDocs(req, res) {
  const docs = {
    api: [
      { path: '/api/auth/register', method: 'POST', description: 'Register as Restaurant, NGO, or Admin' },
      { path: '/api/auth/login', method: 'POST', description: 'Authenticate and get JWT token' },
      { path: '/api/auth/me', method: 'GET', description: 'Get user profile from JWT token' },
      { path: '/api/auth/profile', method: 'PUT', description: 'Update authenticated user profile' },
      { path: '/api/inventory', method: 'GET', description: 'List available surplus food items' },
      { path: '/api/inventory', method: 'POST', description: 'Create new surplus food inventory listing' },
      { path: '/api/inventory/:id/reserve', method: 'PUT', description: 'Reserve an item for NGO pickup' },
      { path: '/api/inventory/:id', method: 'DELETE', description: 'Remove inventory detail' },
      { path: '/api/ai/predict-freshness', method: 'POST', description: 'Predict perishability and freshness risk' },
      { path: '/api/ai/recommend-ngos', method: 'POST', description: 'Recommend NGO partners for redistribution' },
      { path: '/api/ai/insights', method: 'GET', description: 'Get system analytics summary' },
      { path: '/api/ai/smart-analysis', method: 'POST', description: 'Smart analysis of inventory item with AI insights' },
      { path: '/api/ai/assistant-chat', method: 'POST', description: 'Ask the FoodLink AI assistant' },
      { path: '/api/ai/recipe-generator', method: 'POST', description: 'Generate recipes from available surplus items' },
      { path: '/api/logistics/dispatch', method: 'POST', description: 'Dispatch and assign a courier to a pickup' },
      { path: '/api/logistics/track/:trackingNumber', method: 'GET', description: 'Track current shipment status' },
      { path: '/api/logistics/verify-qr', method: 'POST', description: 'Verify QR handoff for completed delivery' },
      { path: '/api/logistics/webhook', method: 'POST', description: 'External logistics status webhook receiver' },
      { path: '/api/notifications', method: 'GET', description: 'List notifications' },
      { path: '/api/notifications', method: 'POST', description: 'Create a notification' },
      { path: '/api/notifications/:id/read', method: 'PUT', description: 'Mark a notification as read' },
      { path: '/api/uploads/image', method: 'POST', description: 'Upload an image for inventory or receipts' }
    ]
  };

  res.json(docs);
}

module.exports = { getDocs };
