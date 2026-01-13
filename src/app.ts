import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './auth/routes/routes';
import categoryRoutes from './category/routes/routes';
import transactionRoutes from './transaction/routes/routes';
import dashboardRoutes from './dashboard/routes/routes';
import { errorHandler } from './middleware/errorHandler';
import morganMiddleware from './middleware/morganMiddleware';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(morganMiddleware);
app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).send('Finance Tracker API is running!');
});

app.use('/api/', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

export default app;
