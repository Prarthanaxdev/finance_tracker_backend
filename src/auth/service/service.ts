import User from '../model/auth.model';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';
import { ValidationError, ConflictError, UnauthorizedError } from '../../utils/errors';

const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId } as JWTPayload, process.env.JWT_SECRET as string, {
    expiresIn: '2d',
  });
};

export const registerUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw new ValidationError('Please provide email and password');
  }

  if (password.length < 6) {
    throw new ValidationError('Password must be at least 6 characters');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ConflictError('User already exists with this email');
  }

  const user = await User.create({
    email,
    password,
  });

  const token = generateToken(user._id.toString());

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    token,
  };
};

export const loginUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw new ValidationError('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isPasswordCorrect = await user.matchPassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const token = generateToken(user._id.toString());

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    token,
  };
};
