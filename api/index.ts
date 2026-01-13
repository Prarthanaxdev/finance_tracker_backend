import 'module-alias/register';
import serverless from 'serverless-http';
import app from '../src/app';
import '../src/config/db';

export const handler = serverless(app);
