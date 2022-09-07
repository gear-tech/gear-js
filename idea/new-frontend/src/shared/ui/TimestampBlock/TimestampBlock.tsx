import clsx from 'clsx';

import styles from './TimestampBlock.module.scss';
import { formatDate } from '../../helpers';
import timeSVG from '../../assets/images/indicators/time.svg';

type Props = {
  size?: 'small' | 'large';
  color?: 'light' | 'primary';
  withIcon?: boolean;
  timestamp: string;
  className?: string;
};

const TimestampBlock = (props: Props) => {
  const { size = 'small', color = 'primary', withIcon = false, timestamp, className } = props;

  const textClasses = clsx(styles.value, styles[size], styles[color]);

  return (
    <div className={clsx(styles.timestampBlock, className)}>
      {withIcon && <img src={timeSVG} alt="timestamp" className={styles.icon} />}
      <span className={textClasses}>{formatDate(timestamp)}</span>
    </div>
  );
};

export { TimestampBlock };
