import { CronJob } from 'cron';
import { type DataCache, hash, logger } from 'gear-idea-common';

let _cache: DataCache;

export function initRetry(cache: DataCache) {
  _cache = cache;
}

export function retryMethodsJob(classInstance: any) {
  new CronJob(
    '* * * * *',
    async () => {
      if (!_cache.connected) return;

      const toRetry = await _cache.hGetAll('retry');

      if (Object.keys(toRetry).length === 0) {
        return;
      }

      for (const key in toRetry) {
        const { method, args, count } = JSON.parse(toRetry[key]);

        await _cache.hDel('retry', [key]);

        try {
          logger.info('Retry', { method, args, count });
          await classInstance[method](...args, { isRetry: true });
        } catch (error) {
          logger.error('Retry error', { method, error: error.message });
          if (count > 0) {
            await _cache.hSet('retry', { [key]: JSON.stringify({ method, args, count: count - 1 }) });
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

export function Retry(count: number, resultInsteadOfError: string) {
  return (_target: any, propKey: string, descriptor: PropertyDescriptor) => {
    const original = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      if (typeof args.at(-1) === 'object' && args.at(-1).isRetry === true) {
        return original.apply(this, args.slice(0, -1));
      }
      if (!_cache.connected) {
        return original.apply(this, args);
      }

      const key = hash(propKey, { method: propKey, args });

      try {
        await original.apply(this, args);

        return resultInsteadOfError;
      } catch (_) {
        await _cache.hSet('retry', { [key]: JSON.stringify({ method: propKey, args, count }) });

        return resultInsteadOfError;
      }
    };
  };
}
