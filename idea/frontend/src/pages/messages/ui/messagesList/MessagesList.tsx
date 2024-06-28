import { HexString } from '@gear-js/api';
import SimpleBar from 'simplebar-react';

import { useScrollLoader } from '@/hooks';
import { Placeholder } from '@/entities/placeholder';
import { MESSAGE_TYPE, Message, MessageCard } from '@/features/message';
import HorizontalMessageCardSVG from '@/shared/assets/images/placeholders/horizontalMessageCard.svg?react';

import styles from './MessagesList.module.scss';

type Props = {
  messages: Message[];
  programNames: Record<HexString, string>;
  isLoading: boolean;
  totalCount: number;
  loadMorePrograms: () => void;
};

const MessagesList = ({ messages, programNames, isLoading, totalCount, loadMorePrograms }: Props) => {
  const hasMore = !isLoading && messages.length < totalCount;
  const isEmpty = !(isLoading || totalCount);
  const isLoaderShowing = isEmpty || (!totalCount && isLoading);

  const scrollableNodeRef = useScrollLoader<HTMLDivElement>(loadMorePrograms, hasMore);

  const getProgram = ({ type, source, destination }: Message) => {
    const id = type === MESSAGE_TYPE.USER_MESSAGE_SENT ? source : destination;
    const name = programNames[id]; // if there's no name, message is not from a program

    return { id, name };
  };

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
            <MessageCard key={message.id} message={message} program={getProgram(message)} />
          ))}
        </SimpleBar>
      )}
    </div>
  );
};

export { MessagesList };
