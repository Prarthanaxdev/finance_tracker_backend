import CategoryModel from '../model/category.model';
import { ValidationError, ConflictError, NotFoundError } from '../../utils/errors';

/**
 *
 * @param userId
 * @param name
 * @param type
 * @param description
 * @returns
 */
export const createCategory = async (
  userId: string,
  name: string,
  type: string,
  description?: string,
) => {
  if (!name || !type) {
    throw new ValidationError('Name and type are required');
  }

  const existingCategory = await CategoryModel.findOne({
    userId,
    name,
  });

  if (existingCategory) {
    throw new ConflictError('Category with this name already exists');
  }

  const newCategory = await CategoryModel.create({
    userId,
    name,
    type,
    description,
  });

  return newCategory;
};

/**
 * @param userId
 * @returns
 */
export const getUserCategories = async (userId: string, limit: number, offset: number) => {
  const total = await CategoryModel.countDocuments({
    userId,
    isDeleted: false,
  });

  const categories = await CategoryModel.find({
    userId,
    isDeleted: false,
  })
    .limit(limit)
    .skip(offset);

  return {
    total,
    limit,
    offset,
    categories,
  };
};

/**
 * @param categoryId
 * @param userId
 * @param updateData
 * @returns
 */
export const updateCategory = async (
  categoryId: string,
  userId: string,
  updateData: { name?: string; type?: string; description?: string },
) => {
  if (updateData.name || updateData.type) {
    if (!updateData.name || !updateData.type) {
      throw new ValidationError('Name and type are required');
    }
  }

  const category = await CategoryModel.findOneAndUpdate({ _id: categoryId, userId }, updateData, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new NotFoundError('Category not found');
  }

  return category;
};

/**
 * @param categoryId
 * @param userId
 * @returns
 */
export const deleteCategory = async (categoryId: string, userId: string) => {
  const category = await CategoryModel.findOneAndDelete({
    _id: categoryId,
    userId,
  });

  if (!category) {
    throw new NotFoundError('Category not found');
  }

  return category;
};
