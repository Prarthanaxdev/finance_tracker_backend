import { TransactionRepository } from '@repositories/TransactionRepository';
import { ValidationError, NotFoundError } from '@utils/errors';

/**
 * Transaction Domain Service
 * Contains pure business logic for transaction operations
 */
export class TransactionDomainService {
  private transactionRepository: TransactionRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
  }

  /**
   * Validates transaction amount
   */
  validateAmount(amount: number): void {
    if (amount <= 0) {
      throw new ValidationError('Amount must be positive');
    }
  }

  /**
   * Creates a new transaction
   */
  async createTransaction(transactionData: any) {
    this.validateAmount(transactionData.amount);

    const transaction = await this.transactionRepository.create(transactionData);
    return transaction;
  }

  /**
   * Retrieves user transactions with filters and pagination
   */
  async getUserTransactions(
    userId: string,
    limit: number,
    offset: number,
    transactionType?: 'income' | 'expense',
  ) {
    const result = await this.transactionRepository.findByUserId(
      userId,
      limit,
      offset,
      transactionType,
    );
    return { ...result, limit, offset };
  }

  /**
   * Updates a transaction
   */
  async updateTransaction(transactionId: string, userId: string, updateData: any) {
    if (updateData.amount !== undefined) {
      this.validateAmount(updateData.amount);
    }

    const transaction = await this.transactionRepository.update(transactionId, userId, updateData);

    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    return transaction;
  }

  /**
   * Deletes a transaction
   */
  async deleteTransaction(transactionId: string, userId: string) {
    const transaction = await this.transactionRepository.delete(transactionId, userId);

    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    return transaction;
  }

  /**
   * Calculates balance from transactions
   */
  calculateBalance(transactions: any[]): number {
    return transactions.reduce((sum, t) => {
      return sum + (t.type === 'income' ? t.amount : -t.amount);
    }, 0);
  }
}
