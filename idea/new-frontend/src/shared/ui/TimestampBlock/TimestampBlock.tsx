import clsx from 'clsx';

import styles from './TimestampBlock.module.scss';
import { formatDate } from '../../helpers';
import timeSVG from '../../assets/images/indicators/time.svg';

type Props = {
  timestamp: string;
  className?: string;
};

const TimestampBlock = ({ timestamp, className }: Props) => (
  <div className={clsx(styles.timestampBlock, className)}>
    <img src={timeSVG} alt="timestamp" className={styles.icon} />
    <span className={styles.value}>{formatDate(timestamp)}</span>
  </div>
);

export { TimestampBlock };
