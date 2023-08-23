import { JSONRPC_ERRORS } from '../jsonrpc-errors';
import { logger } from '../logger';

export function FormResponse(target: unknown, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
  const originalMethod = descriptor.value;
  descriptor.value = async function SafeWrapper() {
    try {
      return { result: await originalMethod.apply(this, arguments) };
    } catch (error) {
      if (error.name) {
        const { name, ...err } = error;
        logger.error(name, { error: err, stack: error.stack });
        return { error: name };
      } else {
        logger.error('Unknown error', { error, stack: error.stack });
        return { error: JSONRPC_ERRORS.InternalError.name };
      }
    }
  };
  return descriptor;
}
