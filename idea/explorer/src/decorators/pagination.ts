export function Pagination() {
  return function (target: any, propKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const [params] = args;

      params.limit = Math.min(params.limit, 100) || 20;

      params.offset = params.offset || 0;

      return originalMethod.apply(this, args);
    };
  };
}
