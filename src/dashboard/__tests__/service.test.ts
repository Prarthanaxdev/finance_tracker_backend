/**
 * Dashboard Service Test Suite
 *
 * This file tests the dashboard analytics functions including monthly summaries,
 * trends analysis, and category breakdowns. These functions use MongoDB aggregation
 * pipelines to generate financial insights from transaction data.
 */

import { getMonthlySummary, getMonthlyTrends, getCategoryBreakdown } from '@services/index';
import { Transaction as TransactionModel } from '@models/index';
import { ValidationError } from '@utils/errors';

// Mock the models
jest.mock('@models/index');

describe('Dashboard Service', () => {
  // Test user ID used across all test cases
  const userId = 'user123';

  // Clear all mocks after each test to ensure test isolation
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMonthlySummary', () => {
    /**
     * Test monthly summary calculation with both income and expenses
     * Verifies that the service correctly aggregates and calculates the balance
     */
    test('should return monthly income, expense, and balance', async () => {
      // Mock aggregation result with income and expense totals
      const mockAggregateResult = [
        { _id: 'income', totalAmount: 5000 },
        { _id: 'expense', totalAmount: 3000 },
      ];

      // Mock the MongoDB aggregation pipeline
      (TransactionModel.aggregate as jest.Mock).mockResolvedValue(mockAggregateResult);

      const result = await getMonthlySummary(userId);

      expect(result).toEqual({
        income: 5000,
        expense: 3000,
        balance: 2000,
      });
      expect(TransactionModel.aggregate).toHaveBeenCalled();
    });

    /**
     * Test handling of empty transaction history
     * Ensures that zero values are returned when user has no transactions
     */
    test('should return zero values if no transactions exist', async () => {
      // Mock empty aggregation result
      (TransactionModel.aggregate as jest.Mock).mockResolvedValue([]);

      const result = await getMonthlySummary(userId);

      expect(result).toEqual({
        income: 0,
        expense: 0,
        balance: 0,
      });
    });

    /**
     * Test handling of income-only transactions
     * Ensures correct calculation when user only has income transactions
     */
    test('should handle only income transactions', async () => {
      // Mock aggregation result with only income
      const mockAggregateResult = [{ _id: 'income', totalAmount: 5000 }];

      (TransactionModel.aggregate as jest.Mock).mockResolvedValue(mockAggregateResult);

      const result = await getMonthlySummary(userId);

      expect(result).toEqual({
        income: 5000,
        expense: 0,
        balance: 5000,
      });
    });

    /**
     * Test handling of expense-only transactions
     * Ensures correct calculation (negative balance) when user only has expenses
     */
    test('should handle only expense transactions', async () => {
      // Mock aggregation result with only expenses
      const mockAggregateResult = [{ _id: 'expense', totalAmount: 3000 }];

      (TransactionModel.aggregate as jest.Mock).mockResolvedValue(mockAggregateResult);

      const result = await getMonthlySummary(userId);

      expect(result).toEqual({
        income: 0,
        expense: 3000,
        balance: -3000,
      });
    });
  });

  describe('getMonthlyTrends', () => {
    /**
     * Test monthly trends generation for a full year
     * Verifies that the service returns data for all 12 months, filling in zeros for missing months
     */
    test('should return monthly trends for a given year', async () => {
      // Mock aggregation result with data for some months
      const mockAggregateResult = [
        { _id: { month: 1 }, income: 5000, expense: 3000 },
        { _id: { month: 2 }, income: 6000, expense: 4000 },
      ];

      (TransactionModel.aggregate as jest.Mock).mockResolvedValue(mockAggregateResult);

      const result = await getMonthlyTrends(userId, 2026);

      expect(result).toHaveLength(12);
      expect(result[0]).toEqual({ month: 'Jan', income: 5000, expense: 3000 });
      expect(result[1]).toEqual({ month: 'Feb', income: 6000, expense: 4000 });
      expect(result[2]).toEqual({ month: 'Mar', income: 0, expense: 0 });
    });

    /**
     * Test year parameter validation
     * Ensures that a valid year is required for trends analysis
     */
    test('should throw ValidationError if year is not provided', async () => {
      await expect(getMonthlyTrends(userId, 0)).rejects.toThrow(ValidationError);
    });

    /**
     * Test handling of year with no transaction data
     * Ensures all 12 months are returned with zero values when no data exists
     */
    test('should return all months with zero values if no data', async () => {
      // Mock empty aggregation result
      (TransactionModel.aggregate as jest.Mock).mockResolvedValue([]);

      const result = await getMonthlyTrends(userId, 2026);

      expect(result).toHaveLength(12);
      expect(result.every((item: any) => item.income === 0 && item.expense === 0)).toBe(true);
    });
  });

  describe('getCategoryBreakdown', () => {
    /**
     * Test category breakdown generation
     * Verifies that expenses are grouped by category with totals for the current month
     */
    test('should return category breakdown for current month', async () => {
      // Mock aggregation result with category totals
      const mockAggregateResult = [
        { category: 'Food', total: 1500 },
        { category: 'Transport', total: 800 },
        { category: 'Entertainment', total: 500 },
      ];

      (TransactionModel.aggregate as jest.Mock).mockResolvedValue(mockAggregateResult);

      const result = await getCategoryBreakdown(userId);

      expect(result).toEqual(mockAggregateResult);
      expect(TransactionModel.aggregate).toHaveBeenCalled();
    });

    /**
     * Test handling of month with no expenses
     * Ensures empty array is returned when user has no expense transactions
     */
    test('should return empty array if no expenses exist', async () => {
      // Mock empty aggregation result
      (TransactionModel.aggregate as jest.Mock).mockResolvedValue([]);

      const result = await getCategoryBreakdown(userId);

      expect(result).toEqual([]);
    });

    /**
     * Test filtering by expense type
     * Verifies that only expense transactions are included in the breakdown (not income)
     */
    test('should only include expense type transactions', async () => {
      const mockAggregateResult = [{ category: 'Food', total: 1500 }];

      (TransactionModel.aggregate as jest.Mock).mockResolvedValue(mockAggregateResult);

      await getCategoryBreakdown(userId);

      const aggregateCall = (TransactionModel.aggregate as jest.Mock).mock.calls[0][0];
      const matchStage = aggregateCall.find((stage: any) => stage.$match);

      expect(matchStage.$match.type).toBe('expense');
    });
  });
});
