import { athleteRoutes } from './routes/athleteRoutes';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { PrismaClient } from '@prisma/client';


const app = new Hono();
const prisma = new PrismaClient();

app.use('/*', cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}));

app.route('/athletes', athleteRoutes);

app.onError((err, c) => {
  console.error('Unhandled error:', err);
  
  if (err instanceof Error) {
    const statusCode = err['statusCode'] || 500;
    const message = err.message || 'Internal Server Error';
    return c.json({ error: message }, statusCode);
  }
  
  return c.json({ error: 'Internal Server Error' }, 500);
});

import { serve } from '@hono/node-server';
const port = parseInt(process.env.PORT || '4000');

prisma.$connect()
  .then(() => {
    console.log('Connected to the database');
    serve({
      fetch: app.fetch,
      port
    });
    console.log(`Server is running on port ${port}`);
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });
