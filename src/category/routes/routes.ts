import express, { Router } from 'express';
import { authMiddleware } from '@middleware/authMiddleware';
import * as CategoryController from '../controller/controller';
import { validateRequest } from '@validations/validator';
import { CreateCategorySchema } from '@validations/schema';

const router: Router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 example: Groceries
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: expense
 *               description:
 *                 type: string
 *                 example: Monthly grocery expenses
 *     responses:
 *       201:
 *         description: Category created successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  authMiddleware,
  validateRequest(CreateCategorySchema),
  CategoryController.AddCategory,
);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories for authenticated user
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, CategoryController.GetCategories);
export default router;
