import { kafkaNetworkData } from '../common/kafka-network-data';
import { Message } from 'kafkajs';

export function KafkaMessagePartition(
  target: unknown,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<any> ) {
  const originalMethod = descriptor.value;
  const kafkaMessage = '0';

  descriptor.value = async function SafeWrapper() {
    try {
      const message = arguments[kafkaMessage] as Message;
      if(message.partition === kafkaNetworkData.partition) return await originalMethod.apply(this, arguments);
    } catch (ex) {
      console.log(ex);
      return { error: ex.name };
    }
  };
  return descriptor;
}
