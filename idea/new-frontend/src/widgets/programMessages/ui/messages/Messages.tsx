import SimpleBar from 'simplebar-react';
import clsx from 'clsx';

import { useScrollLoader } from 'hooks';
import { Placeholder } from 'entities/placeholder';
import { IMessage, HorizontalMessageCard } from 'entities/message';
import { ReactComponent as HorizontalMessageCardSVG } from 'shared/assets/images/placeholders/horizontalMessageCard.svg';

import styles from '../ProgramMessages.module.scss';

type Props = {
  messages: IMessage[];
  isLoading: boolean;
  totalCount: number;
  loadMoreMessages: () => void;
};

const Messages = ({ messages, isLoading, totalCount, loadMoreMessages }: Props) => {
  const hasMore = !isLoading && messages.length < totalCount;
  const isEmpty = !(isLoading || totalCount);
  const isLoaderShowing = isEmpty || (isLoading && !totalCount);

  const ref = useScrollLoader(loadMoreMessages, hasMore);

  const renderMessages = () => messages.map((message) => <HorizontalMessageCard key={message.id} message={message} />);

  return (
    <SimpleBar scrollableNodeProps={{ ref }} className={clsx(styles.simpleBar, isLoaderShowing && styles.noOverflow)}>
      {isLoaderShowing ? (
        <Placeholder
          block={<HorizontalMessageCardSVG className={styles.placeholderBlock} />}
          title="There is no messages yet"
          isEmpty={isEmpty}
          blocksCount={8}
        />
      ) : (
        renderMessages()
      )}
    </SimpleBar>
  );
};

export { Messages };
