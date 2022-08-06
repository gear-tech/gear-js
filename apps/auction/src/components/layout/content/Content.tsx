import { ReactNode } from 'react';
import styles from './Content.module.scss';

type Props = {
  heading: string;
  children: ReactNode;
};

function Content({ heading, children }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Dutch Auction</h2>
      </div>
      <h3 className={styles.subheading}>{heading}</h3>
      {children}
    </div>
  );
}

export { Content };
