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
      const data = await c.req.json<CreateAthleteDto>();
      const athlete = await this.athleteService.createAthlete(data);
      await this.invalidateCache();
      return c.json(athlete, 201);
    } catch (error) {
      return this.handleError(error, 'Failed to create athlete');
    }
  }

  async getAllAthletes(c: Context) {
    try {
      const cachedAthletes = await this.getCachedAthletes();
      if (cachedAthletes) {
        return c.json(cachedAthletes);
      }

      const athletes = await this.athleteService.getAllAthletes();
      await this.cacheAthletes(athletes);
      return c.json(athletes);
    } catch (error) {
      return this.handleError(error, 'Failed to fetch athletes');
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
      const data = await c.req.json<UpdateAthleteDto>();
      const athlete = await this.athleteService.updateAthlete(id, data);
      await this.invalidateCache();
      return c.json(athlete);
    } catch (error) {
      return this.handleError(error, 'Failed to update athlete');
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

  private async getCachedAthletes() {
    const redisClient = await getRedisClient();
    const cachedAthletes = await redisClient.get('athletes');
    return cachedAthletes ? JSON.parse(cachedAthletes) : null;
  }

  private async cacheAthletes(athletes: any) {
    const redisClient = await getRedisClient();
    await redisClient.setex('athletes', CACHE_EXPIRATION, JSON.stringify(athletes));
  }

  private async invalidateCache() {
    const redisClient = await getRedisClient();
    await redisClient.del('athletes');
  }

  private handleError(error: unknown, defaultMessage: string) {
    if (error instanceof APIError) throw error;
    throw new APIError(defaultMessage, 500);
  }
}