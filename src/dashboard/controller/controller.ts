import { Response, NextFunction } from 'express';
import { AuthRequest } from '@auth/types';
import { DashboardApplicationService } from '@services/application/DashboardApplicationService';
import { UnauthorizedError, ValidationError } from '@utils/errors';
import { logger } from '@config/logger';

const dashboardAppService = new DashboardApplicationService();

export const GetSummary = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    logger.info('Fetching monthly summary', {
      userId: req.user._id,
    });

    const summary = await dashboardAppService.getMonthlySummary(req.user._id);

    logger.info('Monthly summary retrieved successfully', {
      userId: req.user._id,
      data: summary,
    });

    res.status(200).json({
      success: true,
      message: 'Monthly summary retrieved successfully',
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

export const GetMonthlyTrends = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    const year = Number(req.query.year);
    if (!year) {
      throw new ValidationError('Year query parameter is required');
    }

    logger.info('Fetching monthly trends', {
      userId: req.user._id,
      year,
    });

    const trends = await dashboardAppService.getMonthlyTrends(req.user._id, year);

    logger.info('Monthly trends retrieved successfully', {
      userId: req.user._id,
      year,
    });

    res.status(200).json({
      success: true,
      data: trends,
    });
  } catch (error) {
    next(error);
  }
};

export const CategoryBreakdown = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    logger.info('Fetching category breakdown', {
      userId: req.user._id,
    });

    const breakdown = await dashboardAppService.getCategoryBreakdown(req.user._id);

    logger.info('Category breakdown retrieved successfully', {
      userId: req.user._id,
      itemCount: breakdown.length,
    });

    res.status(200).json({
      success: true,
      message: 'Category breakdown retrieved successfully',
      data: breakdown,
    });
  } catch (error) {
    next(error);
  }
};
