import SimpleBar from 'simplebar-react';
import clsx from 'clsx';
import { WaitlistItem } from '@gear-js/api';

import { HorizontalWaitlistItem, HumanWaitlistItem } from 'entities/waitlist';

import styles from '../ProgramMessages.module.scss';
import { Placeholder } from '../placeholder';

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
    <SimpleBar className={clsx(styles.simpleBar, styles.loading)}>
      <div className={styles.messagesList}>{isLoaderShowing ? <Placeholder isEmpty={isEmpty} /> : renderItems()}</div>
    </SimpleBar>
  );
};

export { Waitlist };
