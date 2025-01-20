import clsx from 'clsx';

import styles from './BulbBlock.module.scss';
import { BulbStatus } from './const';

type Props = {
  text?: string;
  size?: 'small' | 'large';
  color?: 'light' | 'primary';
  weight?: 'normal' | 'bold';
  status: BulbStatus;
  className?: string;
};

const BulbBlock = (props: Props) => {
  const { text, size = 'small', color = 'primary', weight = 'bold', status, className } = props;

  return (
    <p className={clsx(styles.bulbBlock, styles[status], className)}>
      <span className={clsx(styles.status, styles[size], styles[color], styles[weight])}>{text ?? status}</span>
    </p>
  );
};

export { BulbBlock };
