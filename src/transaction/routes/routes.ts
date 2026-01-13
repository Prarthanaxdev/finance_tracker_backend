import express, { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import {
  AddTransaction,
  GetTransactions,
  DeleteTransaction,
  UpdateTransaction,
} from '../controller/controller';
import { validateRequest } from '../../validations/validator';
import { CreateTransactionSchema, UpdateTransactionSchema } from '../../validations/schema';

const router: Router = express.Router();

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     description: Add a new income or expense transaction for the authenticated user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryId
 *               - amount
 *               - type
 *               - date
 *             properties:
 *               categoryId:
 *                 type: string
 *                 description: MongoDB ObjectId of the category
 *                 example: "507f1f77bcf86cd799439011"
 *               amount:
 *                 type: number
 *                 description: Transaction amount (must be positive)
 *                 example: 150.50
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: expense
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: ISO format date string
 *                 example: "2025-01-08T10:30:00Z"
 *               description:
 *                 type: string
 *                 description: Optional transaction description
 *                 example: "Grocery shopping at market"
 *     responses:
 *       201:
 *         description: Transaction created successfully
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
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, validateRequest(CreateTransactionSchema), AddTransaction);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions for authenticated user
 *     description: Retrieve list of all income and expense transactions with optional filtering
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         description: Filter by transaction type (optional)
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filter by category ID (optional)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter transactions from this date (optional)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter transactions until this date (optional)
 *     responses:
 *       200:
 *         description: List of transactions retrieved successfully
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
 *                       _id:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       type:
 *                         type: string
 *                       category:
 *                         type: string
 *                       date:
 *                         type: string
 *                       description:
 *                         type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, GetTransactions);

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Update a transaction
 *     description: Modify an existing transaction for the authenticated user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *               amount:
 *                 type: number
 *                 example: 200.75
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               date:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaction updated successfully
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
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */
router.put('/:id', authMiddleware, validateRequest(UpdateTransactionSchema), UpdateTransaction);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     description: Remove a transaction for the authenticated user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */
router.delete('/:id', authMiddleware, DeleteTransaction);

export default router;
