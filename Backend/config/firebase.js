const admin = require('firebase-admin');
const { config } = require('./index');

// Initialize Firebase Admin SDK using environment variables when available.
const firebaseConfig = {
  projectId: config.firebase.projectId,
  clientEmail: config.firebase.clientEmail,
  privateKey: config.firebase.privateKey
};

if (!firebaseConfig.projectId || !firebaseConfig.clientEmail || !firebaseConfig.privateKey) {
  // Fallback: do not throw in local dev. Provide a lightweight in-memory mock
  // of the Firestore and Auth APIs so the backend can start without crashing.
  console.warn('Firebase service account not configured - using in-memory mock for dev.');

  const dataStore = new Map(); // collectionName -> Map(docId -> data)

  function ensureCollection(name) {
    if (!dataStore.has(name)) dataStore.set(name, new Map());
    return dataStore.get(name);
  }

  function makeDocSnapshot(id, data) {
    return {
      id,
      exists: data !== undefined,
      data: () => (data === undefined ? null : { ...data })
    };
  }

  function makeCollectionRef(name) {
    const coll = ensureCollection(name);

    return {
      doc(id) {
        return {
          async get() {
            const d = coll.get(id);
            return makeDocSnapshot(id, d);
          },
          async set(data) {
            coll.set(id, { ...data });
          },
          async update(updates) {
            const existing = coll.get(id) || {};
            coll.set(id, { ...existing, ...updates });
          },
          async delete() {
            coll.delete(id);
          }
        };
      },
      async get() {
        const docs = Array.from(coll.entries()).map(([id, data]) => ({
          id,
          data: () => ({ ...data })
        }));
        return { docs };
      },
      where(field, op, value) {
        const self = this;
        const results = Array.from(coll.entries())
          .filter(([, data]) => {
            // support simple '==' predicate
            if (op === '==') return data && data[field] === value;
            return false;
          })
          .map(([id, data]) => ({ id, data }));

        return {
          limit(n) {
            this._limit = n;
            return this;
          },
          async get() {
            let sliced = results;
            if (this._limit) sliced = results.slice(0, this._limit);
            return { docs: sliced.map((d) => ({ id: d.id, data: () => ({ ...d.data }) })) };
          }
        };
      },
      limit(n) {
        const self = this;
        return {
          async get() {
            const docs = Array.from(coll.entries())
              .slice(0, n)
              .map(([id, data]) => ({ id, data: () => ({ ...data }) }));
            return { docs };
          }
        };
      },
      async add(data) {
        const id = `mock_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        coll.set(id, { ...data });
        return { id };
      }
    };
  }

  const firestore = {
    collection(name) {
      return makeCollectionRef(name);
    }
  };

  const auth = {
    async createUser({ email }) {
      // Return a minimal user object that caller expects
      return { uid: `mock_uid_${Date.now()}` };
    },
    async setCustomUserClaims(uid, claims) {
      // no-op for local mock
      return;
    }
  };

  module.exports = {
    admin: {},
    firestore,
    auth
  };
} else {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig)
  });

  const firestore = admin.firestore();
  const auth = admin.auth();

  module.exports = {
    admin,
    firestore,
    auth
  };
}
