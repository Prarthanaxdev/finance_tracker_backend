import { Request, Response, NextFunction } from 'express';
import { RegisterBody, LoginBody, ApiResponse } from '../types';
import * as AuthService from '../service/service';

/**
 * Register a new user
 * desc    Register a new user
 * route   POST /api/signup
 * access  Public (anyone can register)
 *
 */
export const SignupUser = async (
  req: Request<{}, ApiResponse, RegisterBody>,
  res: Response<ApiResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const userData = await AuthService.registerUser(email, password);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * login user
 * desc    Login user
 * route   POST /api/signin
 * access  Public
 */
export const SigninUser = async (
  req: Request<{}, ApiResponse, LoginBody>,
  res: Response<ApiResponse>,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const userData = await AuthService.loginUser(email, password);

    res.json({
      success: true,
      message: 'Login successful',
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};
