const { config } = require('../config');

let client = null;
try {
  // Try to require and instantiate the official client if available
  const genai = require('@google/genai');
  const TextGenerationClient = genai?.TextGenerationClient || genai?.TextClient || genai?.default;
  if (typeof TextGenerationClient === 'function') {
    client = new TextGenerationClient({ apiKey: config.geminiApiKey });
  }
} catch (err) {
  // ignore - we'll fallback to a mock client below
}

if (!client) {
  // Fallback mock client for local development when the real Gemini client isn't available
  client = {
    generate: async (opts) => ({ candidates: [{ content: `Mock Gemini response for prompt: ${String(opts.prompt).slice(0,200)}` }] })
  };
}

function buildPrompt(type, data) {
  switch (type) {
    case 'freshness':
      return `You are a food safety assistant. Provide freshness suggestions for the following item:\n
Food Name: ${data.foodName}\nCategory: ${data.category}\nCondition: ${data.foodCondition}\nStorage: ${data.storageCondition}\nPrepared At: ${data.preparedAt}\nExpiry Time: ${data.expiryTime}\nNotes: ${data.notes || 'None'}\n\nGive a concise suggestion on whether it is safe, needs urgent pickup, or should be discarded.`;
    case 'description':
      return `Generate a compelling donation description for this food item and highlight why NGOs should request it:\n
Food Name: ${data.foodName}\nCategory: ${data.category}\nQuantity: ${data.quantity} ${data.quantityUnit || 'units'}\nCondition: ${data.foodCondition}\nStorage: ${data.storageCondition}\nNotes: ${data.notes || 'No additional notes'}\n\nKeep it under 100 words and encourage pickup within the next 4 hours.`;
    case 'ngo_recommendation':
      return `Recommend nearby NGO partners for this food donation. Use the following data:\n
Restaurant Lat: ${data.lat}\nRestaurant Lng: ${data.lng}\nQuantity Kg: ${data.quantityKg}\nCategory: ${data.category}\nPickup urgency: ${data.urgency || 'high'}\n\nReturn a JSON array of up to 5 recommended NGOs with fields ngoName, distanceKm, suitability, and reason.`;
    case 'summary':
      return `Summarize this donation in a clear paragraph suitable for a logistics dashboard. Include food name, quantity, location, status, and next steps.\n\nDetails:\nFood Name: ${data.foodName}\nCategory: ${data.category}\nQuantity: ${data.quantity} ${data.quantityUnit || 'units'}\nStatus: ${data.status}\nPickup Window: ${data.pickupWindowStart || 'TBD'} to ${data.pickupWindowEnd || 'TBD'}\nLocation: ${data.restaurantAddress || 'Unknown'}\nNotes: ${data.notes || 'None'}`;
    default:
      return 'Provide a helpful response.';
  }
}

async function generateGeminiResponse(type, data) {
  // If no real API key is configured we'll still use the mock client above.

  const prompt = buildPrompt(type, data);

  const response = await client.generate({
    model: 'gemini-pro-1.1',
    prompt,
    temperature: 0.7,
    maxOutputTokens: 250
  });

  const text = response?.candidates?.[0]?.content?.trim() || '';
  return { prompt, response: text };
}

module.exports = { generateGeminiResponse };
