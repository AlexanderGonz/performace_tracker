import { AthleteController } from '../interfaces/http/controllers/AthleteController';
import { AthleteService } from '../application/services/AthleteService';
import { APIError } from '../utils/errors';
import { getRedisClient } from '../infrastructure/cache/redisClient';
import { AthleteRepository } from 'apps/backend/src/domain/repositories/AthleteRepository';
import { AthleteBuilder } from 'apps/backend/src/domain/entities/AtheleteBuilder';

// Mock dependencies
jest.mock('../application/services/AthleteService');
jest.mock('../infrastructure/cache/redisClient');

describe('AthleteController', () => {
  let athleteController: AthleteController;
  let mockAthleteService: jest.Mocked<AthleteService>;
  let mockContext: any;
  let mockRedisClient: any;

  beforeEach(() => {
    const mockAthleteRepository = {} as jest.Mocked<AthleteRepository>;
    mockAthleteService = new AthleteService(mockAthleteRepository) as jest.Mocked<AthleteService>;
    athleteController = new AthleteController(mockAthleteService);
    mockContext = {
      req: {
        json: jest.fn(),
        param: jest.fn(),
      },
      json: jest.fn(),
    };
    mockRedisClient = {
      get: jest.fn(),
      setex: jest.fn(),
      del: jest.fn(),
    };
    (getRedisClient as jest.Mock).mockResolvedValue(mockRedisClient);
  });

  describe('createAthlete', () => {
    it('should create an athlete and return 201 status', async () => {
      const mockData = { name: 'John Doe', age: 25, team: 'Test Team' };
      const mockAthlete = new AthleteBuilder()
        .withId('1')
        .withName(mockData.name)
        .withAge(mockData.age)
        .withTeam(mockData.team)
        .build();
      mockContext.req.json.mockResolvedValue(mockData);
      mockAthleteService.createAthlete.mockResolvedValue(mockAthlete);

      await athleteController.createAthlete(mockContext);

      expect(mockAthleteService.createAthlete).toHaveBeenCalledWith(mockData);
      expect(mockContext.json).toHaveBeenCalledWith(mockAthlete, 201);
      expect(mockRedisClient.del).toHaveBeenCalledWith('athletes');
    });

    it('should handle errors', async () => {
      mockContext.req.json.mockRejectedValue(new Error('Invalid data'));

      await expect(athleteController.createAthlete(mockContext)).rejects.toThrow(APIError);
    });
  });

  describe('getAllAthletes', () => {
    it('should return cached athletes if available', async () => {
      const cachedAthletes = [{ id: '1', name: 'John Doe' }];
      mockRedisClient.get.mockResolvedValue(JSON.stringify(cachedAthletes));

      await athleteController.getAllAthletes(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(cachedAthletes);
      expect(mockAthleteService.getAllAthletes).not.toHaveBeenCalled();
    });

    it('should fetch and cache athletes if not in cache', async () => {
      const athletes = [new AthleteBuilder()
        .withId('1')
        .withName('John Doe')
        .withAge(25)
        .withTeam('Test Team')
        .build()];
      mockRedisClient.get.mockResolvedValue(null);
      mockAthleteService.getAllAthletes.mockResolvedValue(athletes);

      await athleteController.getAllAthletes(mockContext);

      expect(mockAthleteService.getAllAthletes).toHaveBeenCalled();
      expect(mockContext.json).toHaveBeenCalledWith(athletes);
      expect(mockRedisClient.setex).toHaveBeenCalledWith('athletes', 300, JSON.stringify(athletes));
    });
  });

  describe('getAthleteById', () => {
    it('should return an athlete by id', async () => {
      const mockAthlete = new AthleteBuilder()
        .withId('1')
        .withName('John Doe')
        .withAge(25)
        .withTeam('Test Team')
        .build();
      mockContext.req.param.mockReturnValue('1');
      mockAthleteService.getAthleteById.mockResolvedValue(mockAthlete);

      await athleteController.getAthleteById(mockContext);

      expect(mockAthleteService.getAthleteById).toHaveBeenCalledWith('1');
      expect(mockContext.json).toHaveBeenCalledWith(mockAthlete);
    });

    it('should handle errors', async () => {
      mockContext.req.param.mockReturnValue('1');
      mockAthleteService.getAthleteById.mockRejectedValue(new Error('Athlete not found'));

      await expect(athleteController.getAthleteById(mockContext)).rejects.toThrow(APIError);
    });
  });

  describe('updateAthlete', () => {
    it('should update an athlete and invalidate cache', async () => {
      const mockData = { name: 'Updated Name' };
      const mockAthlete = new AthleteBuilder()
        .withId('1')
        .withName(mockData.name)
        .withAge(25)
        .withTeam('Test Team')
        .build();
      mockContext.req.param.mockReturnValue('1');
      mockContext.req.json.mockResolvedValue(mockData);
      mockAthleteService.updateAthlete.mockResolvedValue(mockAthlete);

      await athleteController.updateAthlete(mockContext);

      expect(mockAthleteService.updateAthlete).toHaveBeenCalledWith('1', mockData);
      expect(mockContext.json).toHaveBeenCalledWith(mockAthlete);
      expect(mockRedisClient.del).toHaveBeenCalledWith('athletes');
    });
  });

  describe('deleteAthlete', () => {
    it('should delete an athlete and invalidate cache', async () => {
      mockContext.req.param.mockReturnValue('1');

      const result = await athleteController.deleteAthlete(mockContext);

      expect(mockAthleteService.deleteAthlete).toHaveBeenCalledWith('1');
      expect(mockRedisClient.del).toHaveBeenCalledWith('athletes');
      expect(result.status).toBe(204);
    });
  });
});