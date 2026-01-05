import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './auth/routes';
import categoryRoutes from './category/routes';
import transactionRoutes from './transaction/routes';
import dashboardRoutes from './dashboard/routes';
import connectDB from './config/db';

dotenv.config();

const app = express();

// Middleware
const corsOptions = {
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route to test server
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Finance Tracker API is running!' });
});

// Routes
app.use('/api/', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Start server (connect to DB first)
const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
