import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './keys';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Tracker API',
      version: '1.0.0',
      description: 'REST API for personal finance tracking application',
      contact: {
        name: 'API Support',
        email: 'support@financetracker.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Path to API docs (all route files)
  apis: ['./src/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
