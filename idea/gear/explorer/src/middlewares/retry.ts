import { CronJob } from 'cron';
import { client, hash, isRedisConnected } from './redis';
import { logger } from 'gear-idea-common';

export function retryMethodsJob(classInstance: any) {
  new CronJob(
    '* * * * *',
    async () => {
      if (!isRedisConnected) return;

      const toRetry = await client.hGetAll('retry');

      if (Object.keys(toRetry).length === 0) {
        return;
      }

      for (const key in toRetry) {
        const { method, args, count } = JSON.parse(toRetry[key]);

        await client.hDel('retry', key);

        try {
          logger.info('Retry', { method, args, count });
          await classInstance[method](...args, { isRetry: true });
        } catch (error) {
          logger.error('Retry error', { method, error: error.message });
          if (count > 0) {
            await client.hSet('retry', key, JSON.stringify({ method, args, count: count - 1 }));
          }
        }
      }
    },
    null,
    true,
    null,
    null,
    true,
  );
}

export function Retry(count = 100, resultInsteadOfError: string) {
  return function (_target: any, propKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      if (typeof args.at(-1) === 'object' && args.at(-1).isRetry === true) {
        return await originalMethod.apply(this, args.slice(0, -1));
      }
      if (!isRedisConnected) {
        return await originalMethod.apply(this, args);
      }

      const key = hash(propKey, { method: propKey, args });

      try {
        await originalMethod.apply(this, args);

        return resultInsteadOfError;
      } catch (_) {
        await client.HSET('retry', key, JSON.stringify({ method: propKey, args, count }));

        return resultInsteadOfError;
      }
    };
  };
}
