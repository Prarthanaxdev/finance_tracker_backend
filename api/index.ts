import 'module-alias/register';
import serverless from 'serverless-http';
import app from '../src/app';
import connectDB from '../src/config/db';

let isConnected = false;

async function connectOnce() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
    console.log('MongoDB connected');
  }
}

const handler = serverless(app);

export default async function (req: any, res: any) {
  await connectOnce(); // ensure DB once per lambda
  return handler(req, res);
}
