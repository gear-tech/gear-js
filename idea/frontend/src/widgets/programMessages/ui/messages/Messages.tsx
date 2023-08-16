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
  loadMore: () => void;
};

const Messages = ({ messages, isLoading, totalCount, loadMore }: Props) => {
  const hasMore = !isLoading && messages.length < totalCount;
  const isEmpty = !(isLoading || totalCount);
  const isLoaderShowing = isEmpty || (isLoading && !totalCount);

  const scrollableNodeRef = useScrollLoader<HTMLDivElement>(loadMore, hasMore);

  const renderMessages = () => messages.map((message) => <HorizontalMessageCard key={message.id} message={message} />);

  return (
    <SimpleBar
      className={clsx(styles.simpleBar, isLoaderShowing && styles.noOverflow)}
      scrollableNodeProps={{ ref: scrollableNodeRef }}>
      {isLoaderShowing ? (
        <Placeholder
          block={<HorizontalMessageCardSVG className={styles.placeholderBlock} />}
          title="There are no messages yet"
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
