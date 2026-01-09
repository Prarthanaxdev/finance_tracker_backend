import { z } from 'zod';

// ============== AUTH SCHEMAS ==============

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// ============== CATEGORY SCHEMAS ==============

export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Name required').max(50),
  type: z.enum(['income', 'expense']),
  description: z.string().optional(),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

// ============== TRANSACTION SCHEMAS ==============

export const CreateTransactionSchema = z.object({
  categoryId: z.string().min(1, 'Category ID required'),
  amount: z.number().positive('Amount must be > 0'),
  type: z.enum(['income', 'expense']),
  description: z.string().optional(),
});

export const UpdateTransactionSchema = CreateTransactionSchema.partial();

// ============== TYPES ==============

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
