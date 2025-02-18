import clsx from 'clsx';

import TimeSVG from '../../assets/images/indicators/time.svg?react';
import { formatDate } from '../../helpers';

import styles from './TimestampBlock.module.scss';

type Props = {
  timestamp: string | number;
  size?: 'small' | 'medium' | 'large';
  color?: 'light' | 'primary';
  withIcon?: boolean;
  className?: string;
  annotation?: string;
  prefix?: string;
};

const TimestampBlock = ({
  size = 'small',
  color = 'primary',
  withIcon = false,
  timestamp,
  className,
  prefix,
  annotation,
}: Props) => {
  const textClasses = clsx(styles.value, styles[size], styles[color]);

  return (
    <div className={clsx(styles.timestampBlock, className)}>
      {withIcon && <TimeSVG className={styles.icon} />}

      <span className={textClasses}>
        {prefix} {formatDate(timestamp)} {annotation && `(${annotation})`}
      </span>
    </div>
  );
};

export { TimestampBlock };
