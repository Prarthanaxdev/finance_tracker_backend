import { TransactionRepository } from '../../repositories/TransactionRepository';
import mongoose from 'mongoose';
import { ValidationError } from '../../utils/errors';

/**
 * Analytics Domain Service
 * Contains pure business logic for analytics and aggregations
 */
export class AnalyticsDomainService {
  private transactionRepository: TransactionRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
  }

  /**
   * Gets monthly summary for a user
   */
  async getMonthlySummary(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const endOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

    const summary = await this.transactionRepository.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          isDeleted: false,
          createdAt: { $gte: startOfMonth, $lt: endOfMonth },
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

    summary.forEach((item: any) => {
      if (item._id === 'income') {
        income = item.totalAmount;
      } else if (item._id === 'expense') {
        expense = item.totalAmount;
      }
    });

    return { income, expense, balance: income - expense };
  }

  /**
   * Gets monthly trends for a specific year
   */
  async getMonthlyTrends(userId: string, year: number) {
    if (!year) {
      throw new ValidationError('Year query parameter is required');
    }

    const startOfYear = new Date(Date.UTC(year, 0, 1));
    const endOfYear = new Date(Date.UTC(year + 1, 0, 1));

    const data = await this.transactionRepository.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          isDeleted: false,
          createdAt: { $gte: startOfYear, $lt: endOfYear },
        },
      },
      {
        $group: {
          _id: { month: { $month: '$createdAt' } },
          income: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] },
          },
          expense: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] },
          },
        },
      },
      { $sort: { '_id.month': 1 } },
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
      const found = data.find((d: any) => d._id.month === index + 1);
      return {
        month: name,
        income: found?.income || 0,
        expense: found?.expense || 0,
      };
    });

    return result;
  }

  /**
   * Gets category breakdown for current month
   */
  async getCategoryBreakdown(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const endOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

    const breakdown = await this.transactionRepository.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: 'expense',
          isDeleted: false,
          createdAt: { $gte: startOfMonth, $lt: endOfMonth },
        },
      },
      {
        $lookup: {
          from: 'categories',
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

    return breakdown;
  }
}
