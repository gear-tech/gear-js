import { IUserMessageSentKafkaValue, MessageType } from '@gear-js/common';

interface CreateMessageInput extends IUserMessageSentKafkaValue {
  type: MessageType;
}

export { CreateMessageInput };
