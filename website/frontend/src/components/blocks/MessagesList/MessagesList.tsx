import { MessageItem } from './children/MessageItem';
import { MessagesListHeader } from './children/MessagesListHeader';

import { MessageModel } from 'types/message';

type Props = {
  messages: MessageModel[];
};

const MessagesList = ({ messages }: Props) => (
  <div>
    <MessagesListHeader />
    <ul>
      {messages.map((message: MessageModel) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </ul>
  </div>
);

export { MessagesList };
