import express, { Router } from 'express';
import { authMiddleware } from '@middleware/authMiddleware';
import { GetSummary, GetMonthlyTrends, CategoryBreakdown } from '../controller/controller';
const router: Router = express.Router();

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get financial summary for authenticated user
 *     description: Returns total income, total expense, and net balance for the user
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Financial summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalIncome:
 *                       type: number
 *                       example: 5000
 *                     totalExpense:
 *                       type: number
 *                       example: 2000
 *                     netBalance:
 *                       type: number
 *                       example: 3000
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 */
router.get('/summary', authMiddleware, GetSummary);

/**
 * @swagger
 * /api/dashboard/monthly-trend:
 *   get:
 *     summary: Get monthly income and expense trends
 *     description: Returns month-by-month breakdown of income and expenses for the past year
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly trends retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: "2025-12"
 *                       income:
 *                         type: number
 *                         example: 5000
 *                       expense:
 *                         type: number
 *                         example: 2000
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 */
router.get('/monthly-trend', authMiddleware, GetMonthlyTrends);

/**
 * @swagger
 * /api/dashboard/category-breakdown:
 *   get:
 *     summary: Get expense breakdown by category
 *     description: Returns percentage and amount spent in each expense category
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category breakdown retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                         example: Groceries
 *                       amount:
 *                         type: number
 *                         example: 500
 *                       percentage:
 *                         type: number
 *                         example: 25
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 */
router.get('/category-breakdown', authMiddleware, CategoryBreakdown);

export default router;
