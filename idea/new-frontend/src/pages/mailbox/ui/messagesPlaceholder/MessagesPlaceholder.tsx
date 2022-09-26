import { Placeholder } from 'entities/placeholder';
import { ReactComponent as MessagePlaceholderSVG } from 'shared/assets/images/placeholders/mailboxMessage.svg';

type Props = {
  isEmpty: boolean;
};

const MessagesPlaceholder = ({ isEmpty }: Props) => (
  <Placeholder
    block={<MessagePlaceholderSVG />}
    title="There is no messages yet"
    description="Your mailbox is currently empty"
    isEmpty={isEmpty}
    blocksCount={4}
  />
);

export { MessagesPlaceholder };
