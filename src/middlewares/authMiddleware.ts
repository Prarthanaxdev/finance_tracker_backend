import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../auth/auth.model';
import { AuthRequest } from '../auth/auth.types';

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'secretkey';
    const decoded = jwt.verify(token, secret) as { id: string };

    const user = await UserModel.findById(decoded.id).select('name email');
    if (!user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    req.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
};
