import { CategoryRepository } from '@repositories/CategoryRepository';
import { ValidationError, ConflictError, NotFoundError } from '@utils/errors';

/**
 * Category Domain Service
 * Contains pure business logic for category operations
 */
export class CategoryDomainService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  /**
   * Validates category data
   */
  validateCategoryData(name: string, type: string): void {
    if (!name || !type) {
      throw new ValidationError('Name and type are required');
    }
  }

  /**
   * Validates category update data
   */
  validateCategoryUpdateData(updateData: {
    name?: string;
    type?: string;
    description?: string;
  }): void {
    if (updateData.name || updateData.type) {
      if (!updateData.name || !updateData.type) {
        throw new ValidationError('Name and type are required');
      }
    }
  }

  /**
   * Checks if category with name exists for user
   */
  async checkCategoryExists(userId: string, name: string): Promise<boolean> {
    return await this.categoryRepository.existsByUserIdAndName(userId, name);
  }

  /**
   * Validates that a category exists by ID
   */
  async validateCategoryExists(categoryId: string): Promise<void> {
    const exists = await this.categoryRepository.existsById(categoryId);
    if (!exists) {
      throw new NotFoundError('Category not found');
    }
  }

  /**
   * Creates a new category
   */
  async createCategory(userId: string, name: string, type: string, description?: string) {
    const exists = await this.checkCategoryExists(userId, name);
    if (exists) {
      throw new ConflictError('Category with this name already exists');
    }

    const category = await this.categoryRepository.create({ userId, name, type, description });
    return category;
  }

  /**
   * Retrieves user categories with pagination
   */
  async getUserCategories(userId: string, limit: number, offset: number) {
    const result = await this.categoryRepository.findByUserId(userId, limit, offset);
    return { ...result, limit, offset };
  }

  /**
   * Updates a category
   */
  async updateCategory(
    categoryId: string,
    userId: string,
    updateData: { name?: string; type?: 'income' | 'expense'; description?: string },
  ) {
    const category = await this.categoryRepository.update(categoryId, userId, updateData);

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return category;
  }

  /**
   * Deletes a category
   */
  async deleteCategory(categoryId: string, userId: string) {
    const category = await this.categoryRepository.delete(categoryId, userId);

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return category;
  }
}
