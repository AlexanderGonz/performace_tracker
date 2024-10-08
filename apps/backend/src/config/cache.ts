import Redis from 'ioredis';

let redisClient: Redis | null = null;

export const getRedisClient = async (): Promise<Redis> => {
  if (redisClient === null) {
    const host = process.env.REDIS_HOST || 'redis';
    const port = parseInt(process.env.REDIS_PORT || '6379');

    console.log(`Attempting to connect to Redis at ${host}:${port}`);

    redisClient = new Redis({
      host,
      port,
      retryStrategy: (times) => {
        if (times > 3) {
          console.error(`Failed to connect to Redis after ${times} attempts`);
          return null; // stop retrying
        }
        return Math.min(times * 100, 3000); // wait for 100ms, 200ms, 300ms before retrying
      },
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error', err);
    });

    redisClient.on('connect', () => {
      console.log('Successfully connected to Redis');
    });

    // Wait for the connection to be established
    try {
      await redisClient.ping();
      console.log('Redis connection verified');
    } catch (error) {
      console.error('Failed to verify Redis connection:', error);
      throw error;
    }
  }

  return redisClient;
};