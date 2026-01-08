import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './auth/routes/routes';
import categoryRoutes from './category/routes/routes';
import transactionRoutes from './transaction/routes/routes';
import dashboardRoutes from './dashboard/routes/routes';
import connectDB from './config/db';
import config from './config/keys';
import { errorHandler } from './middleware/errorHandler';
import morganMiddleware from './middleware/morganMiddleware';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

dotenv.config();

const app = express();

// Middleware
app.use(helmet()); // Security headers
const corsOptions = {
  origin: config.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);

// Swagger documentation route
app.use('/api-docs', ...(swaggerUi.serve as any));
app.get('/api-docs', swaggerUi.setup(swaggerSpec) as any);

// Basic route to test server
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Finance Tracker API is running!' });
});

// Routes
app.use('/api/', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);
// Error handling middleware
app.use(errorHandler);

// Start server (connect to DB first)
const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    const PORT = config.PORT;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
