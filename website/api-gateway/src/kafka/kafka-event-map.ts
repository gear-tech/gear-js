import { KafkaParams } from './types';

const kafkaEventMap = new Map<string, (params: any) => KafkaParams>();

function deleteKafkaEvent(key: string) {
  const THREE_SECOND = 3000;
  setTimeout(() => {
    kafkaEventMap.delete(key);
  }, THREE_SECOND);
}

export { kafkaEventMap, deleteKafkaEvent };
