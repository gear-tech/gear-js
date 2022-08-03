import { memo, ReactNode } from 'react';

import styles from './Subtitle.module.scss';

type Props = {
  children: ReactNode;
};

const Subtitle = memo(({ children }: Props) => (
  <h2 className={styles.subtitle}>
    {children}
    <hr className={styles.line} />
  </h2>
));

export { Subtitle };
