import { KafkaMessage } from 'kafkajs';

export function isIncludeCorrelationId(message: KafkaMessage): boolean {
  // eslint-disable-next-line no-prototype-builtins
  return message.headers.hasOwnProperty('kafka_correlationId');
}
