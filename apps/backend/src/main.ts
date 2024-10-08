import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { PrismaClient } from '@prisma/client';
import { getRedisClient } from './infrastructure/cache/redisClient';
import { serve } from '@hono/node-server';
import { AthleteController } from './interfaces/http/controllers/AthleteController';
import { MetricController } from './interfaces/http/controllers/MetricController';
import { AthleteService } from './application/services/AthleteService';
import { MetricService } from './application/services/MetricService';
import { PrismaAthleteRepository } from './infrastructure/repositories/PrismaAthleteRepository';
import { PrismaMetricRepository } from './infrastructure/repositories/PrismaMetricRepository';
import { createAthleteRoutes } from './interfaces/http/routes/athleteRoutes';

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

// Create repositories
const athleteRepository = new PrismaAthleteRepository(prisma);
const metricRepository = new PrismaMetricRepository(prisma);

// Create services
const athleteService = new AthleteService(athleteRepository);
const metricService = new MetricService(metricRepository, athleteRepository);

// Create controllers
const athleteController = new AthleteController(athleteService);
const metricController = new MetricController(metricService);

// Create and use routes
const athleteRoutes = createAthleteRoutes(athleteController, metricController);
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

const port = parseInt(process.env.PORT || '4000');

Promise.all([prisma.$connect(), getRedisClient()])
  .then(() => {
    console.log('Connected to the database and Redis');
    serve({
      fetch: app.fetch,
      port
    });
    console.log(`Server is running on port ${port}`);
  })
  .catch((error) => {
    console.error('Failed to connect to the database or Redis:', error);
    process.exit(1);
  });