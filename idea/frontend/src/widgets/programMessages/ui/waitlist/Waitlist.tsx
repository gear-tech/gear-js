import SimpleBar from 'simplebar-react';
import clsx from 'clsx';
import { WaitlistItem } from '@gear-js/api';

import { Placeholder } from 'entities/placeholder';
import { HorizontalWaitlistItem, HumanWaitlistItem } from 'entities/waitlist';
import HorizontalMessageCardSVG from 'shared/assets/images/placeholders/horizontalMessageCard.svg?react';

import styles from '../ProgramMessages.module.scss';

type Props = {
  waitlist: WaitlistItem[];
  isLoading: boolean;
  totalCount: number;
};

const Waitlist = ({ waitlist, isLoading, totalCount }: Props) => {
  const isEmpty = !(isLoading || totalCount);
  const isLoaderShowing = isEmpty || isLoading;

  const renderItems = () =>
    waitlist.map((item) => {
      const [content, interval] = item.toHuman() as HumanWaitlistItem;

      return <HorizontalWaitlistItem key={content.message.id} content={content} interval={interval} />;
    });

  return (
    <SimpleBar className={clsx(styles.simpleBar, isLoaderShowing && styles.noOverflow)}>
      {isLoaderShowing ? (
        <Placeholder
          block={<HorizontalMessageCardSVG className={styles.placeholderBlock} />}
          title="There are no messages yet"
          isEmpty={isEmpty}
          blocksCount={8}
        />
      ) : (
        renderItems()
      )}
    </SimpleBar>
  );
};

export { Waitlist };
