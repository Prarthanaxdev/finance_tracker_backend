import Category from '../models/Category';
import { ICategory } from '../category/types';

/**
 * Category Repository
 * Handles all database operations for Category model
 */
export class CategoryRepository {
  /**
   * Find category by ID
   */
  async findById(categoryId: string): Promise<ICategory | null> {
    return await Category.findById(categoryId);
  }

  /**
   * Find category by user ID and name
   */
  async findByUserIdAndName(userId: string, name: string): Promise<ICategory | null> {
    return await Category.findOne({ userId, name });
  }

  /**
   * Find all categories for a user with pagination
   */
  async findByUserId(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<{ total: number; categories: ICategory[] }> {
    const total = await Category.countDocuments({ userId, isDeleted: false });
    const categories = await Category.find({ userId, isDeleted: false }).limit(limit).skip(offset);

    return { total, categories };
  }

  /**
   * Create a new category
   */
  async create(categoryData: {
    userId: string;
    name: string;
    type: string;
    description?: string;
  }): Promise<ICategory> {
    return await Category.create(categoryData);
  }

  /**
   * Update category by ID and user ID
   */
  async update(
    categoryId: string,
    userId: string,
    updateData: Partial<ICategory>,
  ): Promise<ICategory | null> {
    return await Category.findOneAndUpdate({ _id: categoryId, userId }, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Delete category by ID and user ID
   */
  async delete(categoryId: string, userId: string): Promise<ICategory | null> {
    return await Category.findOneAndDelete({ _id: categoryId, userId });
  }

  /**
   * Check if category exists for user
   */
  async existsByUserIdAndName(userId: string, name: string): Promise<boolean> {
    const category = await Category.findOne({ userId, name });
    return !!category;
  }

  /**
   * Check if category exists by ID
   */
  async existsById(categoryId: string): Promise<boolean> {
    const category = await Category.findById(categoryId);
    return !!category;
  }
}
