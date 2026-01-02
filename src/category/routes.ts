import express, { Router } from 'express';
import { authMiddleware } from '../authMiddleware';
import { AddCategory, GetCategories } from './controller';

const router: Router = express.Router();

router.post('/', authMiddleware, AddCategory);
router.get('/', authMiddleware, GetCategories);

export default router;
