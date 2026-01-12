/**
 * Category Service Test Suite
 *
 * This file tests the category service functions including create, read, update, and delete operations.
 * It verifies proper validation, error handling, and CRUD operations for transaction categories.
 */

import {
  createCategory,
  getUserCategories,
  updateCategory,
  deleteCategory,
} from '../service/service';
import CategoryModel from '../model/category.model';
import { ValidationError, ConflictError, NotFoundError } from '../../utils/errors';

// Mock the Category model to prevent actual database calls during testing
jest.mock('../model/category.model');

describe('Category Service', () => {
  // Test user ID used across all test cases
  const userId = 'user123';

  // Clear all mocks after each test to ensure test isolation
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCategory', () => {
    /**
     * Test successful category creation
     * Verifies that a new category can be created with valid data
     */
    test('should successfully create a new category', async () => {
      // Mock category data to be returned after creation
      const mockCategory = {
        _id: 'cat123',
        userId,
        name: 'Food',
        type: 'expense',
        description: 'Food expenses',
      };

      // Mock that no existing category with this name exists
      (CategoryModel.findOne as jest.Mock).mockResolvedValue(null);
      // Mock successful category creation
      (CategoryModel.create as jest.Mock).mockResolvedValue(mockCategory);

      const result = await createCategory(userId, 'Food', 'expense', 'Food expenses');

      expect(result).toEqual(mockCategory);
      expect(CategoryModel.findOne).toHaveBeenCalledWith({ userId, name: 'Food' });
      expect(CategoryModel.create).toHaveBeenCalledWith({
        userId,
        name: 'Food',
        type: 'expense',
        description: 'Food expenses',
      });
    });

    /**
     * Test validation for missing category name
     * Ensures that category name is a required field
     */
    test('should throw ValidationError if name is missing', async () => {
      await expect(createCategory(userId, '', 'expense')).rejects.toThrow(ValidationError);
    });

    /**
     * Test validation for missing category type
     * Ensures that category type (income/expense) is a required field
     */
    test('should throw ValidationError if type is missing', async () => {
      await expect(createCategory(userId, 'Food', '')).rejects.toThrow(ValidationError);
    });

    /**
     * Test duplicate category name validation
     * Ensures users cannot create multiple categories with the same name
     */
    test('should throw ConflictError if category already exists', async () => {
      // Mock that a category with this name already exists
      (CategoryModel.findOne as jest.Mock).mockResolvedValue({
        _id: 'cat123',
        name: 'Food',
      });

      await expect(createCategory(userId, 'Food', 'expense')).rejects.toThrow(ConflictError);
    });
  });

  describe('getUserCategories', () => {
    /**
     * Test retrieving user categories with pagination
     * Verifies that categories are returned with correct pagination metadata
     */
    test('should return user categories with pagination', async () => {
      // Mock categories to be returned
      const mockCategories = [
        { _id: 'cat1', name: 'Food', type: 'expense' },
        { _id: 'cat2', name: 'Salary', type: 'income' },
      ];

      // Mock total count of documents
      (CategoryModel.countDocuments as jest.Mock).mockResolvedValue(2);
      // Mock the query chain for finding categories with pagination
      (CategoryModel.find as jest.Mock).mockReturnValue({
        limit: jest.fn().mockReturnValue({
          skip: jest.fn().mockResolvedValue(mockCategories),
        }),
      });

      const result = await getUserCategories(userId, 10, 0);

      expect(result.total).toBe(2);
      expect(result.categories).toEqual(mockCategories);
      expect(result.limit).toBe(10);
      expect(result.offset).toBe(0);
    });

    /**
     * Test filtering of deleted categories
     * Ensures that soft-deleted categories are not included in the results
     */
    test('should use correct filter for non-deleted categories', async () => {
      (CategoryModel.countDocuments as jest.Mock).mockResolvedValue(0);
      (CategoryModel.find as jest.Mock).mockReturnValue({
        limit: jest.fn().mockReturnValue({
          skip: jest.fn().mockResolvedValue([]),
        }),
      });

      await getUserCategories(userId, 10, 0);

      expect(CategoryModel.countDocuments).toHaveBeenCalledWith({
        userId,
        isDeleted: false,
      });
      expect(CategoryModel.find).toHaveBeenCalledWith({
        userId,
        isDeleted: false,
      });
    });
  });

  describe('updateCategory', () => {
    /**
     * Test successful category update
     * Verifies that category fields can be updated successfully
     */
    test('should successfully update a category', async () => {
      // Mock updated category data
      const mockUpdatedCategory = {
        _id: 'cat123',
        userId,
        name: 'Updated Food',
        type: 'expense',
        description: 'Updated description',
      };

      // Mock successful update operation
      (CategoryModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedCategory);

      const result = await updateCategory('cat123', userId, { description: 'Updated description' });

      expect(result).toEqual(mockUpdatedCategory);
      expect(CategoryModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'cat123', userId },
        { description: 'Updated description' },
        { new: true, runValidators: true },
      );
    });

    /**
     * Test update of non-existent category
     * Ensures proper error handling when trying to update a category that doesn't exist
     */
    test('should throw NotFoundError if category does not exist', async () => {
      // Mock that no category is found
      (CategoryModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(updateCategory('nonexistent', userId, { description: 'Test' })).rejects.toThrow(
        NotFoundError,
      );
    });

    /**
     * Test validation for incomplete category update
     * Ensures that name and type must be updated together (both or neither)
     */
    test('should throw ValidationError if name is provided without type', async () => {
      await expect(updateCategory('cat123', userId, { name: 'Food' })).rejects.toThrow(
        ValidationError,
      );
    });

    /**
     * Test validation for incomplete category update
     * Ensures that type and name must be updated together (both or neither)
     */
    test('should throw ValidationError if type is provided without name', async () => {
      await expect(updateCategory('cat123', userId, { type: 'expense' })).rejects.toThrow(
        ValidationError,
      );
    });
  });

  describe('deleteCategory', () => {
    /**
     * Test successful category deletion
     * Verifies that a category can be deleted successfully
     */
    test('should successfully delete a category', async () => {
      // Mock deleted category data
      const mockDeletedCategory = {
        _id: 'cat123',
        userId,
        name: 'Food',
      };

      // Mock successful delete operation
      (CategoryModel.findOneAndDelete as jest.Mock).mockResolvedValue(mockDeletedCategory);

      const result = await deleteCategory('cat123', userId);

      expect(result).toEqual(mockDeletedCategory);
      expect(CategoryModel.findOneAndDelete).toHaveBeenCalledWith({
        _id: 'cat123',
        userId,
      });
    });

    /**
     * Test deletion of non-existent category
     * Ensures proper error handling when trying to delete a category that doesn't exist
     */
    test('should throw NotFoundError if category does not exist', async () => {
      // Mock that no category is found to delete
      (CategoryModel.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      await expect(deleteCategory('nonexistent', userId)).rejects.toThrow(NotFoundError);
    });
  });
});
