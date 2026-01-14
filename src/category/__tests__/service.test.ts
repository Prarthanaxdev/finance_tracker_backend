import { createCategory, updateCategory } from '../../services/index';
import { ValidationError } from '../../utils/errors';

jest.mock('../../models/index');

describe('Category Service', () => {
  describe('createCategory', () => {
    test('should throw ValidationError if name or type is missing', async () => {
      await expect(createCategory('userId', '', 'expense')).rejects.toThrow(ValidationError);
      await expect(createCategory('userId', 'Food', '')).rejects.toThrow(ValidationError);
    });
  });

  describe('updateCategory', () => {
    test('should throw ValidationError if name is provided without type', async () => {
      await expect(updateCategory('categoryId', 'userId', { name: 'Food' })).rejects.toThrow(ValidationError);
    });
    test('should throw ValidationError if type is provided without name', async () => {
      await expect(updateCategory('categoryId', 'userId', { type: 'expense' })).rejects.toThrow(ValidationError);
    });
  });
});
