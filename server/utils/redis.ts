import Redis from 'ioredis';

const runtimeConfig = useRuntimeConfig();

const redis = new Redis({
    host: runtimeConfig.redis.host,
    port: runtimeConfig.redis.port,
    retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

redis.on('error', (error) => {
    console.error('Redis connection error:', error);
});

redis.on('connect', () => {
    console.log('Successfully connected to Redis');
});

export function useRedis() {
    return redis;
} 