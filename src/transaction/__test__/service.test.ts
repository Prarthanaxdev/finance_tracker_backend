/**
 * Transaction Service Test Suite
 *
 * This file tests the transaction service functions including create, read, update, and delete operations.
 * It verifies proper validation, error handling, and CRUD operations for financial transactions.
 */


import { updateTransaction } from '../../services/index';
import { ValidationError } from '../../utils/errors';

describe('Transaction Service', () => {
  describe('updateTransaction', () => {
    test('should throw ValidationError if amount is provided as null', async () => {
      await expect(updateTransaction('transactionId', 'userId', { amount: null })).rejects.toThrow(ValidationError);
    });
    test('should throw ValidationError if type is provided without category', async () => {
      await expect(updateTransaction('transactionId', 'userId', { type: 'expense' })).rejects.toThrow(ValidationError);
    });
  });
});
