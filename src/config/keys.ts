import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['MONGODB_URI', 'PORT', 'CORS_ORIGIN', 'JWT_SECRET'];

const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}\n` +
      `Please add them to your .env file`,
  );
}

// Export validated configuration
export const config = {
  MONGODB_URI: process.env.MONGODB_URI as string,
  PORT: parseInt(process.env.PORT as string, 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export default config;
