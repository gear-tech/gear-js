import SimpleBar from 'simplebar-react';

import { useScrollLoader } from 'hooks';
import { Placeholder } from 'entities/placeholder';
import { IMessage, HorizontalMessageCard } from 'entities/message';
import HorizontalMessageCardSVG from 'shared/assets/images/placeholders/horizontalMessageCard.svg?react';

import styles from './MessagesList.module.scss';

type Props = {
  messages: IMessage[];
  isLoading: boolean;
  totalCount: number;
  loadMorePrograms: () => void;
};

const MessagesList = (props: Props) => {
  const { messages, isLoading, totalCount, loadMorePrograms } = props;

  const hasMore = !isLoading && messages.length < totalCount;
  const isEmpty = !(isLoading || totalCount);
  const isLoaderShowing = isEmpty || (!totalCount && isLoading);

  const scrollableNodeRef = useScrollLoader<HTMLDivElement>(loadMorePrograms, hasMore);

  return (
    <div className={styles.programsList}>
      {isLoaderShowing ? (
        <Placeholder
          block={<HorizontalMessageCardSVG className={styles.placeholderBlock} />}
          title="There are no messages yet"
          isEmpty={isEmpty}
          blocksCount={7}
        />
      ) : (
        <SimpleBar className={styles.simpleBar} scrollableNodeProps={{ ref: scrollableNodeRef }}>
          {messages.map((message) => (
            <HorizontalMessageCard key={message.id} message={message} moreInfo />
          ))}
        </SimpleBar>
      )}
    </div>
  );
};

export { MessagesList };
