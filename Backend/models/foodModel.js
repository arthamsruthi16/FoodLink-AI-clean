const { firestore } = require('../config/firebase');

/**
 * Food inventory model operations against Firestore.
 */
const inventoryCollection = firestore.collection('food_items');

async function createFoodItem(foodItem) {
  const docRef = inventoryCollection.doc(foodItem.id);
  await docRef.set(foodItem);
  return { id: docRef.id, ...foodItem };
}

async function getFoodItemById(id) {
  const doc = await inventoryCollection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function updateFoodItem(id, updates) {
  await inventoryCollection.doc(id).update(updates);
  const doc = await inventoryCollection.doc(id).get();
  return { id: doc.id, ...doc.data() };
}

async function deleteFoodItem(id) {
  await inventoryCollection.doc(id).delete();
}

async function getFoodItemsByRestaurant(restaurantId) {
  const snapshot = await inventoryCollection.where('restaurantId', '==', restaurantId).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function queryFoodItems(filters = {}) {
  let query = inventoryCollection;

  if (filters.category) {
    query = query.where('category', '==', filters.category);
  }
  if (filters.status) {
    query = query.where('status', '==', filters.status);
  }
  if (filters.isReserved !== undefined) {
    query = query.where('isReserved', '==', filters.isReserved);
  }

  const snapshot = await query.get();
  const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  if (filters.search) {
    const q = String(filters.search).toLowerCase();
    return items.filter((item) => {
      return [
        item.foodName,
        item.restaurantName,
        item.category,
        item.city,
        item.country,
        item.restaurantAddress
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(q));
    });
  }

  if (filters.minUrgency !== undefined) {
    return items.filter((item) => item.urgencyScore >= Number(filters.minUrgency));
  }

  return items;
}

module.exports = {
  createFoodItem,
  getFoodItemById,
  updateFoodItem,
  deleteFoodItem,
  queryFoodItems,
  getFoodItemsByRestaurant
};
