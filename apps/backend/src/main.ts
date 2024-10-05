import { athleteRoutes } from './routes/athleteRoutes';
import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';


const app = new Hono();
const prisma = new PrismaClient();

app.route('/athletes', athleteRoutes);

app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.text('Internal Server Error', 500);
});

import { serve } from '@hono/node-server';
const port = 4000;

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
