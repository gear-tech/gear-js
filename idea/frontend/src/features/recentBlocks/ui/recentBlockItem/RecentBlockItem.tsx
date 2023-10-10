import clsx from 'clsx';
import { generatePath, Link } from 'react-router-dom';

import { IChainBlock } from 'entities/chainBlock';
import TimeSVG from 'shared/assets/images/indicators/time.svg?react';
import BlockNumberSVG from 'shared/assets/images/indicators/blockNumber.svg?react';
import { absoluteRoutes } from 'shared/config';

import styles from './RecentBlockItem.module.scss';

type Props = {
  block: IChainBlock;
  className?: string;
};

const RecentBlockItem = ({ block, className }: Props) => (
  <li className={clsx(styles.recentBlockItem, className)}>
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
