import { API_METHODS, UpdateMessageData } from '@gear-js/common';

interface SendByKafkaTopicInput {
  method: API_METHODS;
  params: UpdateMessageData[];
  genesis?: string;
  key?: string;
}

export { SendByKafkaTopicInput };
