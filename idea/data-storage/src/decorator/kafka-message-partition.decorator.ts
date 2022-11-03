import { kafkaNetworkData } from '../common/kafka-network-data';
import { Message } from 'kafkajs';

export function KafkaMessagePartition(target: unknown, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
  const originalMethod = descriptor.value;
  const kafkaMessage = '0';

  descriptor.value = function SafeWrapper() {
    try {
      const message = arguments[kafkaMessage] as Message;
      if (message.partition === kafkaNetworkData.partition) return originalMethod.apply(this, arguments);
    } catch (ex) {
      console.log(ex);
      return Promise.resolve({ error: ex.name });
    }
  };
  return descriptor;
}
