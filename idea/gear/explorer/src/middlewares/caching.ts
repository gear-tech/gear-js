import { type DataCache, hash } from 'gear-idea-common';

let _cache: DataCache;

export function initCache(cache: DataCache) {
  _cache = cache;
}

export function Cache(ttl: number) {
  return (_target: any, propKey: string, descriptor: PropertyDescriptor) => {
    const original = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const key = hash(propKey, args[0]);
      return _cache.get(key, () => original.apply(this, args), ttl);
    };
  };
}
