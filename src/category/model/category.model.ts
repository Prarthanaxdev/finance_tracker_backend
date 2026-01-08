import mongoose, { Schema } from 'mongoose';
import { ICategory } from '../types';

const CategorySchema = new Schema<ICategory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

/* Prevent duplicate category names per user */
CategorySchema.index({ userId: 1, name: 1 }, { unique: true });

const CategoryModel = mongoose.model<ICategory>('Category', CategorySchema);
export default CategoryModel;
