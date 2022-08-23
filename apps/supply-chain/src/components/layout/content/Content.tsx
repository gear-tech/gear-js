import clsx from 'clsx';
import { ReactNode } from 'react';
import styles from './Content.module.scss';

type Props = {
  heading: string;
  children?: ReactNode;
  className?: string;
};

function Content({ heading, children, className }: Props) {
  const bodyClassName = clsx(styles.body, className);

  return (
    <>
      <header className={styles.header}>
        <h2 className={styles.heading}>Supply chain</h2>
        <p className={styles.subheading}>{heading}</p>
      </header>
      <div className={bodyClassName}>{children}</div>
    </>
  );
}

export { Content };
