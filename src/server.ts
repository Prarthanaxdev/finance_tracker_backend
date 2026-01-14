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
import path from 'path';
import fs from 'fs';
import logger from './config/logger';

dotenv.config();

// Load Swagger spec: from JSDoc in dev, from static JSON in production
const getSwaggerSpec = () => {
  if (process.env.NODE_ENV === 'production') {
    const swaggerPath = path.join(__dirname, 'swagger.json');
    if (fs.existsSync(swaggerPath)) {
      return JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));
    }
  }
  return swaggerSpec;
};

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
app.use((req, __res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Swagger documentation route
app.use('/api-docs', ...(swaggerUi.serve as any));
app.get('/api-docs', swaggerUi.setup(getSwaggerSpec()) as any);

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
app.use((err: any, __req: Request, __res: Response, next: any) => {
  logger.error(err);
  next(err);
});
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
