import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://default:IakPNoYpRDIFyvZlKTXSRSocmCLiKecx@shinkansen.proxy.rlwy.net:40522', {
  enableReadyCheck: false,
  maxRetriesPerRequest: 3,
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export default redis;