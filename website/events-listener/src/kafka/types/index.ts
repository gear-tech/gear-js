import { API_METHODS, UpdateMessageParams } from '@gear-js/common';

type KafkaParams = UpdateMessageParams;

interface SendByKafkaTopicInput {
  method: API_METHODS;
  params: string | KafkaParams;
  genesis?: string;
  key?: string;
}

export { SendByKafkaTopicInput };
