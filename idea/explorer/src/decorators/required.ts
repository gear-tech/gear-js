import { InvalidParams } from '../errors';

export function RequiredParams(params: string[]) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const missing = params.filter((param) => args[0][param] === undefined);

      if (missing.length) {
        throw new InvalidParams(`Missing required params: ${missing.join(', ')}`);
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
