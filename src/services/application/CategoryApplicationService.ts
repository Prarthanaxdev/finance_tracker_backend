import { CategoryDomainService } from '@services/domain/CategoryDomainService';

export class CategoryApplicationService {
  private categoryDomainService: CategoryDomainService;

  constructor() {
    this.categoryDomainService = new CategoryDomainService();
  }

  /**
   * category creation workflow
   * 1. Validate data
   * 2. Create category (domain logic handles duplicate check)
   */
  async createCategory(userId: string, name: string, type: string, description?: string) {
    // Validate and create through domain service
    this.categoryDomainService.validateCategoryData(name, type);
    return await this.categoryDomainService.createCategory(userId, name, type, description);
  }

  /**
   * Retrieves user categories with pagination
   */
  async getUserCategories(userId: string, limit: number, offset: number) {
    return await this.categoryDomainService.getUserCategories(userId, limit, offset);
  }

  /**
   * category update workflow
   * 1. Validate update data
   * 2. Update category (domain logic)
   */
  async updateCategory(
    categoryId: string,
    userId: string,
    updateData: { name?: string; type?: 'income' | 'expense'; description?: string },
  ) {
    this.categoryDomainService.validateCategoryUpdateData(updateData);
    return await this.categoryDomainService.updateCategory(categoryId, userId, updateData);
  }

  /**
   * Deletes a category
   */
  async deleteCategory(categoryId: string, userId: string) {
    return await this.categoryDomainService.deleteCategory(categoryId, userId);
  }
}
