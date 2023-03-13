import { dataStorageLogger } from '../common/data-storage.logger';

export function FormResponse(target: unknown, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
  const originalMethod = descriptor.value;
  descriptor.value = async function SafeWrapper() {
    try {
      return { result: await originalMethod.apply(this, arguments) };
    } catch (ex) {
      dataStorageLogger.error(`Request ${JSON.stringify(arguments)}`);
      console.log(ex);
      return { error: ex.name };
    }
  };
  return descriptor;
}
