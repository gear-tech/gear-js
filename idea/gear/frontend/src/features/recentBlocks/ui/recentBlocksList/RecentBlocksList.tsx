import { TransitionGroup, CSSTransition } from 'react-transition-group';
import SimpleBar from 'simplebar-react';
import clsx from 'clsx';

import { AnimationTimeout } from '@/shared/config';

import { RecentBlockItem } from '../recentBlockItem';
import { RecentBlock } from '../../types';
import styles from './RecentBlocksList.module.scss';

type Props = {
  blocks: RecentBlock[];
  className?: string;
};

const RecentBlocksList = ({ blocks, className }: Props) => (
  <SimpleBar className={clsx(styles.simpleBar, className)}>
    <TransitionGroup component="ul" className={styles.blockList}>
      {blocks.map((item) => (
        <CSSTransition key={item.number} timeout={AnimationTimeout.Default} exit={false}>
          <RecentBlockItem block={item} className={styles.listItem} />
        </CSSTransition>
      ))}
    </TransitionGroup>
  </SimpleBar>
);

export { RecentBlocksList };
