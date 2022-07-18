import clsx from 'clsx';
import { ReactNode } from 'react';
import styles from './Content.module.scss';

type Props = {
  heading: string;
  children: ReactNode;
  className?: string;
};

function Content({ heading, children, className }: Props) {
  const containerClassName = clsx(styles.container, className);

  return (
    <div className={containerClassName}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Dutch Auction</h2>
      </div>
      <h3 className={styles.subheading}>{heading}</h3>
      {children}
    </div>
  );
}

export { Content };
