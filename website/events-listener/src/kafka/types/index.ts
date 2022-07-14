import { KAFKA_TOPICS, UpdateMessageParams } from '@gear-js/common';

type KafkaParams = UpdateMessageParams;

interface SendByKafkaTopicInput {
  topic: KAFKA_TOPICS;
  params: string | KafkaParams;
  genesis?: string;
  key?: string;
}

export { SendByKafkaTopicInput };
