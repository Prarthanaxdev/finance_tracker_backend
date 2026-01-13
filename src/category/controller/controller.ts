import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../auth/types';
import { CategoryApplicationService } from '../../services/application/CategoryApplicationService';

const categoryAppService = new CategoryApplicationService();

/**
 * Add a new category for the authenticated user
 * route: POST /categories
 */
export const AddCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const { name, type, description } = req.body;

    const newCategory = await categoryAppService.createCategory(
      req.user._id,
      name,
      type,
      description,
    );

    res.status(201).json({
      success: true,
      message: 'Category added successfully',
      data: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all categories for the authenticated user
 * route: GET /categories
 */
export const GetCategories = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const categories = await categoryAppService.getUserCategories(req.user._id, limit, offset);

    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing category for the authenticated user
 * route: PUT /categories/:id
 */
export const UpdateCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const { id } = req.params;
    const { name, type, description } = req.body;

    const updatedCategory = await categoryAppService.updateCategory(id, req.user._id, {
      name,
      type,
      description,
    });

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};
