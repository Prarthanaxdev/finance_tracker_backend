import { Response, NextFunction } from 'express';
import { AuthRequest } from '@auth/types';
import { TransactionApplicationService } from '@services/application/TransactionApplicationService';

const transactionAppService = new TransactionApplicationService();

export const AddTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { amount, type, categoryId, description } = req.body;
    if (!amount || !type || !categoryId) {
      res.status(400).json({ message: 'Amount, type, categoryId are required' });
      return;
    }

    const newTransaction = await transactionAppService.createTransaction({
      userId: req.user._id,
      amount,
      type,
      categoryId,
      description,
    });

    res.status(201).json({
      message: 'Transaction added successfully',
      data: newTransaction,
    });
  } catch (error) {
    next(error);
  }
};

export const GetTransactions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const limit = parseInt(req.query.limit as string, 10) || 10;
    const offset = parseInt(req.query.offset as string, 10) || 0;
    const transactionType =
      req.query.type === 'income' || req.query.type === 'expense'
        ? (req.query.type as 'income' | 'expense')
        : undefined;

    const transactions = await transactionAppService.getUserTransactions(
      req.user._id,
      limit,
      offset,
      transactionType,
    );

    res.status(200).json({
      message: 'Transactions retrieved successfully',
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

export const DeleteTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const transaction = await transactionAppService.deleteTransaction(id, req.user._id);

    res.status(200).json({
      message: 'Transaction deleted successfully',
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

export const UpdateTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { amount, type, categoryId, date, description } = req.body;

    const updatedTransaction = await transactionAppService.updateTransaction(id, req.user._id, {
      amount,
      type,
      categoryId,
      date,
      description,
    });

    res.status(200).json({
      message: 'Transaction updated successfully',
      data: updatedTransaction,
    });
  } catch (error) {
    next(error);
  }
};
