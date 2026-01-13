# Backend Deployment Guide for Vercel

## Quick Deployment Steps

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from backend directory**:
   ```bash
   cd "C:\Users\prarthanab\Documents\Finance Tracker\finance_tracker_backend"
   vercel --prod
   ```

4. **Set Environment Variables** in Vercel Dashboard:
   - Go to https://vercel.com/dashboard
   - Select your deployed project
   - Go to Settings > Environment Variables
   - Add these variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `PORT`: 3000
     - `CORS_ORIGIN`: Your frontend URL (or * for development)
     - `JWT_SECRET`: Your JWT secret key
     - `JWT_REFRESH_SECRET`: Your JWT refresh secret key

5. **Redeploy** after setting environment variables:
   ```bash
   vercel --prod
   ```

## Important Notes:

- Your API will be available at: `https://your-project-name.vercel.app/`
- Health check endpoint: `https://your-project-name.vercel.app/health`
- API routes: `https://your-project-name.vercel.app/api/...`

## Troubleshooting:

- If deployment fails, check the Function Logs in Vercel dashboard
- Ensure all environment variables are set correctly
- Make sure your MongoDB allows connections from Vercel (0.0.0.0/0)

## After Deployment:

- Test your API endpoints
- Update frontend environment variables to point to your deployed backend
- Configure CORS_ORIGIN to match your frontend domain