import SimpleBar from 'simplebar-react';
import clsx from 'clsx';

import { Placeholder } from 'entities/placeholder';
import { IMessage, HorizontalMessageCard } from 'entities/message';
import { ReactComponent as HorizontalMessageCardSVG } from 'shared/assets/images/placeholders/horizontalMessageCard.svg';

import styles from '../ProgramMessages.module.scss';

type Props = {
  messages: IMessage[];
  isLoading: boolean;
  totalCount: number;
};

const Messages = ({ messages, isLoading, totalCount }: Props) => {
  const isEmpty = !(isLoading || totalCount);
  const isLoaderShowing = isEmpty || (isLoading && !totalCount);

  const renderMessages = () => messages.map((message) => <HorizontalMessageCard key={message.id} message={message} />);

  return (
    <SimpleBar className={clsx(styles.simpleBar, isLoaderShowing && styles.noOverflow)}>
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
