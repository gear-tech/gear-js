import { ReactNode } from 'react';
import clsx from 'clsx';

import styles from './Subtitle.module.scss';

type Props = {
  children: ReactNode;
  className?: string;
};

function Subtitle({ className, children }: Props) {
  return (
    <h2 className={clsx(styles.subtitle, className)}>
      {children}
      <hr className={styles.line} />
    </h2>
  );
}

export { Subtitle };
