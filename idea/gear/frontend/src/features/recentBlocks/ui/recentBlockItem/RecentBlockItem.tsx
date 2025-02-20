import clsx from 'clsx';
import { Ref } from 'react';
import { generatePath, Link } from 'react-router-dom';

import BlockNumberSVG from '@/shared/assets/images/indicators/blockNumber.svg?react';
import TimeSVG from '@/shared/assets/images/indicators/time.svg?react';
import { absoluteRoutes } from '@/shared/config';

import { RecentBlock } from '../../types';

import styles from './RecentBlockItem.module.scss';

type Props = {
  block: RecentBlock;
  ref?: Ref<HTMLLIElement>; // TODO(#1780): temporary react 19 patch
  className?: string;
};

const RecentBlockItem = ({ block, ref, className }: Props) => (
  <li className={clsx(styles.recentBlockItem, className)} ref={ref}>
    <Link to={generatePath(absoluteRoutes.block, { blockId: String(block.number) })}>
      <p className={styles.hash}>{block.hash}</p>
      <div className={styles.content}>
        <span className={styles.otherInfo}>
          <TimeSVG className={styles.icon} />
          {block.number}
        </span>
        <span className={styles.otherInfo}>
          <BlockNumberSVG className={styles.icon} />
          {block.time}
        </span>
      </div>
    </Link>
  </li>
);

export { RecentBlockItem };
