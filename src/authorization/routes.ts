import express, { Router } from 'express';
import { SigninUser, SignupUser } from './controller';

const router: Router = express.Router();

router.post('/signup', SignupUser);
router.post('/signin', SigninUser);

export default router;
