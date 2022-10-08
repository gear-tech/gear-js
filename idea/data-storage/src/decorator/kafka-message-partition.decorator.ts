import { KafkaNetworkData } from '../common/kafka-network-data';
import { Message } from 'kafkajs';

export function KafkaMessagePartition(
  target: unknown,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<any> ) {
  const originalMethod = descriptor.value;
  const kafkaMessageKey = '0';

  descriptor.value = async function SafeWrapper() {
    try {
      const message = arguments[kafkaMessageKey] as Message;
      if(message.partition === KafkaNetworkData.partition) return await originalMethod.apply(this, arguments);
    } catch (ex) {
      console.log(ex);
      return { error: ex.name };
    }
  };
  return descriptor;
}
