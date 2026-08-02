const { firestore } = require('../config/firebase');

const revokedTokensCollection = firestore.collection('revoked_tokens');

async function revokeToken(jti, userId, expiresAt) {
  if (!jti) throw new Error('Token jti is required for revocation');
  const payload = {
    jti,
    userId: userId || null,
    revokedAt: new Date().toISOString(),
    expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null
  };
  await revokedTokensCollection.doc(jti).set(payload);
  return payload;
}

async function isTokenRevoked(jti) {
  if (!jti) return false;
  const doc = await revokedTokensCollection.doc(jti).get();
  return doc.exists;
}

module.exports = {
  revokeToken,
  isTokenRevoked
};
