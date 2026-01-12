import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // logs only errors
    new winston.transports.File({ filename: 'logs/combined.log' }), // logs all levels (info, warn, error)
  ],
});

export default logger;
