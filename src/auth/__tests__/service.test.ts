/**
 * Authentication Service Test Suite
 *
 * This file tests the authentication service functions including user registration and login.
 * It verifies proper validation, error handling, and successful authentication flows.
 */

import { registerUser, loginUser } from '../../services/index';
import { User } from '../../models/index';
import jwt from 'jsonwebtoken';
import { ValidationError, ConflictError, UnauthorizedError } from '../../utils/errors';

// Mock the models
jest.mock('../../models/index');

// Mock jsonwebtoken to control token generation in tests
jest.mock('jsonwebtoken');

// Set up a test JWT secret for token generation
process.env.JWT_SECRET = 'test-secret-key';

describe('Auth Service', () => {
  // Clear all mocks after each test to ensure test isolation
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    /**
     * Test successful user registration
     * Verifies that a new user can be registered with valid credentials
     * and receives a token upon successful registration
     */
    test('should successfully register a new user', async () => {
      // Mock user data that will be returned after successful registration
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        name: 'Test User',
      };

      // Mock that no existing user is found (email is available)
      (User.findOne as jest.Mock).mockResolvedValue(null);
      // Mock successful user creation
      (User.create as jest.Mock).mockResolvedValue(mockUser);
      // Mock token generation
      (jwt.sign as jest.Mock).mockReturnValue('test-token');

      const result = await registerUser('test@example.com', 'password123');

      expect(result).toEqual({
        _id: '123',
        email: 'test@example.com',
        name: 'Test User',
        token: 'test-token',
      });
      expect(User.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    /**
     * Test validation for missing credentials
     * Ensures that both email and password are required fields
     */
    test('should throw ValidationError if email or password is missing', async () => {
      await expect(registerUser('', 'password123')).rejects.toThrow(ValidationError);
      await expect(registerUser('test@example.com', '')).rejects.toThrow(ValidationError);
    });

    /**
     * Test password length validation
     * Ensures passwords meet minimum security requirements (6 characters)
     */
    test('should throw ValidationError if password is less than 6 characters', async () => {
      await expect(registerUser('test@example.com', '12345')).rejects.toThrow(ValidationError);
    });

    /**
     * Test duplicate email validation
     * Ensures that users cannot register with an email that's already in use
     */
    test('should throw ConflictError if user already exists', async () => {
      // Mock that a user with this email already exists
      (User.findOne as jest.Mock).mockResolvedValue({ email: 'test@example.com' });

      await expect(registerUser('test@example.com', 'password123')).rejects.toThrow(ConflictError);
    });
  });

  describe('loginUser', () => {
    /**
     * Test successful user login
     * Verifies that a user can login with correct credentials
     * and receives a token for authenticated requests
     */
    test('should successfully login a user with correct credentials', async () => {
      // Mock user with password matching functionality
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        name: 'Test User',
        matchPassword: jest.fn().mockResolvedValue(true),
      };

      // Mock finding the user and selecting password field
      (User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });
      // Mock token generation
      (jwt.sign as jest.Mock).mockReturnValue('test-token');

      const result = await loginUser('test@example.com', 'password123');

      expect(result).toEqual({
        _id: '123',
        email: 'test@example.com',
        name: 'Test User',
        token: 'test-token',
      });
    });

    /**
     * Test validation for missing login credentials
     * Ensures both email and password are provided for login
     */
    test('should throw ValidationError if email or password is missing', async () => {
      await expect(loginUser('', 'password123')).rejects.toThrow(ValidationError);
      await expect(loginUser('test@example.com', '')).rejects.toThrow(ValidationError);
    });

    /**
     * Test login with non-existent user
     * Ensures proper error handling when attempting to login with an unregistered email
     */
    test('should throw UnauthorizedError if user does not exist', async () => {
      // Mock that no user is found with the provided email
      (User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await expect(loginUser('nonexistent@example.com', 'password123')).rejects.toThrow(
        UnauthorizedError,
      );
    });

    /**
     * Test login with incorrect password
     * Ensures that invalid passwords are rejected even when the user exists
     */
    test('should throw UnauthorizedError if password is incorrect', async () => {
      // Mock user with password matching function that returns false
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        name: 'Test User',
        matchPassword: jest.fn().mockResolvedValue(false),
      };

      (User.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      await expect(loginUser('test@example.com', 'wrongpassword')).rejects.toThrow(
        UnauthorizedError,
      );
    });
  });
});
