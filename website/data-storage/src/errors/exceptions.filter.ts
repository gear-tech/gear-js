import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { GearError } from './base';

export function CatchGearErrros(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
  const originalMethod = descriptor.value;
  descriptor.value = async function SafeWrapper() {
    try {
      return await originalMethod.apply(this, arguments);
    } catch (ex) {
      return { error: ex.message };
    }
  };
  return descriptor;
}
