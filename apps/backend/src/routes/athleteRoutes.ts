import { Hono } from 'hono';
import {
  createAthlete,
  getAllAthletes,
  getAthleteById,
  updateAthlete,
  addMetric,
  getMetrics,
  deleteAthlete
} from '../controllers/athleteController';
import { getRedisClient } from '../config/cache';
import { APIError } from '../utils/errors';

const router = new Hono();

const CACHE_EXPIRATION = 60 * 5; // 5 minutes

// GET all athletes (with caching)
router.get('/', async (c) => {
  try {
    const redisClient = await getRedisClient();
    // Check cache first
    const cachedAthletes = await redisClient.get('athletes');
    if (cachedAthletes) {
      return c.json(JSON.parse(cachedAthletes));
    }

    // If not in cache, fetch from database using the controller
    const athletes = await getAllAthletes(c);
    
    // Store in cache
    await redisClient.setex('athletes', CACHE_EXPIRATION, JSON.stringify(athletes));
    
    return athletes;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Failed to fetch athletes', 500);
  }
});

// POST new athlete
router.post('/', async (c) => {
  try {
    const athlete = await createAthlete(c);
    // Invalidate cache
    const redisClient = await getRedisClient();
    await redisClient.del('athletes');
    return athlete;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Failed to create athlete', 500);
  }
});

// GET athlete by ID
router.get('/:id', getAthleteById);

// PUT update athlete
router.put('/:id', async (c) => {
  try {
    const athlete = await updateAthlete(c);
    // Invalidate cache
    const redisClient = await getRedisClient();
    await redisClient.del('athletes');
    return athlete;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Failed to update athlete', 500);
  }
});

// POST add metric to athlete
router.post('/:id/metrics', addMetric);

// GET metrics for athlete
router.get('/:id/metrics', getMetrics);

// DELETE athlete
router.delete('/:id', async (c) => {
  try {
    await deleteAthlete(c);
    // Invalidate cache
    const redisClient = await getRedisClient();
    await redisClient.del('athletes');
    return c.text('', 204);
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Failed to delete athlete', 500);
  }
});

export { router as athleteRoutes };