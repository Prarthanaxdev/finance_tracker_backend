import { TransactionDomainService } from '@services/domain/TransactionDomainService';
import { CategoryDomainService } from '@services/domain/CategoryDomainService';

export class TransactionApplicationService {
  private transactionDomainService: TransactionDomainService;
  private categoryDomainService: CategoryDomainService;

  constructor() {
    this.transactionDomainService = new TransactionDomainService();
    this.categoryDomainService = new CategoryDomainService();
  }

  /**
   * transaction creation workflow
   * 1. Validate category exists (cross-entity check)
   * 2. Create transaction (domain logic)
   */
  async createTransaction(transactionData: any) {
    await this.categoryDomainService.validateCategoryExists(transactionData.categoryId);
    return await this.transactionDomainService.createTransaction(transactionData);
  }

  /**
   * Retrieves user transactions with filters
   */
  async getUserTransactions(
    userId: string,
    limit: number,
    offset: number,
    transactionType?: 'income' | 'expense',
  ) {
    return await this.transactionDomainService.getUserTransactions(
      userId,
      limit,
      offset,
      transactionType,
    );
  }

  /**
   * transaction update workflow
   */
  async updateTransaction(transactionId: string, userId: string, updateData: any) {
    if (updateData.categoryId) {
      await this.categoryDomainService.validateCategoryExists(updateData.categoryId);
    }

    return await this.transactionDomainService.updateTransaction(transactionId, userId, updateData);
  }

  /**
   * Deletes a transaction
   */
  async deleteTransaction(transactionId: string, userId: string) {
    return await this.transactionDomainService.deleteTransaction(transactionId, userId);
  }
}
