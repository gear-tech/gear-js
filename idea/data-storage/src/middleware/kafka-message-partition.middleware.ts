import { SERVICE_DATA } from '../common/service-data';
import { Message } from 'kafkajs';

export function ValidateKafkaEventPartition(
  target: unknown,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<any> ) {
  const originalMethod = descriptor.value;
  descriptor.value = async function SafeWrapper() {
    try {
      const message = arguments['0'] as Message;
      if(message.partition === SERVICE_DATA.partition) return await originalMethod.apply(this, arguments);
    } catch (ex) {
      console.log(ex);
      return { error: ex.name };
    }
  };
  return descriptor;
}
