import clsx from 'clsx';

import styles from './TimestampBlock.module.scss';
import { formatDate } from '../../helpers';
import TimeSVG from '../../assets/images/indicators/time.svg?react';

type Props = {
  timestamp: string | number;
  size?: 'small' | 'medium' | 'large';
  color?: 'light' | 'primary';
  withIcon?: boolean;
  className?: string;
};

const TimestampBlock = ({ size = 'small', color = 'primary', withIcon = false, timestamp, className }: Props) => {
  const textClasses = clsx(styles.value, styles[size], styles[color]);

  return (
    <div className={clsx(styles.timestampBlock, className)}>
      {withIcon && <TimeSVG className={styles.icon} />}

      <span className={textClasses}>{formatDate(timestamp)}</span>
    </div>
  );
};

export { TimestampBlock };
