import { Placeholder } from 'entities/placeholder';
import { ReactComponent as MessagePlaceholderSVG } from 'shared/assets/images/placeholders/mailboxMessage.svg';

import styles from './MessagesPlaceholder.module.scss';

type Props = {
  isEmpty: boolean;
};

const MessagesPlaceholder = ({ isEmpty }: Props) => (
  <div className={styles.placeholder}>
    <Placeholder
      block={<MessagePlaceholderSVG />}
      title="There are no messages yet"
      description="Your mailbox is currently empty"
      isEmpty={isEmpty}
      blocksCount={3}
    />
  </div>
);

export { MessagesPlaceholder };
