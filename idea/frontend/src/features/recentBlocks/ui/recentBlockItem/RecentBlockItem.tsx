import clsx from 'clsx';
import { generatePath, Link } from 'react-router-dom';

import { IChainBlock } from 'entities/chainBlock';
import timeSVG from 'shared/assets/images/indicators/time.svg';
import blockNumberSVG from 'shared/assets/images/indicators/blockNumber.svg';
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
          <img src={blockNumberSVG} alt="block number" />
          {block.number}
        </span>
        <span className={styles.otherInfo}>
          <img src={timeSVG} alt="block time" />
          {block.time}
        </span>
      </div>
    </Link>
  </li>
);

export { RecentBlockItem };
