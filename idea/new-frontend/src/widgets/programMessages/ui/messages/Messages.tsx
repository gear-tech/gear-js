import SimpleBar from 'simplebar-react';
import clsx from 'clsx';

import { useScrollLoader } from 'hooks';
import { IMessage, HorizontalMessageCard } from 'entities/message';

import styles from '../ProgramMessages.module.scss';
import { Placeholder } from '../placeholder';

type Props = {
  messages: IMessage[];
  isLoading: boolean;
  totalCount: number;
  loadMoreMessages: () => void;
};

const Messages = ({ messages, isLoading, totalCount, loadMoreMessages }: Props) => {
  const hasMore = !isLoading && messages.length < totalCount;
  const isEmpty = !(isLoading || totalCount);
  const isLoaderShowing = isEmpty || isLoading;

  const ref = useScrollLoader(loadMoreMessages, hasMore);

  const renderMessages = () => messages.map((message) => <HorizontalMessageCard key={message.id} message={message} />);

  return (
    <SimpleBar id="data-test-iddd" scrollableNodeProps={{ ref }} className={clsx(styles.simpleBar, styles.loading)}>
      <div className={styles.messagesList}>
        {isLoaderShowing ? <Placeholder isEmpty={isEmpty} /> : renderMessages()}
      </div>
    </SimpleBar>
  );
};

export { Messages };
