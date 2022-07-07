import { MessageItem } from './children/MessageItem';
import { MessagesListHeader } from './children/MessagesListHeader';

import { MessageModel } from 'types/message';

type Props = {
  messages: MessageModel[];
};

const MessagesList = ({ messages }: Props) => {
  const getMessages = () => messages.map((message) => <MessageItem key={message.id} message={message} />);

  return (
    <div>
      <MessagesListHeader />
      <ul>{getMessages()}</ul>
    </div>
  );
};

export { MessagesList };
