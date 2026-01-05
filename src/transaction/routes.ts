import express, { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import {
  AddTransaction,
  GetTransactions,
  UpdateTransaction,
  DeleteTransaction,
} from './controller';

const router: Router = express.Router();

router.post('/', authMiddleware, AddTransaction);
router.get('/', authMiddleware, GetTransactions);
router.put('/:id', authMiddleware, UpdateTransaction);
router.delete('/:id', authMiddleware, DeleteTransaction);

export default router;
