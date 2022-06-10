import { KafkaParams } from './types';

const kafkaEventMap = new Map<string, (params: any) => KafkaParams>();

function deleteKafkaEvent(key: string) {
  kafkaEventMap.delete(key);
}

export { kafkaEventMap, deleteKafkaEvent };
