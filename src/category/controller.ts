import { Response } from 'express';
import CategoryModel from '../models/Category';
import { AuthRequest } from '../types';

export const AddCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const { name, type, description } = req.body;
    if (!name || !type) {
      res.status(400).json({
        success: false,
        message: 'Name and type are required',
      });
      return;
    }

    const existingCategory = await CategoryModel.findOne({
      userId: req.user._id,
      name,
    });

    if (existingCategory) {
      res.status(409).json({
        success: false,
        message: 'Category with this name already exists',
      });
      return;
    }

    const newCategory = await CategoryModel.create({
      userId: req.user._id,
      name,
      type,
      description,
    });
    res.status(201).json({
      success: true,
      message: 'Category added successfully',
      data: newCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

export const GetCategories = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(400).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const categories = await CategoryModel.find({ userId: req.user._id, isDeleted: false });

    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

export const UpdateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const category = await CategoryModel.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { name, type, description },
      { new: true },
    );

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};
