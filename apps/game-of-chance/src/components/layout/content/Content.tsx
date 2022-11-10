import { ReactNode } from 'react';
import styles from './Content.module.scss';

type Props = {
  subheading: string;
  children?: ReactNode;
};

function Content({ subheading, children }: Props) {
  return (
    <div className={styles.container}>
      <header>
        <h2 className={styles.heading}>Game of chance</h2>
        <p className={styles.subheading}>{subheading}</p>
      </header>
      {children}
    </div>
  );
}

export { Content };
