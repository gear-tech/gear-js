import { Logo } from './logo';
import { AccountComponent } from './account';
import styles from './Header.module.scss';
import clsx from 'clsx';

export const Header = () => (
  <header className={clsx('container', styles.header)}>
    <Logo />
    <AccountComponent />
  </header>
);
