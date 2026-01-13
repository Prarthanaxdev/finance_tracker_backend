import { AuthApplicationService } from '@services/application/AuthApplicationService';
import { CategoryApplicationService } from '@services/application/CategoryApplicationService';
import { TransactionApplicationService } from '@services/application/TransactionApplicationService';
import { DashboardApplicationService } from '@services/application/DashboardApplicationService';

// Auth service wrappers
const authService = new AuthApplicationService();
export const registerUser = (email: string, password: string) =>
  authService.registerUser(email, password);
export const loginUser = (email: string, password: string) =>
  authService.loginUser(email, password);

// Category service wrappers
const categoryService = new CategoryApplicationService();
export const createCategory = (userId: string, name: string, type: string, description?: string) =>
  categoryService.createCategory(userId, name, type, description);
export const getUserCategories = (userId: string, limit: number, offset: number) =>
  categoryService.getUserCategories(userId, limit, offset);
export const updateCategory = (
  categoryId: string,
  userId: string,
  updateData: { name?: string; type?: 'income' | 'expense'; description?: string },
) => categoryService.updateCategory(categoryId, userId, updateData);
export const deleteCategory = (categoryId: string, userId: string) =>
  categoryService.deleteCategory(categoryId, userId);

// Transaction service wrappers
const transactionService = new TransactionApplicationService();
export const createTransaction = (transactionData: any) =>
  transactionService.createTransaction(transactionData);
export const getUserTransactions = (
  userId: string,
  limit: number,
  offset: number,
  transactionType?: 'income' | 'expense',
) => transactionService.getUserTransactions(userId, limit, offset, transactionType);
export const updateTransaction = (transactionId: string, userId: string, updateData: any) =>
  transactionService.updateTransaction(transactionId, userId, updateData);
export const deleteTransaction = (transactionId: string, userId: string) =>
  transactionService.deleteTransaction(transactionId, userId);

// Dashboard service wrappers
const dashboardService = new DashboardApplicationService();
export const getMonthlySummary = (userId: string) => dashboardService.getMonthlySummary(userId);
export const getMonthlyTrends = (userId: string, year: number) =>
  dashboardService.getMonthlyTrends(userId, year);
export const getCategoryBreakdown = (userId: string) =>
  dashboardService.getCategoryBreakdown(userId);
