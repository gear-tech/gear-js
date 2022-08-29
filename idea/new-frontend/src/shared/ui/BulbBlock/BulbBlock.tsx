import clsx from 'clsx';

import styles from './BulbBlock.module.scss';
import { BulbStatus } from './const';

type Props = {
  text?: string;
  status: BulbStatus;
  className?: string;
};

const BulbBlock = ({ status, text, className }: Props) => (
  <div className={clsx(styles.bulbBlock, className)}>
    <span className={clsx(styles.bulb, styles[status])} />
    <span className={styles.status}>{text ?? status}</span>
  </div>
);

export { BulbBlock };
