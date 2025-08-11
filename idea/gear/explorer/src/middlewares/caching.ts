import { logger } from 'gear-idea-common';
import { client, hash, isRedisConnected } from './redis';

export function Cache(ttl: number) {
  return function (_target: any, propKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const params = args[0];

      if (!isRedisConnected) {
        return originalMethod.apply(this, args);
      }

      const key = hash(propKey, params);

      const cached = await client.get(key);

      if (cached && typeof cached === 'string') {
        return JSON.parse(cached);
      }

      const result = await originalMethod.apply(this, args);

      client
        .set(key, JSON.stringify(result), {
          EX: ttl,
        })
        .catch((err) => {
          logger.error('Redis set error', { error: err.message });
        });

      return result;
    };
  };
}
