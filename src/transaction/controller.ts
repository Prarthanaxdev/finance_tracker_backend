import { Response } from 'express';
import { AuthRequest } from '../auth/auth.types';
import TransactionModel from './transaction.model';

export const AddTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: 'Unauthorized',
      });
      return;
    }

    const { amount, type, categoryId, description } = req.body;
    if (!amount || !type || !categoryId) {
      res.status(400).json({
        message: 'Amount, type, categoryId are required',
      });
      return;
    }

    const newTransaction = await TransactionModel.create({
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
    res.status(500).json({
      message: 'Server Error',
    });
  }
};

export const GetTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(400).json({
        message: 'Unauthorized',
      });
      return;
    }
    const transactions = await TransactionModel.find({
      userId: req.user._id,
      isDeleted: false,
    }).sort({ date: -1 });
    res.status(200).json({
      message: 'Transactions retrieved successfully',
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
    });
  }
};

export const DeleteTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: 'Unauthorized',
      });
      return;
    }
    const { id } = req.params;
    const transaction = await TransactionModel.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { isDeleted: true },
      { new: true },
    );
    if (!transaction) {
      res.status(404).json({
        message: 'Transaction not found',
      });
      return;
    }
    res.status(200).json({
      message: 'Transaction deleted successfully',
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
    });
  }
};

export const UpdateTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: 'Unauthorized',
      });
      return;
    }
    const { id } = req.params;
    const { amount, type, categoryId, date, description } = req.body;

    const updatedTransaction = await TransactionModel.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { amount, type, categoryId, date, description },
      { new: true },
    );
    if (!updatedTransaction) {
      res.status(404).json({
        message: 'Transaction not found',
      });
      return;
    }
    res.status(200).json({
      message: 'Transaction updated successfully',
      data: updatedTransaction,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
    });
  }
};
