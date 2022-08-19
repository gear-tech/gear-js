import { ReactNode } from 'react';

import styles from './Box.module.scss';

type Props = {
  children: ReactNode;
};

function Box({ children }: Props) {
  return <div className={styles.box}>{children}</div>;
}

export { Box };
