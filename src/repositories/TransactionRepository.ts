import Transaction from '@models/Transaction';
import { ITransaction } from '@transaction/types';

/**
 * Transaction Repository
 * Handles all database operations for Transaction model
 */
export class TransactionRepository {
  /**
   * Find transaction by ID
   */
  async findById(transactionId: string): Promise<ITransaction | null> {
    return await Transaction.findById(transactionId);
  }

  /**
   * Find transaction by ID and user ID
   */
  async findByIdAndUserId(transactionId: string, userId: string): Promise<ITransaction | null> {
    return await Transaction.findOne({ _id: transactionId, userId });
  }

  /**
   * Find all transactions for a user with pagination and filters
   */
  async findByUserId(
    userId: string,
    limit: number,
    offset: number,
    transactionType?: 'income' | 'expense',
  ): Promise<{ total: number; transactions: ITransaction[] }> {
    const filter: any = { userId, isDeleted: false };

    if (transactionType) {
      filter.type = transactionType;
    }

    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip(offset)
      .limit(limit)
      .populate('categoryId', 'name');

    return { total, transactions };
  }

  /**
   * Create a new transaction
   */
  async create(transactionData: any): Promise<ITransaction> {
    return await Transaction.create(transactionData);
  }

  /**
   * Update transaction by ID and user ID
   */
  async update(
    transactionId: string,
    userId: string,
    updateData: Partial<ITransaction>,
  ): Promise<ITransaction | null> {
    return await Transaction.findOneAndUpdate(
      { _id: transactionId, userId, isDeleted: false },
      updateData,
      { new: true, runValidators: true },
    );
  }

  /**
   * Delete transaction by ID and user ID
   */
  async delete(transactionId: string, userId: string): Promise<ITransaction | null> {
    return await Transaction.findOneAndDelete({ _id: transactionId, userId });
  }

  /**
   * Aggregate transactions for analytics
   */
  async aggregate(pipeline: any[]): Promise<any[]> {
    return await Transaction.aggregate(pipeline);
  }
}
