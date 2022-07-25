import { IUserMessageSentKafkaValue, MESSAGE_TYPE } from '@gear-js/common';

interface CreateMessageInput extends IUserMessageSentKafkaValue {
  type: MESSAGE_TYPE;
}

export { CreateMessageInput };
