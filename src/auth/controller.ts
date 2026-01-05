import { Request, Response } from 'express';
import User from './auth.model';
import jwt from 'jsonwebtoken';
import { RegisterBody, LoginBody, ApiResponse, JWTPayload } from './auth.types';

const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId } as JWTPayload, process.env.JWT_SECRET as string, {
    expiresIn: '2d', // Token expires in 2 days
  });
};

// @desc    Register a new user
// @route   POST /api/signup
// @access  Public (anyone can register)
export const SignupUser = async (
  req: Request<{}, ApiResponse, RegisterBody>,
  res: Response<ApiResponse>,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
      return;
    }

    // Check if password is at least 6 characters
    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
      return;
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
      return;
    }

    const user = await User.create({
      email,
      password,
    });

    // Generate JWT token for the new user
    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        token, // Send token so user is automatically logged in after registration
      },
    });
  } catch (error) {
    // Handle any errors
    console.error('Registration error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Server error during registration';
    res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

// @desc    Login user
// @route   POST /api/signin
// @access  Public
export const SigninUser = async (
  req: Request<{}, ApiResponse, LoginBody>,
  res: Response<ApiResponse>,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
      return;
    }

    // Find user by email and include password field (normally excluded)
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    // Check if password matches
    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    const token = generateToken(user._id.toString());
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Server error during login';
    res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};
