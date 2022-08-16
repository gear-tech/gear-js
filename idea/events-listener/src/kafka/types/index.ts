import { KAFKA_TOPICS, UpdateMessageData } from '@gear-js/common';

interface SendByKafkaTopicInput {
  method: KAFKA_TOPICS;
  params: UpdateMessageData[];
  genesis?: string;
  key?: string;
}

export { SendByKafkaTopicInput };
