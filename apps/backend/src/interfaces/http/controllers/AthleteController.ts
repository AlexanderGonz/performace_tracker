import { Context } from 'hono';
import { AthleteService } from '../../../application/services/AthleteService';
import { CreateAthleteDto, UpdateAthleteDto } from '../../../application/dtos/athleteDto';
import { getRedisClient } from '../../../infrastructure/cache/redisClient';
import { APIError } from '../../../utils/errors';

const CACHE_EXPIRATION = 60 * 5; // 5 minutes

export class AthleteController {
  constructor(private athleteService: AthleteService) {}

  async createAthlete(c: Context) {
    try {
      const data: CreateAthleteDto = await c.req.json();
      const athlete = await this.athleteService.createAthlete(data as any);
      const redisClient = await getRedisClient();
      await redisClient.del('athletes');
      return c.json(athlete, 201);
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError('Failed to create athlete', 500);
    }
  }

  async getAllAthletes(c: Context) {
    try {
      const redisClient = await getRedisClient();
      const cachedAthletes = await redisClient.get('athletes');
      if (cachedAthletes) {
        return c.json(JSON.parse(cachedAthletes));
      }

      const athletes = await this.athleteService.getAllAthletes();
      await redisClient.setex('athletes', CACHE_EXPIRATION, JSON.stringify(athletes));
      return c.json(athletes);
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError('Failed to fetch athletes', 500);
    }
  }

  async getAthleteById(c: Context) {
    try {
      const id = c.req.param('id');
      const athlete = await this.athleteService.getAthleteById(id);
      return c.json(athlete);
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError('Failed to get athlete', 500);
    }
  }

  async updateAthlete(c: Context) {
    try {
      const id = c.req.param('id');
      const data: UpdateAthleteDto = await c.req.json();
      const athlete = await this.athleteService.updateAthlete(id, data as any);
      const redisClient = await getRedisClient();
      await redisClient.del('athletes');
      return c.json(athlete);
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError('Failed to update athlete', 500);
    }
  }

  async deleteAthlete(c: Context) {
    try {
      const id = c.req.param('id');
      await this.athleteService.deleteAthlete(id);
      const redisClient = await getRedisClient();
      await redisClient.del('athletes');
      return c.text('', 204);
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError('Failed to delete athlete', 500);
    }
  }
}