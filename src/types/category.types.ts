import { Types } from 'mongoose';

export interface ICategory {
  userId: Types.ObjectId;
  name: string;
  type: 'income' | 'expense';
  description?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
