import express, { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { GetSummary, GetMonthlyTrends, CategoryBreakdown } from './controller';

const router: Router = express.Router();

router.get('/summary', authMiddleware, GetSummary);
router.get('/monthly-trend', authMiddleware, GetMonthlyTrends);
router.get('/category-breakdown', authMiddleware, CategoryBreakdown);

export default router;
