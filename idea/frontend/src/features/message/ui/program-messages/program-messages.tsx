import { HexString } from '@gear-js/api';
import clsx from 'clsx';
import SimpleBar from 'simplebar-react';

import { useDataLoading, useMessages, useScrollLoader } from '@/hooks';

import { Placeholder } from '@/entities/placeholder';
import HorizontalMessageCardSVG from '@/shared/assets/images/placeholders/horizontalMessageCard.svg?react';

import { MessageCard } from '../message-card';
import styles from './program-messages.module.scss';

type Props = {
  programId: HexString;
};

type RequestParams = {
  source: HexString;
  destination: HexString;
};

const ProgramMessages = ({ programId }: Props) => {
  const { messages, totalCount, isLoading: isMessagesLoading, fetchMessages } = useMessages();

  const { loadData } = useDataLoading<RequestParams>({
    defaultParams: { source: programId, destination: programId },
    fetchData: fetchMessages,
  });

  const hasMore = !isMessagesLoading && messages.length < totalCount;
  const isEmpty = !(isMessagesLoading || totalCount);
  const isLoaderShowing = isEmpty || (isMessagesLoading && !totalCount);

  const scrollableNodeRef = useScrollLoader<HTMLDivElement>(loadData, hasMore);

  const sortedMessages = messages.sort((msg, nextMsg) => Date.parse(nextMsg.timestamp) - Date.parse(msg.timestamp));

  const renderMessages = () => sortedMessages.map((message) => <MessageCard key={message.id} message={message} />);

  return (
    <div className={styles.programMessages}>
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
    </div>
  );
};

export { ProgramMessages };
