import clsx from 'clsx';

import styles from './BulbBlock.module.scss';
import { BulbStatus } from './const';

type Props = {
  text?: string;
  status: BulbStatus;
  className?: string;
};

const BulbBlock = ({ status, text, className }: Props) => (
  <p className={clsx(styles.bulbBlock, styles[status], className)}>
    <span className={styles.status}>{text ?? status}</span>
  </p>
);

export { BulbBlock };
