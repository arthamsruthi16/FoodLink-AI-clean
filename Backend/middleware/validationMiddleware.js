function validateRegistration(req, res, next) {
  const {
    name,
    email,
    password,
    role,
    orgName,
    orgType,
    address,
    phone,
    lat,
    lng
  } = req.body;

  const roles = ['restaurant', 'ngo', 'admin'];

  if (!name || !email || !password || !orgName || !orgType || !address || !phone || lat === undefined || lng === undefined) {
    return res.status(400).json({ error: 'Missing required registration fields.' });
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Email must be a valid address.' });
  }

  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  if (!roles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role selected.' });
  }

  if (typeof lat !== 'number' && typeof lat !== 'string') {
    return res.status(400).json({ error: 'Latitude must be provided.' });
  }
  if (typeof lng !== 'number' && typeof lng !== 'string') {
    return res.status(400).json({ error: 'Longitude must be provided.' });
  }

  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  next();
}

function validateDonation(req, res, next) {
  const {
    foodName,
    category,
    quantity,
    expiryTime,
    pickupTime,
    address,
    lat,
    lng
  } = req.body;

  if (!foodName || !category || quantity === undefined || !expiryTime || !pickupTime || !address || lat === undefined || lng === undefined) {
    return res.status(400).json({ error: 'Missing required donation fields.' });
  }

  if (typeof quantity !== 'number' && typeof quantity !== 'string') {
    return res.status(400).json({ error: 'Quantity must be a number.' });
  }

  next();
}

function validateDonationUpdate(req, res, next) {
  const { quantity, lat, lng } = req.body;

  if (quantity !== undefined && typeof quantity !== 'number' && typeof quantity !== 'string') {
    return res.status(400).json({ error: 'Quantity must be a number.' });
  }

  if (lat !== undefined && typeof lat !== 'number' && typeof lat !== 'string') {
    return res.status(400).json({ error: 'Latitude must be a number.' });
  }

  if (lng !== undefined && typeof lng !== 'number' && typeof lng !== 'string') {
    return res.status(400).json({ error: 'Longitude must be a number.' });
  }

  next();
}

function validateNgoNearbySearch(req, res, next) {
  const { lat, lng, radius } = req.query;

  if (lat !== undefined && isNaN(Number(lat))) {
    return res.status(400).json({ error: 'Latitude must be a valid number.' });
  }
  if (lng !== undefined && isNaN(Number(lng))) {
    return res.status(400).json({ error: 'Longitude must be a valid number.' });
  }
  if (radius !== undefined && isNaN(Number(radius))) {
    return res.status(400).json({ error: 'Radius must be a valid number.' });
  }

  next();
}

function validateNgoRequestDonation(req, res, next) {
  const { itemId } = req.params;
  if (!itemId) {
    return res.status(400).json({ error: 'Food item ID is required to request a donation.' });
  }
  next();
}

function validateNgoAcceptPickup(req, res, next) {
  const { pickupId } = req.params;
  if (!pickupId) {
    return res.status(400).json({ error: 'Pickup ID is required to accept a pickup.' });
  }
  next();
}

module.exports = {
  validateRegistration,
  validateLogin,
  validateDonation,
  validateDonationUpdate,
  validateNgoNearbySearch,
  validateNgoRequestDonation,
  validateNgoAcceptPickup
};
