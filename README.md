# Finance Tracker - Backend

This is the backend API for the Personal Finance Tracker application.

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Create `.env` file** in the backend folder:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/finance-tracker
   NODE_ENV=development
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── auth/              # Authentication routes, controllers, models, and services
├── category/          # Category management
├── dashboard/         # Dashboard data and analytics
├── transaction/       # Transaction CRUD operations
├── config/            # Configuration files (database, logger, Swagger, keys)
├── middleware/        # Express middleware (auth, error handling, logging)
├── utils/             # Utility functions and custom error classes
├── validations/       # Input validation schemas
└── server.ts          # Main application entry point
```

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Bcryptjs** - Password hashing
- **Helmet** - Security headers
- **Morgan** - HTTP request logging
- **Winston** - Application logging

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token

### Transactions

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Dashboard

- `GET /api/dashboard` - Get dashboard summary and analytics

## Author

Prarthana Bahuguna
