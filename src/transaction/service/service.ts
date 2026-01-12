import TransactionModel from '../model/model';
import { ValidationError, NotFoundError } from '../../utils/errors';

export const createTransaction = async (transactionData: any) => {
  if (transactionData.amount <= 0) {
    throw new ValidationError('Amount must be positive');
  }

  const processedData = {
    ...transactionData,
  };

  // Database operation
  return await TransactionModel.create(processedData);
};

export const getUserTransactions = async (
  userId: string,
  limit: number,
  offset: number,
  transactionType?: 'income' | 'expense',
) => {
  const filter: any = {
    userId,
    isDeleted: false,
  };

  if (transactionType) {
    filter.type = transactionType;
  }

  const total = await TransactionModel.countDocuments(filter);

  const transactions = await TransactionModel.find(filter)
    .sort({ date: -1 })
    .skip(offset)
    .limit(limit)
    .populate('categoryId', 'name');

  return {
    total,
    limit,
    offset,
    transactions,
  };
};

export const deleteTransaction = async (transactionId: string, userId: string) => {
  const transaction = await TransactionModel.findOneAndDelete({
    _id: transactionId,
    userId,
  });

  if (!transaction) {
    throw new NotFoundError('Transaction not found');
  }

  return transaction;
};

export const updateTransaction = async (transactionId: string, userId: string, updateData: any) => {
  if (updateData.amount !== undefined && updateData.amount <= 0) {
    throw new ValidationError('Amount must be greater than zero');
  }

  const updatedTransaction = await TransactionModel.findOneAndUpdate(
    { _id: transactionId, userId, isDeleted: false },
    updateData,
    { new: true, runValidators: true },
  );

  if (!updatedTransaction) {
    throw new NotFoundError('Transaction not found');
  }

  return updatedTransaction;
};
