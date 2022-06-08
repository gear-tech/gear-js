import { KafkaParams } from '../kafka/types';

export function transformToSting(params: KafkaParams): string {
  return JSON.stringify(params);
}
