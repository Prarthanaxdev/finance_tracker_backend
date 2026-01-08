import { Types } from 'mongoose';

export interface ITransaction {
  userId: Types.ObjectId;
  categoryId: Types.ObjectId;
  id: Types.ObjectId;
  amount: number;
  type: 'income' | 'expense';
  date: Date;
  description?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
