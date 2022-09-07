import { ReactNode } from 'react';

import styles from './Subheader.module.scss';

type Props = {
  title: string;
  children?: ReactNode;
};

const Subheader = ({ title, children }: Props) => (
  <div className={styles.subheader}>
    <h2 className={styles.title}>{title}</h2>
    {children}
  </div>
);

export { Subheader };
