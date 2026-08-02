const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { auth } = require('../config/firebase');
const { config } = require('../config');
const { createUser, getUserByEmail, updateUser, listUsers: fetchUsers } = require('../models/userModel');
const { revokeToken } = require('../models/tokenBlacklistModel');

function signAuthToken(user) {
  const jti = uuidv4();
  return jwt.sign(
    {
      jti,
      id: user.id,
      email: user.email,
      role: user.role
    },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
}

async function register(req, res) {
  const {
    name,
    email,
    password,
    role = 'restaurant',
    orgName,
    orgType,
    address,
    city,
    country,
    region,
    phone,
    lat,
    lng
  } = req.body;

  if (!name || !email || !password || !orgName || !orgType || !address || !phone || lat === undefined || lng === undefined) {
    return res.status(400).json({ error: 'Missing required registration fields.' });
  }

  const normalizedEmail = String(email).toLowerCase();
  const existingUser = await getUserByEmail(normalizedEmail);
  if (existingUser) {
    return res.status(409).json({ error: 'Email is already registered.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const authUser = await auth.createUser({
    email: normalizedEmail,
    password,
    displayName: name
  });

  await auth.setCustomUserClaims(authUser.uid, { role });

  const userId = uuidv4();
  const userRecord = {
    id: userId,
    authUid: authUser.uid,
    name,
    email: normalizedEmail,
    role,
    orgName,
    orgType,
    address,
    city: city || '',
    country: country || '',
    region: region || '',
    phone,
    lat: Number(lat),
    lng: Number(lng),
    verified: false,
    avatarUrl: '',
    rating: 0,
    totalDonations: 0,
    mealsSaved: 0,
    impactBadge: '',
    createdAt: new Date().toISOString(),
    passwordHash: hashedPassword
  };

  await createUser(userRecord);

  const token = signAuthToken(userRecord);
  const userResponse = { ...userRecord };
  delete userResponse.passwordHash;

  return res.status(201).json({ token, user: userResponse });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const normalizedEmail = String(email).toLowerCase();
  const user = await getUserByEmail(normalizedEmail);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash || '');
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = signAuthToken(user);
  const userResponse = { ...user };
  delete userResponse.passwordHash;

  return res.json({ token, user: userResponse });
}

async function logout(req, res) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(400).json({ error: 'Authentication token missing.' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.decode(token);
  if (!decoded || !decoded.jti) {
    return res.status(400).json({ error: 'Invalid token.' });
  }

  const expiresAt = decoded.exp ? decoded.exp * 1000 : null;
  await revokeToken(decoded.jti, decoded.id || null, expiresAt);

  res.json({ message: 'Logout successful.' });
}

async function listUsers(req, res) {
  const users = await fetchUsers(200);
  const safeUsers = users.map((user) => {
    const safeData = { ...user };
    delete safeData.passwordHash;
    return safeData;
  });
  res.json({ users: safeUsers });
}

async function getProfile(req, res) {
  const user = { ...req.user };
  delete user.passwordHash;
  res.json({ user });
}

async function updateProfile(req, res) {
  const updates = { ...req.body };
  if (updates.password) {
    updates.passwordHash = await bcrypt.hash(updates.password, 10);
    delete updates.password;
  }

  if (updates.email) {
    updates.email = String(updates.email).toLowerCase();
  }

  const updatedUser = await updateUser(req.user.id, updates);
  delete updatedUser.passwordHash;
  res.json({ user: updatedUser });
}

module.exports = {
  register,
  login,
  logout,
  listUsers,
  getProfile,
  updateProfile
};
