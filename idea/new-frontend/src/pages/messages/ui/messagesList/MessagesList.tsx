import SimpleBar from 'simplebar-react';

import { useScrollLoader } from 'hooks';
import { Placeholder } from 'entities/placeholder';
import { IMessage, HorizontalMessageCard } from 'entities/message';
import { ReactComponent as HorizontalMessageCardSVG } from 'shared/assets/images/placeholders/horizontalMessageCard.svg';

import clsx from 'clsx';
import styles from './ProgramsList.module.scss';

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
      <SimpleBar
        className={clsx(styles.simpleBar, isLoaderShowing && styles.noOverflow)}
        scrollableNodeProps={{ ref: scrollableNodeRef }}>
        {isLoaderShowing ? (
          <Placeholder
            block={<HorizontalMessageCardSVG className={styles.placeholderBlock} />}
            title="There is no messages yet"
            isEmpty={isEmpty}
            blocksCount={8}
          />
        ) : (
          messages.map((message) => <HorizontalMessageCard key={message.id} message={message} moreInfo />)
        )}
      </SimpleBar>
    </div>
  );
};

export { MessagesList };
