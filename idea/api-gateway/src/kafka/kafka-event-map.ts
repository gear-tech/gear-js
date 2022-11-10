import { KafkaParams } from './types';
import { RpcResponse } from '../json-rpc/types';

const kafkaEventMap = new Map<string, (params: any) => KafkaParams>();
//TODO RabbitMQ
const rabbitMQEventMap = new Map<string, (params: any) => RpcResponse>();

function deleteKafkaEvent(key: string) {
  kafkaEventMap.delete(key);
}

export { kafkaEventMap, deleteKafkaEvent, rabbitMQEventMap };
