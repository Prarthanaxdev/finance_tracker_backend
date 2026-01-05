import { Response } from 'express';
import TransactionModel from '../transaction/transaction.model';
import { AuthRequest } from '../auth/auth.types';
import mongoose from 'mongoose';

const now = new Date();
const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
const endOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
export const GetSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const summary = await TransactionModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user._id),
          isDeleted: false,
          createdAt: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    let income = 0;
    let expense = 0;

    summary.forEach((item) => {
      if (item._id === 'income') {
        income = item.totalAmount;
      } else if (item._id === 'expense') {
        expense = item.totalAmount;
      }
    });

    res.status(200).json({
      success: true,
      message: 'Monthly summary retrieved successfully',
      data: {
        income,
        expense,
        balance: income - expense,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

export const GetMonthlyTrends = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const year = Number(req.query.year);
    if (!year) {
      res.status(400).json({
        success: false,
        message: 'Year query parameter is required',
      });
      return;
    }

    const startOfYear = new Date(Date.UTC(year, 0, 1));
    const endOfYear = new Date(Date.UTC(year + 1, 0, 1));

    const data = await TransactionModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user._id),
          isDeleted: false,
          createdAt: {
            $gte: startOfYear,
            $lt: endOfYear,
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: '$createdAt' } },
          income: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0],
            },
          },
        },
      },
      {
        $sort: { '_id.month': 1 },
      },
    ]);

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const result = months.map((name, index) => {
      const found = data.find((d) => d._id.month === index + 1);
      return {
        month: name,
        income: found?.income || 0,
        expense: found?.expense || 0,
      };
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

export const CategoryBreakdown = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const categoryBreakdown = await TransactionModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user._id),
          type: 'expense',
          isDeleted: false,
          createdAt: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
        },
      },
      {
        $lookup: {
          from: 'categories', // MongoDB collection name
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category.name',
          total: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          total: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.status(200).json({
      success: true,
      message: 'Category breakdown retrieved successfully',
      data: categoryBreakdown,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};
