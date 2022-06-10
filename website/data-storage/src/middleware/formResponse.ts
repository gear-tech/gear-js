import { logger } from '@gear-js/common';
import { DATA_STORAGE } from '../main';

export function FormResponse(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
  const originalMethod = descriptor.value;
  descriptor.value = async function SafeWrapper() {
    try {
      return { result: await originalMethod.apply(this, arguments) };
    } catch (ex) {
      logger.warn(`${DATA_STORAGE} Middleware: ${JSON.stringify(ex)}`);
      return { error: ex.name };
    }
  };
  return descriptor;
}
