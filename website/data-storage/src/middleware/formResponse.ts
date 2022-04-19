import { Logger } from '@nestjs/common';

const logger = new Logger('Middleware');
export function FormResponse(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
  const originalMethod = descriptor.value;
  descriptor.value = async function SafeWrapper() {
    try {
      return { result: await originalMethod.apply(this, arguments) };
    } catch (ex) {
      logger.warn(ex);
      return { error: ex.name };
    }
  };
  return descriptor;
}
