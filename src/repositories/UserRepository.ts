import User from '../models/Auth';
import { IUser } from '../auth/types';

/**
 * User Repository
 * Handles all database operations for User model
 * Filters sensitive data before returning results
 */
export class UserRepository {
  /**
   * Find user by email (without password)
   */
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  /**
   * Find user by email with password (for authentication)
   */
  async findByEmailWithPassword(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select('+password');
  }

  /**
   * Find user by ID (without password)
   */
  async findById(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }

  /**
   * Create a new user
   * Returns user without password
   */
  async create(userData: { email: string; password: string }): Promise<IUser> {
    const user = await User.create(userData);
    // Return user without password
    return this.findById(user._id.toString()) as Promise<IUser>;
  }

  /**
   * Update user by ID
   */
  async update(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Delete user by ID
   */
  async delete(userId: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(userId);
  }

  /**
   * Check if user exists by email
   */
  async exists(email: string): Promise<boolean> {
    const user = await User.findOne({ email });
    return !!user;
  }
}
