import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from '../src/auth/routes/routes';
import categoryRoutes from '../src/category/routes/routes';
import transactionRoutes from '../src/transaction/routes/routes';
import dashboardRoutes from '../src/dashboard/routes/routes';
import connectDB from '../src/config/db';
import { config } from '../src/config/keys';
import { errorHandler } from '../src/middleware/errorHandler';
import morganMiddleware from '../src/middleware/morganMiddleware';

dotenv.config();

const app = express();

// Connect to database
connectDB().catch((error) => {
  console.error('Failed to connect to database:', error);
});

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: config.CORS_ORIGIN,
  credentials: true,
};
app.use(cors(corsOptions));

// Logging middleware
app.use(morganMiddleware);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Finance Tracker API',
    version: '1.0.0',
    status: 'running',
  });
});

// Error handling middleware
app.use(errorHandler);

export default app;
