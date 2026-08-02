import bcrypt from 'bcryptjs';
import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../../src/types';
import { db } from '../db';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'foodlink_ai_secure_jwt_secret_key_2026_prod';

/**
 * Register a new User (Restaurant, NGO, or Admin)
 */
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, orgName, orgType, address, phone, lat, lng } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required.' });
    }

    const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      role: role as UserRole,
      orgName: orgName || name,
      orgType: orgType || (role === 'restaurant' ? 'Restaurant' : role === 'ngo' ? 'NGO' : 'Admin'),
      address: address || '100 Main St, San Francisco, CA',
      phone: phone || '+1 (415) 555-0100',
      lat: lat || 37.7749,
      lng: lng || -122.4194,
      verified: true, // Auto-verify for quick startup demonstration
      rating: 5.0,
      totalDonations: 0,
      mealsSaved: 0,
      impactBadge: role === 'restaurant' ? 'New Food Hero' : 'Community Partner',
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);

    const token = jwt.sign({ id: newUser.id, role: newUser.role, email: newUser.email }, JWT_SECRET, {
      expiresIn: '7d'
    });

    return res.status(201).json({ token, user: newUser });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Registration failed.' });
  }
});

/**
 * Login User
 */
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, {
      expiresIn: '7d'
    });

    return res.json({ token, user });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Login failed.' });
  }
});

/**
 * Get current user profile
 */
authRouter.get('/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No authorization token provided.' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = db.users.find((u) => u.id === decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    return res.json({ user });
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
});

/**
 * Update user profile
 */
authRouter.put('/profile', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized.' });

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const userIndex = db.users.findIndex((u) => u.id === decoded.id);

    if (userIndex === -1) return res.status(404).json({ error: 'User not found.' });

    const updated = {
      ...db.users[userIndex],
      ...req.body
    };

    db.users[userIndex] = updated;
    return res.json({ user: updated });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
});
