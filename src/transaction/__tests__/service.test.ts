/**
 * Transaction Service Test Suite
 *
 * This file tests the transaction service functions including create, read, update, and delete operations.
 * It verifies proper validation, error handling, and CRUD operations for financial transactions.
 */

import {
  createTransaction,
  getUserTransactions,
  updateTransaction,
  deleteTransaction,
} from '@services/index';
import { Transaction as TransactionModel } from '@models/index';
import { ValidationError, NotFoundError } from '@utils/errors';

// Mock the models
jest.mock('@models/index');

describe('Transaction Service', () => {
  // Test user ID used across all test cases
  const userId = 'user123';

  // Clear all mocks after each test to ensure test isolation
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    /**
     * Test successful transaction creation
     * Verifies that a new transaction can be created with valid data
     */
    test('should successfully create a new transaction', async () => {
      // Transaction data to be created
      const transactionData = {
        userId,
        categoryId: 'cat123',
        amount: 100,
        type: 'expense',
        date: new Date(),
        description: 'Grocery shopping',
      };

      // Mock transaction data returned after creation
      const mockTransaction = {
        _id: 'txn123',
        ...transactionData,
      };

      // Mock successful transaction creation
      (TransactionModel.create as jest.Mock).mockResolvedValue(mockTransaction);

      const result = await createTransaction(transactionData);

      expect(result).toEqual(mockTransaction);
      expect(TransactionModel.create).toHaveBeenCalledWith(transactionData);
    });

    /**
     * Test validation for zero amount
     * Ensures that transactions must have a positive amount
     */
    test('should throw ValidationError if amount is not positive', async () => {
      const invalidData = {
        userId,
        amount: 0,
        type: 'expense',
      };

      await expect(createTransaction(invalidData)).rejects.toThrow(ValidationError);
    });

    /**
     * Test validation for negative amount
     * Ensures that transaction amounts cannot be negative
     */
    test('should throw ValidationError if amount is negative', async () => {
      const invalidData = {
        userId,
        amount: -50,
        type: 'expense',
      };

      await expect(createTransaction(invalidData)).rejects.toThrow(ValidationError);
    });
  });

  describe('getUserTransactions', () => {
    /**
     * Test retrieving user transactions with pagination
     * Verifies that transactions are returned with correct pagination metadata
     */
    test('should return user transactions with pagination', async () => {
      // Mock transactions to be returned
      const mockTransactions = [
        { _id: 'txn1', amount: 100, type: 'expense', date: new Date() },
        { _id: 'txn2', amount: 500, type: 'income', date: new Date() },
      ];

      // Mock total count of documents
      (TransactionModel.countDocuments as jest.Mock).mockResolvedValue(2);
      // Mock the query chain for finding transactions with sorting, pagination, and population
      (TransactionModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              populate: jest.fn().mockResolvedValue(mockTransactions),
            }),
          }),
        }),
      });

      const result = await getUserTransactions(userId, 10, 0);

      expect(result.total).toBe(2);
      expect(result.limit).toBe(10);
      expect(result.offset).toBe(0);
    });

    /**
     * Test filtering transactions by type (income/expense)
     * Verifies that transactions can be filtered by type when specified
     */
    test('should filter transactions by type', async () => {
      // Mock expense transactions only
      const mockTransactions = [{ _id: 'txn1', amount: 100, type: 'expense' }];

      (TransactionModel.countDocuments as jest.Mock).mockResolvedValue(1);
      // Mock the query chain with type filter
      (TransactionModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              populate: jest.fn().mockResolvedValue(mockTransactions),
            }),
          }),
        }),
      });

      await getUserTransactions(userId, 10, 0, 'expense');

      expect(TransactionModel.find).toHaveBeenCalledWith({
        userId,
        isDeleted: false,
        type: 'expense',
      });
    });
  });

  describe('updateTransaction', () => {
    /**
     * Test successful transaction update
     * Verifies that transaction fields can be updated successfully
     */
    test('should successfully update a transaction', async () => {
      // Data to update
      const updateData = { amount: 150, description: 'Updated description' };
      // Mock updated transaction data
      const mockUpdatedTransaction = {
        _id: 'txn123',
        userId,
        ...updateData,
      };

      // Mock successful update operation
      (TransactionModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedTransaction);

      const result = await updateTransaction('txn123', userId, updateData);

      expect(result).toEqual(mockUpdatedTransaction);
      expect(TransactionModel.findOneAndUpdate).toHaveBeenCalled();
    });

    /**
     * Test update of non-existent transaction
     * Ensures proper error handling when trying to update a transaction that doesn't exist
     */
    test('should throw NotFoundError if transaction does not exist', async () => {
      // Mock that no transaction is found
      (TransactionModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(updateTransaction('nonexistent', userId, { amount: 100 })).rejects.toThrow(
        NotFoundError,
      );
    });

    /**
     * Test validation for invalid amount in update
     * Ensures that updated amounts must be positive
     */
    test('should throw ValidationError if amount is not positive', async () => {
      await expect(updateTransaction('txn123', userId, { amount: 0 })).rejects.toThrow(
        ValidationError,
      );
    });
  });

  describe('deleteTransaction', () => {
    /**
     * Test successful transaction deletion
     * Verifies that a transaction can be deleted successfully
     */
    test('should successfully delete a transaction', async () => {
      // Mock deleted transaction data
      const mockDeletedTransaction = {
        _id: 'txn123',
        userId,
        amount: 100,
        isDeleted: true,
      };

      // Mock successful delete operation
      (TransactionModel.findOneAndDelete as jest.Mock).mockResolvedValue(mockDeletedTransaction);

      const result = await deleteTransaction('txn123', userId);

      expect(result).toEqual(mockDeletedTransaction);
    });

    /**
     * Test deletion of non-existent transaction
     * Ensures proper error handling when trying to delete a transaction that doesn't exist
     */
    test('should throw NotFoundError if transaction does not exist', async () => {
      // Mock that no transaction is found to delete
      (TransactionModel.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      await expect(deleteTransaction('nonexistent', userId)).rejects.toThrow(NotFoundError);
    });
  });
});
