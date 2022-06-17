import { ReactNode } from 'react';
import styles from './Main.module.scss';

type Props = {
  children: ReactNode;
};

const Main = ({ children }: Props) => <main className={styles.main}>{children}</main>;

export { Main };
