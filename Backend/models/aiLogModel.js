const { firestore } = require('../config/firebase');

const aiLogsCollection = firestore.collection('ai_logs');

async function createAiLog(logEntry) {
  const docRef = aiLogsCollection.doc(logEntry.id);
  await docRef.set(logEntry);
  return { id: docRef.id, ...logEntry };
}

module.exports = { createAiLog };
