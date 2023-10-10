import { TransitionGroup, CSSTransition } from 'react-transition-group';
import SimpleBar from 'simplebar-react';
import clsx from 'clsx';

import { IChainBlock } from '@/entities/chainBlock';
import { AnimationTimeout } from '@/shared/config';

import styles from './RecentBlocksList.module.scss';
import { RecentBlockItem } from '../recentBlockItem';

type Props = {
  blocks: IChainBlock[];
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
