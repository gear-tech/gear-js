import { ReactNode } from 'react';
import styles from './Box.module.scss';

type Props = {
  children: ReactNode;
};

function Box({ children }: Props) {
  return (
    <div className={styles.box}>
      <h2 className={styles.heading}>Escrow contract</h2>
      <div className={styles.body}>{children}</div>
    </div>
  );
}

export { Box };
