import clsx from 'clsx';

import styles from './BulbBlock.module.scss';
import { BulbStatus } from './const';

type Props = {
  text?: string;
  size?: 'small' | 'large';
  color?: 'light' | 'primary';
  status: BulbStatus;
  className?: string;
};

const BulbBlock = (props: Props) => {
  const { text, size = 'small', color = 'primary', status, className } = props;

  const textClasses = clsx(styles.status, styles[size], styles[color]);

  return (
    <p className={clsx(styles.bulbBlock, styles[status], className)}>
      <span className={textClasses}>{text ?? status}</span>
    </p>
  );
};

export { BulbBlock };
