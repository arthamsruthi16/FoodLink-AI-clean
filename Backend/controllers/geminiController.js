const { v4: uuidv4 } = require('uuid');
const { generateGeminiResponse } = require('../services/geminiService');
const { createAiLog } = require('../models/aiLogModel');

async function handleGeminiRequest(req, res, type) {
  const payload = req.body;
  if (!payload || Object.keys(payload).length === 0) {
    return res.status(400).json({ error: 'Request payload is required.' });
  }

  try {
    const { prompt, response } = await generateGeminiResponse(type, payload);
    const logEntry = {
      id: uuidv4(),
      type,
      prompt,
      response,
      userId: req.user ? req.user.id : null,
      createdAt: new Date().toISOString(),
      meta: {
        path: req.originalUrl,
        body: payload
      }
    };
    await createAiLog(logEntry);
    return res.json({ prompt, response, logId: logEntry.id });
  } catch (error) {
    console.error('Gemini API error:', error.message || error);
    return res.status(500).json({ error: 'Failed to generate Gemini response.' });
  }
}

async function freshnessSuggestion(req, res) {
  return handleGeminiRequest(req, res, 'freshness');
}

async function donationDescription(req, res) {
  return handleGeminiRequest(req, res, 'description');
}

async function ngoRecommendation(req, res) {
  return handleGeminiRequest(req, res, 'ngo_recommendation');
}

async function donationSummary(req, res) {
  return handleGeminiRequest(req, res, 'summary');
}

module.exports = {
  freshnessSuggestion,
  donationDescription,
  ngoRecommendation,
  donationSummary
};
