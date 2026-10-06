import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../database/db.js';
import { User } from '../src/types.js';

const JWT_SECRET = process.env.JWT_SECRET || 'zsp_secret_key_2026_super_secure';

export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      accountType: user.accountType,
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid JWT token' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }

  const user = db.getUserById(decoded.id);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: User not found' });
  }

  req.user = user;
  next();
}
