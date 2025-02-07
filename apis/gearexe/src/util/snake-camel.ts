export function snakeToCamel<T>(object: unknown): T {
  if (typeof object !== 'object' || object === null) {
    return object as T;
  }

  if (Array.isArray(object)) {
    return object.map(snakeToCamel) as T;
  }

  return Object.keys(object).reduce((accumulator, key) => {
    const camelKey = key.replaceAll(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    accumulator[camelKey] = snakeToCamel(object[key]);
    return accumulator;
  }, {}) as T;
}
